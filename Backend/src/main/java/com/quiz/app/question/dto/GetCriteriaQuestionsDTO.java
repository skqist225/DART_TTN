package com.quiz.app.question.dto;


import com.quiz.entity.Question;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GetCriteriaQuestionsDTO {
    private GetCriteriaDTO criteria;
    private Set<Question> questions;
    private int missing;
}
