package com.quiz.app.test.dto;


import com.quiz.entity.Test;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TestsDTO {
    private List<Test> tests;
    private long totalElements;
    private long totalPages;
}
