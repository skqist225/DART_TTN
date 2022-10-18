package com.quiz.app.subject;

import com.quiz.entity.Question;
import com.quiz.entity.Subject;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface SubjectRepository extends CrudRepository<Subject, String> {

    public Subject findByName(String name);
}
