package com.quiz.app.test;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.quiz.app.exception.ConstrainstViolationException;
import com.quiz.app.exception.NotFoundException;
import com.quiz.app.response.StandardJSONResponse;
import com.quiz.app.response.error.BadResponse;
import com.quiz.app.response.success.OkResponse;
import com.quiz.app.test.dto.PostCreateTestDTO;
import com.quiz.app.test.dto.TestsDTO;
import com.quiz.entity.Test;
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
@RequestMapping("/api/tests")
public class TestRestController {
    @Autowired
    private TestService testService;

    @Autowired
    private ObjectMapper objectMapper;

    private ArrayNode arrayNode;

    public void addError(String fieldName, String fieldError) {
        ObjectNode node = objectMapper.createObjectNode();
        node.put(fieldName, fieldError);
        arrayNode.add(node);
    }

    @GetMapping("")
    public ResponseEntity<StandardJSONResponse<TestsDTO>> fetchAllSubjects(
            @RequestParam("page") String page,
            @RequestParam(name = "query", required = false, defaultValue = "") String query,
            @RequestParam(name = "sortDir", required = false, defaultValue = "desc") String sortDir,
            @RequestParam(name = "sortField", required = false, defaultValue = "id") String sortField
    ) {
        Map<String, String> filters = new HashMap<>();
        filters.put("page", page);
        filters.put("query", query);
        filters.put("sortDir", sortDir);
        filters.put("sortField", sortField);

        TestsDTO testsDTO = new TestsDTO();

        if (page.equals("0")) {
            List<Test> tests = testService.findAll();

            testsDTO.setTests(tests);
            testsDTO.setTotalElements(tests.size());
            testsDTO.setTotalPages(0);

        } else {
            Page<Test> testPage = testService.findAllSubjects(filters);

            testsDTO.setTests(testPage.getContent());
            testsDTO.setTotalElements(testPage.getTotalElements());
            testsDTO.setTotalPages(testPage.getTotalPages());
        }

        return new OkResponse<>(testsDTO).response();
    }

    @PostMapping("save")
    public ResponseEntity<StandardJSONResponse<Test>> saveSubject(
            @RequestBody PostCreateTestDTO postCreateTestDTO,
            @RequestParam(name = "isEdit", required = false, defaultValue = "false") boolean isEdit
    ) {
        arrayNode = objectMapper.createArrayNode();
        Test savedSubject = null;

        Integer id = postCreateTestDTO.getId();
        String name = postCreateTestDTO.getName();

        if (Objects.isNull(id)) {
            addError("id", "Mã môn học không được để trống");
        }

        if (Objects.isNull(name)) {
            addError("name", "Tên môn học không được để trống");
        }

        if (arrayNode.size() > 0) {
            return new BadResponse<Test>(arrayNode.toString()).response();
        } else {
            if (testService.isNameDuplicated(id, name, isEdit)) {
                addError("name", "Tên môn học đã tồn tại");
            }

            if (arrayNode.size() > 0) {
                return new BadResponse<Test>(arrayNode.toString()).response();
            }
        }

        if (isEdit) {
            try {
                Test test = testService.findById(id);
                test.setName(name);

                savedSubject = testService.save(test);
            } catch (NotFoundException exception) {
                return new BadResponse<Test>(exception.getMessage()).response();
            }
        } else {
            savedSubject = testService.save(Test.build(postCreateTestDTO));
        }

        return new OkResponse<>(savedSubject).response();
    }

    @DeleteMapping("{id}/delete")
    public ResponseEntity<StandardJSONResponse<String>> delete(@PathVariable("id") Integer id) {
        try {
            return new OkResponse<>(testService.deleteById(id)).response();
        } catch (ConstrainstViolationException ex) {
            return new BadResponse<String>(ex.getMessage()).response();
        }
    }
}