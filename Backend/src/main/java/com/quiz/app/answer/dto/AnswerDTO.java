package com.quiz.app.answer.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

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
    private String order;

    public AnswerDTO(String content, boolean isAnswer, String order) {
        this.content = content;
        this.isAnswer = isAnswer;
        this.order = order;
    }
}
