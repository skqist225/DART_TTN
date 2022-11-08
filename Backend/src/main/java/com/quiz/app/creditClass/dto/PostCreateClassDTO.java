package com.quiz.app.creditClass.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PostCreateClassDTO {
    private String id;
    private String name;
    private String facultyId;
}
