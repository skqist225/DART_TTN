package com.quiz.app.question.dto;

import com.quiz.app.answer.dto.AnswerDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class PostCreateQuestionDTO {
    private Integer id;
    private String content;
    private String type;
    private String level;
    private List<AnswerDTO> answers;
    private String answer;
    private String subjectName;
    private String subjectId;
    private String chapterName;
    private Integer chapterId;
    private MultipartFile image;
}
