package com.quiz.entity;

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

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "LUACHON")
public class Answer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "NOIDUNG", columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "LA_DAPAN", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean isAnswer;

    @ManyToOne
    @JoinColumn(name = "MACAUHOI", nullable = false)
    private Question question;
}
