package com.quiz.app.question.dto;


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
public class QuestionsDTO {
    private List<Question> questions;
    private long totalElements;
    private long totalPages;
}
