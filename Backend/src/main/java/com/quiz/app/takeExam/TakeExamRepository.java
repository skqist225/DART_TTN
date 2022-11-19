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


    @Query(value = "SELECT * FROM thi where maltc = :creditClassId  AND masv = :studentId",
            nativeQuery = true)
    public List<TakeExam> findByRegister(Integer creditClassId, String studentId);

    @Modifying
    @Query(value = "INSERT INTO thi(lanthi, macathi, maltc, masv) values(:tryTime, :examId, :creditClassId, :studentId)",
            nativeQuery = true)
    public void insertIntoTakeExamTable(int tryTime, int examId, int creditClassId,
                                        String studentId);
}
