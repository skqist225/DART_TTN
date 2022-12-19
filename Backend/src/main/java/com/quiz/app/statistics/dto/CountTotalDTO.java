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
    private Integer totalExams = 0;
    private Integer totalExamsUsed = 0;
    private Integer totalExamsNotUsed = 0;
    private Integer totalExamsCancelled = 0;

    private Integer totalUsers = 0;
    private Integer totalUsersAdmin = 0;
    private Integer totalUsersTeacher = 0;
    private Integer totalUsersTeacherAndAdmin = 0;
    private Integer totalUsersStudent = 0;

    private Integer totalCreditClasses = 0;
    private Integer totalCreditClassesOpened = 0;
    private Integer totalCreditClassesClosed = 0;

    private Integer totalSubjects = 0;

    private Integer totalTests = 0;
    private Integer totalTestsUsed = 0;
    private Integer totalTestsNotUsed = 0;
    private Integer totalTestsCancelled = 0;

    private Integer totalQuestions = 0;
    private Integer totalQuestionsActive = 0;
    private Integer totalQuestionsDisabled = 0;
}