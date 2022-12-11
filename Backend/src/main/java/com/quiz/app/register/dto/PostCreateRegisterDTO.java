package com.quiz.app.register.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PostCreateRegisterDTO {
    private Integer creditClassId;
    private List<String> registerList;
}
