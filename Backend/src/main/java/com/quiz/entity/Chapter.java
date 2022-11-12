package com.quiz.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Getter
@Setter
@Table(name = "CHUONG")
public class Chapter {
    @Id
    @Column(name = "MACHUONG")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "TENCHUONG", nullable = false, unique = true)
    private String name;

    @ManyToOne
    @JoinColumn(name = "MAMH")
    private Subject subject;

    @JsonIgnore
    @OneToMany(mappedBy = "chapter", fetch = FetchType.LAZY)
    private List<Question> questions;

    public static Chapter build(String name, Subject subject) {
        return Chapter.builder().name(name).subject(subject).build();
    }

    public Chapter(Integer id, String name) {
        this.id = id;
        this.name = name;
    }
}
