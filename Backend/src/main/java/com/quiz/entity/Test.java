package com.quiz.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.quiz.app.test.dto.PostCreateTestDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.util.HashSet;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "BODE")
public class Test extends BaseEntity {

    @Column(name = "TENBODE", nullable = false, unique = true)
    private String name;

    @Column(name = "HINHANH")
    private String image;

    @Column(name = "SOLANTHI")
    private int numberOfTested;

    @Column(name = "SOLANXEM")
    private int numberOfViews;

    @Column(name = "THOIGIANLAMBAI", columnDefinition = "SMALLINT", nullable = false)
    private int time;

    @Column(name = "SONGUOIDANGTHI")
    private int numberOfCurrentTesting;

    @Builder.Default
    @JsonIgnore
    @ManyToMany
    @JoinTable(name = "BODE_CAUHOI", joinColumns = @JoinColumn(name = "MABODE"),
            inverseJoinColumns = @JoinColumn(name = "MACAUHOI"))
    private Set<Question> questions = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "MAMH")
    private Subject subject;

    @ManyToOne
    @JoinColumn(name = "MAGV")
    private User teacher;

    @Transient
    private int numberOfRightAnswer;

    @Transient
    private float mark;

    @Column(name = "DADUOCSUDUNG")
    private boolean isUsed;

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
