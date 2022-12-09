package com.quiz.app.takeExam;

import com.quiz.app.takeExam.dto.StudentRanking;
import com.quiz.entity.TakeExam;
import com.quiz.entity.TakeExamId;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface TakeExamRepository extends CrudRepository<TakeExam, TakeExamId> {


    @Query(value = "SELECT t.* FROM thi t left join cathi ct on ct.macathi = t.macathi where " +
            "maltc = :creditClassId AND masv = :studentId AND ct.dahuy = 0",
            nativeQuery = true)
    List<TakeExam> findByRegister(Integer creditClassId, String studentId);

    @Modifying
    @Query(value = "INSERT INTO thi(lanthi, macathi, maltc, masv, madethi) values(:tryTime, " +
            ":examId, " +
            ":creditClassId, :studentId, :testId)",
            nativeQuery = true)
    void insertIntoTakeExamTable(int tryTime, int examId, int creditClassId,
                                 String studentId, Integer testId);

    @Modifying
    @Query(value = "UPDATE thi SET diem = :mark where masv = :studentId and " +
            "macathi" +
            " " +
            "= :examId",
            nativeQuery = true)
    void updateTakeExamScore(String studentId, Integer examId, float mark);

    @Query(value = "SELECT * FROM thi where masv = :studentId and macathi = :examId",
            nativeQuery = true)
    TakeExam findByStudentAndExam(String studentId, Integer examId);

    @Modifying
    @Query(value = "UPDATE thi SET dathi = true where masv = :studentId and " +
            "macathi" +
            " " +
            "= :examId",
            nativeQuery = true)
    void updateTakeExamTested(String studentId, Integer examId
    );

    @Query(value = "select t.macathi from thi t where masv = :studentId and dathi = 1", nativeQuery = true)
    List<Integer> testedExam(String studentId);

    @Query(value = "select diem from thi where masv = :studentId and macathi = :examId",
            nativeQuery = true)
    float getStudentScoreByExamAndId(String studentId, Integer examId);


    @Query(value = "select temp2.position from (select @rownum \\:= @rownum + 1 AS position, temp" +
            ".studentId from (SELECT  diem AS score, t.masv AS studentId FROM thi t JOIN cathi ct" +
            " ON ct.macathi = t.macathi WHERE maltc = :creditClassId AND ct.loaikythi = :examType ORDER " +
            "BY t" +
            ".diem DESC) as temp JOIN (SELECT @rownum \\:= 0) r\n" +
            ") as temp2 where temp2.studentId = :studentId", nativeQuery = true)
    int getStudentRankingPosition(String studentId, Integer creditClassId,
                                                         String examType);
}
