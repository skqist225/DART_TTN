package com.quiz.entity;


import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class ResultId implements Serializable {
    private User user;
    private Test test;
    private Exam exam;
}
