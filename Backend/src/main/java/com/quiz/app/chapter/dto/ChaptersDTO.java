package com.quiz.app.chapter.dto;


import com.quiz.entity.Chapter;
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
public class ChaptersDTO {
    private List<Chapter> chapters;
    private long totalElements;
    private long totalPages;
}
