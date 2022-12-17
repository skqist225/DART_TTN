package com.quiz.app.test.dto;

import com.quiz.entity.Question;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PostCreateTestDTO {
    private Integer id;
    private String name;
    private String subjectId;
    private List<Question> questions;
}
