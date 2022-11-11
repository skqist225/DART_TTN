package com.quiz.app.creditClass;

import com.quiz.app.answer.dto.AnswerDTO;
import com.quiz.app.common.CommonUtils;
import com.quiz.app.creditClass.dto.CreditClassesDTO;
import com.quiz.app.creditClass.dto.PostCreateCreditClassDTO;
import com.quiz.app.exception.ConstrainstViolationException;
import com.quiz.app.exception.NotFoundException;
import com.quiz.app.response.StandardJSONResponse;
import com.quiz.app.response.error.BadResponse;
import com.quiz.app.response.success.OkResponse;
import com.quiz.entity.CreditClass;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
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


@RestController
@RequestMapping("/api/classes")
public class CreditClassRestController {
    @Autowired
    private CreditClassService creditClassService;

    @GetMapping("")
    public ResponseEntity<StandardJSONResponse<CreditClassesDTO>> fetchAllSubjects(
            @RequestParam("page") String page,
            @RequestParam(name = "query", required = false, defaultValue = "") String query,
            @RequestParam(name = "sortDir", required = false, defaultValue = "desc") String sortDir,
            @RequestParam(name = "sortField", required = false, defaultValue = "id") String sortField
    ) {
        CreditClassesDTO creditClassesDTO = new CreditClassesDTO();

        if (page.equals("0")) {
            List<CreditClass> creditClasses = creditClassService.findAll();

            creditClassesDTO.setCreditClasses(creditClasses);
            creditClassesDTO.setTotalElements(creditClasses.size());
            creditClassesDTO.setTotalPages(0);
        } else {
            Map<String, String> filters = new HashMap<>();
            filters.put("page", page);
            filters.put("query", query);
            filters.put("sortDir", sortDir);
            filters.put("sortField", sortField);

            Page<CreditClass> creditClassesPage = creditClassService.findAllCreditClasses(filters);

            creditClassesDTO.setCreditClasses(creditClassesPage.getContent());
            creditClassesDTO.setTotalElements(creditClassesPage.getTotalElements());
            creditClassesDTO.setTotalPages(creditClassesPage.getTotalPages());
        }

        return new OkResponse<>(creditClassesDTO).response();
    }

    public void catchCreditClassInputException(CommonUtils commonUtils, String schoolYear, Integer semester,
                                               String subjectId,
                                               Integer group,
                                               Integer minimumNumberOfStudents
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

        if (Objects.isNull(minimumNumberOfStudents)) {
            commonUtils.addError("minimumNumberOfStudents", "Số SV tối thiểu không được để trống");
        }
    }

    @PostMapping("save")
    public ResponseEntity<StandardJSONResponse<CreditClass>> saveSubject(
            @RequestBody PostCreateCreditClassDTO postCreateClassDTO,
            @RequestParam(name = "isEdit", required = false, defaultValue = "false") boolean isEdit
    ) {
        CommonUtils commonUtils = new CommonUtils();
        CreditClass creditClass = null;

        Integer id = postCreateClassDTO.getId();
        String schoolYear = postCreateClassDTO.getSchoolYear();
        Integer semester = postCreateClassDTO.getSemester();
        String subjectId = postCreateClassDTO.getSubjectId();
        Integer group = postCreateClassDTO.getGroup();
        Integer minimumNumberOfStudents = postCreateClassDTO.getMinimumNumberOfStudents();

        catchCreditClassInputException(commonUtils, schoolYear, semester, subjectId, group, minimumNumberOfStudents);


        if (commonUtils.getArrayNode().size() > 0) {
            return new BadResponse<CreditClass>(commonUtils.getArrayNode().toString()).response();
        } else {
            if (creditClassService.isUniqueKey(id, schoolYear, semester, subjectId, group, isEdit)) {
                commonUtils.addError("uniqueKey", "Key tồn tại");
            }

            if (commonUtils.getArrayNode().size() > 0) {
                return new BadResponse<CreditClass>(commonUtils.getArrayNode().toString()).response();
            }
        }

        if (isEdit) {
            try {
                CreditClass cls = creditClassService.findById(id);
                cls.setId(id);
//                cls.setName(name);

//                savedSubject = creditClassService.save(cls);
            } catch (NotFoundException exception) {
                return new BadResponse<CreditClass>(exception.getMessage()).response();
            }
        } else {
//            savedSubject = creditClassService.save(CreditClass.build(postCreateClassDTO, null));
        }

        return new OkResponse<>(new CreditClass()).response();
    }

    @DeleteMapping("{id}/delete")
    public ResponseEntity<StandardJSONResponse<String>> delete(@PathVariable("id") Integer id) {
        try {
            return new OkResponse<>(creditClassService.deleteById(id)).response();
        } catch (ConstrainstViolationException ex) {
            return new BadResponse<String>(ex.getMessage()).response();
        }
    }
}
