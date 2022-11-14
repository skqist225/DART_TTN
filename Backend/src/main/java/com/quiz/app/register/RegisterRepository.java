package com.quiz.app.register;

import com.quiz.entity.Register;
import com.quiz.entity.RegisterId;
import com.quiz.entity.Subject;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface RegisterRepository extends CrudRepository<Register, RegisterId> {

}
