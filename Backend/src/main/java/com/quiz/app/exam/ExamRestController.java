package com.quiz.app.exam;

import com.quiz.app.common.CommonUtils;
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
import com.quiz.entity.CreditClass;
import com.quiz.entity.Exam;
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
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;


@RestController
@RequestMapping("/api/exams")
public class ExamRestController {
    @Autowired
    private ExamService examService;

    @Autowired
    private CreditClassService creditClassService;

    @Autowired
    private TakeExamService takeExamService;

    @GetMapping("")
    public ResponseEntity<StandardJSONResponse<ExamsDTO>> fetchAllSubjects(
            @RequestParam("page") String page,
            @RequestParam(name = "query", required = false, defaultValue = "") String query,
            @RequestParam(name = "sortDir", required = false, defaultValue = "desc") String sortDir,
            @RequestParam(name = "sortField", required = false, defaultValue = "id") String sortField,
            @RequestParam(name = "teacher", required = false, defaultValue = "") String teacherId
    ) {
        ExamsDTO subjectsDTO = new ExamsDTO();

        if (page.equals("0")) {
            List<Exam> exams = examService.findAll();

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
            commonUtils.addError("numberOfStudents", "Số SV không được để trống "
            );
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
            @RequestParam(name = "isEdit", required = false, defaultValue = "false") boolean isEdit
    ) {
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
        String type = postCreateExamDTO.getType();
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
                Exam exm = examService.findById(id);
                exm.setExamDate(tempExamDate);
                exm.setNoticePeriod(noticePeriod);
                exm.setTime(time);
                exm.setType(type);

                for (Integer testId : tests) {
                    // Add new test
                    exm.addTest(new Test(testId));
                }

                List<Test> removedTests = new ArrayList<>();
                for (Test test : exm.getTests()) {
                    boolean shouldDelete = true;

                    for (Integer a : tests) {
                        if (a.equals(test.getId())) {
                            shouldDelete = false;
                            break;
                        }
                    }
                    // Remove none mentioned test
                    if (shouldDelete) {
                        removedTests.add(test);
                    }
                }

                for (Test test : removedTests) {
                    exm.removeTest(test);
                }

                exam = examService.save(exm);
            } catch (NotFoundException e) {
                return new BadResponse<String>(e.getMessage()).response();
            }
        } else {
            Exam tempExam = Exam.build(postCreateExamDTO);
            tempExam.setExamDate(tempExamDate);
            for (Integer testId : tests) {
                tempExam.addTest(new Test(testId));
            }
            exam = examService.save(tempExam);
            exam.setTeacher(teacher);

            int i = 0;
            creditClass.getRegisters().sort(Comparator.comparing(register -> register.getStudent().getFullName()));
            for (Register register : creditClass.getRegisters()) {
                if (i >= numberOfStudents) {
                    break;
                }
                if (register.isStatus()) {
                    continue;
                }
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
                    takeExamService.insertIntoTakeExamTable(takeExamService.determineTryTime(register), exam.getId(),
                            register.getCreditClass().getId(), register.getStudent().getId());
                } catch (ConstrainstViolationException e) {

                }

                i++;
            }
        }

        return new OkResponse<>("Thêm ca thi thành công").response();
    }

    @DeleteMapping("{id}/delete")
    public ResponseEntity<StandardJSONResponse<String>> delete(@PathVariable("id") Integer id) {
        try {
            return new OkResponse<>(examService.deleteById(id)).response();
        } catch (ConstrainstViolationException ex) {
            return new BadResponse<String>(ex.getMessage()).response();
        }
    }

    @PutMapping("{id}")
    public ResponseEntity<StandardJSONResponse<String>> enableOrDisable(@PathVariable("id") Integer id, @RequestParam(name = "action") String action) {
        try {
            String message = examService.enableOrDisable(id, action);

            return new OkResponse<>(message).response();
        } catch (NotFoundException ex) {
            return new BadResponse<String>(ex.getMessage()).response();
        }
    }
}
