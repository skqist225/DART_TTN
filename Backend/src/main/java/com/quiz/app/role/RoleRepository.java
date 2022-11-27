package com.quiz.app.role;

import com.quiz.entity.Role;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface  RoleRepository extends CrudRepository<Role, Integer> {
    @Query(value = "SELECT * FROM vaitro WHERE tenvaitro= :name", nativeQuery = true)
    Role findByName(String name);

}
