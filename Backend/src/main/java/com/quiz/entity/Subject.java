package com.quiz.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.quiz.app.subject.dto.PostCreateSubjectDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "MONHOC")
public class Subject {
	@Id
	@Column(name = "MAMH", columnDefinition = "NCHAR(10)")
	private String id;

	@Column(name = "TENMH", columnDefinition = "NVARCHAR(50)", nullable = false, unique = true)
	private String name;

	@Column(name = "SOTIET_LT", columnDefinition = "SMALLINT", nullable = false)
	private int numberOfTheoreticalPeriods;

	@Column(name = "SOTIET_TH", columnDefinition = "SMALLINT", nullable = false)
	private int numberOfPracticePeriods;

	@JsonIgnore
	@OneToMany(mappedBy = "subject", fetch = FetchType.LAZY)
	private List<Test> tests;

	@OneToMany(mappedBy = "subject", orphanRemoval = true, cascade = CascadeType.ALL)
	private List<Chapter> chapters;

	public static Subject build(PostCreateSubjectDTO postCreateSubjectDTO) {
		return Subject.builder()
				.id(postCreateSubjectDTO.getId())
				.name(postCreateSubjectDTO.getName())
				.numberOfPracticePeriods(Integer.parseInt(postCreateSubjectDTO.getNumberOfPracticePeriods()))
				.numberOfTheoreticalPeriods(Integer.parseInt(postCreateSubjectDTO.getNumberOfTheoreticalPeriods()))
				.build();
	}

	@Transient
	public List<Chapter> getChapters() {
		return this.chapters.stream().map(chapter -> new Chapter(chapter.getId(), chapter.getName())).collect(Collectors.toList());
	}

	@Transient
	public int getNumberOfTests() {
		return this.tests.size();
	}

	@Transient
	public int getNumberOfQuestions() {
		int i = 0;
		for (Chapter chapter : this.chapters) {
			i += chapter.getQuestions().size();
		}

		return i;
	}
}
