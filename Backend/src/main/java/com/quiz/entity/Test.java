package com.quiz.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.quiz.app.test.dto.PostCreateTestDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "tests")
public class Test extends BaseEntity {

    @Column(nullable = false, unique = true)
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

    @OneToMany(mappedBy = "subject", cascade = CascadeType.PERSIST)
    private List<Criteria> criteria;

    public void addQuestion(Question question) {
        this.questions.add(question);
    }

    public void removeQuestion(Question question) {
        this.questions.remove(question);
    }

    public static Test build(PostCreateTestDTO postCreateSubjectDTO, Subject subject,
                             User teacher) {
        if (postCreateSubjectDTO.getCriteria().size() > 0) {

        }

        return Test.builder()
                .name(postCreateSubjectDTO.getName())
                .questions(postCreateSubjectDTO.getQuestions())
                .subject(subject)
                .teacher(teacher)
                .build();
    }
}
