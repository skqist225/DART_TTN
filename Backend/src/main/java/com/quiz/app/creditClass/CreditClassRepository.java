package com.quiz.app.creditClass;

import com.quiz.entity.CreditClass;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface CreditClassRepository extends CrudRepository<CreditClass, Integer> {

    public CreditClass findBySchool
}
