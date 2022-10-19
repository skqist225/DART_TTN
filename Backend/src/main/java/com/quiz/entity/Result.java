package com.quiz.entity;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "results")
@IdClass(ResultId.class)
public class Result {
    @Id
    @ManyToOne
    private Test test;

    @Id
    @ManyToOne
    private User user;

    @Id
    @ManyToOne
    private Exam exam;

    private String currentResult;

    private String finalResult;

    private boolean status;
}
