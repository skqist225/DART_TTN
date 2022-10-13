package com.quiz.app.examPaper;

import com.quiz.entity.ExamPaper;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ExamPaperRepository extends CrudRepository<ExamPaper, Integer> {
}
