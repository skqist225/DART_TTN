package com.quiz.app.test;

import com.quiz.app.exam.ExamService;
import com.quiz.app.exception.ConstrainstViolationException;
import com.quiz.app.exception.NotFoundException;
import com.quiz.app.question.QuestionService;
import com.quiz.app.register.RegisterService;
import com.quiz.app.response.StandardJSONResponse;
import com.quiz.app.response.error.BadResponse;
import com.quiz.app.response.success.OkResponse;
import com.quiz.app.security.UserDetailsImpl;
import com.quiz.app.subject.SubjectService;
import com.quiz.app.takeExam.TakeExamService;
import com.quiz.app.takeExamDetail.TakeExamDetailService;
import com.quiz.app.test.dto.CriteriaExtendsDTO;
import com.quiz.app.test.dto.HandInDTO;
import com.quiz.app.test.dto.PostCreateTestDTO;
import com.quiz.app.test.dto.TestDTO;
import com.quiz.app.test.dto.TestsDTO;
import com.quiz.app.utils.CommonUtils;
import com.quiz.entity.Answer;
import com.quiz.entity.Exam;
import com.quiz.entity.Question;
import com.quiz.entity.Subject;
import com.quiz.entity.TakeExam;
import com.quiz.entity.TakeExamDetail;
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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.text.DecimalFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
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
    private ExamService examService;

    @Autowired
    private SubjectService subjectService;

    @Autowired
    private TakeExamService takeExamService;

    @Autowired
    private QuestionService questionService;

    @Autowired
    private TakeExamDetailService takeExamDetailService;

    @Autowired
    private RegisterService registerService;

    @GetMapping("")
    public ResponseEntity<StandardJSONResponse<TestsDTO>> fetchAllSubjects(
            @RequestParam("page") String page,
            @RequestParam(name = "query", required = false, defaultValue = "") String query,
            @RequestParam(name = "sortDir", required = false, defaultValue = "desc") String sortDir,
            @RequestParam(name = "sortField", required = false, defaultValue = "id") String sortField,
            @RequestParam(name = "subject", required = false, defaultValue = "") String subjectId,
            @RequestParam(name = "notUsedTest", required = false, defaultValue = "false") boolean notUsedTest,
            @RequestParam(name = "examId", required = false, defaultValue = "") Integer examId
    ) throws NotFoundException {
        TestsDTO testsDTO = new TestsDTO();

        if (page.equals("0")) {
            List<Test> tests = new ArrayList<>();
            if (!StringUtils.isEmpty(subjectId)) {
                Subject subject = subjectService.findById(subjectId);

                if (notUsedTest) {
                    tests = testService.findBySubjectAndUsed(subject);
                    if (Objects.nonNull(examId)) {
                        Exam exam = examService.findById(examId);
                        tests.addAll(exam.getTests());
                    }
                } else {
                    tests = testService.findBySubject(subject);
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
    public ResponseEntity<StandardJSONResponse<String>> saveTest(
            @AuthenticationPrincipal UserDetailsImpl userDetailsImpl,
            @RequestBody PostCreateTestDTO postCreateTestDTO,
            @RequestParam(name = "isEdit", required = false, defaultValue = "false") boolean isEdit
    ) {
        CommonUtils commonUtils = new CommonUtils();
        Subject subject = null;

        Integer id = postCreateTestDTO.getId();
        String name = postCreateTestDTO.getName();
        String subjectId = postCreateTestDTO.getSubjectId();
        List<Question> questions = postCreateTestDTO.getQuestions();
        User teacher = userDetailsImpl.getUser();

        catchTestInputException(commonUtils, isEdit, id, name, subjectId, questions);

        if (commonUtils.getArrayNode().size() > 0) {
            return new BadResponse<String>(commonUtils.getArrayNode().toString()).response();
        } else {
            if (testService.isNameDuplicated(id, name, isEdit)) {
                commonUtils.addError("name", "Tên đề thi đã tồn tại");
            }

            try {
                subject = subjectService.findById(subjectId);
            } catch (NotFoundException exception) {
                commonUtils.addError("subject", exception.getMessage());
            }

            if (commonUtils.getArrayNode().size() > 0) {
                return new BadResponse<String>(commonUtils.getArrayNode().toString()).response();
            }
        }

        if (isEdit) {
            try {
                Test test = testService.findById(id);
                test.setName(name);

                if (Objects.isNull(test.getQuestions())) {
                    test.setQuestions(new ArrayList<>());
                }

                for (Question qst : questions) {
                    // Check if question exists in the list.
                    Question question = questionService.getQuestionFromTest(test.getId(),
                            qst.getId()
                    );
                    if (Objects.isNull(question)) {
                        test.addQuestion(qst);
                    }
                }

                List<Question> removedQuestions = new ArrayList<>();
                for (Question question : test.getQuestions()) {
                    boolean shouldDelete = true;
                    for (Question qst : questions) {
                        if (question.getId().equals(qst.getId())) {
                            shouldDelete = false;
                            break;
                        }
                    }
                    // Remove none mentioned chapter
                    if (shouldDelete) {
                        removedQuestions.add(question);
                    }
                }

                for (Question question : removedQuestions) {
                    System.out.println("delete question id: " + question.getId());
                    test.removeQuestion(question);
                }

                testService.save(test);
            } catch (NotFoundException exception) {
                return new BadResponse<String>(exception.getMessage()).response();
            }
        } else {
            testService.save(Test.build(name, questions, subject, teacher));
        }

        return new OkResponse<>("Thêm đề thi thành công").response();
    }

    @GetMapping("{id}")
    public ResponseEntity<StandardJSONResponse<TestDTO>> findTest(@PathVariable("id") Integer id) {
        try {
            return new OkResponse<>(TestDTO.build(testService.findById(id), true)).response();
        } catch (NotFoundException ex) {
            return new BadResponse<TestDTO>(ex.getMessage()).response();
        }
    }

    @GetMapping("get-test")
    public ResponseEntity<StandardJSONResponse<Test>> findByStudentAndExam(
            @RequestParam(name = "student", required = false, defaultValue = "id") String studentId,
            @RequestParam(name = "exam", required = false, defaultValue = "") Integer examId) {
        return new OkResponse<>(testService.findByStudentAndExam(studentId, examId)).response();
    }

    @PostMapping("{examId}/handIn")
    public ResponseEntity<StandardJSONResponse<TestDTO>> handIn(
            @AuthenticationPrincipal UserDetailsImpl userDetailsImpl,
            @PathVariable("examId") Integer examId,
            @RequestBody List<HandInDTO> answers) throws NotFoundException {
        User student = userDetailsImpl.getUser();

        int numberOfRightAnswer = 0,
                numberOfEasyRightAnswer = 0,
                numberOfMediumRightAnswer = 0,
                numberOfHardRightAnswer = 0;
        int numberOfEasyQuestions = 0, numberOfMediumQuestions = 0, numberOfHardQuestions = 0;
        float mark = 0;

        // Lấy ra danh sách câu hỏi trong đề thi mà sinh viên làm
        List<TakeExamDetail> takeExamDetails =
                takeExamDetailService.findByStudentAndExam(student.getId(), examId);

        List<Question> questions = new ArrayList<>();
        for (TakeExamDetail detail : takeExamDetails) {
            Question question = detail.getQuestion();
            StringBuilder finalAnswer = new StringBuilder();

            // Xác định câu trả lời của câu hỏi.
            if (question.getType().equals("Một đáp án")) {
                for (Answer ans : question.getAnswers()) {
                    if (ans.isAnswer()) {
                        finalAnswer = new StringBuilder(ans.getOrder());
                    }
                }
            } else if (question.getType().equals("Nhiều đáp án")) {
                int k = 0;
                for (Answer ans : question.getAnswers()) {
                    if (ans.isAnswer()) {
                        if (k > 0) {
                            finalAnswer.append(",").append(ans.getOrder());
                        } else {
                            finalAnswer.append(ans.getOrder());
                        }
                        k++;
                    }
                }
            } else {
                finalAnswer = new StringBuilder(question.getAnswers().get(0).getContent());
            }

            // Đếm số câu hoi theo mức độ
            if (question.getLevel().equals("Dễ")) {
                numberOfEasyQuestions++;
            } else if (question.getLevel().equals("Trung bình")) {
                numberOfMediumQuestions++;
            } else {
                numberOfHardQuestions++;
            }

            boolean isQuestionMatched = false;
            for (HandInDTO handInDTO : answers) {
                if (handInDTO.getQuestionId().equals(question.getId())) {
                    isQuestionMatched = true;
                    // Xác định câu trả lời của sinh viên
                    String userFinalAnswer = handInDTO.getAnswer();

                    if (question.getType().equals("Nhiều đáp án")) {
                        String[] userFinalAnswerArr = handInDTO.getAnswer().split(",");
                        Arrays.sort(userFinalAnswerArr);
                        userFinalAnswer = String.join(",", userFinalAnswerArr);
                    }
                    // Nếu câu trả lời của sinh viên khớp với đáp của câu hỏi thì số câu trả lời
                    // đúng
                    // +1

                    if (finalAnswer.toString().toLowerCase().trim().equals(userFinalAnswer.toLowerCase().trim())) {
                        if (question.getLevel().equals("Dễ")) {
                            numberOfEasyRightAnswer++;
                        } else if (question.getLevel().equals("Trung bình")) {
                            numberOfMediumRightAnswer++;
                        } else {
                            numberOfHardRightAnswer++;
                        }
                        numberOfRightAnswer++;
                    }

                    question.setSelectedAnswer(userFinalAnswer);
                    // Cập nhật câu trả lời của sinh viên vào chi tiết thi
                    takeExamDetailService.updateAnswerForQuestionInStudentTest(userFinalAnswer.trim(), student.getId(), examId
                            , handInDTO.getQuestionId());
                }
            }
            // Nếu sinh viên không chọn đáp án thì câu trả lời là NULL.
            if (!isQuestionMatched) {
                takeExamDetailService.updateAnswerForQuestionInStudentTest(null, student.getId(),
                        examId
                        , question.getId());
            }

            question.setFinalAnswer(finalAnswer.toString());
            questions.add(question);
        }

        // Hệ số, câu hỏi khó gấp đôi điểm câu hỏi dễ, câu hỏi trung bình gấp rưỡi câu hỏi dễ.
        float factor = (float) (10 / (numberOfEasyQuestions + 1.5 * numberOfMediumQuestions + 2 * numberOfHardQuestions));
        // mark = (float) numberOfRightAnswer / takeExamDetails.size() * 10;
        System.out.println(factor);
        if (numberOfRightAnswer == takeExamDetails.size()) {
            mark = 10;
        } else {
            mark = (float) (factor * numberOfEasyRightAnswer + factor * 1.5 * numberOfMediumRightAnswer
                    + factor * 2 * numberOfHardRightAnswer);
        }
        System.out.println(mark);
        DecimalFormat df = new DecimalFormat("#.#");

        TestDTO testDTO = new TestDTO();
        testDTO.setMark(Float.parseFloat(df.format(mark)));
        testDTO.setNumberOfQuestions(questions.size());
        testDTO.setNumberOfRightAnswer(numberOfRightAnswer);
        testDTO.setQuestions(questions);

        // Cập nhật điểm cho kỳ thi giữa kỳ và cuối kỳ
        takeExamService.updateTakeExamScore(student.getId(), examId, Float.parseFloat(df.format(mark)));
        takeExamService.updateTakeExamTested(student.getId(), examId);

        TakeExam takeExam = takeExamService.findByStudentAndExam(student.getId(),
                examId);
        if (takeExam.getExam().getType().equals("Giữa kỳ")) {
            registerService.updateMidTermScore(student.getId(),
                    takeExam.getRegister().getCreditClass().getId(),
                    Float.parseFloat(df.format(mark)));
        } else if (takeExam.getExam().getType().equals("Cuối kỳ")) {
            registerService.updateFinalTermScore(student.getId(),
                    takeExam.getRegister().getCreditClass().getId(),
                    Float.parseFloat(df.format(mark)));
        }

        Exam exam = examService.findById(examId);
        boolean shouldUpdateExamStatus = true;
        for (TakeExam takeExam1 : exam.getTakeExams()) {
            // Kiểm tra tất cả sinh viên đã thi hết chưa
            if (!takeExamService.isTakeExamTested(takeExam1.getStudentId(), examId)) {
                shouldUpdateExamStatus = false;
                break;
            }
        }

        // Kiểm tra ngày giờ hiện tại của ca thi
        LocalDateTime now = LocalDateTime.now();
        int hour = 0, minute = 0;
        if (exam.getNoticePeriod() == 1) {
            hour = 7;
            minute = 0;
        } else if (exam.getNoticePeriod() == 3) {
            hour = 9;
            minute = 0;
        } else if (exam.getNoticePeriod() == 5) {
            hour = 13;
            minute = 0;
        } else {
            hour = 15;
            minute = 0;
        }

        // Nếu ca thi quá thời gian thi cập nhật trạng thái ca thi
        int additionalHour = 0, additionalMinute = 0;
        if (exam.getTime() / 60 == 0) {
            additionalMinute = exam.getTime();
        } else {
            additionalHour = exam.getTime() / 60;
            additionalMinute = exam.getTime() - (60 * additionalHour);
        }

        LocalDateTime examDate = exam.getExamDate().atTime(hour + additionalHour, minute + additionalMinute);
        if (now.isAfter(examDate) || shouldUpdateExamStatus) {
            exam.setTaken(true);
            examService.save(exam);
        }

        return new OkResponse<>(testDTO).response();
    }

    @DeleteMapping("{id}/delete")
    public ResponseEntity<StandardJSONResponse<String>> delete(@PathVariable("id") Integer id) {
        try {
            return new OkResponse<>(testService.deleteById(id)).response();
        } catch (ConstrainstViolationException ex) {
            return new BadResponse<String>(ex.getMessage()).response();
        }
    }

    @PutMapping("{id}")
    public ResponseEntity<StandardJSONResponse<String>> enableOrDisable(@PathVariable("id") Integer id, @RequestParam(name = "action") String action) {
        try {
            String message = testService.enableOrDisable(id, action);

            return new OkResponse<>(message).response();
        } catch (NotFoundException ex) {
            return new BadResponse<String>(ex.getMessage()).response();
        }
    }

    @GetMapping("findByUser")
    public ResponseEntity<StandardJSONResponse<List<CriteriaExtendsDTO>>> getUserCriteria(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<CriteriaExtendsDTO> tests = new ArrayList<>();
        for (Test test : testService.findByTeacher(userDetails.getUser())) {
            boolean shouldAddTest = true;

//            for(CriteriaDTO criteriaDTO :)
//
//            for (Chapter chapter : test.getSubjectChapters()) {
//                if (chapter.getNumberOfActiveQuestions() == 0) {
//                    shouldAddTest = false;
//                    break;
//                }
//            }
//
//            if (shouldAddTest) {
                tests.add(new CriteriaExtendsDTO(test.getSubjectId(), test.getSubjectName(), test.getId(), test.getCriteria()));
//            }

        }

        return new OkResponse<>(tests).response();
    }
}
