package com.quiz.app.takeExam.dto;

import com.quiz.app.test.dto.TestDTO;
import com.quiz.entity.Subject;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class SubjectDTO {
    private String id;
    private String name;
    private int numberOfTests;
    private List<TestDTO> tests;

    public static SubjectDTO build(Subject subject) {
        return new SubjectDTO(subject.getId(), subject.getName(),
                subject.getTests().size(),
                subject.getTests().stream()
                        .map(test -> TestDTO.build(test, false))
                        .collect(Collectors.toList()));
    }
}
