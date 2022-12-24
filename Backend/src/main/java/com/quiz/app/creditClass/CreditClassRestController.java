package com.quiz.app.creditClass;

import com.quiz.app.creditClass.dto.CreditClassesDTO;
import com.quiz.app.creditClass.dto.PostCreateCreditClassDTO;
import com.quiz.app.exam.ExamService;
import com.quiz.app.exam.dto.ExamCreditClassPageDTO;
import com.quiz.app.exception.ConstrainstViolationException;
import com.quiz.app.exception.NotFoundException;
import com.quiz.app.response.StandardJSONResponse;
import com.quiz.app.response.error.BadResponse;
import com.quiz.app.response.success.OkResponse;
import com.quiz.app.security.UserDetailsImpl;
import com.quiz.app.subject.SubjectService;
import com.quiz.app.user.UserService;
import com.quiz.app.utils.CommonUtils;
import com.quiz.entity.CreditClass;
import com.quiz.entity.Exam;
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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/creditClasses")
public class CreditClassRestController {
    @Autowired
    private CreditClassService creditClassService;

    @Autowired
    private SubjectService subjectService;

    @Autowired
    private ExamService examService;

    @Autowired
    private UserService userService;

    @GetMapping("")
    public ResponseEntity<StandardJSONResponse<CreditClassesDTO>> fetchAllSubjects(
            @RequestParam("page") String page,
            @RequestParam(name = "query", required = false, defaultValue = "") String query,
            @RequestParam(name = "sortDir", required = false, defaultValue = "desc") String sortDir,
            @RequestParam(name = "sortField", required = false, defaultValue = "id") String sortField,
            @RequestParam(name = "active", required = false, defaultValue = "false") boolean active,
            @RequestParam(name = "subject", required = false, defaultValue = "") String subjectId,
            @RequestParam(name = "teacher", required = false, defaultValue = "") String teacherId,
            @RequestParam(name = "student", required = false, defaultValue = "") String studentId,
            @RequestParam(name = "haveRegister", required = false, defaultValue = "true") boolean haveRegister,
            @RequestParam(name = "haveExam", required = false, defaultValue = "false") boolean haveExam
    ) {
        CreditClassesDTO creditClassesDTO = new CreditClassesDTO();
        List<CreditClass> creditClasses = new ArrayList<>();
        long totalElements = 0;
        long totalPages = 0;

        if (page.equals("0")) {
            if (active) {
                if (!StringUtils.isEmpty(studentId)) {
                    List<CreditClass> teCreditClasses1 =
                            creditClassService.findAllActiveCreditClassAndStudent(studentId);
                    for (CreditClass creditClass : teCreditClasses1) {
                        List<Exam> teExams = examService.findAllExamsIdByCreditClass(creditClass.getId());
                        if (teExams.size() > 0) {
                            creditClasses.add(creditClass);
                        }
                    }
                } else if (haveRegister) {
                    // Active and have register
                    List<CreditClass> tempCreditClass =
                            creditClassService.findAllActiveCreditClassHaveRegister();
                    // Have test
                    for (CreditClass creditClass : tempCreditClass) {
                        if (creditClass.getSubject().getTests().size() > 0) {
                            boolean shouldAddCreditClass = false;
                            for (Test test : creditClass.getSubject().getTests()) {
                                if (test.isStatus() && !test.getUsed()) {
                                    shouldAddCreditClass = true;
                                }
                            }
                            if (shouldAddCreditClass) {
                                creditClasses.add(creditClass);
                            }
                        }
                    }

                } else {
                    creditClasses = creditClassService.findAllActiveCreditClass();
                }
            } else if (haveExam) {
                creditClasses = creditClassService.findAll();
            } else {
                creditClasses = creditClassService.findAll();
            }

            totalElements = creditClasses.size();
            totalPages = (long) Math.ceil(creditClasses.size() / 10);
        } else {
            Map<String, String> filters = new HashMap<>();
            filters.put("page", page);
            filters.put("query", query);
            filters.put("sortDir", sortDir);
            filters.put("sortField", sortField);
            filters.put("teacherId", teacherId);
            filters.put("subjectId", subjectId);

            Page<CreditClass> creditClassesPage = creditClassService.findAllCreditClasses(filters);
            creditClasses = creditClassesPage.getContent();
            totalElements = creditClassesPage.getTotalElements();
            totalPages = creditClassesPage.getTotalPages();
        }
        if (page.equals("0") && active && haveRegister) {
            System.out.println(creditClasses.size());
        }

        List<CreditClass> tempCreditClasses = new ArrayList<>();
        for (CreditClass creditClass : creditClasses) {
            List<Exam> exams = examService.findAllExamsIdByCreditClass(creditClass.getId());

            if (page.equals("0") && haveExam) {
                if (exams.size() > 0) {
                    if (!StringUtils.isEmpty(teacherId)) {
                        if (creditClass.getTeacherId().equals(teacherId)) {
                            creditClass.setTotalExams(exams.size());
                            tempCreditClasses.add(creditClass);
                        }
                    } else {
                        creditClass.setTotalExams(exams.size());
                        tempCreditClasses.add(creditClass);
                    }
                }
            } else {
                creditClass.setExams(exams.stream().map(exam -> new ExamCreditClassPageDTO(exam.getId(),
                        exam.getName(),
                        exam.getExamDate(), exam.getNoticePeriod(), exam.getTime(), exam.getTests(),
                        exam.getType(), exam.isTaken(), exam.isStatus(), exam.getTakeExams().size()
                )).collect(Collectors.toList()));

                int numberOfMidTermExam = 0,
                        numberOfFinalTermExam = 0,
                        numberOfMidTermExamCreated = 0,
                        numberOfFinalTermExamCreated = 0;

                for (ExamCreditClassPageDTO exam : creditClass.getExams()) {
                    if (exam.getType().equals("Giữa kỳ") && !exam.isStatus()) {
                        numberOfMidTermExam++;
                        numberOfMidTermExamCreated += exam.getNumberOfRegisters();
                    } else if (exam.getType().equals("Cuối kỳ") && !exam.isStatus()) {
                        numberOfFinalTermExam++;
                        numberOfFinalTermExamCreated += exam.getNumberOfRegisters();
                    }
                }

                creditClass.setNumberOfMidTermExam(numberOfMidTermExam);
                creditClass.setNumberOfFinalTermExam(numberOfFinalTermExam);
                creditClass.setNumberOfMidTermExamCreated(numberOfMidTermExamCreated);
                creditClass.setNumberOfFinalTermExamCreated(numberOfFinalTermExamCreated);

                if (page.equals("0") && active && haveRegister) {
                    // Có sinh viên chưa được tạo ca thi cuối kỳ hoặc giữa kỳ
                    if (creditClass.getNumberOfActiveStudents() - numberOfMidTermExamCreated > 0 ||
                            creditClass.getNumberOfActiveStudents() - numberOfFinalTermExamCreated > 0) {
                        tempCreditClasses.add(creditClass);
                    }
                } else {
                    tempCreditClasses.add(creditClass);
                }
            }
        }

        creditClassesDTO.setCreditClasses(tempCreditClasses);
        creditClassesDTO.setTotalElements(totalElements);
        creditClassesDTO.setTotalPages(totalPages);

        return new OkResponse<>(creditClassesDTO).response();
    }

    public void catchCreditClassInputException(CommonUtils commonUtils, String schoolYear, Integer semester,
                                               String subjectId,
                                               Integer group,
                                               String teacherId
    ) {
        if (Objects.isNull(schoolYear) || StringUtils.isEmpty(schoolYear)) {
            commonUtils.addError("schoolYear", "Niên khóa không được để trống");
        }

        if (Objects.isNull(semester)) {
            commonUtils.addError("semester", "Học kỳ không được để trống");
        }

        if (Objects.isNull(subjectId) || StringUtils.isEmpty(subjectId)) {
            commonUtils.addError("subjectId", "Môn học không được để trống");
        }

        if (Objects.isNull(group)) {
            commonUtils.addError("group", "Nhóm không được để trống");
        }

        if (Objects.isNull(teacherId) || StringUtils.isEmpty(teacherId)) {
            commonUtils.addError("teacherId", "Giảng viên không được để trống");
        }
    }

    @PostMapping("save")
    public ResponseEntity<StandardJSONResponse<String>> saveSubject(
            @AuthenticationPrincipal UserDetailsImpl userDetailsImpl,
            @RequestBody PostCreateCreditClassDTO postCreateCreditClassDTO,
            @RequestParam(name = "isEdit", required = false, defaultValue = "false") boolean isEdit
    ) {
        CommonUtils commonUtils = new CommonUtils();
        Subject subject = null;
        User teacher = null;

        Integer id = postCreateCreditClassDTO.getId();
        String schoolYear = postCreateCreditClassDTO.getSchoolYear();
        Integer semester = postCreateCreditClassDTO.getSemester();
        String subjectId = postCreateCreditClassDTO.getSubjectId();
        Integer group = postCreateCreditClassDTO.getGroup();
        String teacherId = postCreateCreditClassDTO.getTeacherId();

        catchCreditClassInputException(commonUtils, schoolYear, semester, subjectId, group,
                teacherId);

        if (commonUtils.getArrayNode().size() > 0) {
            return new BadResponse<String>(commonUtils.getArrayNode().toString()).response();
        } else {
            if (creditClassService.isUniqueKey(id, schoolYear, semester, subjectId, group, isEdit)) {
                commonUtils.addError("uniqueKey", "Niên khóa + học kỳ + môn học + nhóm phải là " +
                        "duy nhất");
            }

            try {
                subject = subjectService.findById(subjectId);
            } catch (NotFoundException e) {
                commonUtils.addError("subjectId", e.getMessage());
            }

            try {
                teacher = userService.findById(teacherId);
            } catch (NotFoundException e) {
                commonUtils.addError("teacherId", e.getMessage());
            }

            if (commonUtils.getArrayNode().size() > 0) {
                return new BadResponse<String>(commonUtils.getArrayNode().toString()).response();
            }
        }

        if (isEdit) {
            try {
                CreditClass creditCls = creditClassService.findById(id);
                creditCls.setSubject(subject);
                creditCls.setSchoolYear(schoolYear);
                creditCls.setSemester(semester);
                creditCls.setGroup(group);
                creditCls.setTeacher(teacher);

                 creditClassService.save(creditCls);
            } catch (NotFoundException exception) {
                return new BadResponse<String>(exception.getMessage()).response();
            }
        } else {
            creditClassService.save(CreditClass.build(postCreateCreditClassDTO,
                    subject, teacher));
        }

        return new OkResponse<>("Thêm lớp tín chỉ thành công").response();
    }

    @DeleteMapping("{id}/delete")
    public ResponseEntity<StandardJSONResponse<String>> delete(@PathVariable("id") Integer id) {
        try {
            return new OkResponse<>(creditClassService.deleteById(id)).response();
        } catch (ConstrainstViolationException ex) {
            return new BadResponse<String>(ex.getMessage()).response();
        }
    }

    @PutMapping("{id}")
    public ResponseEntity<StandardJSONResponse<String>> enableOrDisable(@PathVariable("id") Integer id, @RequestParam(name = "action") String action) {
        try {
            String message = creditClassService.enableOrDisable(id, action);

            return new OkResponse<>(message).response();
        } catch (NotFoundException ex) {
            return new BadResponse<String>(ex.getMessage()).response();
        }
    }

    @GetMapping("{id}/get")
    public ResponseEntity<StandardJSONResponse<CreditClass>> getCreditClass(@PathVariable("id") Integer id) {
        try {
            CreditClass creditClass = creditClassService.findById(
                    id);

            List<Exam> exams = examService.findAllExamsIdByCreditClass(creditClass.getId());
            creditClass.setExams(exams.stream().map(exam -> new ExamCreditClassPageDTO(exam.getId(),
                    exam.getName(),
                    exam.getExamDate(), exam.getNoticePeriod(), exam.getTime(), exam.getTests(),
                    exam.getType(), exam.isTaken(), exam.isStatus(), exam.getTakeExams().size()
            )).collect(Collectors.toList()));
            int numberOfMidTermExam = 0,
                    numberOfFinalTermExam = 0,
                    numberOfMidTermExamCreated = 0,
                    numberOfFinalTermExamCreated = 0;

            for (ExamCreditClassPageDTO exam : creditClass.getExams()) {
                if (exam.getType().equals("Giữa kỳ") && !exam.isStatus()) {
                    numberOfMidTermExam++;
                    numberOfMidTermExamCreated += exam.getNumberOfRegisters();
                } else if (exam.getType().equals("Cuối kỳ") && !exam.isStatus()) {
                    numberOfFinalTermExam++;
                    numberOfFinalTermExamCreated += exam.getNumberOfRegisters();
                }
            }

            creditClass.setNumberOfMidTermExam(numberOfMidTermExam);
            creditClass.setNumberOfFinalTermExam(numberOfFinalTermExam);
            creditClass.setNumberOfMidTermExamCreated(numberOfMidTermExamCreated);
            creditClass.setNumberOfFinalTermExamCreated(numberOfFinalTermExamCreated);

            return new OkResponse<>(creditClass).response();
        } catch (NotFoundException ex) {
            return new BadResponse<CreditClass>(ex.getMessage()).response();
        }
    }
}
