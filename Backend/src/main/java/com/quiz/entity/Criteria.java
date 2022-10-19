package com.quiz.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Table;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "criteria")
public class Criteria extends BaseEntity {
    private int chapter;
    private int numberOfEasyQuestions;
    private int numberOfMediumQuestions;
    private int numberOfHardQuestions;
}
