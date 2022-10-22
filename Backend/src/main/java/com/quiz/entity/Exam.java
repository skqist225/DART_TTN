package com.quiz.entity;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

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
public class Exam extends BaseEntity {
	@ManyToOne
	@JoinColumn(name = "class_id")
	private Class cls;

	@ManyToOne
	@JoinColumn(name = "subject_id")
	private Subject subject;

	@DateTimeFormat(pattern = "dd-MM-yyyy")
	private LocalDateTime examDate;

	private Integer timeInterval;

	@Builder.Default
	@ManyToMany
	@JoinTable(name = "exams_tests", joinColumns = @JoinColumn(name = "exam_id"),
			inverseJoinColumns = @JoinColumn(name = "test_id"))
	private Set<Test> tests = new HashSet<>();
}
