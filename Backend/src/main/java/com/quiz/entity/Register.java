package com.quiz.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.quiz.app.creditClass.dto.CreditClassDTO;
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
import javax.persistence.Transient;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "DANGKY")
@IdClass(RegisterId.class)
public class Register {
    @JsonIgnore
    @Id
    @ManyToOne
    @JoinColumn(name = "MALTC")
    private CreditClass creditClass;

    @Id
    @ManyToOne
    @JoinColumn(name = "MASV")
    private User student;

    @Column(name = "HUYDANGKY", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean status;

    @Column(name = "DIEMCC")
    private Float attendanceScore;

    @Column(name = "DIEMGK")
    private Float midTermScore;

    @Column(name = "DIEMCK")
    private Float finalTermScore;

    @Transient
    private boolean belongToMidTerm = false;

    @Transient
    private boolean belongToEndOfTerm = false;

    @Transient
    private CreditClassDTO tempCreditClass;

    public Register(User student, boolean status, Float attendanceScore, Float midTermScore,
                    Float finalTermScore) {
        this.student = student;
        this.status = status;
        this.attendanceScore = attendanceScore;
        this.midTermScore = midTermScore;
        this.finalTermScore = finalTermScore;
    }
}
