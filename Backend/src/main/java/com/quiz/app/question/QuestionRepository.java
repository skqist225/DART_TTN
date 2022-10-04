package com.quiz.app.question;

import com.quiz.entity.Question;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface QuestionRepository extends CrudRepository<Question, Integer> {
}
