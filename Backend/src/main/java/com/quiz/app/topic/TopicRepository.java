package com.quiz.app.topic;

import com.quiz.entity.Subject;
import com.quiz.entity.Topic;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface TopicRepository extends CrudRepository<Topic, Integer> {
}
