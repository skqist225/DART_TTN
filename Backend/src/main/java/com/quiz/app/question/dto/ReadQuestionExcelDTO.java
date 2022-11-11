package com.quiz.app.question.dto;


import com.quiz.entity.Answer;
import com.quiz.entity.Chapter;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReadQuestionExcelDTO {
    private int id;
    private String content;
    private String type;
    private List<Answer> answers;
    private String level;
    private String chapterName;
    private String subjectName;
    private boolean status;
}
