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
import javax.persistence.ManyToOne;
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

    @Column(name = "DIEM_CC", columnDefinition = "check(DIEM_CC >= 0 and DIEM_CC <= 10)")
    private int attendanceScore;

    @Column(name = "DIEM_GK", columnDefinition = "check(DIEM_GK >= 0 and DIEM_GK <= 10)")
    private float midSemesterScore;

    @Column(name = "DIEM_CK", columnDefinition = "check(DIEM_CK >= 0 and DIEM_CK <= 10)")
    private float finalSemesterScore;

    @Column(name = "HUYDANGKY")
    private boolean isRegisterCancelled;
}
