package com.quiz.app.question;

import com.quiz.entity.Chapter;
import com.quiz.entity.Level;
import com.quiz.entity.Question;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends CrudRepository<Question, Integer> {

    @Query(value = "SELECT * FROM cauhoi where macauhoi = :id", nativeQuery = true)
    Question getById(Integer id);

    @Query(value = "SELECT * FROM cauhoi where noidungcauhoi = :content", nativeQuery = true)
    Question findByContent(String content);

    @Modifying
    @Query(value = "delete from cauhoi where macauhoi = :id", nativeQuery = true)
    void deleteQuestionById(Integer id);

    @Query
    List<Question> findByChapterIn(List<Chapter> subject);

    @Query(value = "SELECT * FROM cauhoi as q WHERE q.machuong IN (:chapters) ORDER BY RAND" +
            "()" +
            "LIMIT :numberOfQuestions",
            nativeQuery = true)
    List<Question> findBySubject(List<Integer> chapters, Integer numberOfQuestions);

    @Query(value = "SELECT * FROM cauhoi as q  WHERE q.machuong = :chapterId AND q.dokho = :level" +
            " " +
            "AND q.consudung = 1 " +
            "ORDER" +
            " BY RAND" +
            "()" +
            "LIMIT :numberOfQuestions",
            nativeQuery = true)
    List<Question> findByChapterAndLevel(Integer chapterId,
                                         Integer level, int numberOfQuestions);

    @Query("SELECT count(*) FROM Question q WHERE q.chapter.id = :chapterId AND q.level = :level " +
            "AND q" +
            ".status = 1")
    Integer queryAvailableQuestions(Integer chapterId,
                                    Level level);

    @Query("SELECT count(*) FROM Question")
    int countTotalQuestions();

    @Query(value = "SELECT ch.* FROM chitietthi ctt left join cauhoi ch on ch.macauhoi = ctt" +
            ".macauhoi where ctt.masv = :studentId AND ctt.macathi = :examId order by ch.macauhoi" +
            " " +
            "asc",
            nativeQuery = true)
    List<Question> findByStudentAndExam(String studentId,
                                        Integer examId);

    @Query(value = "SELECT * FROM quiz.dethi_cauhoi where madethi = :testId and macauhoi = :questionId",
            nativeQuery = true)
    Question getQuestionFromTest(Integer testId, Integer questionId);
}
