package com.quiz.entity;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "topics")
public class Topic extends BaseEntity {

    @Builder.Default
    @JsonIgnore
    @OneToMany(mappedBy = "topic")
    private Set<Quiz> quizes = new HashSet<>();

    @ManyToOne
    private Subject subject;

    @ManyToOne
    private User teacher;
}
