package com.quiz.app.question;

import com.quiz.app.chapter.ChapterService;
import com.quiz.app.exception.ConstrainstViolationException;
import com.quiz.app.exception.NotFoundException;
import com.quiz.app.subject.SubjectService;
import com.quiz.entity.Chapter;
import com.quiz.entity.Level;
import com.quiz.entity.Question;
import com.quiz.entity.Subject;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.query.QueryUtils;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Expression;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;


@Service
public class QuestionService {

    @Autowired
    QuestionRepository questionRepository;

    @Autowired
    SubjectService subjectService;

    @Autowired
    ChapterService chapterService;

    @Autowired
    private EntityManager entityManager;

    public Question save(Question question) {
        return questionRepository.save(question);
    }

    public String deleteById(Integer id) throws ConstrainstViolationException {
        try {
            questionRepository.deleteById(id);
            return "Xóa câu hỏi thành công";
        } catch (Exception ex) {
            throw new ConstrainstViolationException( "Không thể xóa câu hỏi này vì ràng buộc dữ liệu");
        }
    }

    public String enableOrDisable(Integer id, String action) throws NotFoundException {
        try {
            Question question = findById(id);
            String responseMessage = "";
            if (action.equals("enable")) {
                question.setStatus(true);
                responseMessage = "Kích họat câu hỏi thành công";
            } else {
                question.setStatus(false);
                responseMessage = "Hủy kích họat câu hỏi thành công";
            }

            questionRepository.save(question);

            return responseMessage;
        } catch (NotFoundException ex) {
            throw new NotFoundException(ex.getMessage());
        }
    }

    public Question findById(Integer id) throws NotFoundException {
        Question question = questionRepository.getById(id);

        if (Objects.nonNull(question)) {
            return question;
        }

        throw new NotFoundException("Không tìm thấy câu hỏi với mã bằng " + id);
    }

    public boolean isContentDuplicated(Integer id, String content, boolean isEdit) {
        Question question = questionRepository.findByContent(content);
        if (isEdit) {
            return Objects.nonNull(question) && !Objects.equals(question.getId(), id);
        } else {
            return Objects.nonNull(question);
        }
    }

    public Page<Question> findAllQuestions(Map<String, String> filters) {
        int page = Integer.parseInt(filters.get("page"));
        String searchQuery = filters.get("query");
        String sortDir = filters.get("sortDir");
        String sortField = filters.get("sortField");
        String subjectId = filters.get("subjectId");
        String levelStr = filters.get("level");

        Sort sort = Sort.by(sortField);
        sort = sortDir.equals("asc") ? sort.ascending() : sort.descending();
        Pageable pageable = PageRequest.of(page - 1, 10, sort);

        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Question> criteriaQuery = criteriaBuilder.createQuery(Question.class);
        Root<Question> root = criteriaQuery.from(Question.class);

        List<Predicate> predicates = new ArrayList<>();

        if (!StringUtils.isEmpty(searchQuery)) {
            Expression<String> id = root.get("id");
            Expression<String> content = root.get("content");
            Expression<String> chapterName = root.get("chapter").get("name");
            Expression<String> teacherFirstName = root.get("teacher").get("firstName");
            Expression<String> teacherLastName = root.get("teacher").get("lastName");

            Expression<String> wantedQueryField = criteriaBuilder.concat(id, " ");
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, content);
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, " ");
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, chapterName);
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, " ");
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, teacherFirstName);
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, " ");
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, teacherLastName);

            predicates.add(criteriaBuilder.and(criteriaBuilder.like(wantedQueryField, "%" + searchQuery + "%")));
        }

        if (!StringUtils.isEmpty(subjectId)) {
            Expression<Integer> chapterId = root.get("chapter").get("id");

            try {
                Subject subject = subjectService.findById(subjectId);
                List<Integer> chapterIds =
                        subject.getChapters().stream().map(Chapter::getId).collect(Collectors.toList());

                predicates.add(criteriaBuilder.and(chapterId.in(chapterIds)));
            } catch (NotFoundException e) {
            }
        }

        if (!StringUtils.isEmpty(levelStr)) {
            Expression<Level> levelReal = root.get("level");

            Level level = Level.EASY;
            if (Objects.equals(levelStr, "Khó")) {
                level = Level.HARD;
            } else if (Objects.equals(levelStr, "Trung bình")) {
                level = Level.MEDIUM;
            }

            predicates.add(criteriaBuilder.and(criteriaBuilder.equal(levelReal, level)));
        }

        criteriaQuery.where(criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()])));
        criteriaQuery.orderBy(QueryUtils.toOrders(pageable.getSort(), root, criteriaBuilder));

        TypedQuery<Question> typedQuery = entityManager.createQuery(criteriaQuery);

        int totalRows = typedQuery.getResultList().size();
        typedQuery.setFirstResult(pageable.getPageNumber() * pageable.getPageSize());
        typedQuery.setMaxResults(pageable.getPageSize());

        return new PageImpl<>(typedQuery.getResultList(), pageable, totalRows);
    }

    public List<Question> findAll() {
        return (List<Question>) questionRepository.findAll();
    }

    public List<Question> findAll(String subjectId) {
        Subject subject = null;
        try {
            subject = subjectService.findById(subjectId);
            return questionRepository.findByChapterIn(subject.getChapters());
        } catch (NotFoundException e) {
            return null;
        }
    }

    public List<Question> findAll(String subjectId, Integer numberOfQuestions) {
        try {
            Subject subject = subjectService.findById(subjectId);
            List<Integer> chapters =
                    subject.getChapters().stream().map(Chapter::getId).collect(Collectors.toList());
            return questionRepository.findBySubject(chapters, numberOfQuestions);
        } catch (NotFoundException e) {
            throw new RuntimeException(e);
        }
    }

    public Set<Question> findQuestionsByCriteria(String criteria) {
        Set<Question> questions = new HashSet<>();
        String[] criteriaStrArr = criteria.split(";");

        for (String criteriaEl : criteriaStrArr) {
            int chapter = Integer.parseInt(criteriaEl.split(",")[0]);
            String levelStr = criteriaEl.split(",")[1];
            int numberOfQuestions = Integer.parseInt(criteriaEl.split(",")[2]);

            questions.addAll(questionRepository.findByChapterAndLevel(chapter,
                    Question.lookUpLevel(levelStr), numberOfQuestions));
        }

        return questions;
    }
}
