package com.quiz.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.quiz.app.register.dto.PostCreateRegisterDTO;
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
    @Id
    @ManyToOne
    @JoinColumn(name = "MALTC")
    private CreditClass creditClass;

    @Id
    @ManyToOne
    @JoinColumn(name = "MASV")
    private User student;

    @Column(name = "HUYDANGKY")
    private boolean status;

    public static Register build(PostCreateRegisterDTO postCreateRegisterDTO) {
        return null;
    }

}
