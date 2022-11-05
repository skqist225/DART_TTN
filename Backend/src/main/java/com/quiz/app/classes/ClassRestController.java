package com.quiz.app.classes;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.quiz.app.classes.dto.ClassesDTO;
import com.quiz.app.classes.dto.PostCreateClassDTO;
import com.quiz.app.exception.ConstrainstViolationException;
import com.quiz.app.exception.NotFoundException;
import com.quiz.app.response.StandardJSONResponse;
import com.quiz.app.response.error.BadResponse;
import com.quiz.app.response.success.OkResponse;
import com.quiz.entity.Class;
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
public class ClassRestController {
    @Autowired
    private ClassService classService;

    @Autowired
    private ObjectMapper objectMapper;

    private ArrayNode arrayNode;

    public void addError(String fieldName, String fieldError) {
        ObjectNode node = objectMapper.createObjectNode();
        node.put(fieldName, fieldError);
        arrayNode.add(node);
    }

    @GetMapping("")
    public ResponseEntity<StandardJSONResponse<ClassesDTO>> fetchAllSubjects(
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

        ClassesDTO classesDTO = new ClassesDTO();

        if(page.equals("0")) {
            List<Class> classes = classService.findAll();

            classesDTO.setClasses(classes);
            classesDTO.setTotalElements(classes.size());
            classesDTO.setTotalPages(0);

        } else {
            Page<Class> subjectsPage =  classService.findAllSubjects(filters);

            classesDTO.setClasses(subjectsPage.getContent());
            classesDTO.setTotalElements(subjectsPage.getTotalElements());
            classesDTO.setTotalPages(subjectsPage.getTotalPages());
        }
        
        return new OkResponse<>(classesDTO).response();
    }

    @PostMapping("save")
    public ResponseEntity<StandardJSONResponse<Class>> saveSubject(
            @RequestBody PostCreateClassDTO postCreateClassDTO,
            @RequestParam(name = "isEdit", required = false, defaultValue = "false") boolean isEdit
    ) {
        arrayNode = objectMapper.createArrayNode();
        Class savedSubject = null;

        String id = postCreateClassDTO.getId();
        String name = postCreateClassDTO.getName();
        String facultyId = postCreateClassDTO.getFacultyId();

        if (Objects.isNull(id)) {
            addError("id", "Mã lớp không được để trống");
        }

        if (Objects.isNull(name)) {
            addError("name", "Tên lớp không được để trống");
        }

        if (Objects.isNull(facultyId)) {
            addError("facultyId", "Khoa không được để trống");
        }

        if (arrayNode.size() > 0) {
            return new BadResponse<Class>(arrayNode.toString()).response();
        } else {
            if (classService.isIdDuplicated(id, isEdit)) {
                addError("id", "Mã lớp đã tồn tại");
            }

            if (classService.isNameDuplicated(id, name, isEdit)) {
                addError("name", "Tên lớp đã tồn tại");
            }

            if (arrayNode.size() > 0) {
                return new BadResponse<Class>(arrayNode.toString()).response();
            }
        }

        if (isEdit) {
            try {
                Class cls = classService.findById(id);
                cls.setId(id);
                cls.setName(name);

                savedSubject = classService.save(cls);
            } catch (NotFoundException exception) {
                return new BadResponse<Class>(exception.getMessage()).response();
            }
        } else {
            savedSubject = classService.save(Class.build(postCreateClassDTO, null));
        }

        return new OkResponse<>(savedSubject).response();
    }

    @DeleteMapping("{id}/delete")
    public ResponseEntity<StandardJSONResponse<String>> delete(@PathVariable("id") String id) {
        try {
            return new OkResponse<>(classService.deleteById(id)).response();
        } catch (ConstrainstViolationException ex) {
            return new BadResponse<String>(ex.getMessage()).response();
        }
    }
}
