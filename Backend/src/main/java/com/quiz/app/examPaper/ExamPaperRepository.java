package com.quiz.app.examPaper;

import com.quiz.entity.Test;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ExamPaperRepository extends CrudRepository<Test, Integer> {
}
