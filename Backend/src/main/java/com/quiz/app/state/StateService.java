package com.quiz.app.state;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.quiz.entity.Country;
import com.quiz.entity.State;

import java.util.List;

@Service
public class StateService {
    @Autowired
    StateRepository stateRepository;

    public State getStateByName(String stateName) {
        return stateRepository.findByName(stateName);
    }

    public State addState(String stateName, String stateCode, Country country) {
        State s = new State(stateName, stateCode, country);
        return stateRepository.save(s);
    }

    public State save(State state) {
        return stateRepository.save(state);
    }

    public List<State> listAll() {
        return (List<State>) stateRepository.findAll();
    }

    public State getStateById(Integer stateId) {
        return stateRepository.findById(stateId).get();
    }

    public List<State> fetchStatesByCountry(Integer countryId) {
        Country country = new Country(countryId);

        return stateRepository.findByCountryOrderByNameAsc(country);
    }
}
