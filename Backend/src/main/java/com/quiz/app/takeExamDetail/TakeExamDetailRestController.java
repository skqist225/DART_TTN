package com.quiz.app.takeExamDetail;

import com.quiz.app.exam.ExamService;
import com.quiz.app.exception.NotFoundException;
import com.quiz.app.response.StandardJSONResponse;
import com.quiz.app.response.success.OkResponse;
import com.quiz.app.test.dto.HandInDTO;
import com.quiz.app.test.dto.TestDTO;
import com.quiz.entity.Answer;
import com.quiz.entity.Exam;
import com.quiz.entity.Question;
import com.quiz.entity.TakeExamDetail;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/takeExamDetails")
public class TakeExamDetailRestController {
    @Autowired
    private TakeExamDetailService takeExamDetailService;

    @Autowired
    private ExamService examService;

    @GetMapping("findByStudentAndExam")
    public ResponseEntity<StandardJSONResponse<TestDTO>> findByStudentAndExam(
            @RequestParam("studentId") String studentId,
            @RequestParam("examId") Integer examId
    ) throws NotFoundException {
        int numberOfRightAnswer = 0;
        float mark = 0;
        List<TakeExamDetail> takeExamDetails =
                takeExamDetailService.findByStudentAndExam(studentId, examId);

        List<HandInDTO> answers = takeExamDetails.stream()
                .map(takeExamDetail -> new HandInDTO(takeExamDetail.getQuestion().getId(),
                        takeExamDetail.getAnswer()))
                .collect(Collectors.toList());

        List<Question> questions = new ArrayList<>();
        for (TakeExamDetail detail : takeExamDetails) {
            Question question = detail.getQuestion();
            StringBuilder finalAnswer = new StringBuilder();

            if (question.getType().equals("Một đáp án")) {
                for (Answer ans : question.getAnswers()) {
                    if (ans.isAnswer()) {
                        finalAnswer = new StringBuilder(ans.getOrder());
                    }
                }
            } else if (question.getType().equals("Nhiều đáp án")) {
                int k = 0;
                for (Answer ans : question.getAnswers()) {
                    if (ans.isAnswer()) {
                        if (k > 0) {
                            finalAnswer.append(",").append(ans.getOrder());
                        } else {
                            finalAnswer.append(ans.getOrder());
                        }
                        k++;
                    }
                }
            } else {
                finalAnswer = new StringBuilder(question.getAnswers().get(0).getContent());
            }

            for (HandInDTO handInDTO : answers) {
                if (handInDTO.getQuestionId().equals(question.getId())) {

                    String userFinalAnswer = handInDTO.getAnswer();

                    if (Objects.nonNull(userFinalAnswer) && !StringUtils.isEmpty(
                            userFinalAnswer
                    )) {
                        if (question.getType().equals("Nhiều đáp án")) {
                            String[] userFinalAnswerArr = handInDTO.getAnswer().split(",");
                            Arrays.sort(userFinalAnswerArr);
                            userFinalAnswer = String.join(",", userFinalAnswerArr);
                        }

                        if (finalAnswer.toString().toLowerCase().trim().equals(userFinalAnswer.toLowerCase().trim())) {
                            numberOfRightAnswer++;
                        }
                    } else {
                        userFinalAnswer = "";
                    }

                    question.setSelectedAnswer(userFinalAnswer);
                }
            }
            question.setFinalAnswer(finalAnswer.toString());
            questions.add(question);
        }
        DecimalFormat df = new DecimalFormat("#.#");
        mark = (float) numberOfRightAnswer / takeExamDetails.size() * 10;
        TestDTO testDTO = new TestDTO();
        testDTO.setMark(Float.parseFloat(df.format(mark)));
        testDTO.setNumberOfQuestions(questions.size());
        testDTO.setNumberOfRightAnswer(numberOfRightAnswer);
        testDTO.setQuestions(questions);

        Exam exam = examService.findById(examId);
        testDTO.setSubjectName(exam.getSubjectName());
        testDTO.setExamType(exam.getType());
        testDTO.setExamDate(exam.getExamDate());
        testDTO.setNoticePeriod(exam.getNoticePeriod());
        testDTO.setExamTime(exam.getTime());


        return new OkResponse<>(testDTO).response();
    }



}
