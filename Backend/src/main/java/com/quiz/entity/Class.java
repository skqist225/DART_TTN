package com.quiz.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "classes")
public class Class {
    @Id
    private Integer id;

    @Column(nullable = false, unique = true)
    private String name;

    @JsonIgnore
    @Builder.Default
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "studentClass")
    private Set<User> students = new HashSet<>();
}
