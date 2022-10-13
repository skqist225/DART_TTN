package com.quiz.entity;

import com.quiz.app.classes.dto.PostCreateClassDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Id;
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
    private String id;

    private String name;

    public static Class build(PostCreateClassDTO postCreateClassDTO) {
        return Class.builder()
                .id(postCreateClassDTO.getId())
                .name(postCreateClassDTO.getName())
                .build();
    }
}
