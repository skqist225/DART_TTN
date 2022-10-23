package com.quiz.app.test;

import com.quiz.entity.Subject;
import com.quiz.entity.Test;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface TestRepository extends CrudRepository<Test, Integer> {

    public Test findByName(String name);
}
