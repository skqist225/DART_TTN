package com.quiz.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
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
@Table(name = "criteria")
public class Criteria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    private Subject subject;

    private int numberOfQuestions;

    @ManyToOne
    private User teacher;

    @Builder.Default
    @ManyToMany
    @JoinTable(name = "criteria_criteriadetails", joinColumns = @JoinColumn(name =
            "criteria_id"),
            inverseJoinColumns = @JoinColumn(name = "criteriaDetail_id"))
    private Set<CriteriaDetail> criteria = new HashSet<>();
}
