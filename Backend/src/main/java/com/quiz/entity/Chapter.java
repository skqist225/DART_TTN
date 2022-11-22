package com.quiz.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.List;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "CHUONG")
public class Chapter {
    @Id
    @Column(name = "MACHUONG")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "SOCHUONG", nullable = false)
    private Integer chapterNumber;

    @Column(name = "TENCHUONG", nullable = false, unique = true)
    private String name;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "MAMH", nullable = false)
    private Subject subject;

    @JsonIgnore
    @OneToMany(mappedBy = "chapter", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<Question> questions;

    public static Chapter build(int chapterNumber, String name, Subject subject) {
        return Chapter.builder().chapterNumber(chapterNumber).name(name).subject(subject).build();
    }

    public String getSubjectName() {
        return this.subject.getName();
    }
}
