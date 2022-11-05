package com.quiz.app.user;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import com.quiz.entity.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.quiz.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    public Optional<User> findByEmail(String email);

    public Page<User> findAll(Pageable pageable);

//    @Query("SELECT count(*) FROM User u WHERE u.role.id IN (:roles)")
//    public Integer countUserByRole(Set<Role> roles);

    @Query("SELECT count(*) From User ")
    public Integer getNumberOfUser();


    @Query("SELECT u FROM User u WHERE u.email = :email AND u.id <> :userId")
    public List<User> findByEmailAndId(String email, Integer userId);
}
