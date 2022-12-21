package com.quiz.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.quiz.app.question.dto.PostCreateQuestionDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.apache.commons.lang.StringUtils;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode
@Entity
@Table(name = "CAUHOI")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MACAUHOI")
    private Integer id;

    @Column(name = "LOAICAUHOI", columnDefinition = "VARCHAR(20)", nullable = false)
    private String type;

    @Column(name = "NOIDUNGCAUHOI", columnDefinition = "TEXT", nullable = false, unique = true)
    private String content;

    @Builder.Default
    @OneToMany(mappedBy = "question", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<Answer> answers = new ArrayList<>();

    @Column(name = "DOKHO", columnDefinition = "TINYINT(2)", nullable = false)
    private Level level;

    @Column(name = "HINHANH")
    private String image;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "MACHUONG", nullable = false)
    private Chapter chapter;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "MAGV", nullable = false)
    private User teacher;

    @Column(name = "CONSUDUNG", columnDefinition = "BOOLEAN DEFAULT TRUE")
    private boolean status;

    //    @JsonIgnore
    @ManyToMany(mappedBy = "questions")
    private List<Test> tests = new ArrayList<>();

    @Transient
    public void removeAll() {
        this.answers.clear();
    }

    @Transient
    private String finalAnswer;

    @Transient
    private String selectedAnswer;

    @Transient
    public void removeAnswer(Answer answer) {
        this.answers.remove(answer);
    }

    @Transient
    public void addAnswer(Answer answer) {
        this.answers.add(answer);
    }

    public static Question build(PostCreateQuestionDTO postCreateQuestionDTO, User teacher,
                                 Chapter chapter, boolean addAnswer) {
        Question question = Question.builder()
                .content(postCreateQuestionDTO.getContent())
                .type(postCreateQuestionDTO.getType())
                .level(lookUpLevel(postCreateQuestionDTO.getLevel()))
                .chapter(chapter)
                .teacher(teacher)
                .status(true)
                .build();

        if (addAnswer && postCreateQuestionDTO.getAnswers().size() > 0) {
            question.setAnswers(postCreateQuestionDTO.getAnswers().stream().map(
                            answer -> Answer.build(answer.getContent(), answer.isAnswer(), question,
                                    answer.getOrder()))
                    .collect(Collectors.toList()));
        }

        if (postCreateQuestionDTO.getImage() != null) {
            question.setImage(postCreateQuestionDTO.getImage().getOriginalFilename());
        }

        return question;
    }

    @Transient
    public List<Answer> getAnswers() {
        this.answers.sort(Comparator.comparing(Answer::getOrder));
        return this.answers;
    }

    @Transient
    public boolean getShouldEdit() {
        for (Test test : tests) {
            // Questions that belongs to a used test should not be deleted or edited
            if (Objects.nonNull(test.getExam())) {
                return false;
            }
        }

        return true;
    }

    public static Level lookUpLevel(String levelStr) {
        Level level = Level.EASY;
        if (Objects.equals(levelStr, "Khó")) {
            level = Level.HARD;
        } else if (Objects.equals(levelStr, "Trung bình")) {
            level = Level.MEDIUM;
        }

        return level;
    }

    public static Level lookUpLevelOrig(String levelStr) {
        Level level = Level.EASY;
        if (Objects.equals(levelStr, "MEDIUM")) {
            level = Level.MEDIUM;
        } else if (Objects.equals(levelStr, "HARD")) {
            level = Level.HARD;
        }

        return level;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getLevel() {
        String levelStr = null;
        if (level.equals(Level.EASY)) {
            levelStr = "Dễ";
        } else if (level.equals(Level.MEDIUM)) {
            levelStr = "Trung bình";
        } else {
            levelStr = "Khó";
        }

        return levelStr;
    }

    public void setLevel(Level level) {
        this.level = level;
    }

    public String getImage() {
        if (Objects.nonNull(this.image) || !StringUtils.isEmpty(this.image)) {
            return String.format("/question_images/%s/%s", this.id, this.image);
        }

        return this.image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Chapter getChapter() {
        return chapter;
    }

    public void setChapter(Chapter chapter) {
        this.chapter = chapter;
    }

    public User getTeacher() {
        return teacher;
    }

    public void setTeacher(User teacher) {
        this.teacher = teacher;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public String getSelectedAnswer() {
        return selectedAnswer;
    }

    public void setSelectedAnswer(String selectedAnswer) {
        this.selectedAnswer = selectedAnswer;
    }

    public void setAnswers(List<Answer> answers) {
        this.answers = answers;
    }

    public String getFinalAnswer() {
        return finalAnswer;
    }

    public void setFinalAnswer(String finalAnswer) {
        this.finalAnswer = finalAnswer;
    }

    @Transient
    public String getTeacherId() {
        return this.teacher.getId();
    }

    @Transient
    public String getTeacherName() {
        return this.teacher.getFullName();
    }

    @Transient
    public String getChapterName() {
        return this.chapter.getName();
    }

    @Transient
    public String getSubjectId() {
        return this.chapter.getSubject().getId();
    }

    @Transient
    public Integer getChapterId() {
        return this.chapter.getId();
    }

    @Transient
    public String getSubjectName() {
        return this.chapter.getSubject().getName();
    }

    public Question(Integer id) {
        this.id = id;
    }
}
