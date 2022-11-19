package com.quiz.app.takeExam.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PostCreateSubjectDTO {
    private String id;
    private String name;
    private String numberOfTheoreticalPeriods;
    private String numberOfPracticePeriods;
}
