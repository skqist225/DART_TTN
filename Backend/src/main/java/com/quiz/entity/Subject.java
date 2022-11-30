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
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "MONHOC")
public class Subject {
	@Id
	@Column(name = "MAMH", columnDefinition = "NCHAR(12)")
	private String id;

	@Column(name = "TENMH", columnDefinition = "NVARCHAR(50)", nullable = false)
	private String name;

	@Column(name = "SOTIET_LT", columnDefinition = "SMALLINT", nullable = false)
	private int numberOfTheoreticalPeriods;

	@Column(name = "SOTIET_TH", columnDefinition = "SMALLINT", nullable = false)
	private int numberOfPracticePeriods;

	@JsonIgnore
	@Builder.Default
	@OneToMany(mappedBy = "subject", orphanRemoval = true, cascade = CascadeType.ALL)
	private List<Test> tests = new ArrayList<>();

	@Builder.Default
	@OneToMany(mappedBy = "subject", orphanRemoval = true, cascade = CascadeType.ALL)
	private List<Chapter> chapters = new ArrayList<>();

	public static Subject build(PostCreateSubjectDTO postCreateSubjectDTO) {
		return Subject.builder()
				.id(postCreateSubjectDTO.getId())
				.name(postCreateSubjectDTO.getName())
				.numberOfPracticePeriods(postCreateSubjectDTO.getNumberOfPracticePeriods())
				.numberOfTheoreticalPeriods(postCreateSubjectDTO.getNumberOfTheoreticalPeriods())
				.build();
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

	@Transient
	public int getNumberOfActiveQuestions() {
		int i = 0;
		for (Chapter chapter : this.chapters) {
			i += chapter.getNumberOfActiveQuestions();
		}

		return i;
	}

	@Transient
	public void addChapter(Chapter chapter) {
		this.chapters.add(chapter);
	}

	@Transient
	public void removeChapter(Chapter chapter) {
		this.chapters.remove(chapter);
	}

	@Transient
	public void removeAll() {
		this.chapters.clear();
	}

	public Subject(String id, String name, int numberOfTheoreticalPeriods, int numberOfPracticePeriods) {
		this.id = id;
		this.name = name;
		this.numberOfTheoreticalPeriods = numberOfTheoreticalPeriods;
		this.numberOfPracticePeriods = numberOfPracticePeriods;
	}

	@Override
	public String toString() {
		return "Subject{" +
				"id='" + id + '\'' +
				", name='" + name + '\'' +
				", numberOfTheoreticalPeriods=" + numberOfTheoreticalPeriods +
				", numberOfPracticePeriods=" + numberOfPracticePeriods +
				'}';
	}
}
