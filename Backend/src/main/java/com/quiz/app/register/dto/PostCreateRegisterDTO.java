package com.quiz.app.register.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PostCreateRegisterDTO {
    private String id;
    private String name;
    private String numberOfTheoreticalPeriods;
    private String numberOfPracticePeriods;
}
