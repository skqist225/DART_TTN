package com.quiz.app.subject;

import com.quiz.app.chapter.ChapterService;
import com.quiz.app.chapter.dto.ChapterDTO;
import com.quiz.app.common.CommonUtils;
import com.quiz.app.exception.ConstrainstViolationException;
import com.quiz.app.exception.NotFoundException;
import com.quiz.app.response.StandardJSONResponse;
import com.quiz.app.response.error.BadResponse;
import com.quiz.app.response.success.OkResponse;
import com.quiz.app.subject.dto.PostCreateSubjectDTO;
import com.quiz.app.subject.dto.SubjectDTO;
import com.quiz.app.subject.dto.SubjectsDTO;
import com.quiz.entity.Chapter;
import com.quiz.entity.Subject;
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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/subjects")
public class SubjectRestController {
    @Autowired
    private SubjectService subjectService;

    @Autowired
    private ChapterService chapterService;

    @GetMapping("")
    public ResponseEntity<StandardJSONResponse<SubjectsDTO>> fetchAllSubjects(
            @RequestParam("page") String page,
            @RequestParam(name = "query", required = false, defaultValue = "") String query,
            @RequestParam(name = "sortDir", required = false, defaultValue = "desc") String sortDir,
            @RequestParam(name = "sortField", required = false, defaultValue = "id") String sortField,
            @RequestParam(name = "haveChapter", required = false, defaultValue = "false") Boolean haveChapter
    ) {
        SubjectsDTO subjectsDTO = new SubjectsDTO();

        if(page.equals("0")) {
            List<Subject> subjects = null;
            if (haveChapter) {
                subjects = subjectService.findByHaveChapter();
            } else {
                subjects = subjectService.findAll();
            }

            subjectsDTO.setSubjects(subjects);
            subjectsDTO.setTotalElements(subjects.size());
            subjectsDTO.setTotalPages(0);

        } else {
            Map<String, String> filters = new HashMap<>();
            filters.put("page", page);
            filters.put("query", query);
            filters.put("sortDir", sortDir);
            filters.put("sortField", sortField);

            Page<Subject> subjectsPage = subjectService.findAllSubjects(filters);

            subjectsDTO.setSubjects(subjectsPage.getContent());
            subjectsDTO.setTotalElements(subjectsPage.getTotalElements());
            subjectsDTO.setTotalPages(subjectsPage.getTotalPages());
        }

        return new OkResponse<>(subjectsDTO).response();
    }

    @GetMapping("brief")
    public ResponseEntity<StandardJSONResponse<List<SubjectDTO>>> fetchAllSubjects() {
//        return new OkResponse<>(subjectService.findAllSubjects()).response();
        return null;
    }

    @GetMapping("{subjectId}")
    public ResponseEntity<StandardJSONResponse<SubjectDTO>> fetchSubject(@PathVariable(name =
            "subjectId") String subjectId) {
        try {
            return new OkResponse<>(SubjectDTO.build(subjectService.findById(subjectId))).response();
        } catch (NotFoundException e) {
            return new BadResponse<SubjectDTO>(e.getMessage()).response();
        }
    }

    public void catchSubjectInputException(CommonUtils commonUtils, String id, String name,
                                           Integer numberOfTheoreticalPeriods,
                                           Integer numberOfPracticePeriods, boolean isEdit) {
        if (Objects.isNull(id) || StringUtils.isEmpty(name)) {
            commonUtils.addError("id", "Mã môn học không được để trống");
        }

        if (Objects.isNull(name) || StringUtils.isEmpty(name)) {
            commonUtils.addError("name", "Tên môn học không được để trống");
        }

        if (Objects.isNull(numberOfTheoreticalPeriods)) {
            commonUtils.addError("numberOfTheoreticalPeriods", "Số tiết lý thuyết không được để trống");
        }

        if (Objects.isNull(numberOfPracticePeriods)) {
            commonUtils.addError("numberOfPracticePeriods", "Số tiết thực hành không được để " +
                    "trống");
        }
    }

    @PostMapping("save")
    public ResponseEntity<StandardJSONResponse<String>> saveSubject(@RequestBody PostCreateSubjectDTO postCreateSubjectDTO, @RequestParam(name = "isEdit", required = false, defaultValue = "false") boolean isEdit) {
        CommonUtils commonUtils = new CommonUtils();

        String id = postCreateSubjectDTO.getId();
        String name = postCreateSubjectDTO.getName();
        Integer numberOfTheoreticalPeriods = postCreateSubjectDTO.getNumberOfTheoreticalPeriods();
        Integer numberOfPracticePeriods = postCreateSubjectDTO.getNumberOfPracticePeriods();
        List<ChapterDTO> chapterDTOS = postCreateSubjectDTO.getChapters();

        catchSubjectInputException(commonUtils, id, name, numberOfTheoreticalPeriods,
                numberOfPracticePeriods, isEdit);

        if (commonUtils.getArrayNode().size() > 0) {
            return new BadResponse<String>(commonUtils.getArrayNode().toString()).response();
        } else {
            if (subjectService.isIdDuplicated(id, isEdit)) {
                commonUtils.addError("id", "Mã môn học đã tồn tại");
            }

            if (subjectService.isNameDuplicated(id, name, isEdit)) {
                commonUtils.addError("name", "Tên môn học đã tồn tại");
            }

            if ((numberOfTheoreticalPeriods + numberOfPracticePeriods) % 3 != 0) {
                commonUtils.addError("numberOfPracticePeriods", "Số tiết lý thuyết + thực " +
                        "hành phải là bội số của 3 "
                );
            }

            if (commonUtils.getArrayNode().size() > 0) {
                return new BadResponse<String>(commonUtils.getArrayNode().toString()).response();
            }
        }

        int i = 0;
        if (chapterDTOS.size() > 0) {
            for (ChapterDTO chapterDTO : chapterDTOS) {
                if (chapterService.isNameDuplicated(chapterDTO.getId(), chapterDTO.getName(), isEdit)) {
                    commonUtils.addError(String.format("chapters.%d.name", i), "Tên chương đã" +
                            " tồn" +
                            " " +
                            "tại");
                }
                i++;
            }
        }

        if (commonUtils.getArrayNode().size() > 0) {
            return new BadResponse<String>(commonUtils.getArrayNode().toString()).response();
        }

        if (isEdit) {
            try {

                Subject subject = subjectService.findById(id);
                subject.setName(name);
                subject.setNumberOfTheoreticalPeriods(numberOfTheoreticalPeriods);
                subject.setNumberOfPracticePeriods(numberOfPracticePeriods);

                System.out.println(Objects.isNull(subject.getChapters()));
                if (Objects.isNull(subject.getChapters())) {
                    subject.setChapters(new ArrayList<>());
                }
                System.out.println(subject.getChapters());
                List<Chapter> tempChapters = subject.getChapters();

                if (chapterDTOS.size() == 0) {
                    subject.removeAll();
                } else {
                    for (ChapterDTO chapterDTO : chapterDTOS) {
                        // Add new chapter
                        if (Objects.isNull(chapterDTO.getId())) {
                            subject.addChapter(Chapter.build(chapterDTO.getChapterNumber(),
                                    chapterDTO.getName(),
                                    subject));
                        } else {
                            for (Chapter chapter : tempChapters) {
                                // Edit existed chapter
                                if (chapterDTO.getId().equals(chapter.getId())) {
                                    chapter.setChapterNumber(chapterDTO.getChapterNumber());
                                    chapter.setName(chapterDTO.getName());
                                    chapterService.save(chapter);
                                    break;
                                }
                            }
                        }
                    }
                    System.out.println("--------------------------------------");
                    List<Chapter> removedChapters = new ArrayList<>();
                    for (Chapter chapter : tempChapters) {
                        boolean shouldDelete = true;
                        for (ChapterDTO chapterDTO : chapterDTOS) {
                            if (Objects.nonNull(chapterDTO.getId())) {
                                if (chapterDTO.getId().equals(chapter.getId())) {
                                    shouldDelete = false;
                                    break;
                                }
                            } else {
                                shouldDelete = false;
                            }
                        }
                        // Remove none mentioned chapter
                        if (shouldDelete) {
                            removedChapters.add(chapter);
                        }
                    }

                    for (Chapter chapter : removedChapters) {
                        subject.removeChapter(chapter);
                    }
                }

                subjectService.save(subject);
            } catch (NotFoundException exception) {
                return new BadResponse<String>(exception.getMessage()).response();
            }
        } else {
            Subject subject = Subject.build(postCreateSubjectDTO);

            subject.setChapters(chapterDTOS.stream().map(chapter -> Chapter.build(chapter.getChapterNumber(), chapter.getName(),
                    subject)).collect(Collectors.toList()));
            subjectService.save(subject);
        }

        return new OkResponse<>("Thêm môn học thành công").response();
    }

    @DeleteMapping("{id}/delete")
    public ResponseEntity<StandardJSONResponse<String>> delete(@PathVariable("id") String id) {
        try {
            return new OkResponse<>(subjectService.deleteById(id)).response();
        } catch (ConstrainstViolationException ex) {
            return new BadResponse<String>(ex.getMessage()).response();
        }
    }
}
