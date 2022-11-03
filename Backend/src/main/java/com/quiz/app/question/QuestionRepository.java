package com.quiz.app.question;

import com.quiz.entity.Chapter;
import com.quiz.entity.Level;
import com.quiz.entity.Question;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends CrudRepository<Question, Integer> {

    @Query(value = "SELECT * FROM questions where id = :id", nativeQuery = true)
    public Question getById(Integer id);

    public Question findByContent(String content);


    @Query
    public List<Question> findByChapterIn(List<Chapter> subject);

    @Query(value = "SELECT * FROM questions as q WHERE q.subject_id = :subject ORDER BY RAND()" +
            "LIMIT :numberOfQuestions",
            nativeQuery = true)
    public List<Question> findBySubject(String subject, Integer numberOfQuestions);

    public List<Question> findByChapterAndLevel(Chapter chapter,
                                                Level level);
}
