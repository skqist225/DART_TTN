package com.quiz.app.chapter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.quiz.app.chapter.dto.ChaptersDTO;
import com.quiz.app.chapter.dto.PostCreateChapterDTO;
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

    @Autowired
    private ObjectMapper objectMapper;

    private ArrayNode arrayNode;

    public void addError(String fieldName, String fieldError) {
        ObjectNode node = objectMapper.createObjectNode();
        node.put(fieldName, fieldError);
        arrayNode.add(node);
    }

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

            Page<Chapter> chaptersPage = chapterService.findAllSubjects(filters);

            chaptersDTO.setChapters(chaptersPage.getContent());
            chaptersDTO.setTotalElements(chaptersPage.getTotalElements());
            chaptersDTO.setTotalPages(chaptersPage.getTotalPages());
        }

        return new OkResponse<>(chaptersDTO).response();
    }

    @PostMapping("save")
    public ResponseEntity<StandardJSONResponse<Chapter>> saveSubject(
            @RequestBody PostCreateChapterDTO postCreateChapterDTO,
            @RequestParam(name = "isEdit", required = false, defaultValue = "false") boolean isEdit
    ) {
        arrayNode = objectMapper.createArrayNode();
        Chapter savedChapter = null;
        Subject subject = null;

        Integer id = postCreateChapterDTO.getId();
        String name = postCreateChapterDTO.getName();
        String subjectId = postCreateChapterDTO.getSubjectId();

        if (Objects.isNull(name)) {
            addError("name", "Tên chương không được để trống");
        }

        if (Objects.isNull(subjectId)) {
            addError("subjectId", "Môn học không được để trống");
        }

        if (arrayNode.size() > 0) {
            return new BadResponse<Chapter>(arrayNode.toString()).response();
        } else {
            if (chapterService.isNameDuplicated(id, name, isEdit)) {
                addError("name", "Tên chương đã tồn tại");
            }

            try {
                subject = subjectService.findById(subjectId);
            } catch (NotFoundException exception) {
                return new BadResponse<Chapter>(exception.getMessage()).response();
            }

            if (arrayNode.size() > 0) {
                return new BadResponse<Chapter>(arrayNode.toString()).response();
            }
        }

        if (isEdit) {
            try {
                Chapter chapter = chapterService.findById(id);
                chapter.setName(name);
                chapter.setSubject(subject);

                savedChapter = chapterService.save(chapter);
            } catch (NotFoundException exception) {
                return new BadResponse<Chapter>(exception.getMessage()).response();
            }
        } else {
            savedChapter = chapterService.save(Chapter.build(name, subject));
        }

        return new OkResponse<>(savedChapter).response();
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
