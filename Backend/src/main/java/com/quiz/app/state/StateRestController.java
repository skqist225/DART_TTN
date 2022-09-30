package com.quiz.app.state;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.quiz.app.response.StandardJSONResponse;
import com.quiz.app.response.success.OkResponse;
import com.quiz.entity.State;

@RestController
@RequestMapping("/api/")
public class StateRestController {

    @Autowired
    private StateService stateService;

    @GetMapping("states/country/{countryId}")
    public ResponseEntity<StandardJSONResponse<List<State>>> fetchStatesByCountry(
            @PathVariable("countryId") Integer countryId) {
        return new OkResponse<List<State>>(stateService.fetchStatesByCountry(countryId)).response();
    }

    @GetMapping("states")
    public ResponseEntity<StandardJSONResponse<List<State>>> fetchStates() {
        return new OkResponse<List<State>>(stateService.listAll()).response();
    }
}
