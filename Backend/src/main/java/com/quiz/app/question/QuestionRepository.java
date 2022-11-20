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

    @Query(value = "SELECT * FROM cauhoi where macauhoi = :id", nativeQuery = true)
    public Question getById(Integer id);

    @Query(value = "SELECT * FROM cauhoi where noidungcauhoi = :content", nativeQuery = true)
    public Question findByContent(String content);

    @Query
    public List<Question> findByChapterIn(List<Chapter> subject);

    @Query(value = "SELECT * FROM cauhoi as q WHERE q.machuong IN (:chapters) ORDER BY RAND" +
            "()" +
            "LIMIT :numberOfQuestions",
            nativeQuery = true)
    public List<Question> findBySubject(List<Integer> chapters, Integer numberOfQuestions);

    @Query(value = "SELECT * FROM cauhoi as q  WHERE q.machuong = :chapterId AND q.dokho = :level" +
            " " +
            "AND q.status = 1 " +
            "ORDER" +
            " BY RAND" +
            "()" +
            "LIMIT :numberOfQuestions",
            nativeQuery = true)
    public List<Question> findByChapterAndLevel(Integer chapterId,
                                                Integer level, int numberOfQuestions);

    @Query("SELECT count(*) FROM Question q WHERE q.chapter.id = :chapterId AND q.level = :level " +
            "AND q" +
            ".status = 1")
    public Integer queryAvailableQuestions(Integer chapterId,
                                           Level level);
}
