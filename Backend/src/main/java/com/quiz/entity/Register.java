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
import javax.persistence.JoinTable;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "DANGKY")
@IdClass(RegisterId.class)
public class Register {
    @Id
    @ManyToOne
    @JoinColumn(name = "MALTC")
    private CreditClass creditClass;

    @Id
    @ManyToOne
    @JoinColumn(name = "MASV")
    private User student;

    @ManyToOne
    @JoinColumn(name = "MACATHI")
    private Exam exam;

    @Column(name = "DIEM")
    private float score;

    @Column(name = "HUYDANGKY")
    private boolean isRegisterCancelled;
}
