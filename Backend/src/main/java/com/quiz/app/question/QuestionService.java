package com.quiz.app.question;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class QuestionService {
    @Autowired
    QuestionRepository questionRepository;
}
