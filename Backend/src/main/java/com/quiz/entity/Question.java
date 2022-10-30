package com.quiz.entity;

import com.quiz.app.question.dto.PostCreateQuestionDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "questions")
public class Question extends BaseEntity {

	@Column(columnDefinition = "TEXT", nullable = false, unique = true)
	private String content;

	@Column(columnDefinition = "TEXT", nullable = false)
	private String answerA;

	@Column(columnDefinition = "TEXT", nullable = false)
	private String answerB;

	@Column(columnDefinition = "TEXT", nullable = false)
	private String answerC;

	@Column(columnDefinition = "TEXT", nullable = false)
	private String answerD;

	@Column(nullable = false)
	private String finalAnswer;

	@Column(nullable = false)
	private Level level;

	private Integer chapter;

	private String image;

	@Transient
	private String selectedAnswer;

	@ManyToOne
	@JoinColumn(name = "subject_id", nullable = false)
	private Subject subject;

	@ManyToOne
	@JoinColumn(nullable = false)
	private User teacher;

	public static Question build(PostCreateQuestionDTO postCreateQuestionDTO, User teacher,
								 Subject subject) {
		Question question = Question.builder()
				.content(postCreateQuestionDTO.getContent())
				.answerA(postCreateQuestionDTO.getAnswerA())
				.answerB(postCreateQuestionDTO.getAnswerB())
				.answerC(postCreateQuestionDTO.getAnswerC())
				.answerD(postCreateQuestionDTO.getAnswerD())
				.finalAnswer(postCreateQuestionDTO.getFinalAnswer())
				.level(postCreateQuestionDTO.getLevel())
				.subject(subject)
				.teacher(teacher)
				.build();

		if (postCreateQuestionDTO.getImage() != null) {
			question.setImage(postCreateQuestionDTO.getImage().getOriginalFilename());
		}

		return question;
	}
}
