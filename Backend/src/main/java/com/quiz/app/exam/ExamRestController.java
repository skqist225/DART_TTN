package com.quiz.app.exam;

import com.quiz.app.common.CommonUtils;
import com.quiz.app.exam.dto.ExamsDTO;
import com.quiz.app.exam.dto.PostCreateExamDTO;
import com.quiz.app.exception.ConstrainstViolationException;
import com.quiz.app.response.StandardJSONResponse;
import com.quiz.app.response.error.BadResponse;
import com.quiz.app.response.success.OkResponse;
import com.quiz.entity.Exam;
import com.quiz.entity.Subject;
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
@RequestMapping("/api/exams")
public class ExamRestController {
    @Autowired
    private ExamService examService;

    @GetMapping("")
    public ResponseEntity<StandardJSONResponse<ExamsDTO>> fetchAllSubjects(
            @RequestParam("page") String page,
            @RequestParam(name = "query", required = false, defaultValue = "") String query,
            @RequestParam(name = "sortDir", required = false, defaultValue = "desc") String sortDir,
            @RequestParam(name = "sortField", required = false, defaultValue = "id") String sortField
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

            Page<Exam> examsPage = examService.findAllSubjects(filters);

            subjectsDTO.setExams(examsPage.getContent());
            subjectsDTO.setTotalElements(examsPage.getTotalElements());
            subjectsDTO.setTotalPages(examsPage.getTotalPages());
        }

        return new OkResponse<>(subjectsDTO).response();
    }

    @PostMapping("save")
    public ResponseEntity<StandardJSONResponse<Exam>> saveSubject(
            @RequestBody PostCreateExamDTO postCreateExamDTO,
            @RequestParam(name = "isEdit", required = false, defaultValue = "false") boolean isEdit
    ) {
        Exam exam = null;
        CommonUtils commonUtils = new CommonUtils();

        String id = postCreateExamDTO.getId();
        String name = postCreateExamDTO.getName();
        String numberOfTheoreticalPeriods = postCreateExamDTO.getNumberOfTheoreticalPeriods();
        String numberOfPracticePeriods = postCreateExamDTO.getNumberOfPracticePeriods();

        if (Objects.isNull(id)) {
            commonUtils.addError("id", "Mã môn học không được để trống");
        }

        if (Objects.isNull(name)) {
            commonUtils.addError("name", "Tên môn học không được để trống");
        }

        if (Objects.isNull(numberOfTheoreticalPeriods)) {
            commonUtils.addError("numberOfTheoreticalPeriods", "Số tiết lý thuyết không được để trống");
        }

        if (Objects.isNull(numberOfPracticePeriods)) {
            commonUtils.addError("numberOfPracticePeriods", "Số tiết thực hành không được để " +
                    "trống");
        }

        if (commonUtils.getArrayNode().size() > 0) {
            return new BadResponse<Exam>(commonUtils.getArrayNode().toString()).response();
        } else {
            int numberOfTheoreticalPeriodsInt = 0, numberOfPracticePeriodsInt = 0;
            try {
                numberOfTheoreticalPeriodsInt = Integer.parseInt(numberOfTheoreticalPeriods);
            } catch (final NumberFormatException e) {
                commonUtils.addError("numberOfTheoreticalPeriods", "Số tiết lý thuyết không hợp " +
                        "lệ");
            }

            try {
                numberOfPracticePeriodsInt = Integer.parseInt(numberOfPracticePeriods);
            } catch (final NumberFormatException e) {
                commonUtils.addError("numberOfPracticePeriods", "Số tiết thực hành không hợp " +
                        "lệ");
            }

            if (commonUtils.getArrayNode().size() > 0) {
                return new BadResponse<Exam>(commonUtils.getArrayNode().toString()).response();
            }

            if ((numberOfPracticePeriodsInt + numberOfTheoreticalPeriodsInt) % 3 != 0) {
                commonUtils.addError("numberOfPracticePeriods", "Số tiết lý thuyết + thực " +
                        "hành phải là bội số của 3 "
                );
            }

            if (commonUtils.getArrayNode().size() > 0) {
                return new BadResponse<Exam>(commonUtils.getArrayNode().toString()).response();
            }
        }

        if (isEdit) {
//            try {
//                Subject    subject = examService.findById(id);
//                subject.setName(name);
//
//                savedSubject = examService.save(subject);
//            } catch (NotFoundException exception) {
//                return new BadResponse<Subject>(exception.getMessage()).response();
//            }
        } else {
            exam = examService.save(Exam.build(postCreateExamDTO));
        }

        return new OkResponse<>(exam).response();
    }

    @DeleteMapping("{id}/delete")
    public ResponseEntity<StandardJSONResponse<String>> delete(@PathVariable("id") Integer id) {
        try {
            return new OkResponse<>(examService.deleteById(id)).response();
        } catch (ConstrainstViolationException ex) {
            return new BadResponse<String>(ex.getMessage()).response();
        }
    }
}
