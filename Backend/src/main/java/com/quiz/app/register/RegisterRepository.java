package com.quiz.app.register;

import com.quiz.entity.Register;
import com.quiz.entity.RegisterId;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface RegisterRepository extends CrudRepository<Register, RegisterId> {
    @Query(value = "select * from dangky where maltc = :creditClassId", nativeQuery = true)
    List<Register> findByMyCreditClass(Integer creditClassId);

    @Modifying
    @Query(value = "UPDATE dangky SET diemgk = :mark  where masv = :studentId and maltc = " + ":creditClassId", nativeQuery = true)
    void updateMidTermScore(String studentId, Integer creditClassId, float mark);

    @Modifying
    @Query(value = "UPDATE dangky SET diemck = :mark where masv = :studentId and maltc = " + ":creditClassId", nativeQuery = true)
    void updateFinalTermScore(String studentId, Integer creditClassId, float mark);

    @Modifying
    @Query(value = "update dangky set huydangky" + " = 1 where maltc = :creditClassId AND masv = :studentId", nativeQuery = true)
    void cancelRegister(Integer creditClassId, String studentId);

    @Modifying
    @Query(value = "update dangky set huydangky" + " = 0 where maltc = :creditClassId AND masv = :studentId", nativeQuery = true)
    void openRegister(Integer creditClassId, String studentId);
}
