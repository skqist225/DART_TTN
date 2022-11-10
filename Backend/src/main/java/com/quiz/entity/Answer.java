package com.quiz.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.util.Comparator;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "LUACHON")
public class Answer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "NOIDUNG", columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "LADAPAN", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean isAnswer;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "MACAUHOI", nullable = false)
    private Question question;

    public static Answer build(String content, Question question, String isAnswer) {
        return Answer.builder()
                .content(content)
                .question(question)
                .isAnswer(isAnswer.equals("true"))
                .build();
    }

    public Answer(String content, boolean isAnswer) {
        this.content = content;
        this.isAnswer = isAnswer;
    }
}
