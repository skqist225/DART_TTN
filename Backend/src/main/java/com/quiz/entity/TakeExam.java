package com.quiz.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.JoinColumn;
import javax.persistence.JoinColumns;
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
@Table(name = "THI")
@IdClass(TakeExamId.class)
public class TakeExam {
    @Id
    @ManyToOne
    @JoinColumn(name = "MACATHI")
    private Exam exam;

    @Id
    @ManyToOne
    @JoinColumns({
            @JoinColumn(name = "MALTC", referencedColumnName = "MALTC"),
            @JoinColumn(name = "MASV", referencedColumnName = "MASV"),
    })
    private Register register;

    @Id
    @Column(name = "LANTHI", columnDefinition = "SMALLINT")
    private int tryTime;

    @OneToMany(mappedBy = "takeExam")
    private List<TakeExamDetail> takeExamDetails;

    @ManyToOne
    private Test test;

    @Column(name = "DIEM")
    private float score;
}
