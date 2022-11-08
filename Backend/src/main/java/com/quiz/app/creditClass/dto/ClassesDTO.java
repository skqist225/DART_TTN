package com.quiz.app.creditClass.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ClassesDTO {
    private List<Class> classes;
    private long totalElements;
    private long totalPages;
}
