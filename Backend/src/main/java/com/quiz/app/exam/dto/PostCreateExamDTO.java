package com.quiz.app.exam.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PostCreateExamDTO {
    private Integer id;
    private String name;
    private Integer creditClassId;
    private String examDate;
    private Integer noticePeriod;
    private Integer numberOfStudents;
    private Integer time;
    private String examType;
    private List<Integer> tests;
}
