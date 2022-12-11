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
    private int totalExams = 0;
    private int totalExamsUsed = 0;
    private int totalExamsNotUsed = 0;
    private int totalExamsCancelled = 0;

    private int totalCreditClasses = 0;
    private int totalCreditClassesOpened = 0;
    private int totalCreditClassesClosed = 0;

    private int totalSubjects = 0;

    private int totalTests = 0;
    private int totalTestsTaken = 0;
    private int totalTestsNotTaken = 0;

    private int totalQuestions = 0;
    private int totalQuestionsActivated = 0;
    private int totalQuestionsDisabled = 0;
}