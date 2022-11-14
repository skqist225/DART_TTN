package com.quiz.app.creditClass.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PostCreateCreditClassDTO {
    private Integer id;
    private String schoolYear;
    private Integer semester;
    private String subjectId;
    private Integer group;
    private Integer minimumNumberOfStudents;
    private String teacherId;
}
