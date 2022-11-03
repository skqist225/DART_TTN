package com.quiz.app.question.dto;


import com.quiz.entity.Chapter;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReadQuestionExcelDTO {
    private int id;
    private String content;
    private String answerA;
    private String answerB;
    private String answerC;
    private String answerD;
    private String finalAnswer;
    private String level;
    private String chapterName;
    private String subjectName;
    private boolean status;
}
