package com.quiz.app.user;

import com.quiz.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    @Query(value = "SELECT * FROM nguoidung WHERE nguoidung.manguoidung = :id", nativeQuery = true)
    Optional<User> findById(String id);

    @Query(value = "SELECT * FROM nguoidung WHERE nguoidung.email = :email", nativeQuery = true)
    User findByEmail(String email);

    Page<User> findAll(Pageable pageable);

    @Query(value = "SELECT * FROM nguoidung as nd JOIN nguoidung_vaitro vt ON nd.manguoidung = vt" +
            ".manguoidung WHERE vt.mavaitro = :roleId GROUP BY nd.manguoidung", nativeQuery = true)
    List<User> findByRole(Integer roleId);
}
