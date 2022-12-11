package com.quiz.app.creditClass.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CreditClassDTO {
    private Integer id;
    private String schoolYear;
    private int semester;
    private String subjectName;
    private String teacherName;
}
