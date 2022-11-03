package com.quiz.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.quiz.app.subject.dto.PostCreateSubjectDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "subjects")
public class Subject {
	@Id
	private String id;

	@Column(nullable = false, unique = true)
	private String name;

	private String image;

	@JsonIgnore
	@Builder.Default
	@OneToMany(mappedBy = "subject", fetch = FetchType.LAZY)
	private List<Test> tests = new ArrayList<>();

	@JsonIgnore
	@Builder.Default
	@OneToMany(mappedBy = "subject", fetch = FetchType.LAZY)
	private List<Chapter> chapters = new ArrayList<>();

	public Subject(String id, String name) {
		this.id = id;
		this.name = name;
	}

	public static Subject build(PostCreateSubjectDTO postCreateSubjectDTO) {
		return Subject.builder()
				.id(postCreateSubjectDTO.getId())
				.name(postCreateSubjectDTO.getName())
				.build();
	}
}
