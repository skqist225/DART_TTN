package com.quiz.app.takeExamDetail;

import com.quiz.entity.TakeExamDetail;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface TakeExamDetailRepository extends CrudRepository<TakeExamDetail, Integer> {


    @Modifying
    @Query(value = "INSERT INTO chitietthi(macauhoi, macathi, maltc, masv, lanthi) values" +
            "(:questionId, :examId, :creditClassId,  +:studentId, :tryTime)", nativeQuery = true)
    void insertIntoTakeExamDetail(Integer questionId, int tryTime, int examId, int creditClassId,
                                  String studentId);

    @Modifying
    @Query(value = "delete from chitietthi where masv= :studentId and maltc = :creditClassId and macathi =" +
            " :examId and lanthi = :tryTime", nativeQuery = true)
    void deleteTakeExamDetail(int examId, int creditClassId,
                              String studentId, int tryTime);

    @Modifying
    @Query(value = "update chitietthi set cautraloi = :userAnswer where masv = :studentId AND " +
            "macathi = :examId AND macauhoi = :questionId", nativeQuery = true)
    void updateAnswerForQuestionInStudentTest(String userAnswer, String studentId,
                                              Integer examId,
                                              Integer questionId
    );

    @Query(value = "select * from chitietthi where masv = :studentId AND macathi = :examId",
            nativeQuery = true)
    List<TakeExamDetail> findByStudentAndExam(String studentId, Integer examId);
}
