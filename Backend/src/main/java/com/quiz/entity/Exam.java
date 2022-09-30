package com.quiz.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Entity;
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
@Table(name = "results")
public class Exam extends BaseEntity {

	@ManyToOne
	private Topic topic;

	@Builder.Default
	@ManyToMany
	@JoinTable(name = "exams_students", joinColumns = @JoinColumn(name = "exam_id"), inverseJoinColumns = @JoinColumn(name = "student_id"))
	private List<User> students = new ArrayList<>();

	@DateTimeFormat(pattern = "dd-MM-yyyy")
	private LocalDateTime start;

	@DateTimeFormat(pattern = "dd-MM-yyyy")
	private LocalDateTime end;
}
