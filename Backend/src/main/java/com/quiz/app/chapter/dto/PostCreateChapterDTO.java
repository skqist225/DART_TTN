package com.quiz.app.chapter.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PostCreateChapterDTO {
    private Integer id;
    private String name;
    private String subjectId;
}
