package com.quiz.entity;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class TakeExamId implements Serializable {
    private Exam exam;
    private Register register;
    private int tryTime;
}
