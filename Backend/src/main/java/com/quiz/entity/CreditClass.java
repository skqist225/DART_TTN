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
import javax.persistence.Transient;
import javax.persistence.UniqueConstraint;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

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

    @Column(name = "HUYLOP")
    private boolean status;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "MAGV")
    private User teacher;

    @JsonIgnore
    @OneToMany(mappedBy = "creditClass")
    private List<Register> registers;

    @Transient
    private List<Exam> exams;

    public CreditClass(Integer id) {
        this.id = id;
    }

    public static CreditClass build(PostCreateCreditClassDTO postCreateCreditClassDTO, Subject subject, User teacher) {
        return CreditClass.builder()
                .schoolYear(postCreateCreditClassDTO.getSchoolYear())
                .semester(postCreateCreditClassDTO.getSemester())
                .subject(subject)
                .group(postCreateCreditClassDTO.getGroup())
                .status(false)
                .teacher(teacher)
                .build();
    }

    @Transient
    public String getSubjectId() {
        return this.subject.getId();
    }

    @Transient
    public String getSubjectName() {
        return this.subject.getName();
    }

    @Transient
    public String getTeacherName() {
        return this.teacher.getFullName();
    }

    @Transient
    public String getTeacherId() {
        return this.teacher.getId();
    }

    @Transient
    public int getNumberOfActiveStudents() {
        return this.registers.stream().reduce(0, (subtotal, element) -> {
            if (!element.isStatus()) {
                return subtotal + 1;
            }
            return subtotal;
        }, Integer::sum);
    }

    @Transient
    public List<Register> getTempRegisters() {
        if (this.getRegisters().size() > 0) {
            this.registers.sort(Comparator.comparing(register -> register.getStudent().getFullName()));
            return this.registers.stream().map(register -> new Register(register.getStudent(),
                    register.isStatus(), register.getAttendanceScore(), register.getMidTermScore(),
                    register.getFinalTermScore())).collect(Collectors.toList());
        }
        return new ArrayList<>();
    }
}
