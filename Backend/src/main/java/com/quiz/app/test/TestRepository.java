package com.quiz.app.test;

import com.quiz.entity.Chapter;
import com.quiz.entity.Subject;
import com.quiz.entity.Test;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface TestRepository extends CrudRepository<Test, Integer> {

    @Query(value = "SELECT * FROM dethi where tendethi = :name", nativeQuery = true)
    public Test findByName(String name);

    public List<Test> findBySubject(Subject subject);

}
