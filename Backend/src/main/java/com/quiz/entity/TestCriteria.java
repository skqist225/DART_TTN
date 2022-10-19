package com.quiz.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.util.HashSet;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "testCriteria")
public class TestCriteria extends BaseEntity {
    @ManyToOne
    private Subject subject;

    private int numberOfQuestions;

    @ManyToOne
    private User teacher;

    @Builder.Default
    @ManyToMany
    @JoinTable(name = "testCriteria_criteria", joinColumns = @JoinColumn(name = "testCriteria_id"),
            inverseJoinColumns = @JoinColumn(name = "criteria_id"))
    private Set<Criteria> criteria = new HashSet<>();
}
