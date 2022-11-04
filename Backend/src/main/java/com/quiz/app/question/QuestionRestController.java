package com.quiz.app.question;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.quiz.app.chapter.ChapterService;
import com.quiz.app.exception.ConstrainstViolationException;
import com.quiz.app.exception.NotFoundException;
import com.quiz.app.question.dto.GetCriteriaQuestionsDTO;
import com.quiz.app.question.dto.PostCreateQuestionDTO;
import com.quiz.app.question.dto.QuestionsDTO;
import com.quiz.app.question.dto.ReadQuestionExcelDTO;
import com.quiz.app.response.StandardJSONResponse;
import com.quiz.app.response.error.BadResponse;
import com.quiz.app.response.success.OkResponse;
import com.quiz.app.security.UserDetailsImpl;
import com.quiz.app.subject.SubjectService;
import com.quiz.app.utils.ExcelUtils;
import com.quiz.app.utils.ProcessImage;
import com.quiz.entity.Chapter;
import com.quiz.entity.Level;
import com.quiz.entity.Question;
import com.quiz.entity.Subject;
import com.quiz.entity.User;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileInputStream;
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

    @Autowired
    private SubjectService subjectService;

    @Autowired
    private ChapterService chapterService;

    @Autowired
    private ObjectMapper objectMapper;

    private ArrayNode arrayNode;

    public void addError(String fieldName, String fieldError) {
        ObjectNode node = objectMapper.createObjectNode();
        node.put(fieldName, fieldError);
        arrayNode.add(node);
    }

    @GetMapping("load")
    public ResponseEntity<StandardJSONResponse<List<GetCriteriaQuestionsDTO>>> loadCriteriaQuestions(
            @RequestParam(name = "criteria", required = false, defaultValue = "") String criteria) {
        if (Objects.nonNull(criteria)) {
            return new OkResponse<>(questionService.findQuestionsByCriteria(criteria)).response();
        }

        return null;
    }

    @GetMapping("")
    public ResponseEntity<StandardJSONResponse<QuestionsDTO<Question>>> fetchAllQuestions(
            @RequestParam("page") String page,
            @RequestParam(name = "query", required = false, defaultValue = "") String query,
            @RequestParam(name = "sortDir", required = false, defaultValue = "desc") String sortDir,
            @RequestParam(name = "sortField", required = false, defaultValue = "id") String sortField,
            @RequestParam(name = "subject", required = false, defaultValue = "") String subjectId,
            @RequestParam(name = "numberOfQuestions", required = false, defaultValue = "") Integer numberOfQuestions
    ) {
        QuestionsDTO<Question> questionsDTO = new QuestionsDTO<>();
        if (page.equals("0")) {
            List<Question> questions = null;
            if (!StringUtils.isEmpty(subjectId)) {
                if (numberOfQuestions > 0) {
                    questions = questionService.findAll(subjectId, numberOfQuestions);
                } else {
                    questions = questionService.findAll(subjectId);
                }
            } else {
                questions = questionService.findAll();
            }
            questionsDTO.setQuestions(questions);
            questionsDTO.setTotalElements(questions.size());
            questionsDTO.setTotalPages(0);
        } else {
            Map<String, String> filters = new HashMap<>();
            filters.put("page", page);
            filters.put("query", query);
            filters.put("sortDir", sortDir);
            filters.put("sortField", sortField);

            Page<Question> questionPage = questionService.findAllQuestions(filters);
            questionsDTO.setQuestions(questionPage.getContent());
            questionsDTO.setTotalElements(questionPage.getTotalElements());
            questionsDTO.setTotalPages(questionPage.getTotalPages());
        }

        return new OkResponse<>(questionsDTO).response();
    }

    public void catchQuestionInputException(String content, String answerA, String answerB, String answerC,
                                            String answerD, String finalAnswer, String level,
                                            Integer chapterId
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

        if (Objects.isNull(chapterId)) {
            addError("chapterId", "Chương không được để trống");
        }
    }

    @PostMapping("save")
    public ResponseEntity<StandardJSONResponse<String>> saveQuestion(
            @AuthenticationPrincipal UserDetailsImpl userDetailsImpl,
            @ModelAttribute PostCreateQuestionDTO postCreateQuestionDTO,
            @RequestParam(name = "isEdit", required = false, defaultValue = "false") boolean isEdit)
            throws IOException {
        arrayNode = objectMapper.createArrayNode();
        User teacher = userDetailsImpl.getUser();
        Question savedQuestion = null;
        Chapter chapter = null;

        Integer id = postCreateQuestionDTO.getId();
        String content = postCreateQuestionDTO.getContent();
        String answerA = postCreateQuestionDTO.getAnswerA();
        String answerB = postCreateQuestionDTO.getAnswerB();
        String answerC = postCreateQuestionDTO.getAnswerC();
        String answerD = postCreateQuestionDTO.getAnswerD();
        String finalAnswer = postCreateQuestionDTO.getFinalAnswer();
        String levelStr = postCreateQuestionDTO.getLevel();
        Integer chapterId = postCreateQuestionDTO.getChapterId();

        catchQuestionInputException(content, answerA, answerB, answerC, answerD, finalAnswer,
                levelStr, chapterId);

        try {
            chapter = chapterService.findById(chapterId);
        } catch (NotFoundException e) {
            addError("chapter", e.getMessage());
        }

        if (arrayNode.size() > 0) {
            return new BadResponse<String>(arrayNode.toString()).response();
        } else {
            if (questionService.isContentDuplicated(id, content, isEdit)) {
                addError("content", "Nội dung câu hỏi đã tồn tại");
            }

            if (arrayNode.size() > 0) {
                return new BadResponse<String>(arrayNode.toString()).response();
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

                Level level = Level.EASY;
                if (Objects.equals(levelStr, "Khó")) {
                    level = Level.HARD;
                } else if (Objects.equals(levelStr, "Trung bình")) {
                    level = Level.MEDIUM;
                }

                question.setLevel(level);
                question.setChapter(chapter);
                question.setTeacher(teacher);

                if (postCreateQuestionDTO.getImage() != null) {
                    question.setImage(postCreateQuestionDTO.getImage().getOriginalFilename());
                }

                savedQuestion = questionService.save(question);

            }catch(NotFoundException exception) {
                addError("id", exception.getMessage());
                return new BadResponse<String>(arrayNode.toString()).response();
            }
        } else {
            savedQuestion = questionService.save(Question.build(postCreateQuestionDTO,
                    userDetailsImpl.getUser(), chapter));
        }

        if (postCreateQuestionDTO.getImage() != null) {
            String devUploadDir = String.format("%s/%s/", DEV_STATIC_DIR, savedQuestion.getId());
            String prodUploadDir = String.format("%s/%s/", PROD_STATIC_DIR, savedQuestion.getId());
            String staticPath = String.format("%s/%s/", PROD_STATIC_PATH, savedQuestion.getId());
            ProcessImage.uploadImage(devUploadDir, prodUploadDir, staticPath, postCreateQuestionDTO.getImage(), environment);
        }

        return new OkResponse<>("Thêm hoặc sửa câu hỏi thành công").response();
    }

    @PostMapping("save/multiple")
    public ResponseEntity<StandardJSONResponse<String>> saveMultipleQuestions(
            @AuthenticationPrincipal UserDetailsImpl userDetailsImpl,
            @RequestBody List<PostCreateQuestionDTO> questions) throws IOException {
        arrayNode = objectMapper.createArrayNode();
        User teacher = userDetailsImpl.getUser();

        int i = 0;
        int totalQuestions = questions.size();

        for (PostCreateQuestionDTO question : questions) {
            String content = question.getContent();
            String subjectName = question.getSubjectName();
            String chapterName = question.getChapterName();

            if (StringUtils.isEmpty(content) || questionService.isContentDuplicated(null, content,
                    false)) {
                continue;
            }

            i++;

            Subject subject = null;
            try {
                subject = subjectService.findByName(subjectName);
            } catch (NotFoundException e) {
                StringBuilder subjectId = new StringBuilder();
                for (String s : subjectName.split(" ")) {
                    subjectId.append(s.charAt(0));
                }

                subject = subjectService.save(new Subject(subjectId.toString().toUpperCase(), subjectName));
            }

            Chapter chapter = null;
            try {
                chapter = chapterService.findByName(chapterName);
            } catch (NotFoundException e) {
                chapter =
                        chapterService.save(Chapter.build(chapterName, subject));
            }

            questionService.save(Question.build(question, teacher, chapter));
        }

        String responseMessage = "";
        if (i == 0) {
            responseMessage = "Tất cả câu hỏi đã được thêm từ trước";
        } else {
            responseMessage = String.format("%d/%d câu hỏi đã được thêm vào thành công", i, totalQuestions);
        }

        return new OkResponse<>(responseMessage).response();
    }

    @PostMapping("excel/read")
    public ResponseEntity<StandardJSONResponse<QuestionsDTO>> readExcelFile(@RequestParam(name = "file") MultipartFile excelFile) throws IOException {
        List<ReadQuestionExcelDTO> questions = new ArrayList<>();
        ExcelUtils excelUtils = new ExcelUtils((FileInputStream) excelFile.getInputStream());

        try {
            excelUtils.readQuestionFromFile(questions);

            QuestionsDTO<ReadQuestionExcelDTO> questionsDTO = new QuestionsDTO();

            questionsDTO.setQuestions(questions);
            questionsDTO.setTotalElements(questions.size());
            questionsDTO.setTotalPages((int) Math.ceil(questions.size() / 10.0));

            return new OkResponse<QuestionsDTO>(questionsDTO).response();
        } catch (NotFoundException e) {
            return new BadResponse<QuestionsDTO>(e.getMessage()).response();
        }
    }


    @DeleteMapping("{id}/delete")
    public ResponseEntity<StandardJSONResponse<String>> delete(@PathVariable("id") Integer id) {
        try {
            return new OkResponse<>(questionService.deleteById(id)).response();
        } catch (ConstrainstViolationException ex) {
            return new BadResponse<String>(ex.getMessage()).response();
        }
    }

    @PutMapping("{id}")
    public ResponseEntity<StandardJSONResponse<String>> enableOrDisable(@PathVariable("id") Integer id, @RequestParam(name = "action") String action) {
        try {
            String message = questionService.enableOrDisable(id, action);

            return new OkResponse<>(message).response();
        } catch (NotFoundException ex) {
            return new BadResponse<String>(ex.getMessage()).response();
        }
    }
}
