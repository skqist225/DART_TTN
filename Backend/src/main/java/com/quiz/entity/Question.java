package com.quiz.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "questions")
public class Question extends BaseEntity {

	@Column(columnDefinition = "TEXT NOT NULL")
	private String content;

	@Column(columnDefinition = "TEXT NOT NULL")
	private String answerA;

	@Column(columnDefinition = "TEXT NOT NULL")
	private String answerB;

	@Column(columnDefinition = "TEXT NOT NULL")
	private String answerC;

	@Column(columnDefinition = "TEXT NOT NULL")
	private String answerD;

	private String finalAnswer;

	private QuizLevel level;

	@ManyToOne
	private User teacher;
}
