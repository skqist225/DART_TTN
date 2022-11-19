package com.quiz.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.quiz.app.creditClass.dto.PostCreateCreditClassDTO;
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
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "LOPTINCHI", uniqueConstraints =
@UniqueConstraint(columnNames = {"NIENKHOA", "HOCKY", "MAMH", "NHOM"}))
public class CreditClass {
    @Id
    @Column(name = "MALTC")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "NIENKHOA", columnDefinition = "NCHAR(9)", nullable = false)
    private String schoolYear;

    @Column(name = "HOCKY", columnDefinition = "SMALLINT", nullable = false)
    private int semester;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "MAMH", nullable = false)
    private Subject subject;

    @Column(name = "NHOM", columnDefinition = "SMALLINT", nullable = false)
    private int group;

    @Column(name = "SOSVTOITHIEU", columnDefinition = "SMALLINT", nullable = false)
    private int minimumNumberOfStudents;

    @Column(name = "HUYLOP")
    private boolean isCancelled;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "MAGV")
    private User teacher;

    @JsonIgnore
    @OneToMany(mappedBy = "creditClass")
    private List<Register> registers;

    public CreditClass(Integer id) {
        this.id = id;
    }

    public static CreditClass build(PostCreateCreditClassDTO postCreateCreditClassDTO, Subject subject, User teacher) {
        return CreditClass.builder()
                .schoolYear(postCreateCreditClassDTO.getSchoolYear())
                .semester(postCreateCreditClassDTO.getSemester())
                .subject(subject)
                .group(postCreateCreditClassDTO.getGroup())
                .minimumNumberOfStudents(postCreateCreditClassDTO.getMinimumNumberOfStudents())
                .isCancelled(false)
                .teacher(teacher)
                .build();
    }

    public String getSubjectId() {
        return this.subject.getId();
    }

    public String getSubjectName() {
        return this.subject.getName();
    }

    public String getTeacherName() {
        return this.teacher.getFullName();
    }

    public int getNumberOfActiveStudents() {
        int i = 0;
        for (Register register : this.registers) {
            if (!register.isStatus()) {
                i++;
            }
        }
        return i;
    }
}
