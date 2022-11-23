package com.quiz.app.statistics.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DoughnutChartDTO {
    private List<CountQuestionsBySubjectDTO> countQuestionsBySubject;
    private List<CountExamByCreditClassDTO> countExamsByCreditClass;
}
