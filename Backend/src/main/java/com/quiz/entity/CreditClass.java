package com.quiz.entity;

import com.quiz.app.classes.dto.PostCreateClassDTO;
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
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "LOPTINCHI")
public class CreditClass {
    @Id
    @Column(name = "MALTC")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "NIENKHOA", columnDefinition = "NCHAR(9)", nullable = false, unique = true)
    private String schoolYear;

    @Column(name = "HOCKY", columnDefinition = "SMALLINT", nullable = false, unique = true)
    private int semester;

    @ManyToOne
    @JoinColumn(name = "MAMH", nullable = false, unique = true)
    private Subject subject;

    @Column(name = "NHOM", columnDefinition = "SMALLINT", nullable = false, unique = true)
    private int group;

    @Column(name = "SOSVTOITHIEU",columnDefinition = "SMALLINT", nullable = false)
    private int minimumNumberOfStudents;

    @Column(name = "HUYLOP")
    private boolean isCancelled;

    @ManyToOne
    @JoinColumn(name = "MAKHOA", nullable = false)
    private Faculty faculty;

    @ManyToOne
    @JoinColumn(name = "MAGV")
    private User teacher;

    public CreditClass(Integer id) {
        this.id = id;
    }

    public static CreditClass build(PostCreateClassDTO postCreateClassDTO) {
        return CreditClass.builder()
                .build();
    }
}
