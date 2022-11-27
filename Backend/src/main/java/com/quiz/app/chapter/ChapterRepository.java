package com.quiz.app.chapter;

import com.quiz.entity.Chapter;
import com.quiz.entity.Subject;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface ChapterRepository extends CrudRepository<Chapter, Integer> {

    @Query(value = "SELECT * FROM chuong where machuong = :id", nativeQuery = true)
    Optional<Chapter> findById(Integer id);

    List<Chapter> findBySubject(Subject subject);

    @Query(value = "SELECT * FROM chuong where tenchuong = :name", nativeQuery = true)
    Chapter findByName(String name);

    @Modifying
    @Query(value = "delete from chuong where machuong = :id", nativeQuery = true)
    void deleteById(Integer id);

    @Modifying
    @Query(value = "update chuong set tenchuong = :name where machuong = :id", nativeQuery = true)
    void updateById(Integer id, String name);

}
