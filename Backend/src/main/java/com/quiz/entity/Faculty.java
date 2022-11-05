package com.quiz.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "KHOA")
public class Faculty {
    @Id
    @Column(name = "MAKHOA", columnDefinition = "NCHAR(10)")
    private String id;

    @Column(name = "TENKHOA", columnDefinition = "NCHAR(50)", nullable = false, unique = true)
    private String name;
}
