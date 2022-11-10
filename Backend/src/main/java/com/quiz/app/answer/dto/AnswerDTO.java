package com.quiz.app.answer.dto;

import com.quiz.app.test.dto.TestDTO;
import com.quiz.entity.Subject;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AnswerDTO {
    private Integer id;
    private String content;
    private String isAnswer;
}
