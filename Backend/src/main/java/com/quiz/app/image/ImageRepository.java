package com.quiz.app.image;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.quiz.entity.Image;

@Repository
public interface ImageRepository extends CrudRepository<Image, Integer> {
}
