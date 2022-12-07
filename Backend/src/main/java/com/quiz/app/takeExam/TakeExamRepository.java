package com.quiz.app.takeExam;

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
    @Query(value = "UPDATE thi SET diem = :mark where masv = :studentId and macathi = :examId",
            nativeQuery = true)
    void updateTakeExamScore(String studentId, Integer examId, float mark);

    @Query(value = "SELECT * FROM thi where masv = :studentId and macathi = :examId",
            nativeQuery = true)
    TakeExam findByStudentAndExam(String studentId, Integer examId);
}
