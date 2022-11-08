package com.quiz.app.chapter;

import com.quiz.entity.Chapter;
import com.quiz.entity.Subject;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ChapterRepository extends CrudRepository<Chapter, Integer> {
    public List<Chapter> findBySubject(Subject subject);

    public Chapter findByName(String name);
}
