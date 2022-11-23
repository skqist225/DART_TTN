package com.quiz.app.takeExamDetail;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/subjects")
public class TakeExamDetailRestController {
    @Autowired
    private TakeExamDetailService subjectService;


//    @GetMapping("")
//    public ResponseEntity<StandardJSONResponse<SubjectsDTO>> fetchAllSubjects(
//            @RequestParam("page") String page,
//            @RequestParam(name = "query", required = false, defaultValue = "") String query,
//            @RequestParam(name = "sortDir", required = false, defaultValue = "desc") String sortDir,
//            @RequestParam(name = "sortField", required = false, defaultValue = "id") String sortField
//    ) {
//        SubjectsDTO subjectsDTO = new SubjectsDTO();
//
//        if(page.equals("0")) {
//            List<Subject> subjects = subjectService.findAll();
//
//            subjectsDTO.setSubjects(subjects);
//            subjectsDTO.setTotalElements(subjects.size());
//            subjectsDTO.setTotalPages(0);
//
//        } else {
//            Map<String, String> filters = new HashMap<>();
//            filters.put("page", page);
//            filters.put("query", query);
//            filters.put("sortDir", sortDir);
//            filters.put("sortField", sortField);
//
//            Page<Subject> subjectsPage = subjectService.findAllSubjects(filters);
//
//            subjectsDTO.setSubjects(subjectsPage.getContent());
//            subjectsDTO.setTotalElements(subjectsPage.getTotalElements());
//            subjectsDTO.setTotalPages(subjectsPage.getTotalPages());
//        }
//
//        return new OkResponse<>(subjectsDTO).response();
//    }
//
//    @GetMapping("brief")
//    public ResponseEntity<StandardJSONResponse<List<SubjectDTO>>> fetchAllSubjects() {
////        return new OkResponse<>(subjectService.findAllSubjects()).response();
//        return null;
//    }
//
//    @GetMapping("{subjectId}")
//    public ResponseEntity<StandardJSONResponse<SubjectDTO>> fetchSubject(@PathVariable(name =
//            "subjectId") String subjectId) {
//        try {
//            return new OkResponse<>(SubjectDTO.build(subjectService.findById(subjectId))).response();
//        } catch (NotFoundException e) {
//            return new BadResponse<SubjectDTO>(e.getMessage()).response();
//        }
//    }
//
//    @PostMapping("save")
//    public ResponseEntity<StandardJSONResponse<Subject>> saveSubject(
//            @RequestBody PostCreateSubjectDTO postCreateSubjectDTO,
//            @RequestParam(name = "isEdit", required = false, defaultValue = "false") boolean isEdit
//    ) {
//        Subject savedSubject = null;
//        CommonUtils commonUtils = new CommonUtils();
//
//        String id = postCreateSubjectDTO.getId();
//        String name = postCreateSubjectDTO.getName();
//        String numberOfTheoreticalPeriods = postCreateSubjectDTO.getNumberOfTheoreticalPeriods();
//        String numberOfPracticePeriods = postCreateSubjectDTO.getNumberOfPracticePeriods();
//
//        if (Objects.isNull(id)) {
//            commonUtils.addError("id", "Mã môn học không được để trống");
//        }
//
//        if (Objects.isNull(name)) {
//            commonUtils.addError("name", "Tên môn học không được để trống");
//        }
//
//        if (Objects.isNull(numberOfTheoreticalPeriods)) {
//            commonUtils.addError("numberOfTheoreticalPeriods", "Số tiết lý thuyết không được để trống");
//        }
//
//        if (Objects.isNull(numberOfPracticePeriods)) {
//            commonUtils.addError("numberOfPracticePeriods", "Số tiết thực hành không được để " +
//                    "trống");
//        }
//
//        if (commonUtils.getArrayNode().size() > 0) {
//            return new BadResponse<Subject>(commonUtils.getArrayNode().toString()).response();
//        } else {
//            if (subjectService.isIdDuplicated(id, isEdit)) {
//                commonUtils.addError("id", "Mã môn học đã tồn tại");
//            }
//
//            if (subjectService.isNameDuplicated(id, name, isEdit)) {
//                commonUtils.addError("name", "Tên môn học đã tồn tại");
//            }
//
//            int numberOfTheoreticalPeriodsInt = 0, numberOfPracticePeriodsInt = 0;
//            try {
//                numberOfTheoreticalPeriodsInt = Integer.parseInt(numberOfTheoreticalPeriods);
//            } catch (final NumberFormatException e) {
//                commonUtils.addError("numberOfTheoreticalPeriods", "Số tiết lý thuyết không hợp " +
//                        "lệ");
//            }
//
//            try {
//                numberOfPracticePeriodsInt = Integer.parseInt(numberOfPracticePeriods);
//            } catch (final NumberFormatException e) {
//                commonUtils.addError("numberOfPracticePeriods", "Số tiết thực hành không hợp " +
//                        "lệ");
//            }
//
//            if (commonUtils.getArrayNode().size() > 0) {
//                return new BadResponse<Subject>(commonUtils.getArrayNode().toString()).response();
//            }
//
//            if ((numberOfPracticePeriodsInt + numberOfTheoreticalPeriodsInt) % 3 != 0) {
//                commonUtils.addError("numberOfPracticePeriods", "Số tiết lý thuyết + thực " +
//                        "hành phải là bội số của 3 "
//                );
//            }
//
//            if (commonUtils.getArrayNode().size() > 0) {
//                return new BadResponse<Subject>(commonUtils.getArrayNode().toString()).response();
//            }
//        }
//
//        if (isEdit) {
//            try {
//                Subject subject = subjectService.findById(id);
//                subject.setName(name);
//                subject.setNumberOfTheoreticalPeriods(Integer.parseInt(postCreateSubjectDTO.getNumberOfTheoreticalPeriods()));
//                subject.setNumberOfPracticePeriods(Integer.parseInt(postCreateSubjectDTO.getNumberOfPracticePeriods()));
//
//                savedSubject = subjectService.save(subject);
//            } catch (NotFoundException exception) {
//                return new BadResponse<Subject>(exception.getMessage()).response();
//            }
//        } else {
//            savedSubject = subjectService.save(Subject.build(postCreateSubjectDTO));
//        }
//
//        return new OkResponse<>(savedSubject).response();
//    }
//
//    @DeleteMapping("{id}/delete")
//    public ResponseEntity<StandardJSONResponse<String>> delete(@PathVariable("id") String id) {
//        try {
//            return new OkResponse<>(subjectService.deleteById(id)).response();
//        } catch (ConstrainstViolationException ex) {
//            return new BadResponse<String>(ex.getMessage()).response();
//        }
//    }
}
