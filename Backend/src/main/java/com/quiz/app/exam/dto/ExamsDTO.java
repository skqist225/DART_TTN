package com.quiz.app.exam.dto;


import com.quiz.entity.Exam;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ExamsDTO {
    private List<Exam> exams;
    private long totalElements;
    private long totalPages;
}
