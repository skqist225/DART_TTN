package com.quiz.app.answer;

import com.quiz.entity.Answer;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface AnswerRepository extends CrudRepository<Answer, Integer> {

    @Modifying
    @Query(value = "delete from luachon where macauhoi = :id", nativeQuery = true)
    void deleteByQuestionId(Integer id);
}
