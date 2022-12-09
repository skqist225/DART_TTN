package com.quiz.app.test.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.quiz.entity.Question;
import com.quiz.entity.Test;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

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
    private int time;
    private int numberOfQuestions;
    private int numberOfRightAnswer;
    private float mark;
    private List<Question> questions;
    private String subjectName;
    private String examType;
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate examDate;
    private int noticePeriod;
    private int examTime;

    public static TestDTO build(Test test, boolean includeQuestions) {
        TestDTO testDTO = TestDTO.builder()
                .id(test.getId())
                .name(test.getName())
                .teacherName(test.getTeacher().getFullName())
                .numberOfQuestions(test.getQuestions().size())
                .build();

        if (includeQuestions) {
            testDTO.setQuestions(test.getQuestions());
        }

        return testDTO;
    }
}
