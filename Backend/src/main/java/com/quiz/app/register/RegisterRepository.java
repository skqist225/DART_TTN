package com.quiz.app.register;

import com.quiz.entity.CreditClass;
import com.quiz.entity.Register;
import com.quiz.entity.RegisterId;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface RegisterRepository extends CrudRepository<Register, RegisterId> {
    @Query(value = "select * from dangky where maltc = :creditClassId", nativeQuery = true)
    List<Register> findByMyCreditClass(Integer creditClassId);
}
