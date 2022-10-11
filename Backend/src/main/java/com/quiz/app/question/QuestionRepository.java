package com.quiz.app.question;

import com.quiz.entity.Question;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionRepository extends CrudRepository<Question, Integer> {

    @Query(value = "SELECT * FROM questions where id = :id", nativeQuery = true)
    public Question getById(Integer id);

    public Question findByContent(String content);
}
