package com.quiz.app.state;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.quiz.entity.Country;
import com.quiz.entity.State;

@Repository
public interface StateRepository extends CrudRepository<State, Integer> {
    public List<State> findAllByOrderByNameAsc();

    public List<State> findByCountryOrderByNameAsc(Country country);

    public State findByName(String stateName);

}
