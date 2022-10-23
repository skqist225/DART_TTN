package com.quiz.app.question;

import com.quiz.entity.Level;
import com.quiz.entity.Question;
import com.quiz.entity.Subject;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends CrudRepository<Question, Integer> {

    @Query(value = "SELECT * FROM questions where id = :id", nativeQuery = true)
    public Question getById(Integer id);

    public Question findByContent(String content);

    public List<Question> findBySubject(Subject subject);

    public List<Question> findByChapterAndLevelAndSubject(int chapter,
                                                          Level level, Subject subject);
}
