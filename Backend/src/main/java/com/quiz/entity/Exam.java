package com.quiz.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.quiz.app.exam.dto.PostCreateExamDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "CATHI")
public class Exam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MACATHI")
    private Integer id;

    @Column(name = "TENCATHI", columnDefinition = "NVARCHAR(255)", nullable = false)
    private String name;

    @JsonFormat(pattern = "dd/MM/yyyy")
    @DateTimeFormat(pattern = "dd-MM-yyyy")
    @Column(name = "NGAYTHI", nullable = false)
    private LocalDate examDate;

    @Column(name = "TIETBAODANH", columnDefinition = "SMALLINT", nullable = false)
    private int noticePeriod;

    @Column(name = "THOIGIANLAMBAI", columnDefinition = "SMALLINT", nullable = false)
    private int time;

    @Builder.Default
    @OneToMany(mappedBy = "exam")
    private Set<Test> tests = new HashSet<>();

    @Column(name = "LOAIKYTHI", columnDefinition = "NVARCHAR(50)", nullable = false)
    private String type;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "MAGV", nullable = false)
    private User teacher;

    @Builder.Default
    @OneToMany(mappedBy = "exam")
    private List<TakeExam> takeExams = new ArrayList<>();

    @Column(name = "DATHI", columnDefinition = "BOOLEAN DEFAULT 0")
    private boolean taken;

    @Column(name = "DAHUY", columnDefinition = "BOOLEAN DEFAULT 0")
    private boolean status;

    public static Exam build(PostCreateExamDTO postCreateExamDTO) {
        return Exam.builder()
                .name(postCreateExamDTO.getName())
                .time(postCreateExamDTO.getTime())
                .noticePeriod(postCreateExamDTO.getNoticePeriod())
                .type(postCreateExamDTO.getType())
                .taken(false)
                .status(false)
                .build();
    }

    public void addTest(Test test) {
        this.tests.add(test);
    }

    public void removeTest(Test test) {
        this.tests.remove(test);
    }

    public String getCreatedBy() {
        return this.teacher.getFullName();
    }

    public String getSubjectId() {
        return this.takeExams.get(0).getRegister().getCreditClass().getSubjectId();
    }

    public String getSubjectName() {
        return this.takeExams.get(0).getRegister().getCreditClass().getSubjectName();
    }

    public int getNumberOfRegisters() {
        return this.takeExams.size();
    }

    public String getTeacherName() {
        if (this.takeExams.size() > 0) {
            return this.takeExams.get(0).getRegister().getCreditClass().getTeacherName();
        }
        return "";
    }

    public Integer getCreditClassId() {
        if (this.takeExams.size() > 0) {
            return this.takeExams.get(0).getRegister().getCreditClass().getId();
        }
        return null;
    }

    public List<Integer> getTestIds() {
        return this.getTests().stream().map(Test::getId).collect(Collectors.toList());
    }

    public Exam(Integer id, String name, LocalDate examDate, int noticePeriod, int time, Set<Test> tests, String type, boolean taken, boolean status) {
        this.id = id;
        this.name = name;
        this.examDate = examDate;
        this.noticePeriod = noticePeriod;
        this.time = time;
        this.tests = tests;
        this.type = type;
        this.taken = taken;
        this.status = status;
    }
}
