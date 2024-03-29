package com.quiz.app.question;

import com.quiz.app.answer.AnswerService;
import com.quiz.app.answer.dto.AnswerDTO;
import com.quiz.app.chapter.ChapterService;
import com.quiz.app.exception.ConstrainstViolationException;
import com.quiz.app.exception.NotFoundException;
import com.quiz.app.question.dto.AvailableQuestionDTO;
import com.quiz.app.question.dto.PostCreateQuestionDTO;
import com.quiz.app.question.dto.QuestionsDTO;
import com.quiz.app.response.StandardJSONResponse;
import com.quiz.app.response.error.BadResponse;
import com.quiz.app.response.success.OkResponse;
import com.quiz.app.security.UserDetailsImpl;
import com.quiz.app.subject.SubjectService;
import com.quiz.app.subject.dto.PostCreateSubjectDTO;
import com.quiz.app.utils.CommonUtils;
import com.quiz.app.utils.ExcelUtils;
import com.quiz.app.utils.ProcessImage;
import com.quiz.entity.Answer;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

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
    private AnswerService answerService;

    @Autowired
    private SubjectService subjectService;

    @Autowired
    private ChapterService chapterService;

    @GetMapping("load")
    public ResponseEntity<StandardJSONResponse<Set<Question>>> loadCriteriaQuestions(
            @RequestParam(name = "criteria", required = false, defaultValue = "") String criteria) {
        if (!StringUtils.isEmpty(criteria)) {
            return new OkResponse<>(questionService.findQuestionsByCriteria(criteria)).response();
        }

        return null;
    }

    @GetMapping("queryAvailableQuestions")
    public ResponseEntity<StandardJSONResponse<AvailableQuestionDTO>> queryAvailableQuestions(
            @RequestParam(name = "chapter", required = false, defaultValue = "") Integer chapter,
            @RequestParam(name = "level", required = false, defaultValue = "") Level level,
            @RequestParam(name = "filterIndex", required = false, defaultValue = "") String filterIndex) {
        AvailableQuestionDTO availableQuestionDTO = new AvailableQuestionDTO();
        availableQuestionDTO.setFilterIndex(filterIndex);
        availableQuestionDTO.setData(questionService.queryAvailableQuestions(chapter, level));
        return new OkResponse<>(availableQuestionDTO).response();
    }

    @GetMapping("")
    public ResponseEntity<StandardJSONResponse<QuestionsDTO<Question>>> fetchAllQuestions(
            @RequestParam("page") String page,
            @RequestParam(name = "query", required = false, defaultValue = "") String query,
            @RequestParam(name = "sortDir", required = false, defaultValue = "desc") String sortDir,
            @RequestParam(name = "sortField", required = false, defaultValue = "id") String sortField,
            @RequestParam(name = "teacher", required = false, defaultValue = "") String teacherId,
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
            questionsDTO.setTotalPages((long) Math.ceil(questions.size() / 10));
        } else {
            Map<String, String> filters = new HashMap<>();
            filters.put("page", page);
            filters.put("query", query);
            filters.put("sortDir", sortDir);
            filters.put("sortField", sortField);
            filters.put("subjectId", subjectId);
            filters.put("teacherId", teacherId);

            Page<Question> questionPage = questionService.findAllQuestions(filters);
            questionsDTO.setQuestions(questionPage.getContent());
            questionsDTO.setTotalElements(questionPage.getTotalElements());
            questionsDTO.setTotalPages(questionPage.getTotalPages());
        }

        return new OkResponse<>(questionsDTO).response();
    }

    public void catchQuestionInputException(CommonUtils commonUtils, String content, String type,
                                            String level,
                                            List<AnswerDTO> answers,
                                            Integer chapterId
    ) {
        if (Objects.isNull(content) || StringUtils.isEmpty(content)) {
            commonUtils.addError("content", "Nội dung câu hỏi không được để trống");
        }

        if (Objects.isNull(type) || StringUtils.isEmpty(type)) {
            commonUtils.addError("content", "Loại câu hỏi không được để trống");
        }

        if (Objects.isNull(level) || StringUtils.isEmpty(level)) {
            commonUtils.addError("level", "Mức độ không được để trống");
        }

        for (AnswerDTO ans : answers) {
            if (Objects.isNull(ans.getContent()) || StringUtils.isEmpty(ans.getContent())) {
                commonUtils.addError("answers", "Không được để trống sự lựa chọn");
                break;
            }
        }

        if (Objects.isNull(chapterId)) {
            commonUtils.addError("chapterId", "Chương không được để trống");
        }
    }

    @PostMapping("save")
    public ResponseEntity<StandardJSONResponse<String>> saveQuestion(
            @AuthenticationPrincipal UserDetailsImpl userDetailsImpl,
            @ModelAttribute PostCreateQuestionDTO postCreateQuestionDTO,
            @RequestParam(name = "isEdit", required = false, defaultValue = "false") boolean isEdit)
            throws IOException {
        CommonUtils commonUtils = new CommonUtils();
        User teacher = userDetailsImpl.getUser();
        Question savedQuestion = null;
        Chapter chapter = null;
        Integer id = postCreateQuestionDTO.getId();
        String content = postCreateQuestionDTO.getContent();

        String type = postCreateQuestionDTO.getType();
        String levelStr = postCreateQuestionDTO.getLevel();
        List<AnswerDTO> answers = postCreateQuestionDTO.getAnswers();
        Integer chapterId = postCreateQuestionDTO.getChapterId();
        System.out.println(answers.get(0).isAnswer());
        catchQuestionInputException(commonUtils, content, type, levelStr, answers,
                chapterId);

        try {
            chapter = chapterService.findById(chapterId);
        } catch (NotFoundException e) {
            commonUtils.addError("chapterId", e.getMessage());
        }

        if (commonUtils.getArrayNode().size() > 0) {
            return new BadResponse<String>(commonUtils.getArrayNode().toString()).response();
        } else {
            if (questionService.isContentDuplicated(id, content, isEdit)) {
                commonUtils.addError("content", "Nội dung câu hỏi đã tồn tại");
            }

            if (commonUtils.getArrayNode().size() > 0) {
                return new BadResponse<String>(commonUtils.getArrayNode().toString()).response();
            }
        }

        if (isEdit) {
            try {
                Question question = questionService.findById(id);
                question.setContent(content);
                String oldQuestionTpe = question.getType();
                question.setType(type);
                question.setLevel(Question.lookUpLevel(levelStr));
                question.setChapter(chapter);

                if (Objects.isNull(question.getAnswers())) {
                    question.setAnswers(new ArrayList<>());
                }

                if (postCreateQuestionDTO.getImage() != null) {
                    question.setImage(postCreateQuestionDTO.getImage().getOriginalFilename());
                }

                System.out.println("Old type: " + oldQuestionTpe);
                System.out.println("type: " + type);
                if (type.equals("Đáp án điền")) {
                    if (question
                            .getAnswers().size() > 0) {
                        question.removeAll();
                    }
                    AnswerDTO answer = answers.get(0);
                    question.addAnswer(
                            Answer.build(answer.getContent(),
                                    answer.getIsTempAnswer().equals("true"), question,
                                    answer.getOrder()));
                    ;
                } else {
                    if (oldQuestionTpe.equals("Đáp án điền")) {
                        if (question
                                .getAnswers().size() > 0) {
                            question.removeAll();
                        }
                        for (AnswerDTO answer : answers) {
                            question.addAnswer(
                                    Answer.build(answer.getContent(),
                                            answer.getIsTempAnswer().equals("true"), question,
                                            answer.getOrder()));
                            ;
                        }
                    } else {
                        if (answers.size() == 0) {
                            question.removeAll();
                        } else {
                            for (AnswerDTO answerDTO : answers) {
                                // Add new question
                                if (Objects.isNull(answerDTO.getId())) {
                                    question.addAnswer(Answer.build(answerDTO.getContent(),
                                            answerDTO.getIsTempAnswer().equals("true"), question, answerDTO.getOrder()));
                                } else {
                                    for (Answer answer : question.getAnswers()) {
                                        // Edit existed question
                                        if (answerDTO.getId().equals(answer.getId())) {
                                            answer.setContent(answerDTO.getContent());
                                            answer.setOrder(answerDTO.getOrder());
                                            answer.setAnswer(answerDTO.getIsTempAnswer().equals("true"));
                                            answerService.save(answer);
                                            break;
                                        }
                                    }
                                }
                            }
                        }

                        List<Answer> ans = new ArrayList<>();
                        for (Answer answer : question.getAnswers()) {
                            if (Objects.isNull(answer.getId())) {
                                continue;
                            }

                            boolean shouldDelete = true;


                            for (AnswerDTO a : answers) {
                                if (Objects.nonNull(a.getId())) {
                                    if (a.getId().equals(answer.getId())) {
                                        shouldDelete = false;
                                        break;
                                    }
                                }
                            }
                            // Remove none mentioned question
                            if (shouldDelete) {
                                ans.add(answer);
                            }
                        }

                        for (Answer answer : ans) {
                            question.removeAnswer(answer);
                        }
                    }
                }

                savedQuestion = questionService.save(question);
            } catch (NotFoundException exception) {
                commonUtils.addError("id", exception.getMessage());
                return new BadResponse<String>(commonUtils.getArrayNode().toString()).response();
            }
        } else {
            Question question = Question.build(postCreateQuestionDTO,
                    userDetailsImpl.getUser(), chapter, false);

            if (postCreateQuestionDTO.getAnswers().size() > 0) {
                question.setAnswers(postCreateQuestionDTO.getAnswers().stream().map(
                        answer -> Answer.build(answer.getContent(),
                                answer.getIsTempAnswer().equals("true"),
                                question, answer.getOrder())).collect(Collectors.toList()));
            }
            questionService.save(question);
        }

        if (postCreateQuestionDTO.getImage() != null) {
            String devUploadDir = String.format("%s/%s/", DEV_STATIC_DIR, savedQuestion.getId());
            String prodUploadDir = String.format("%s/%s/", PROD_STATIC_DIR, savedQuestion.getId());
            String staticPath = String.format("%s/%s/", PROD_STATIC_PATH, savedQuestion.getId());
            ProcessImage.uploadImage(devUploadDir, prodUploadDir, staticPath, postCreateQuestionDTO.getImage(), environment);
        }

        return new OkResponse<>("Thêm hoặc sửa câu hỏi thành công").response();
    }

    @Transactional
    @PostMapping("save/multiple")
    public ResponseEntity<StandardJSONResponse<String>> readExcelFile(
            @AuthenticationPrincipal UserDetailsImpl userDetailsImpl,
            @RequestParam(name = "file") MultipartFile excelFile) throws IOException {
        try {
            User teacher = userDetailsImpl.getUser();

            List<PostCreateQuestionDTO> questions = new ArrayList<>();
            ExcelUtils excelUtils = new ExcelUtils((FileInputStream) excelFile.getInputStream());

            excelUtils.readQuestionFromFile(questions);

            int i = 0;
            int totalQuestions = questions.size();

            for (PostCreateQuestionDTO question : questions) {
                String content = question.getContent();
                String subjectId = question.getSubjectId();
                String subjectName = question.getSubjectName();

                String chapterName = question.getChapterName().split(":")[1].trim();
                int chapterNumber =
                        Integer.parseInt(String.valueOf(question.getChapterName().charAt(7)));

                if (Objects.isNull(content) ||
                        StringUtils.isEmpty(content) ||
                        questionService.isContentDuplicated(null, content, false)) {
                    continue;
                }

                // Check if teacher create question teaches this subject
                boolean shouldContinue = true;
                List<Subject> subjects = subjectService.findByTeacher(teacher.getId());
                for (Subject subject1 : subjects) {

                    System.out.println(subjectId);
                    System.out.println(subject1.getId());
                    if (Objects.equals(subjectId, subject1.getId())) {
                        shouldContinue = false;
                        break;
                    }
                }

                if (shouldContinue) {
                    continue;
                }

                i++;

                Subject subject = null;
                try {
                    subject = subjectService.findById(subjectId);
                } catch (NotFoundException e) {
                    subject = subjectService.save(
                            Subject.build(new PostCreateSubjectDTO(subjectId
                                    , subjectName, 15, 0, null)));
                }

                Chapter chapter = null;
                try {
                    chapter = chapterService.findByName(chapterName);
                } catch (NotFoundException e) {
                    chapter =
                            chapterService.save(Chapter.build(chapterNumber, chapterName,
                                    subject));
                }

                questionService.save(Question.build(question, teacher,
                        chapter, true));
            }

            String responseMessage = "";
            if (i == 0) {
                responseMessage = "Tất cả câu hỏi đã được thêm từ trước";
            } else {
                responseMessage = String.format("%d/%d câu hỏi đã được thêm vào thành công", i, totalQuestions);
            }
            return new OkResponse<>(responseMessage).response();
        } catch (IllegalStateException e) {
            return new BadResponse<String>("Không thể đọc được nội dung từ file Excel").response();
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

    @GetMapping("get-questions")
    public ResponseEntity<StandardJSONResponse<List<Question>>> getQuestions(
            @AuthenticationPrincipal UserDetailsImpl userDetailsImpl,
            @RequestParam(name = "exam", defaultValue = "") Integer examId) {
        return new OkResponse<>(questionService.findByStudentAndExam(userDetailsImpl.getUser().getId(), examId)).response();
    }
}
