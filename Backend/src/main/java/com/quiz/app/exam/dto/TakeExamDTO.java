package com.quiz.app.exam.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TakeExamDTO {
    private String studentId;
    private String studentName;
    private Float score;
    private String testName;
}
