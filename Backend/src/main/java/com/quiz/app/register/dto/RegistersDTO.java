package com.quiz.app.register.dto;


import com.quiz.entity.Register;
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
public class RegistersDTO {
    private List<Register> registers;
    private long totalElements;
    private long totalPages;
}
