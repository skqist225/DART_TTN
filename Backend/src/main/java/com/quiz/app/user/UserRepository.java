package com.quiz.app.user;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.quiz.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    public Optional<User> findByEmail(String email);

    @Modifying
    @Query(value = "delete from users_favorite_rooms where user_id = :userId and room_id = :roomId", nativeQuery = true)
    public void removeFromFavLists(Integer userId, Integer roomId);

    public Long countById(Integer id);

    @Query("SELECT u FROM User u WHERE CONCAT(u.id, ' ', u.email, ' ', u.firstName, ' ', u.lastName) LIKE %?1%")
    public Page<User> findAll(String keyword, Pageable pageable);

    public Page<User> findAll(Pageable pageable);

    @Query("SELECT count(*) FROM User u WHERE u.role.id = :roleId")
    public Integer countUserByRole(Integer roleId);

    @Query("SELECT count(*) From User ")
    public Integer getNumberOfUser();


    @Query("SELECT u FROM User u WHERE u.email = :email AND u.id <> :userId")
    public List<User> findByEmailAndId(String email, Integer userId);
}
