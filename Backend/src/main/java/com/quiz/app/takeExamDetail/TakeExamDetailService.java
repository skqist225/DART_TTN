package com.quiz.app.takeExamDetail;

import com.quiz.entity.TakeExamDetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.transaction.Transactional;
import java.util.List;


@Service
public class TakeExamDetailService {

    @Autowired
    private TakeExamDetailRepository takeExamDetailRepository;

    @Autowired
    private EntityManager entityManager;

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
    public void updateAnswerForQuestionInStudentTest(String studentId, Integer examId,
                                                     Integer questionId,
                                                     String userAnswer) {
        takeExamDetailRepository.updateAnswerForQuestionInStudentTest(studentId, examId, questionId
                , userAnswer);
    }

    @Transactional
    public void insertIntoTakeExamDetail(Integer questionId, int tryTime, int examId, int creditClassId,
                                         String studentId) {
        takeExamDetailRepository.insertIntoTakeExamDetail(questionId, tryTime, examId,
                creditClassId, studentId);
    }
}
