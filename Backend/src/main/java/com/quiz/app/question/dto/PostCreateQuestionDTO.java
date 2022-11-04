package com.quiz.app.question.dto;

import com.quiz.entity.Level;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PostCreateQuestionDTO {
    private Integer id;
    private String content;
    private String answerA;
    private String answerB;
    private String answerC;
    private String answerD;
    private String finalAnswer;
    private String subjectName;
    private String chapterName;
    private String level;
    private Integer chapterId;
    private MultipartFile image;
}
