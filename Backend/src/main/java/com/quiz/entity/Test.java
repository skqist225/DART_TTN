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
    @ManyToMany
    @JoinTable(name = "DETHI_CAUHOI", joinColumns = @JoinColumn(name = "MADETHI"),
            inverseJoinColumns = @JoinColumn(name = "MACAUHOI"))
    private List<Question> questions = new ArrayList<>();

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "MAMH", nullable = false)
    private Subject subject;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "MAGV", nullable = false)
    private User teacher;

    @JsonIgnore
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

    @Column(name = "DASUDUNG", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean used;

    @Column(name = "CONSUDUNG", columnDefinition = "BOOLEAN DEFAULT TRUE")
    private boolean status;

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

    public String getTeacherId() {
        return this.getTeacher().getId();
    }

    public String getTeacherName() {
        return String.format("%s %s", this.getTeacher().getLastName(), this.getTeacher().getFirstName());
    }

    public int getNumberOfQuestions() {
        return this.questions.size();
    }

    public boolean getUsed() {
        return this.exam != null;
    }

    public List<CriteriaDTO> getCriteria() {
        TreeMap<String, Integer> crMap = new TreeMap<>();

        for (Question question : this.questions) {
            String mapKey = String.format("%s##%s##%d", question.getChapter().getName(),
                    question.getLevel(), question.getChapter().getId());
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
            int chapterId = Integer.parseInt(entry.getKey().split("##")[2]);
            int numberOfQuestions = entry.getValue();

            List<CriteriaSubDTO> criteriaSubDTOS;
            if (crMap2.containsKey(chapter)) {
                criteriaSubDTOS = crMap2.get(chapter);
            } else {
                criteriaSubDTOS = new ArrayList<>();
            }
            criteriaSubDTOS.add(new CriteriaSubDTO(level, numberOfQuestions, chapterId));
            crMap2.put(chapter, criteriaSubDTOS);
        }

        return crMap2.entrySet().stream().map(entry -> new CriteriaDTO(entry.getKey(),
                entry.getValue())).collect(Collectors.toList());
    }

    public List<Chapter> getSubjectChapters() {
        List<Chapter> chapters = new ArrayList<>();
        for (Chapter chapter : this.subject.getChapters()) {
            int numberOfEasyQuestions = 0;
            int numberOfMediumQuestions = 0;
            int numberOfHardQuestions = 0;
            for (Question question : chapter.getQuestions()) {
                if (question.getLevel().equals("Dễ")) {
                    numberOfEasyQuestions++;
                } else if (question.getLevel().equals("Trung bình")) {
                    numberOfMediumQuestions++;
                } else {
                    numberOfHardQuestions++;
                }
            }
            chapter.setNumberOfEasyQuestions(numberOfEasyQuestions);
            chapter.setNumberOfMediumQuestions(numberOfMediumQuestions);
            chapter.setNumberOfHardQuestions(numberOfHardQuestions);
            chapters.add(chapter);
        }

        return chapters;
    }

    public String getSubjectName() {
        return this.subject.getName();
    }

    public String getSubjectId() {
        return this.subject.getId();
    }

    public Test(Integer id) {
        this.id = id;
    }
}
