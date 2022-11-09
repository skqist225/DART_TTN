package com.quiz.entity;

import com.quiz.app.question.dto.PostCreateQuestionDTO;
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
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.util.List;
import java.util.Objects;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "CAUHOI")
public class Question {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "MACAUHOI")
	private Integer id;

	@Column(name = "LOAICAUHOI")
	private String type;

	@Column(name = "NOIDUNGCAUHOI", columnDefinition = "TEXT", nullable = false, unique = true)
	private String content;

	@OneToMany(mappedBy = "question")
	private List<Answer> answers;

	@Column(name = "DOKHO", nullable = false)
	private Level level;

	@Column(name = "HINHANH")
	private String image;

	@ManyToOne
	@JoinColumn(name = "MACHUONG", nullable = false)
	private Chapter chapter;

	@ManyToOne
	@JoinColumn(name = "MAGV", nullable = false)
	private User teacher;

	private boolean status;

	@Transient
	private String selectedAnswer;

	public static Question build(PostCreateQuestionDTO postCreateQuestionDTO, User teacher,
								 Chapter chapter) {
		Level level = Level.EASY;
		if (Objects.equals(postCreateQuestionDTO.getLevel(), "Khó")) {
			level = Level.HARD;
		} else if (Objects.equals(postCreateQuestionDTO.getLevel(), "Trung bình")) {
			level = Level.MEDIUM;
		}

		Question question = Question.builder()
				.content(postCreateQuestionDTO.getContent())
				.type(postCreateQuestionDTO.getType())
				.level(level)
				.chapter(chapter)
				.teacher(teacher)
				.status(true)
				.build();

		if (postCreateQuestionDTO.getImage() != null) {
			question.setImage(postCreateQuestionDTO.getImage().getOriginalFilename());
		}

		return question;
	}
}
