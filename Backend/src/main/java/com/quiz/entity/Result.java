package com.quiz.entity;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinColumns;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "KETQUA")
public class Result extends BaseEntity {
    @OneToOne
    @JoinColumns({
            @JoinColumn(name = "MALTC"),
            @JoinColumn(name = "MASV"),
    })
    private Register register;

    @ManyToOne
    @JoinColumn(name = "MACATHI")
    private Exam exam;

    @ManyToOne
    @JoinColumn(name = "MABODE")
    private Test test;

    @Column(name = "SULUACHONHIENTAI")
    private String currentResult;

    @Column(name = "SULUACHONCUOICUNG")
    private String finalResult;

    @Column(name = "DIEM")
    private float mark;

    @Column(name = "THOIGIANHOANTHANH", columnDefinition = "SMALLINT")
    private int timeToComplete;

    @Column(name = "THICHINHTHUC")
    private boolean isOfficialExam;

    @Column(name = "HOANTHANH")
    private boolean isComplete;
}
