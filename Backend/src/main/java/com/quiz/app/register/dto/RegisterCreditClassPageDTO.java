package com.quiz.app.register.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RegisterCreditClassPageDTO {
    private String id;
    private String fullName;
    private String status;
    private String numberOfTheoreticalPeriods;
    private String numberOfPracticePeriods;
}
