package com.quiz.app.chapter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.quiz.app.chapter.dto.PostCreateChapterDTO;
import com.quiz.app.chapter.dto.ChaptersDTO;
import com.quiz.app.exception.ConstrainstViolationException;
import com.quiz.app.exception.NotFoundException;
import com.quiz.app.response.StandardJSONResponse;
import com.quiz.app.response.error.BadResponse;
import com.quiz.app.response.success.OkResponse;
import com.quiz.entity.Chapter;
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
@RequestMapping("/api/chapters")
public class ChapterRestController {
    @Autowired
    private ChapterService chapterService;

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
            @RequestParam(name = "sortField", required = false, defaultValue = "id") String sortField
    ) {
        Map<String, String> filters = new HashMap<>();
        filters.put("page",page);
        filters.put("query", query);
        filters.put("sortDir", sortDir);
        filters.put("sortField", sortField);

        ChaptersDTO chaptersDTO = new ChaptersDTO();

        if(page.equals("0")) {
            List<Chapter> chapters = chapterService.findAll();

            chaptersDTO.setChapters(chapters);
            chaptersDTO.setTotalElements(chapters.size());
            chaptersDTO.setTotalPages(0);

        } else {
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
        Chapter savedSubject = null;

        Integer id = postCreateChapterDTO.getId();
        String name = postCreateChapterDTO.getName();

        if (Objects.isNull(id)) {
            addError("id", "Mã môn học không được để trống");
        }

        if (Objects.isNull(name)) {
            addError("name", "Tên môn học không được để trống");
        }

        if (arrayNode.size() > 0) {
            return new BadResponse<Chapter>(arrayNode.toString()).response();
        } else {
            if (chapterService.isIdDuplicated(id, isEdit)) {
                addError("id","Mã môn học đã tồn tại" );
            }

            if (chapterService.isNameDuplicated(id, name, isEdit)) {
                addError("name","Tên môn học đã tồn tại" );
            }

            if (arrayNode.size() > 0) {
                return new BadResponse<Chapter>(arrayNode.toString()).response();
            }
        }

        if (isEdit) {
            try {
                Chapter subject = chapterService.findById(id);
                subject.setId(id);
                subject.setName(name);

                savedSubject = chapterService.save(subject);
            } catch (NotFoundException exception) {
                return new BadResponse<Chapter>(exception.getMessage()).response();
            }
        } else {
            savedSubject = chapterService.save(Chapter.build(postCreateChapterDTO));
        }

        return new OkResponse<>(savedSubject).response();
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
