package com.quiz.app.statistics.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class QuestionsByChapterDTO {
    private String chapterName;
    private Integer numberOfEasyQuestions = 0;
    private Integer numberOfMediumQuestions = 0;
    private Integer numberOfHardQuestions = 0;
}
