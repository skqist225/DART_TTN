package com.quiz.app.creditClass.dto;


import com.quiz.entity.CreditClass;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreditClassesDTO {
    private List<CreditClass> creditClasses;
    private long totalElements;
    private long totalPages;
}
