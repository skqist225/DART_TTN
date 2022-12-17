package com.quiz.app.takeExamDetail;

import com.quiz.app.takeExam.TakeExamRepository;
import com.quiz.entity.Question;
import com.quiz.entity.TakeExamDetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;


@Service
public class TakeExamDetailService {

    @Autowired
    private TakeExamDetailRepository takeExamDetailRepository;

    @Autowired
    private TakeExamRepository takeExamRepository;

    public TakeExamDetail save(TakeExamDetail takeExamDetail) {
        return takeExamDetailRepository.save(takeExamDetail);
    }

    public void saveAll(List<TakeExamDetail> takeExamDetails) {
        takeExamDetailRepository.saveAll(takeExamDetails);
    }

    public List<TakeExamDetail> findByStudentAndExam(String studentId, Integer examId) {
        return takeExamDetailRepository.findByStudentAndExam(studentId, examId);
    }

    @Transactional
    public void updateAnswerForQuestionInStudentTest(String userAnswer, String studentId,
                                                     Integer examId,
                                                     Integer questionId
    ) {
        takeExamDetailRepository.updateAnswerForQuestionInStudentTest(userAnswer, studentId,
                examId, questionId
        );
    }

    @Transactional
    public void insertIntoTakeExamDetail(Integer questionId, int tryTime, int examId, int creditClassId,
                                         String studentId) {
        takeExamDetailRepository.insertIntoTakeExamDetail(questionId, tryTime, examId,
                creditClassId, studentId);
    }

    @Transactional
    public void updateTakeExamDetail(List<Question> questions, int tryTime, int examId,
                                     int creditClassId,
                                     String studentId, int testId) {
        takeExamRepository.updateTakeExamTest(examId,
                creditClassId, studentId, testId, tryTime);
        takeExamDetailRepository.deleteTakeExamDetail(examId,
                creditClassId, studentId, tryTime);

        for (Question question : questions) {
            insertIntoTakeExamDetail(question.getId(), tryTime, examId,
                    creditClassId,
                    studentId);
        }
    }
}
