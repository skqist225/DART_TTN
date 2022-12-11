package com.quiz.app.statistics;


import com.quiz.app.creditClass.CreditClassRepository;
import com.quiz.app.creditClass.CreditClassService;
import com.quiz.app.exam.ExamRepository;
import com.quiz.app.question.QuestionService;
import com.quiz.app.statistics.dto.CountExamByCreditClassDTO;
import com.quiz.app.statistics.dto.CountQuestionsBySubjectDTO;
import com.quiz.app.statistics.dto.CountTestsBySubjectAndStatus;
import com.quiz.app.statistics.dto.CountTotalDTO;
import com.quiz.app.statistics.dto.DoughnutChartDTO;
import com.quiz.app.subject.SubjectService;
import com.quiz.app.test.TestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StatisticService {
    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private CreditClassRepository creditClassRepository;

    @Autowired
    private TestService testService;

    @Autowired
    private SubjectService subjectService;

    @Autowired
    private QuestionService questionService;

    public CountTotalDTO count() {
        CountTotalDTO countTotalDTO = new CountTotalDTO();

        int totalExams = examRepository.countTotalExams();
        int totalExamsUsed = examRepository.countTotalExamsUsed();
        int totalExamsNotUsed = examRepository.countTotalExamsNotUsed();
        int totalExamsCancelled = examRepository.countTotalExamsCancelled();

        int totalCreditClasses = creditClassRepository.countTotalCreditClasses();
        int totalCreditClassesOpened = creditClassRepository.countTotalCreditClassesOpened();
        int totalCreditClassesClosed = creditClassRepository.countTotalCreditClassesClosed();

        int totalSubjects = subjectService.countTotalSubjects();
        int totalTests = testService.countTotalTests();
        int totalQuestions = questionService.countTotalQuestions();

        countTotalDTO.setTotalExams(totalExams);
        countTotalDTO.setTotalExamsUsed(totalExamsUsed);
        countTotalDTO.setTotalExamsNotUsed(totalExamsNotUsed);
        countTotalDTO.setTotalExamsCancelled(totalExamsCancelled);

        countTotalDTO.setTotalCreditClasses(totalCreditClasses);
        countTotalDTO.setTotalCreditClassesClosed(totalCreditClassesOpened);
        countTotalDTO.setTotalCreditClassesClosed(totalCreditClassesClosed);

        countTotalDTO.setTotalSubjects(totalSubjects);
        countTotalDTO.setTotalTests(totalTests);
        countTotalDTO.setTotalQuestions(totalQuestions);


        return countTotalDTO;
    }

    public List<CountQuestionsBySubjectDTO> countQuestionsBySubject() {
        return subjectService.countQuestionsBySubject();
    }

    public List<CountExamByCreditClassDTO> countExamByCreditClass() {
        return examRepository.countExamByCreditClass();
    }

    public DoughnutChartDTO doughnut() {
        return new DoughnutChartDTO(countQuestionsBySubject(), countExamByCreditClass());
    }

    public List<CountTestsBySubjectAndStatus> countTestsBySubjectAndStatus() {
        return testService.countTestBySubjectAndStatus();
    }
}