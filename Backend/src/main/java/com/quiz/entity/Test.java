package com.quiz.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.quiz.app.test.dto.PostCreateTestDTO;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter()
@Setter
@Builder
@Entity
@Table(name = "DETHI")
public class Test {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MADETHI")
    private Integer id;

    @Column(name = "TENDETHI", nullable = false, unique = true)
    private String name;

    @Getter(AccessLevel.NONE)
    @Builder.Default
    @JsonIgnore
    @ManyToMany
    @JoinTable(name = "DETHI_CAUHOI", joinColumns = @JoinColumn(name = "MADETHI"),
            inverseJoinColumns = @JoinColumn(name = "MACAUHOI"))
    private List<Question> questions = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "MAMH")
    private Subject subject;

    @ManyToOne
    @JoinColumn(name = "MAGV")
    private User teacher;

    @ManyToOne
    @JoinColumn(name = "MACATHI")
    private Exam exam;

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "TAOLUC", updatable = false, nullable = false)
    private Date createdDate;

    @UpdateTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "CAPNHATLUC")
    private Date updatedDate;

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

        return Test.builder().name(postCreateSubjectDTO.getName()).questions(postCreateSubjectDTO.getQuestions()).subject(subject).teacher(teacher).build();
    }


    @Transient
    public List<Question> getQuestions() {
        this.questions.sort(Comparator.comparing(Question::getId));
        return this.questions;
    }

    public String getTeacherName() {
        return String.format("%s %s", this.getTeacher().getFirstName(), this.getTeacher().getLastName());
    }

    public int getNumberOfQuestions() {
        return this.questions.size();
    }

    public String getStatus() {
        return this.exam == null ? "Chưa sử dụng" : "Đã được sử dụng";
    }

    public List<>
}
