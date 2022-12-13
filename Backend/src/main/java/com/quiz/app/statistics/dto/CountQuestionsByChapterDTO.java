package com.quiz.app.statistics.dto;

public interface CountQuestionsByChapterDTO {
    Integer getChapterId();
    String getChapterName();
    Integer getNumberOfQuestions();
}
