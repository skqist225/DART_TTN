package com.quiz.entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.quiz.app.subject.dto.PostCreateSubjectDTO;
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
@Table(name = "subjects")
public class Subject {
	@Id
	private Integer id;

	@Column(nullable = false, unique = true)
	private String name;

	@Builder.Default
	@OneToMany(mappedBy = "subject")
	private List<Topic> topics = new ArrayList<>();

	@Builder.Default
	@OneToMany(mappedBy = "subject")
	private List<Question> questions = new ArrayList<>();

	public static Subject build(PostCreateSubjectDTO postCreateSubjectDTO){
		return Subject.builder()
				.name(postCreateSubjectDTO.getName())
				.build();
	}
}
