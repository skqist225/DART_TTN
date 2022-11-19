package com.quiz.app.takeExamDetail;

import com.quiz.entity.Subject;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface TakeExamDetailRepository extends CrudRepository<Subject, String> {

    public Subject findByName(String name);
}
