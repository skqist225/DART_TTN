package com.quiz.app.subject;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.quiz.app.exception.ConstrainstViolationException;
import com.quiz.app.exception.NotFoundException;
import com.quiz.app.response.StandardJSONResponse;
import com.quiz.app.response.error.BadResponse;
import com.quiz.app.response.success.OkResponse;
import com.quiz.app.subject.dto.PostCreateSubjectDTO;
import com.quiz.app.subject.dto.SubjectsDTO;
import com.quiz.entity.Subject;
import com.quiz.entity.User;
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
@RequestMapping("/api/subjects")
public class SubjectRestController {
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
    public ResponseEntity<StandardJSONResponse<SubjectsDTO>> fetchAllSubjects(
            @RequestParam("page") String page,
            @RequestParam(name = "query", required = false, defaultValue = "") String query,
            @RequestParam(name = "sortDir", required = false, defaultValue = "DESC") String sortDir,
            @RequestParam(name = "sortField", required = false, defaultValue = "createdDate") String sortField
    ) {
        Map<String, String> filters = new HashMap<>();
        filters.put("page",page);
        filters.put("query", query);
        filters.put("sortDir", sortDir);
        filters.put("sortField", sortField);

        SubjectsDTO subjectsDTO = new SubjectsDTO();

        Page<Subject> subjectsPage =  subjectService.findAllSubjects(filters);

        subjectsDTO.setSubjects(subjectsPage.getContent());
        subjectsDTO.setTotalElements(subjectsPage.getTotalElements());
        subjectsDTO.setTotalPages(subjectsPage.getTotalPages());

        return new OkResponse<>(subjectsDTO).response();
    }

    @PostMapping("save")
    public ResponseEntity<StandardJSONResponse<Subject>> saveSubject(
            @RequestBody PostCreateSubjectDTO postCreateSubjectDTO) {
        arrayNode = objectMapper.createArrayNode();
        Subject savedSubject = null;

        String id = postCreateSubjectDTO.getId();
        String name = postCreateSubjectDTO.getName();
        boolean isEdit = postCreateSubjectDTO.isEdit();

        if (Objects.isNull(id)) {
            addError("id", "Mã môn học không được để trống");
        }

        if (Objects.isNull(name)) {
            addError("name", "Tên môn học không được để trống");
        }

        if (arrayNode.size() > 0) {
            return new BadResponse<Subject>(arrayNode.toString()).response();
        } else {
            if (subjectService.isIdDuplicated(id, isEdit)) {
                addError("id","Mã môn học đã tồn tại" );
            }

            if (subjectService.isNameDuplicated(id, name, isEdit)) {
                addError("name","Tên môn học đã tồn tại" );
            }

            if (arrayNode.size() > 0) {
                return new BadResponse<Subject>(arrayNode.toString()).response();
            }
        }

        if (isEdit) {
            try {
                Subject subject = subjectService.findById(id);
                subject.setId(id);
                subject.setName(name);

                savedSubject = subjectService.save(subject);
            } catch (NotFoundException exception) {
                return new BadResponse<Subject>(exception.getMessage()).response();
            }
        } else {
            savedSubject = subjectService.save(Subject.build(postCreateSubjectDTO));
        }

        return new OkResponse<>(savedSubject).response();
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
