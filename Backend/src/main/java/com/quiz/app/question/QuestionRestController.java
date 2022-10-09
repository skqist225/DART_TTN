package com.quiz.app.question;

import com.quiz.app.exception.ConstrainstViolationException;
import com.quiz.app.exception.NotFoundException;
import com.quiz.app.question.dto.PostCreateQuestionDTO;
import com.quiz.app.question.dto.QuestionsDTO;
import com.quiz.app.response.StandardJSONResponse;
import com.quiz.app.response.error.BadResponse;
import com.quiz.app.response.success.OkResponse;
import com.quiz.app.security.UserDetailsImpl;
import com.quiz.app.subject.dto.SubjectsDTO;
import com.quiz.app.utils.ProcessImage;
import com.quiz.entity.Question;
import com.quiz.entity.Subject;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.query.QueryUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Expression;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;


@RestController
@RequestMapping("/api/questions")
public class QuestionRestController {
    public final String DEV_STATIC_DIR = "src/main/resources/static/question_images";
    public final String PROD_STATIC_DIR = "/opt/tomcat/webapps/ROOT/WEB-INF/classes/static/question_images";
    public final String PROD_STATIC_PATH = "static/question_images";

    @Value("${env}")
    private String environment;

    @Autowired
    private QuestionService questionService;

    @GetMapping("")
    public ResponseEntity<StandardJSONResponse<QuestionsDTO>> fetchAllSubjects(
            @RequestParam("page") String page,
            @RequestParam(name = "query", required = false, defaultValue = "") String query,
            @RequestParam(name = "sortDir", required = false, defaultValue = "desc") String sortDir,
            @RequestParam(name = "sortField", required = false, defaultValue = "id") String sortField
    ) {
        Map<String, String> filters = new HashMap<>();
        filters.put("page",page);
        filters.put("query", query);
        filters.put("sortDir", sortDir);
        filters.put("sortField", sortField);

        QuestionsDTO questionsDTO = new QuestionsDTO();

        Page<Question> questionPage =  questionService.findAllQuestions(filters);

        questionsDTO.setQuestions(questionPage.getContent());
        questionsDTO.setTotalElements(questionPage.getTotalElements());
        questionsDTO.setTotalPages(questionPage.getTotalPages());

        return new OkResponse<>(questionsDTO).response();
    }

    @PostMapping("save")
    public ResponseEntity<StandardJSONResponse<Question>> fetchCitiesByState(
            @AuthenticationPrincipal UserDetailsImpl userDetailsImpl,
            @ModelAttribute PostCreateQuestionDTO postCreateQuestionDTO) throws IOException {
        Integer id = postCreateQuestionDTO.getId();
        Question savedQuestion = null;

        if (
            Objects.isNull(postCreateQuestionDTO.getContent()) ||
            Objects.isNull(postCreateQuestionDTO.getAnswerA()) ||
            Objects.isNull(postCreateQuestionDTO.getAnswerB()) ||
            Objects.isNull(postCreateQuestionDTO.getAnswerC()) ||
            Objects.isNull(postCreateQuestionDTO.getAnswerD()) ||
            Objects.isNull(postCreateQuestionDTO.getFinalAnswer()) ||
            Objects.isNull(postCreateQuestionDTO.getLevel())
        ) {
            return new BadResponse<Question>("Vui lòng không để trống các câu trả lời và mức độ câu hỏi").response();
        }

        if (Objects.nonNull(id)) {
            if (questionService.checkContentDuplicated(id, postCreateQuestionDTO.getContent()).equals("Duplicated")) {
                return new BadResponse<Question>("Nội dung câu hỏi là duy nhất").response();
            }

            try {
                Question question = questionService.findById(id);
                question.setContent(postCreateQuestionDTO.getContent());
                question.setAnswerA(postCreateQuestionDTO.getAnswerA());
                question.setAnswerB(postCreateQuestionDTO.getAnswerB());
                question.setAnswerC(postCreateQuestionDTO.getAnswerC());
                question.setAnswerD(postCreateQuestionDTO.getAnswerD());
                question.setFinalAnswer(postCreateQuestionDTO.getFinalAnswer());
                question.setLevel(postCreateQuestionDTO.getLevel());

                if(postCreateQuestionDTO.getImage() != null) {
                    question.setImage(postCreateQuestionDTO.getImage().getOriginalFilename());
                }

                savedQuestion = questionService.save(question);

            }catch(NotFoundException exception) {
                return new BadResponse<Question>(exception.getMessage()).response();
            }
        } else {
            savedQuestion = questionService.save(Question.build(postCreateQuestionDTO, userDetailsImpl.getUser()));
        }

        if (postCreateQuestionDTO.getImage() != null) {
            String devUploadDir = String.format("%s/%s/", DEV_STATIC_DIR, savedQuestion.getId());
            String prodUploadDir = String.format("%s/%s/", PROD_STATIC_DIR, savedQuestion.getId());
            String staticPath = String.format("%s/%s/", PROD_STATIC_PATH, savedQuestion.getId());
            ProcessImage.uploadImage(devUploadDir, prodUploadDir, staticPath, postCreateQuestionDTO.getImage(), environment);
        }

        return new OkResponse<>(savedQuestion).response();
    }

    @DeleteMapping("{id}/delete")
    public ResponseEntity<StandardJSONResponse<String>> delete(@PathVariable("id") Integer id) {
        try {
            return new OkResponse<>(questionService.deleteById(id)).response();
        } catch (ConstrainstViolationException ex) {
            return new BadResponse<String>(ex.getMessage()).response();
        }
    }


}
