package com.quiz.entity;


import com.quiz.app.classes.dto.PostCreateClassDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "LOP")
public class Class {
    @Id
    @Column(name = "MALOP", columnDefinition = "NCHAR(11)")
    private String id;

    @Column(name = "TENLOP", nullable = false, unique = true)
    private String name;

    @ManyToOne
    @JoinColumn(name = "MAKHOA", nullable = false)
    private Faculty faculty;

    public static Class build(PostCreateClassDTO postCreateClassDTO, Faculty faculty) {
        return Class.builder()
                .id(postCreateClassDTO.getId())
                .name(postCreateClassDTO.getName())
                .faculty(faculty)
                .build();
    }
}
