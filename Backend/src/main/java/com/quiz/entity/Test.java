package com.quiz.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.quiz.app.test.dto.CriteriaDTO;
import com.quiz.app.test.dto.CriteriaSubDTO;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

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
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

@AllArgsConstructor
@NoArgsConstructor
@Getter()
@Setter
@Builder
@Entity
@Table(name = "DETHI")
public class Test {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MADETHI")
    private Integer id;

    @Column(name = "TENDETHI", nullable = false, unique = true)
    private String name;

    @Getter(AccessLevel.NONE)
    @Builder.Default
    @JsonIgnore
    @ManyToMany
    @JoinTable(name = "DETHI_CAUHOI", joinColumns = @JoinColumn(name = "MADETHI"),
            inverseJoinColumns = @JoinColumn(name = "MACAUHOI"))
    private List<Question> questions = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "MAMH")
    private Subject subject;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "MAGV")
    private User teacher;

    @ManyToOne
    @JoinColumn(name = "MACATHI")
    private Exam exam;

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "TAOLUC", updatable = false, nullable = false)
    private Date createdDate;

    @UpdateTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "CAPNHATLUC")
    private Date updatedDate;

    public void addQuestion(Question question) {
        this.questions.add(question);
    }

    public void removeQuestion(Question question) {
        this.questions.remove(question);
    }

    public static Test build(String name, List<Question> questions, Subject subject,
                             User teacher) {
        return Test.builder().name(name).questions(questions).subject(subject).teacher(teacher).build();
    }


    @Transient
    public List<Question> getQuestions() {
        this.questions.sort(Comparator.comparing(Question::getId));
        return this.questions;
    }

    public String getTeacherName() {
        return String.format("%s %s", this.getTeacher().getFirstName(), this.getTeacher().getLastName());
    }

    public int getNumberOfQuestions() {
        return this.questions.size();
    }

    public String getStatus() {
        return this.exam == null ? "Chưa sử dụng" : "Đã được sử dụng";
    }

    public List<CriteriaDTO> getCriteria() {
        TreeMap<String, Integer> crMap = new TreeMap<>();

        for (Question question : this.questions) {
            String mapKey = String.format("%s##%s", question.getChapter().getName(),
                    question.getLevel());
            if (crMap.containsKey(mapKey)) {
                crMap.put(mapKey, crMap.get(mapKey) + 1);
            } else {
                crMap.put(mapKey, 1);
            }
        }

        TreeMap<String, List<CriteriaSubDTO>> crMap2 = new TreeMap<>();
        for (Map.Entry<String, Integer> entry : crMap.entrySet()) {
            String chapter = entry.getKey().split("##")[0];
            String level = entry.getKey().split("##")[1];
            int numberOfQuestions = entry.getValue();

            List<CriteriaSubDTO> criteriaSubDTOS;
            if (crMap2.containsKey(chapter)) {
                criteriaSubDTOS = crMap2.get(chapter);
            } else {
                criteriaSubDTOS = new ArrayList<>();
            }
            criteriaSubDTOS.add(new CriteriaSubDTO(level, numberOfQuestions));
            crMap2.put(chapter, criteriaSubDTOS);
        }

        return crMap2.entrySet().stream().map(entry -> new CriteriaDTO(entry.getKey(),
                entry.getValue())).collect(Collectors.toList());

    }

    public String getSubjectName() {
        return this.subject.getName();
    }

    public Test(Integer id) {
        this.id = id;
    }
}
