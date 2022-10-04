package com.quiz.entity;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinColumns;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.google.auto.value.AutoValue.Builder;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "results")
public class Result extends BaseEntity {
//    @ManyToOne
    @ManyToOne(cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "exam_class_id", referencedColumnName = "class_id"),
            @JoinColumn(name = "exam_subject_id", referencedColumnName = "subject_id"),
            @JoinColumn(name = "exam_try_time", referencedColumnName = "try_time")
    })
    private Exam exam;

    @ManyToOne
    private User user;

    private String selectedAnswer;
}
