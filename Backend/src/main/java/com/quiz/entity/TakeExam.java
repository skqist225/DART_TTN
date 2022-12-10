package com.quiz.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
import javax.persistence.Transient;
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

    @JsonIgnore
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

    @JsonIgnore
    @OneToMany(mappedBy = "takeExam")
    private List<TakeExamDetail> takeExamDetails;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "MADETHI")
    private Test test;

    @Column(name = "DIEM")
    private Float score;

    @Column(name = "DATHI", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean tested;

    @Transient
    private String studentId;

    @Transient
    private String studentFullName;

    @Transient
    private String examName;

    @Transient
    private int testId;

    @Transient
    private String testName;

    @Transient
    private int rankOrder;

    public static TakeExam build(Exam exam, Register register, int tryTime, Test test) {
        return TakeExam.builder()
                .exam(exam)
                .register(register)
                .tryTime(tryTime)
                .test(test)
                .build();
    }

    public String getTestName() {
        return this.test.getName();
    }

    public String getStudentId() {
        return this.register.getStudent().getId();
    }
    public String getStudentName() {
        return this.register.getStudent().getFullName();
    }
    public String getExamName() {
        return this.getExam().getName();
    }


    @Override
    public String toString() {
        return "TakeExam{" +
                "tryTime=" + tryTime +
                ", score=" + score +
                '}';
    }

    public static TakeExam build(TakeExam takeExam) {
        return TakeExam.builder()
                .studentId(takeExam.getRegister().getStudent().getId())
                .studentFullName(takeExam.getRegister().getStudent().getFullName())
                .score(takeExam.getScore())
                .examName(takeExam.getExam().getName())
                .testId(takeExam.getTest().getId())
                .testName(takeExam.getTest().getName())
                .build()
                ;
    }

    public TakeExam(Float score, String studentId, String studentFullName, String testName, int rankOrder) {
        this.score = score;
        this.studentId = studentId;
        this.studentFullName = studentFullName;
        this.testName = testName;
        this.rankOrder = rankOrder;
    }
}
