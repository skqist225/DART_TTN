package com.quiz.app.test.dto;

import com.quiz.app.question.dto.GetCriteriaDTO;
import com.quiz.entity.Question;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PostCreateTestDTO {
    private Integer id;
    private String name;
    private String subjectId;
    private List<Question> questions;
    private List<GetCriteriaDTO> criteria;
 }
