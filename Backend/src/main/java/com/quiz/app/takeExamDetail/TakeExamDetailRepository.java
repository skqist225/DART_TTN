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
    public void insertIntoTakeExamDetail(Integer questionId, int tryTime, int examId, int creditClassId,
                                         String studentId);


    @Modifying
    @Query(value = "update chitietthi set cautraloi = :userAnswer where masv = :studentId AND " +
            "macathi = :examId AND macauhoi = :questionId", nativeQuery = true)
    public void updateAnswerForQuestionInStudentTest(String studentId, Integer examId,
                                                     Integer questionId,
                                                     String userAnswer);

    @Query(value = "select * from chitietthi where masv = :studentId AND macathi = :examId",
            nativeQuery = true)
    public List<TakeExamDetail> findByStudentAndExam(String studentId, Integer examId);
}
