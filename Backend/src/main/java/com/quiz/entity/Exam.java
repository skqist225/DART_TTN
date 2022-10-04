package com.quiz.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.JoinColumn;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "exams")
@IdClass(ExamId.class)
public class Exam {
	@Id
	@ManyToOne
	@JoinColumn(name = "class_id")
	private Class classId;

	@Id
	@ManyToOne
	@JoinColumn(name = "subject_id")
	private Subject subjectId;

	@Id
	@Column(name = "try_time")
	private Integer tryTime;

	@DateTimeFormat(pattern = "dd-MM-yyyy")
	private Date examDate;

	private Integer numberOfQuestions;

	private Integer timeInterval;
}
