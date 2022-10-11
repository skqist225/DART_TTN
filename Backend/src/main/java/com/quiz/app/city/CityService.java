package com.quiz.app.city;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import com.quiz.entity.City;
import com.quiz.entity.State;

@Service
public class CityService {
    @Autowired
    CityRepository cityRepository;

    public City addCity(String cityName, State state) {
        City c = new City();
        c.setName(cityName);
        c.setState(state);
        City savedState = cityRepository.save(c);

        return savedState;
    }

    public List<City> fetchCitiesByState(Integer stateId) {
        State state = new State(stateId);
        return cityRepository.findByStateOrderByNameAsc(state);
    }
}
