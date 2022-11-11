package com.quiz.entity;

import com.quiz.app.question.dto.PostCreateQuestionDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import javax.persistence.CascadeType;
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
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "CAUHOI")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MACAUHOI")
    private Integer id;

    @Column(name = "LOAICAUHOI")
    private String type;

    @Column(name = "NOIDUNGCAUHOI", columnDefinition = "TEXT", nullable = false, unique = true)
    private String content;

    @OneToMany(mappedBy = "question", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<Answer> answers;

    @Column(name = "DOKHO", nullable = false)
    private Level level;

    @Column(name = "HINHANH")
    private String image;

    @ManyToOne
    @JoinColumn(name = "MACHUONG", nullable = false)
    private Chapter chapter;

    @ManyToOne
    @JoinColumn(name = "MAGV", nullable = false)
    private User teacher;

    private boolean status;

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

    @Transient
    public List<Answer> getAnswers() {
        this.answers.sort(Comparator.comparing(Answer::getContent));
        return this.answers;
    }

    public static Question build(PostCreateQuestionDTO postCreateQuestionDTO, User teacher,
            Chapter chapter) {

        Question question = Question.builder()
                .content(postCreateQuestionDTO.getContent())
                .type(postCreateQuestionDTO.getType())
                .level(lookUpLevel(postCreateQuestionDTO.getLevel()))
                .chapter(chapter)
                .teacher(teacher)
                .status(true)
                .build();

        if (postCreateQuestionDTO.getAnswers().size() > 0) {
            question.setAnswers(postCreateQuestionDTO.getAnswers().stream().map(
                    answer -> Answer.build(answer.getContent(), answer.getIsAnswer())).collect(Collectors.toList()));
        }

        if (postCreateQuestionDTO.getImage() != null) {
            question.setImage(postCreateQuestionDTO.getImage().getOriginalFilename());
        }

        return question;
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

    public Level getLevel() {
        return level;
    }

    public void setLevel(Level level) {
        this.level = level;
    }

    public String getImage() {
        return image;
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
}
