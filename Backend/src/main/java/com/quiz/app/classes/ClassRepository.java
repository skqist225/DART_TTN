package com.quiz.app.classes;

import com.quiz.entity.Class;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ClassRepository extends CrudRepository<Class, String> {

    public Class findByName(String name);
}
