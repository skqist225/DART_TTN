package com.quiz.app.takeExam.dto;


import com.quiz.entity.Subject;
import com.quiz.entity.TakeExam;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TakeExamsDTO {
    private List<TakeExam> takeExams;
    private long totalElements;
    private long totalPages;
}
