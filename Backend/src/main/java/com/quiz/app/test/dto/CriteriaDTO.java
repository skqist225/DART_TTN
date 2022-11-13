package com.quiz.app.test.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CriteriaDTO {
    private String chapter;
    private List<CriteriaSubDTO> levelAndNumbers;
}
