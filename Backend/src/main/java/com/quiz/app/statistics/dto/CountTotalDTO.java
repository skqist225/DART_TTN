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

    private int totalUsers = 0;
    private int totalUsersAdmin = 0;
    private int totalUsersTeacher = 0;
    private int totalUsersTeacherAndAdmin = 0;
    private int totalUsersStudent = 0;

    private int totalCreditClasses = 0;
    private int totalCreditClassesOpened = 0;
    private int totalCreditClassesClosed = 0;

    private int totalSubjects = 0;

    private int totalTests = 0;
    private int totalTestsUsed = 0;
    private int totalTestsNotUsed = 0;
    private int totalTestsCancelled = 0;

    private int totalQuestions = 0;
    private int totalQuestionsActive = 0;
    private int totalQuestionsDisabled = 0;
}