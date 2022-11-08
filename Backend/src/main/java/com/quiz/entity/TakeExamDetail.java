package com.quiz.entity;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
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
@Table(name = "CHITIETTHI")
public class TakeExamDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumns({
            @JoinColumn(name = "MACATHI", referencedColumnName = "MACATHI"),
            @JoinColumn(name = "MALTC", referencedColumnName = "MALTC"),
            @JoinColumn(name = "MASV", referencedColumnName = "MASV"),
            @JoinColumn(name = "LANTHI", referencedColumnName = "LANTHI"),
    })
    private TakeExam takeExam;

    @ManyToOne
    @JoinColumn(name = "MACAUHOI")
    private Question question;

    @Column(name = "CAUTRALOI")
    private String answer;
}
