package com.quiz.app.city;

import java.util.List;

import com.quiz.entity.City;
import com.quiz.entity.State;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CityRepository extends CrudRepository<City, Integer> {
    public City findByName(String cityName);

    public List<City> findAllByOrderByNameAsc();

    public List<City> findByStateOrderByNameAsc(State state);
}
