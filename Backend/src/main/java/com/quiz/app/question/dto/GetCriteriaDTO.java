package com.quiz.app.question.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GetCriteriaDTO {
    private int chapter;
    private String level;
    private int numberOfQuestions;
}
