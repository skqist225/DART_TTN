package com.quiz.app.answer;

import com.quiz.entity.Answer;
import com.quiz.entity.Subject;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface AnswerRepository extends CrudRepository<Answer, Integer> {
}
