package com.quiz.app.city;

import java.util.List;

import com.quiz.app.response.StandardJSONResponse;
import com.quiz.app.response.success.OkResponse;
import com.quiz.entity.City;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class CityRestController {
    @Autowired
    private CityService cityService;

    @GetMapping("/cities/state/{stateId}")
    public ResponseEntity<StandardJSONResponse<List<City>>> fetchCitiesByState(@PathVariable Integer stateId) {
        return new OkResponse<List<City>>(cityService.fetchCitiesByState(stateId)).response();
    }
}
