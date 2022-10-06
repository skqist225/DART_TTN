package com.quiz.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.quiz.app.question.dto.PostCreateQuestionDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "questions")
public class Question extends BaseEntity {

	@Column(columnDefinition = "TEXT NOT NULL", unique = true)
	private String content;

	@Column(columnDefinition = "TEXT NOT NULL")
	private String answerA;

	@Column(columnDefinition = "TEXT NOT NULL")
	private String answerB;

	@Column(columnDefinition = "TEXT NOT NULL")
	private String answerC;

	@Column(columnDefinition = "TEXT NOT NULL")
	private String answerD;

	@Column(nullable = false)
	private String finalAnswer;

	@Column(nullable = false)
	private QuizLevel level;

	@ManyToOne
	@JoinColumn(name = "subject_id", nullable = false)
	private Subject subject;

	private String image;

	@ManyToOne
	private User teacher;

	public static Question build(PostCreateQuestionDTO postCreateQuestionDTO, User teacher) {
		Question question = Question.builder()
				.content(postCreateQuestionDTO.getContent())
				.answerA(postCreateQuestionDTO.getAnswerA())
				.answerB(postCreateQuestionDTO.getAnswerB())
				.answerC(postCreateQuestionDTO.getAnswerC())
				.answerD(postCreateQuestionDTO.getAnswerD())
				.finalAnswer(postCreateQuestionDTO.getFinalAnswer())
				.level(postCreateQuestionDTO.getLevel())
				.teacher(teacher)
				.build();

		if(postCreateQuestionDTO.getImage() != null) {
			question.setImage(postCreateQuestionDTO.getImage().getOriginalFilename());
		}

		return  question;
	}
}
