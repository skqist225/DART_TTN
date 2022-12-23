package com.quiz.app.test.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CriteriaExtendsDTO {
    private String subjectId;
    private String subjectName;
    private Integer testId;
    private List<CriteriaDTO> criteria;
}
