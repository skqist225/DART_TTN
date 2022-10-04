package com.quiz.app.question;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api")
public class QuestionRestController {
    @Autowired
    private QuestionService questionService;

//    @GetMapping("/cities/state/{stateId}")
//    public ResponseEntity<StandardJSONResponse<List<City>>> fetchCitiesByState(@PathVariable Integer stateId) {
//        return new OkResponse<List<City>>(cityService.fetchCitiesByState(stateId)).response();
//    }
}
