package com.quiz.app.exam;

import com.quiz.app.creditClass.CreditClassService;
import com.quiz.app.exam.dto.ExamsDTO;
import com.quiz.app.exam.dto.PostCreateExamDTO;
import com.quiz.app.exception.ConstrainstViolationException;
import com.quiz.app.exception.NotFoundException;
import com.quiz.app.response.StandardJSONResponse;
import com.quiz.app.response.error.BadResponse;
import com.quiz.app.response.success.OkResponse;
import com.quiz.app.security.UserDetailsImpl;
import com.quiz.app.takeExam.TakeExamService;
import com.quiz.app.takeExamDetail.TakeExamDetailService;
import com.quiz.app.test.TestService;
import com.quiz.app.utils.CommonUtils;
import com.quiz.entity.CreditClass;
import com.quiz.entity.Exam;
import com.quiz.entity.Question;
import com.quiz.entity.Register;
import com.quiz.entity.TakeExam;
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

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Random;

@RestController
@RequestMapping("/api/exams")
public class ExamRestController {
    @Autowired
    private ExamService examService;

    @Autowired
    private CreditClassService creditClassService;

    @Autowired
    private TakeExamService takeExamService;

    @Autowired
    private TakeExamDetailService takeExamDetailService;

    @Autowired
    private TestService testService;

    @GetMapping("")
    public ResponseEntity<StandardJSONResponse<ExamsDTO>> fetchAllSubjects(
            @RequestParam("page") String page,
            @RequestParam(name = "query", required = false, defaultValue = "") String query,
            @RequestParam(name = "sortDir", required = false, defaultValue = "desc") String sortDir,
            @RequestParam(name = "sortField", required = false, defaultValue = "id") String sortField,
            @RequestParam(name = "teacher", required = false, defaultValue = "") String teacherId,
            @RequestParam(name = "creditClass", required = false, defaultValue = "") String creditClassId,
            @RequestParam(name = "student", required = false, defaultValue = "") String studentId,
            @RequestParam(name = "taken", required = false, defaultValue = "") String taken,
            @RequestParam(name = "examType", required = false, defaultValue = "") String examType) {
        ExamsDTO subjectsDTO = new ExamsDTO();
        List<Exam> exams = null;
        if (page.equals("0")) {
            if (!StringUtils.isEmpty(taken)) {
                // Lấy ra những ca thi sinh viên chưa thi, ca thi chưa hủy, chưa thi.
                exams = examService.findByStudentAndTaken(studentId);
            } else {
                exams = examService.findAll();
            }

            subjectsDTO.setExams(exams);
            subjectsDTO.setTotalElements(exams.size());
            subjectsDTO.setTotalPages(0);

        } else {
            Map<String, String> filters = new HashMap<>();
            filters.put("page", page);
            filters.put("query", query);
            filters.put("sortDir", sortDir);
            filters.put("sortField", sortField);
            filters.put("teacherId", teacherId);
            filters.put("creditClassId", creditClassId);
            filters.put("studentId", studentId);
            filters.put("taken", taken);
            filters.put("examType", examType);

            Page<Exam> examsPage = examService.findAllExams(filters);

            subjectsDTO.setExams(examsPage.getContent());
            subjectsDTO.setTotalElements(examsPage.getTotalElements());
            subjectsDTO.setTotalPages(examsPage.getTotalPages());
        }

        return new OkResponse<>(subjectsDTO).response();
    }

    public void catchExamInputException(CommonUtils commonUtils, Integer id, String name,
            Integer creditClassId, String examDate,
            Integer noticePeriod,
            Integer numberOfStudents, Integer time, String type,
            List<Integer> tests,
            boolean isEdit) {
        if (isEdit) {
            if (Objects.isNull(id)) {
                commonUtils.addError("id", "Mã ca thi không được để " +
                        "trống");
            }
        }

        if (Objects.isNull(creditClassId)) {
            commonUtils.addError("creditClassId", "Mã LTC không được để " +
                    "trống");
        }

        if (Objects.isNull(examDate) || StringUtils.isEmpty(examDate)) {
            commonUtils.addError("examDate", "Số tiết thực hành không được để " +
                    "trống");
        }

        if (Objects.isNull(noticePeriod)) {
            commonUtils.addError("noticePeriod", "Tiết báo danh không được để " +
                    "trống");
        }

        if (Objects.isNull(numberOfStudents)) {
            commonUtils.addError("numberOfStudents", "Số SV không được để trống ");
        }

        if (Objects.isNull(time)) {
            commonUtils.addError("time", "Thời gian thi không được để " +
                    "trống");
        }

        if (Objects.isNull(type) || StringUtils.isEmpty(examDate)) {
            commonUtils.addError("type", "Loại kỳ thi không được để " +
                    "trống");
        }

        if (tests.size() == 0) {
            commonUtils.addError("tests", "Đề thi không được để " +
                    "trống");
        }
    }

    @PostMapping("save")
    public ResponseEntity<StandardJSONResponse<String>> saveExam(
            @AuthenticationPrincipal UserDetailsImpl userDetailsImpl,
            @RequestBody PostCreateExamDTO postCreateExamDTO,
            @RequestParam(name = "isEdit", required = false, defaultValue = "false") boolean isEdit) throws NotFoundException {
        User teacher = userDetailsImpl.getUser();
        CommonUtils commonUtils = new CommonUtils();
        Exam exam = null;
        CreditClass creditClass = null;

        Integer id = postCreateExamDTO.getId();
        String name = postCreateExamDTO.getName();
        Integer creditClassId = postCreateExamDTO.getCreditClassId();
        String examDate = postCreateExamDTO.getExamDate();
        Integer numberOfStudents = postCreateExamDTO.getNumberOfStudents();
        Integer noticePeriod = postCreateExamDTO.getNoticePeriod();
        Integer time = postCreateExamDTO.getTime();
        String type = postCreateExamDTO.getExamType();
        List<Integer> tests = postCreateExamDTO.getTests();

        catchExamInputException(commonUtils, id, name, creditClassId, examDate, noticePeriod,
                numberOfStudents, time,
                type, tests, isEdit);

        if (commonUtils.getArrayNode().size() > 0) {
            return new BadResponse<String>(commonUtils.getArrayNode().toString()).response();
        } else {
            try {
                creditClass = creditClassService.findById(creditClassId);
            } catch (NotFoundException e) {
                commonUtils.addError("creditClassId", e.getMessage());
            }

            if (commonUtils.getArrayNode().size() > 0) {
                return new BadResponse<String>(commonUtils.getArrayNode().toString()).response();
            }
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate tempExamDate = LocalDate.parse(examDate, formatter);

        if (isEdit) {
            try {
                exam = examService.findById(id);
                exam.setExamDate(tempExamDate);
                exam.setNoticePeriod(noticePeriod);
                exam.setTime(time);

                for (Test test : exam.getTests()) {
                    test.setExam(null);
                    test.setUsed(false);
                    testService.save(test);
                }

                for (Integer testId : tests) {
                    Test test = testService.findById(testId);
                    test.setExam(exam);
                    test.setUsed(true);
                    testService.save(test);
                }

                for (TakeExam takeExam : exam.getTakeExams()) {
                    Random ran = new Random();
                    int randomTest = ran.nextInt(tests.size());
                    int testId = tests.get(randomTest);
                    Register register = takeExam.getRegister();
                    String studentId = register.getStudent().getId();
                    System.out.printf("Sinh viên %s sử dụng mã đề %d%n", studentId, testId);

                    Test test = testService.findById(testId);
                    List<Question> questions = test.getQuestions();
                    Collections.shuffle(questions);

                    takeExamDetailService.updateTakeExamDetail(questions,
                            takeExam.getTryTime(), exam.getId(), register.getCreditClass().getId(),
                            studentId, testId);
                }

                examService.save(exam);
            } catch (NotFoundException e) {
                return new BadResponse<String>(e.getMessage()).response();
            }
        } else {
            Exam tempExam = Exam.build(postCreateExamDTO);
            tempExam.setTeacher(teacher);
            tempExam.setExamDate(tempExamDate);
            exam = examService.save(tempExam);

            for (Integer testId : tests) {
                Test test = testService.findById(testId);
                test.setExam(exam);
                test.setUsed(true);
                testService.save(test);
                exam.addTest(test);
            }
            exam = examService.save(tempExam);

            int i = 0;
            assert creditClass != null;
            creditClass.getRegisters().sort(Comparator.comparing(register -> register.getStudent().getFullName()));

            for (Register register : creditClass.getRegisters()) {
                // Chỉ tạo ca thi cho số lượng sinh viên nhất định
                if (i >= numberOfStudents) {
                    break;
                }
                // Bỏ qua các trường hợp hủy đăng ký
                if (register.isStatus()) {
                    continue;
                }
                // Nếu đã tạo ca thi rồi, mà ca thi đó chưa hủy thì bỏ qua
                boolean shouldContinue = false;
                List<TakeExam> takeExams = takeExamService.findByRegister(register);
                for (TakeExam takeExam : takeExams) {
                    if (takeExam.getExam().getType().equals(type)) {
                        shouldContinue = true;
                        break;
                    }
                }
                if (shouldContinue) {
                    continue;
                }

                try {
                    // Phát ngẫu nhiên đề thi cho sinh viên
                    Random ran = new Random();
                    int randomTest = ran.nextInt(tests.size());
                    int testId = tests.get(randomTest);
                    String studentId = register.getStudent().getId();
                    System.out.printf("Sinh viên %s sử dụng mã đề %d%n", studentId, testId);

                    int tryTime = takeExamService.determineTryTime(register);
                    takeExamService.insertIntoTakeExamTable(tryTime, exam.getId(),
                            register.getCreditClass().getId(), studentId, testId);

                    // Xáo trộn câu hỏi trong đề thi của sinh viên
                    try {
                        Test test = testService.findById(testId);
                        List<Question> questions = test.getQuestions();
                        Collections.shuffle(questions);
                        for (Question question : questions) {
                            takeExamDetailService.insertIntoTakeExamDetail(question.getId(), tryTime, exam.getId(),
                                    register.getCreditClass().getId(), register.getStudent().getId());
                        }
                    } catch (NotFoundException e) {
                        return new BadResponse<String>(e.getMessage()).response();
                    }
                } catch (ConstrainstViolationException e) {
                    return new BadResponse<String>(e.getMessage()).response();
                }
                i++;
            }
        }

        return new OkResponse<>("Thêm ca thi thành công").response();
    }

    @DeleteMapping("{id}/delete")
    public ResponseEntity<StandardJSONResponse<String>> delete(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable("id") Integer id) {
        try {
            User teacher = userDetails.getUser();

            if (teacher.hasRole("Sinh viên")) {
                return new OkResponse<>("Người dùng không có quyền xoá ca thi").response();
            }

            Exam exam = examService.findById(id);
            String message = "Không thể xóa ca thi";

            if (!teacher.hasRole("Quản trị viên")) { // Giảng viên
                // Chưa thi + chưa duyệt
                if (!exam.isTaken() && exam.isStatus()) {
                    message = examService.delete(exam);
                }
            } else {
                // Chưa thi
                if (!exam.isTaken()) {
                    message = examService.delete(exam);
                }
            }

            return new OkResponse<>(message).response();
        } catch (ConstrainstViolationException | NotFoundException ex) {
            return new BadResponse<String>(ex.getMessage()).response();
        }
    }

    @PutMapping("{id}")
    public ResponseEntity<StandardJSONResponse<String>> enableOrDisable(@PathVariable("id") Integer id,
            @RequestParam(name = "action") String action) {
        try {
            String message = examService.enableOrDisable(id, action);

            return new OkResponse<>(message).response();
        } catch (NotFoundException ex) {
            return new BadResponse<String>(ex.getMessage()).response();
        }
    }
}
