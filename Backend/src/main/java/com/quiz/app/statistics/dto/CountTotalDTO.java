package com.quiz.app.statistics.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CountTotalDTO {
    private int totalExams;
    private int totalCreditClasses;
    private int totalSubjects;
    private int totalTests;
    private int totalQuestions;
}