package com.quiz.app.test;

import com.quiz.app.common.CommonUtils;
import com.quiz.app.exception.ConstrainstViolationException;
import com.quiz.app.exception.NotFoundException;
import com.quiz.app.response.StandardJSONResponse;
import com.quiz.app.response.error.BadResponse;
import com.quiz.app.response.success.OkResponse;
import com.quiz.app.security.UserDetailsImpl;
import com.quiz.app.subject.SubjectService;
import com.quiz.app.test.dto.HandInDTO;
import com.quiz.app.test.dto.PostCreateTestDTO;
import com.quiz.app.test.dto.TestDTO;
import com.quiz.app.test.dto.TestsDTO;
import com.quiz.entity.Question;
import com.quiz.entity.Subject;
import com.quiz.entity.Test;
import com.quiz.entity.User;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;


@RestController
@RequestMapping("/api/tests")
public class TestRestController {
    @Autowired
    private TestService testService;

    @Autowired
    private SubjectService subjectService;

    @GetMapping("")
    public ResponseEntity<StandardJSONResponse<TestsDTO>> fetchAllSubjects(
            @RequestParam("page") String page,
            @RequestParam(name = "query", required = false, defaultValue = "") String query,
            @RequestParam(name = "sortDir", required = false, defaultValue = "desc") String sortDir,
            @RequestParam(name = "sortField", required = false, defaultValue = "id") String sortField,
            @RequestParam(name = "subject", required = false, defaultValue = "") String subjectId
    ) {
        TestsDTO testsDTO = new TestsDTO();

        if (page.equals("0")) {
            List<Test> tests = null;
            if (!StringUtils.isEmpty(subjectId)) {
                try {
                    Subject subject = subjectService.findById(subjectId);
                    tests = testService.findBySubject(subject);
                } catch (NotFoundException e) {
                    tests = new ArrayList<>();
                }
            } else {
                tests = testService.findAll();
            }

            testsDTO.setTests(tests);
            testsDTO.setTotalElements(tests.size());
            testsDTO.setTotalPages(0);

        } else {
            Map<String, String> filters = new HashMap<>();
            filters.put("page", page);
            filters.put("query", query);
            filters.put("sortDir", sortDir);
            filters.put("sortField", sortField);
            filters.put("subjectId", subjectId);

            Page<Test> testPage = testService.findAllTests(filters);

            testsDTO.setTests(testPage.getContent());
            testsDTO.setTotalElements(testPage.getTotalElements());
            testsDTO.setTotalPages(testPage.getTotalPages());
        }

        return new OkResponse<>(testsDTO).response();
    }

    public void catchTestInputException(CommonUtils commonUtils, boolean isEdit, Integer id,
                                        String name,
                                        String subjectId,
                                        List<Question> questions
    ) {
        if (isEdit && Objects.isNull(id)) {
            commonUtils.addError("id", "Mã đề thi không được để trống");
        }

        if (Objects.isNull(name) || StringUtils.isEmpty(name)) {
            commonUtils.addError("name", "Tên đề thi không được để trống");
        }

        if (Objects.isNull(subjectId) || StringUtils.isEmpty(subjectId)) {
            commonUtils.addError("subjectId", "Môn học không được để trống");
        }

        if (questions.size() == 0) {
            commonUtils.addError("questions", "Danh sách câu hỏi không được để trống");
        }
    }

    @PostMapping("save")
    public ResponseEntity<StandardJSONResponse<Test>> saveSubject(
            @AuthenticationPrincipal UserDetailsImpl userDetailsImpl,
            @RequestBody PostCreateTestDTO postCreateTestDTO,
            @RequestParam(name = "isEdit", required = false, defaultValue = "false") boolean isEdit
    ) {
        CommonUtils commonUtils = new CommonUtils();
        Test savedTest = null;
        Subject subject = null;

        Integer id = postCreateTestDTO.getId();
        String name = postCreateTestDTO.getName();
        String subjectId = postCreateTestDTO.getSubjectId();
        List<Question> questions = postCreateTestDTO.getQuestions();
        User teacher = userDetailsImpl.getUser();

        catchTestInputException(commonUtils, isEdit, id, name, subjectId, questions);

        if (commonUtils.getArrayNode().size() > 0) {
            return new BadResponse<Test>(commonUtils.getArrayNode().toString()).response();
        } else {
            if (testService.isNameDuplicated(null, name, isEdit)) {
                commonUtils.addError("name", "Tên bộ đề đã tồn tại");
            }

            try {
                subject = subjectService.findById(subjectId);
            } catch (NotFoundException exception) {
                commonUtils.addError("subject", exception.getMessage());
            }

            if (commonUtils.getArrayNode().size() > 0) {
                return new BadResponse<Test>(commonUtils.getArrayNode().toString()).response();
            }
        }

        if (isEdit) {
            try {
                Test test = testService.findById(id);
                test.setName(name);
                test.setSubject(subject);

                for (Question question : questions) {
                    // Add new question
                    if (Objects.isNull(question.getId())) {
                        test.addQuestion(question);
                    }
                }

                List<Question> qsts = test.getQuestions();
                for (Question question : qsts) {
                    boolean shouldDelete = true;

                    for (Question q : questions) {
                        if (Objects.nonNull(q.getId())) {
                            if (q.getId().equals(question.getId())) {
                                shouldDelete = false;
                                break;
                            }
                        }
                    }
                    // Remove none mentioned question
                    if (shouldDelete) {
                        test.removeQuestion(question);
                    }
                }

                savedTest = testService.save(test);
            } catch (NotFoundException exception) {
                return new BadResponse<Test>(exception.getMessage()).response();
            }
        } else {
            savedTest = testService.save(Test.build(name, questions, subject, teacher));
        }

        return new OkResponse<>(savedTest).response();
    }

    @GetMapping("{id}")
    public ResponseEntity<StandardJSONResponse<TestDTO>> findTest(@PathVariable("id") Integer id) {
        try {
            return new OkResponse<>(TestDTO.build(testService.findById(id), true)).response();
        } catch (NotFoundException ex) {
            return new BadResponse<TestDTO>(ex.getMessage()).response();
        }
    }

    @PostMapping("{id}/handIn")
    public ResponseEntity<StandardJSONResponse<TestDTO>> handIn(@PathVariable("id") Integer id,
                                                                @RequestBody List<HandInDTO> answers) {
        try {
            int numberOfRightAnswer = 0;
            float mark = 0;
            Test test = testService.findById(id);

            for (Question question : test.getQuestions()) {
                for (HandInDTO answer : answers) {
                    if (answer.getId().equals(question.getId())) {
//                        if (question.getFinalAnswer().equals(answer.getAnswer())) {
                            numberOfRightAnswer++;
//                        }
                        question.setSelectedAnswer(answer.getAnswer());
                    }
                }
            }

            mark = (float) numberOfRightAnswer / test.getQuestions().size() * 10;


            return new OkResponse<>(TestDTO.build(test, true)).response();
        } catch (NotFoundException ex) {
            return new BadResponse<TestDTO>(ex.getMessage()).response();
        }
    }

    @DeleteMapping("{id}/delete")
    public ResponseEntity<StandardJSONResponse<String>> delete(@PathVariable("id") Integer id) {
        try {
            return new OkResponse<>(testService.deleteById(id)).response();
        } catch (ConstrainstViolationException ex) {
            return new BadResponse<String>(ex.getMessage()).response();
        }
    }
}
