package com.quiz.app.exam;

import com.quiz.entity.Exam;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ExamRepository extends CrudRepository<Exam, Integer> {

}
