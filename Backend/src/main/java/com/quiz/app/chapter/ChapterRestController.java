package com.quiz.app.chapter;

import com.quiz.app.chapter.dto.ChapterDTO;
import com.quiz.app.chapter.dto.ChaptersDTO;
import com.quiz.app.chapter.dto.PostCreateChapterDTO;
import com.quiz.app.common.CommonUtils;
import com.quiz.app.exception.ConstrainstViolationException;
import com.quiz.app.exception.NotFoundException;
import com.quiz.app.response.StandardJSONResponse;
import com.quiz.app.response.error.BadResponse;
import com.quiz.app.response.success.OkResponse;
import com.quiz.app.subject.SubjectService;
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
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/chapters")
public class ChapterRestController {
    @Autowired
    private ChapterService chapterService;

    @Autowired
    private SubjectService subjectService;



    @GetMapping("")
    public ResponseEntity<StandardJSONResponse<ChaptersDTO>> fetchAllSubjects(
            @RequestParam("page") String page,
            @RequestParam(name = "query", required = false, defaultValue = "") String query,
            @RequestParam(name = "sortDir", required = false, defaultValue = "desc") String sortDir,
            @RequestParam(name = "sortField", required = false, defaultValue = "id") String sortField,
            @RequestParam(name = "subject", required = false, defaultValue = "") String subjectId
    ) {
        ChaptersDTO chaptersDTO = new ChaptersDTO();

        if(page.equals("0")) {
            List<Chapter> chapters = null;
            if (!StringUtils.isEmpty(subjectId)) {
                try {
                    Subject subject = subjectService.findById(subjectId);
                    chapters = chapterService.findBySubject(subject);
                } catch (NotFoundException e) {
                    chapters = new ArrayList<>();
                }
            } else {
                chapters = chapterService.findAll();
            }

            chaptersDTO.setChapters(chapters.stream().sorted(Comparator.comparing(Chapter::getName))
                    .collect(Collectors.toList()));
            chaptersDTO.setTotalElements(chapters.size());
            chaptersDTO.setTotalPages(0);

        } else {
            Map<String, String> filters = new HashMap<>();
            filters.put("page", page);
            filters.put("query", query);
            filters.put("sortDir", sortDir);
            filters.put("sortField", sortField);
            filters.put("subjectId", subjectId);

            Page<Chapter> chaptersPage = chapterService.findAllSubjects(filters);

            chaptersDTO.setChapters(chaptersPage.getContent());
            chaptersDTO.setTotalElements(chaptersPage.getTotalElements());
            chaptersDTO.setTotalPages(chaptersPage.getTotalPages());
        }

        return new OkResponse<>(chaptersDTO).response();
    }

    @PostMapping("save")
    public ResponseEntity<StandardJSONResponse<String>> saveSubject(
            @RequestBody PostCreateChapterDTO postCreateChapterDTO,
            @RequestParam(name = "isEdit", required = false, defaultValue = "false") boolean isEdit
    ) throws NotFoundException, ConstrainstViolationException {
        CommonUtils commonUtils = new CommonUtils();
        Subject subject = null;

        String subjectId = postCreateChapterDTO.getSubjectId();
        List<ChapterDTO> chapterDTOS = postCreateChapterDTO.getChapters();

        if (chapterDTOS.size() > 0) {
            for (ChapterDTO chapter : chapterDTOS) {
                if (Objects.isNull(chapter.getName()) || StringUtils.isEmpty(chapter.getName())) {
                    commonUtils.addError("chapters", "Không được để trống tên chương");
                    break;
                }
            }
        }

        if (Objects.isNull(subjectId)) {
            commonUtils.addError("subjectId", "Môn học không được để trống");
        }

        if (commonUtils.getArrayNode().size() > 0) {
            return new BadResponse<String>(commonUtils.getArrayNode().toString()).response();
        } else {
            if (chapterDTOS.size() > 0) {
                int i = 1;
                for (ChapterDTO chapter : chapterDTOS) {
                    if (chapterService.isNameDuplicated(chapter.getId(), chapter.getName(), isEdit)) {
                        commonUtils.addError("chapters." + (i - 1) + ".name", String.format("Tên " +
                                "chương" +
                                " %d đã tồn tại", i));
                    }
                    i++;
                }
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
            List<Chapter> addedChapters = new ArrayList<>();
            List<Chapter> removedChapters = new ArrayList<>();
            for (ChapterDTO chapterDTO : chapterDTOS) {
                // Add new chapter
                if (Objects.isNull(chapterDTO.getId())) {
                    addedChapters.add(Chapter.build(chapterDTO.getName(), subject));
                } else {
                    chapterService.updateById(chapterDTO.getId(), chapterDTO.getName());
                }
            }

            for (Chapter chapter : subject.getChapters()) {
                boolean shouldDelete = true;

                for (ChapterDTO a : chapterDTOS) {
                    if (Objects.nonNull(a.getId())) {
                        if (a.getId().equals(chapter.getId())) {
                            shouldDelete = false;
                            break;
                        }
                    }
                }
                // Remove none mentioned chapter
                if (shouldDelete) {
                    removedChapters.add(chapter);
                }
            }

            for (Chapter chapter : removedChapters) {
                chapterService.deleteById(chapter.getId());
            }

            chapterService.saveAll(addedChapters);
        } else {
            List<Chapter> chapters = new ArrayList<>();
            for (ChapterDTO chapterDTO : chapterDTOS) {
                chapters.add(Chapter.build(chapterDTO.getName(), subject));
            }
            chapterService.saveAll(chapters);
        }

        return new OkResponse<>("Thêm chương thành công").response();
    }

    @DeleteMapping("{id}/delete")
    public ResponseEntity<StandardJSONResponse<String>> delete(@PathVariable("id") Integer id) {
        try {
            return new OkResponse<>(chapterService.deleteById(id)).response();
        } catch (ConstrainstViolationException ex) {
            return new BadResponse<String>(ex.getMessage()).response();
        }
    }
}
