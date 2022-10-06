package com.quiz.app.question.dto;

import com.quiz.entity.QuizLevel;
import com.quiz.entity.Subject;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PostCreateQuestionDTO {
    private Integer id;
    private String content;
    private String answerA;
    private String answerB;
    private String answerC;
    private String answerD;
    private String finalAnswer;
    private QuizLevel level;
    private Subject subject;
    private Integer subjectId;
    private MultipartFile image;
}