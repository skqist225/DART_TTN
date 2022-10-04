package com.quiz.entity;


import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class ExamId implements Serializable {
    private Class classId;
    private Subject subjectId;
    private Integer tryTime;
}
