package com.quiz.app.role;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.quiz.entity.Role;

@Repository
public interface  RoleRepository extends CrudRepository<Role, Integer> {
}
