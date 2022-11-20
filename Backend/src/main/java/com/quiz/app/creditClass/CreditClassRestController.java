package com.quiz.app.creditClass;

import com.quiz.app.common.CommonUtils;
import com.quiz.app.creditClass.dto.CreditClassesDTO;
import com.quiz.app.creditClass.dto.PostCreateCreditClassDTO;
import com.quiz.app.exam.ExamService;
import com.quiz.app.exception.ConstrainstViolationException;
import com.quiz.app.exception.NotFoundException;
import com.quiz.app.response.StandardJSONResponse;
import com.quiz.app.response.error.BadResponse;
import com.quiz.app.response.success.OkResponse;
import com.quiz.app.security.UserDetailsImpl;
import com.quiz.app.subject.SubjectService;
import com.quiz.app.user.UserService;
import com.quiz.entity.CreditClass;
import com.quiz.entity.Exam;
import com.quiz.entity.Subject;
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
            @RequestParam(name = "teacher", required = false, defaultValue = "id") String teacherId
    ) {
        CreditClassesDTO creditClassesDTO = new CreditClassesDTO();

        if (page.equals("0")) {
            List<CreditClass> creditClasses = null;
            if (active) {
                creditClasses = creditClassService.findAllActiveCreditClass();
            } else {
                creditClasses = creditClassService.findAll();
            }

            creditClassesDTO.setCreditClasses(creditClasses);
            creditClassesDTO.setTotalElements(creditClasses.size());
            creditClassesDTO.setTotalPages((long) Math.ceil(creditClasses.size() / 10));
        } else {
            Map<String, String> filters = new HashMap<>();
            filters.put("page", page);
            filters.put("query", query);
            filters.put("sortDir", sortDir);
            filters.put("sortField", sortField);
            filters.put("teacherId", teacherId);

            Page<CreditClass> creditClassesPage = creditClassService.findAllCreditClasses(filters);

            List<CreditClass> creditClasses = new ArrayList<>();
            for (CreditClass creditClass : creditClassesPage.getContent()) {
                List<Exam> exams = examService.findAllExamsIdByCreditClass(creditClass.getId());
                creditClass.setExams(exams);
                creditClasses.add(creditClass);
            }

            creditClassesDTO.setCreditClasses(creditClasses);
            creditClassesDTO.setTotalElements(creditClassesPage.getTotalElements());
            creditClassesDTO.setTotalPages(creditClassesPage.getTotalPages());
        }

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
        CreditClass creditClass = null;
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

                creditClass = creditClassService.save(creditCls);
            } catch (NotFoundException exception) {
                return new BadResponse<String>(exception.getMessage()).response();
            }
        } else {
            creditClass = creditClassService.save(CreditClass.build(postCreateCreditClassDTO,
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
}
