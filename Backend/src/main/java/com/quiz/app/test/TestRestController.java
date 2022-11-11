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

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;


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
            @RequestParam(name = "sortField", required = false, defaultValue = "id") String sortField
    ) {
        Map<String, String> filters = new HashMap<>();
        filters.put("page", page);
        filters.put("query", query);
        filters.put("sortDir", sortDir);
        filters.put("sortField", sortField);

        TestsDTO testsDTO = new TestsDTO();

        if (page.equals("0")) {
            List<Test> tests = testService.findAll();

            testsDTO.setTests(tests);
            testsDTO.setTotalElements(tests.size());
            testsDTO.setTotalPages(0);

        } else {
            Page<Test> testPage = testService.findAllSubjects(filters);

            testsDTO.setTests(testPage.getContent());
            testsDTO.setTotalElements(testPage.getTotalElements());
            testsDTO.setTotalPages(testPage.getTotalPages());
        }

        return new OkResponse<>(testsDTO).response();
    }

    @PostMapping("save")
    public ResponseEntity<StandardJSONResponse<Test>> saveSubject(
            @AuthenticationPrincipal UserDetailsImpl userDetailsImpl,
            @RequestBody PostCreateTestDTO postCreateTestDTO,
            @RequestParam(name = "isEdit", required = false, defaultValue = "false") boolean isEdit
    ) {
        CommonUtils commonUtils = new CommonUtils();
        Test savedTest = null;

        Integer id = postCreateTestDTO.getId();
        String name = postCreateTestDTO.getName();
        String subjectId = postCreateTestDTO.getSubjectId();
        List<Question> questions = postCreateTestDTO.getQuestions();
        User teacher = userDetailsImpl.getUser();

        if (isEdit && Objects.isNull(id)) {
            commonUtils.addError("id", "Mã bộ đề không được để trống");
        }

        if (Objects.isNull(name)) {
            commonUtils.addError("name", "Tên bộ đề không được để trống");
        }

        if (Objects.isNull(subjectId)) {
            commonUtils.addError("subjectId", "Môn học không được để trống");
        }

        if (questions.size() == 0) {
            commonUtils.addError("questions", "Danh sách câu hỏi không được để trống");
        }

        if (commonUtils.getArrayNode().size() > 0) {
            return new BadResponse<Test>(commonUtils.getArrayNode().toString()).response();
        } else {
            if (testService.isNameDuplicated(null, name, isEdit)) {
                commonUtils.addError("name", "Tên bộ đề đã tồn tại");
            }

            if (commonUtils.getArrayNode().size() > 0) {
                return new BadResponse<Test>(commonUtils.getArrayNode().toString()).response();
            }
        }

        if (isEdit) {
            try {
                Test test = testService.findById(id);
                test.setName(name);

                savedTest = testService.save(test);
            } catch (NotFoundException exception) {
                return new BadResponse<Test>(exception.getMessage()).response();
            }
        } else {
            try {
                Subject subject = subjectService.findById(subjectId);
                savedTest = testService.save(Test.build(postCreateTestDTO, subject, teacher));
            } catch (NotFoundException e) {
                throw new RuntimeException(e);
            }

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
            test.setNumberOfRightAnswer(numberOfRightAnswer);
            test.setMark(Math.round(mark));

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
