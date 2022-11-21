package com.quiz.app.exam.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.quiz.entity.Test;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ExamCreditClassPageDTO {
    private Integer id;
    private String name;
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate examDate;
    private Integer noticePeriod;
    private int time;
    private Set<Test> tests;
    private String type;
    private boolean taken;
    private boolean status;
    private int numberOfRegisters;
}
