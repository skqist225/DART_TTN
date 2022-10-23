package com.quiz.entity;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import com.quiz.app.subject.dto.PostCreateSubjectDTO;
import com.quiz.app.test.dto.PostCreateTestDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "tests")
public class Test extends BaseEntity {

    private String name;

    @Builder.Default
    @JsonIgnore
    @ManyToMany
    @JoinTable(name = "tests_questions", joinColumns = @JoinColumn(name = "test_id"),
            inverseJoinColumns = @JoinColumn(name = "question_id"))
    private Set<Question> questions = new HashSet<>();

    private int numberOfTimes;

    @ManyToOne
    private Subject subject;

    @ManyToOne
    private User teacher;

    public void addQuestion(Question question) {
        this.questions.add(question);
    }

    public void removeQuestion(Question question) {
        this.questions.remove(question);
    }

    public static Test build(PostCreateTestDTO postCreateSubjectDTO) {
        return Test.builder()
                .name(postCreateSubjectDTO.getName())
                .build();
    }
}
