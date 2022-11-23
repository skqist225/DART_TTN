package com.quiz.app.statistics;


import com.quiz.app.creditClass.CreditClassService;
import com.quiz.app.exam.ExamService;
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
    private ExamService examService;

    @Autowired
    private CreditClassService creditClassService;

    @Autowired
    private TestService testService;

    @Autowired
    private SubjectService subjectService;

    @Autowired
    private QuestionService questionService;

    public CountTotalDTO count() {
        int totalExams = examService.countTotalExams();
        int totalCreditClasses = creditClassService.countTotalCreditClasses();
        int totalSubjects = subjectService.countTotalSubjects();
        int totalTests = testService.countTotalTests();
        int totalQuestions = questionService.countTotalQuestions();

        return new CountTotalDTO(totalExams, totalCreditClasses, totalSubjects, totalTests, totalQuestions);
    }

    public List<CountQuestionsBySubjectDTO> countQuestionsBySubject() {
        return subjectService.countQuestionsBySubject();
    }

    public List<CountExamByCreditClassDTO> countExamByCreditClass() {
        return examService.countExamByCreditClass();
    }

    public DoughnutChartDTO doughnut() {
        return new DoughnutChartDTO(countQuestionsBySubject(), countExamByCreditClass());
    }

    public List<CountTestsBySubjectAndStatus> countTestsBySubjectAndStatus() {
        return testService.countTestBySubjectAndStatus();
    }
}