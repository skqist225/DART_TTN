package com.quiz.app.subject.dto;

import com.quiz.app.chapter.dto.ChapterDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PostCreateSubjectDTO {
    private String id;
    private String name;
    private Integer numberOfTheoreticalPeriods;
    private Integer numberOfPracticePeriods;
    private List<ChapterDTO> chapters;
}
