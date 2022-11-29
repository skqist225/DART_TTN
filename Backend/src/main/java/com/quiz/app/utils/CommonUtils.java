package com.quiz.app.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.quiz.app.response.StandardJSONResponse;
import com.quiz.app.response.error.BadResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;


@Getter
@Setter
@AllArgsConstructor
@Controller
public class CommonUtils {
    private final ArrayNode arrayNode;

    private ObjectMapper objectMapper = new ObjectMapper();

    public CommonUtils() {
        this.arrayNode = objectMapper.createArrayNode();
    }

    public void addError(String fieldName, String fieldError) {
        ObjectNode node = objectMapper.createObjectNode();
        node.put(fieldName, fieldError);
        arrayNode.add(node);
    }
}
