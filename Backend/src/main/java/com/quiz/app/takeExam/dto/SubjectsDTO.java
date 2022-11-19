package com.quiz.app.takeExam.dto;


import com.quiz.entity.Subject;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SubjectsDTO {
    private List<Subject> subjects;
    private long totalElements;
    private long totalPages;
}
