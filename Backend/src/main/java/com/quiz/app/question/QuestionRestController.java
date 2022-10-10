package com.quiz.app.question;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.quiz.app.exception.ConstrainstViolationException;
import com.quiz.app.exception.NotFoundException;
import com.quiz.app.question.dto.PostCreateQuestionDTO;
import com.quiz.app.question.dto.QuestionsDTO;
import com.quiz.app.response.StandardJSONResponse;
import com.quiz.app.response.error.BadResponse;
import com.quiz.app.response.success.OkResponse;
import com.quiz.app.subject.SubjectService;
import com.quiz.app.utils.ProcessImage;
import com.quiz.entity.Level;
import com.quiz.entity.Question;
import com.quiz.entity.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.HashMap;
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

    @Autowired
    private SubjectService subjectService;

    @Autowired
    private ObjectMapper objectMapper;

    private ArrayNode arrayNode;

    public void addError(String fieldName, String fieldError) {
        ObjectNode node = objectMapper.createObjectNode();
        node.put(fieldName, fieldError);
        arrayNode.add(node);
    }

    @GetMapping("")
    public ResponseEntity<StandardJSONResponse<QuestionsDTO>> fetchAllSubjects(
            @RequestParam("page") String page,
            @RequestParam(name = "query", required = false, defaultValue = "") String query,
            @RequestParam(name = "sortDir", required = false, defaultValue = "desc") String sortDir,
            @RequestParam(name = "sortField", required = false, defaultValue = "id") String sortField
    ) {
        Map<String, String> filters = new HashMap<>();
        filters.put("page", page);
        filters.put("query", query);
        filters.put("sortDir", sortDir);
        filters.put("sortField", sortField);

        QuestionsDTO questionsDTO = new QuestionsDTO();

        Page<Question> questionPage = questionService.findAllQuestions(filters);

        questionsDTO.setQuestions(questionPage.getContent());
        questionsDTO.setTotalElements(questionPage.getTotalElements());
        questionsDTO.setTotalPages(questionPage.getTotalPages());

        return new OkResponse<>(questionsDTO).response();
    }

    public void catchQuestionInputException(String content, String answerA, String answerB, String answerC,
                                            String answerD, String finalAnswer, Level level
    ) {

        if (Objects.isNull(content)) {
            addError("content", "Nội dung câu hỏi không được để trống");
        }

        if (Objects.isNull(answerA)) {
            addError("A", "Đáp án A không được để trống");
        }

        if (Objects.isNull(answerB)) {
            addError("B", "Đáp án B không được để trống");
        }

        if (Objects.isNull(answerC)) {
            addError("C", "Đáp án C không được để trống");
        }

        if (Objects.isNull(answerD)) {
            addError("D", "Đáp án D không được để trống");
        }

        if (Objects.isNull(finalAnswer)) {
            addError("finalAnswer", "Đáp án không được để trống");
        }

        if (Objects.isNull(level)) {
            addError("level", "Mức độ không được để trống");
        }


    }

    @PostMapping("save")
    public ResponseEntity<StandardJSONResponse<Question>> fetchCitiesByState(
//            @AuthenticationPrincipal UserDetailsImpl userDetailsImpl,
            @ModelAttribute PostCreateQuestionDTO postCreateQuestionDTO,
            @RequestParam(name = "isEdit", required = false, defaultValue = "false") boolean isEdit) throws IOException {
        arrayNode = objectMapper.createArrayNode();
//        User teacher = userDetailsImpl.getUser();
        Question savedQuestion = null;
        Subject subject = null;

        Integer id = postCreateQuestionDTO.getId();
        String content = postCreateQuestionDTO.getContent();
        String answerA = postCreateQuestionDTO.getAnswerA();
        String answerB = postCreateQuestionDTO.getAnswerB();
        String answerC = postCreateQuestionDTO.getAnswerC();
        String answerD = postCreateQuestionDTO.getAnswerD();
        String finalAnswer = postCreateQuestionDTO.getFinalAnswer();
        String subjectId = postCreateQuestionDTO.getSubjectId();
        Level level = postCreateQuestionDTO.getLevel();

        catchQuestionInputException(content, answerA, answerB, answerC, answerD, finalAnswer, level);

        try {
            subject = subjectService.findById(subjectId);
        } catch (NotFoundException e) {
            addError("subject", "Môn học không được để trống");
        }

        if (arrayNode.size() > 0) {
            return new BadResponse<Question>(arrayNode.toString()).response();
        } else {
            if (questionService.isContentDuplicated(id, content, isEdit)) {
                addError("content", "Nội dung câu hỏi đã tồn tại");
            }

            if (arrayNode.size() > 0) {
                return new BadResponse<Question>(arrayNode.toString()).response();
            }
        }

        if (Objects.nonNull(id)) {
            try {
                Question question = questionService.findById(id);
                question.setContent(content);
                question.setAnswerA(answerA);
                question.setAnswerB(answerB);
                question.setAnswerC(answerC);
                question.setAnswerD(answerD);
                question.setFinalAnswer(finalAnswer);
                question.setLevel(level);
                question.setSubject(subject);
//                question.setTeacher(teacher);

                if (postCreateQuestionDTO.getImage() != null) {
                    question.setImage(postCreateQuestionDTO.getImage().getOriginalFilename());
                }

                savedQuestion = questionService.save(question);

            }catch(NotFoundException exception) {
                addError("id", exception.getMessage());
                return new BadResponse<Question>(arrayNode.toString()).response();
            }
        } else {
//            savedQuestion = questionService.save(Question.build(postCreateQuestionDTO,
//                    userDetailsImpl.getUser(), subject));
            savedQuestion = questionService.save(Question.build(postCreateQuestionDTO, subject));
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
