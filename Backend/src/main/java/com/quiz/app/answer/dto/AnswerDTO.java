package com.quiz.app.answer.dto;

import com.quiz.app.test.dto.TestDTO;
import com.quiz.entity.Subject;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class AnswerDTO {
    private Integer id;
    private String content;
    private String isTempAnswer;
    private boolean isAnswer;
}
