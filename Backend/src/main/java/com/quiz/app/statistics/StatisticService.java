package com.quiz.app.statistics;


import com.quiz.app.creditClass.CreditClassRepository;
import com.quiz.app.exam.ExamRepository;
import com.quiz.app.exception.NotFoundException;
import com.quiz.app.question.QuestionRepository;
import com.quiz.app.statistics.dto.CountQuestionsByChapterDTO;
import com.quiz.app.statistics.dto.CountTestsBySubjectAndStatus;
import com.quiz.app.statistics.dto.CountTotalDTO;
import com.quiz.app.statistics.dto.DoughnutChartDTO;
import com.quiz.app.statistics.dto.QuestionsByChapterDTO;
import com.quiz.app.subject.SubjectService;
import com.quiz.app.test.TestRepository;
import com.quiz.app.user.UserRepository;
import com.quiz.entity.Chapter;
import com.quiz.entity.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class StatisticService {
    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private CreditClassRepository creditClassRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TestRepository testRepository;

    @Autowired
    private SubjectService subjectService;

    @Autowired
    private QuestionRepository questionRepository;

    public CountTotalDTO count() {
        CountTotalDTO countTotalDTO = new CountTotalDTO();

        Integer totalExams = examRepository.countTotalExams();
        Integer totalExamsUsed = examRepository.countTotalExamsUsed();
        Integer totalExamsNotUsed = examRepository.countTotalExamsNotUsed();
        Integer totalExamsCancelled = examRepository.countTotalExamsCancelled();

        Integer totalCreditClasses = creditClassRepository.countTotalCreditClasses();
        Integer totalCreditClassesOpened = creditClassRepository.countTotalCreditClassesOpened();
        Integer totalCreditClassesClosed = creditClassRepository.countTotalCreditClassesClosed();

        Integer totalUsers = userRepository.countAllUsers();
        Integer totalUsersAdmin = userRepository.countAllUsersAdmin();
        Integer totalUsersTeacher = userRepository.countAllUsersTeacher();
        Integer totalUsersTeacherAndAdmin = userRepository.countAllUsersTeacherAndAdmin();
        Integer totalUsersStudent = userRepository.countAllUsersStudent();

        Integer totalSubjects = subjectService.countTotalSubjects();

        Integer totalTests = testRepository.countTotalTests();
        Integer totalTestsUsed = testRepository.countTotalTestsUsed();
        Integer totalTestsNotUsed = testRepository.countTotalTestsNotUsed();
        Integer totalTestsCancelled = testRepository.countTotalTestsCancelled();

        Integer totalQuestions = questionRepository.countTotalQuestions();
        Integer totalQuestionsActive = questionRepository.countTotalQuestionsActive();
        Integer totalQuestionsDisabled = questionRepository.countTotalQuestionsDisabled();

        countTotalDTO.setTotalExams(totalExams);
        countTotalDTO.setTotalExamsUsed(totalExamsUsed);
        countTotalDTO.setTotalExamsNotUsed(totalExamsNotUsed);
        countTotalDTO.setTotalExamsCancelled(totalExamsCancelled);

        countTotalDTO.setTotalUsers(totalUsers);
        countTotalDTO.setTotalUsersAdmin(totalUsersAdmin);
        countTotalDTO.setTotalUsersTeacher(totalUsersTeacher);
        countTotalDTO.setTotalUsersTeacherAndAdmin(totalUsersTeacherAndAdmin);
        countTotalDTO.setTotalUsersStudent(totalUsersStudent);

        countTotalDTO.setTotalCreditClasses(totalCreditClasses);
        countTotalDTO.setTotalCreditClassesOpened(totalCreditClassesOpened);
        countTotalDTO.setTotalCreditClassesClosed(totalCreditClassesClosed);

        countTotalDTO.setTotalSubjects(totalSubjects);

        countTotalDTO.setTotalTests(totalTests);
        countTotalDTO.setTotalTestsUsed(totalTestsUsed);
        countTotalDTO.setTotalTestsNotUsed(totalTestsNotUsed);
        countTotalDTO.setTotalTestsCancelled(totalTestsCancelled);

        countTotalDTO.setTotalQuestions(totalQuestions);
        countTotalDTO.setTotalQuestionsActive(totalQuestionsActive);
        countTotalDTO.setTotalQuestionsDisabled(totalQuestionsDisabled);


        return countTotalDTO;
    }

    public List<QuestionsByChapterDTO> countQuestionsByChapter(String subjectId) throws NotFoundException {
        Subject subject = subjectService.findById(subjectId);

        List<CountQuestionsByChapterDTO> easyQuestions =
                questionRepository.countQuestionsByChapter(subjectId, 0);
        List<CountQuestionsByChapterDTO> mediumQuestions =
                questionRepository.countQuestionsByChapter(subjectId, 1);
        List<CountQuestionsByChapterDTO> hardQuestions =
                questionRepository.countQuestionsByChapter(subjectId, 2);

        List<QuestionsByChapterDTO> questionsByChapterDTOS = new ArrayList<>();
        for (Chapter chapter : subject.getChapters()) {
            QuestionsByChapterDTO questionsByChapterDTO = new QuestionsByChapterDTO();
            questionsByChapterDTO.setChapterName(chapter.getName());
            for (CountQuestionsByChapterDTO countQuestionsByChapterDTO : easyQuestions) {
                if (chapter.getId().equals(countQuestionsByChapterDTO.getChapterId())) {
                    questionsByChapterDTO.setNumberOfEasyQuestions(countQuestionsByChapterDTO.getNumberOfQuestions());
                }
            }

            for (CountQuestionsByChapterDTO countQuestionsByChapterDTO : mediumQuestions) {
                if (chapter.getId().equals(countQuestionsByChapterDTO.getChapterId())) {
                    questionsByChapterDTO.setNumberOfMediumQuestions(countQuestionsByChapterDTO.getNumberOfQuestions());
                }
            }

            for (CountQuestionsByChapterDTO countQuestionsByChapterDTO : hardQuestions) {
                if (chapter.getId().equals(countQuestionsByChapterDTO.getChapterId())) {
                    questionsByChapterDTO.setNumberOfHardQuestions(countQuestionsByChapterDTO.getNumberOfQuestions());
                }

            }
            questionsByChapterDTOS.add(questionsByChapterDTO);
        }
        return questionsByChapterDTOS;
    }

    public DoughnutChartDTO doughnut() {
        return new DoughnutChartDTO(questionRepository.countQuestionsBySubject(),
                examRepository.countExamByCreditClass()
        );
    }

    public List<CountTestsBySubjectAndStatus> countTestsBySubjectAndStatus() {
        return testRepository.countTestBySubjectAndStatus();
    }
}