package com.quiz.app.test.dto;

import com.quiz.entity.Question;
import com.quiz.entity.Test;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TestDTO {
    private Integer id;
    private String name;
    private String image;
    private String teacherName;
    private int numberOfTested;
    private int numberOfViews;
    private int time;
    private int numberOfQuestions;
    private int numberOfRightAnswer;
    private float mark;
    private Set<Question> questions;

    public static TestDTO build(Test test, boolean includeQuestions) {
        TestDTO testDTO = TestDTO.builder()
                .id(test.getId())
                .name(test.getName())
                .teacherName(test.getTeacher().getFullName())
                .numberOfQuestions(test.getQuestions().size())
                .numberOfRightAnswer(test.getNumberOfRightAnswer())
                .mark(test.getMark())
                .build();

        if (includeQuestions) {
            testDTO.setQuestions(test.getQuestions());
        }

        return testDTO;
    }
}
