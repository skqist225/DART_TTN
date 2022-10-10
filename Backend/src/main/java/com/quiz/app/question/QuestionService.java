package com.quiz.app.question;

import com.quiz.app.exception.ConstrainstViolationException;
import com.quiz.app.exception.NotFoundException;
import com.quiz.entity.Question;
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
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;


@Service
public class QuestionService {
    private final String DELETE_SUCCESSFULLY = "Xóa câu hỏi thành công";
    private final String DELETE_FORBIDDEN = "Không thể xóa câu hỏi này vì ràng buộc dữ liệu";

    private final Integer MAX_QUESTIONS_PER_PAGE = 20;

    @Autowired
    QuestionRepository questionRepository;

    @Autowired
    private EntityManager entityManager;

    public Question save(Question question) {
        return questionRepository.save(question);
    }

    public String deleteById(Integer id) throws ConstrainstViolationException {
        try {
            questionRepository.deleteById(id);
            return DELETE_SUCCESSFULLY;
        } catch (Exception ex) {
            throw new ConstrainstViolationException(DELETE_FORBIDDEN);
        }
    }

    public Question findById(Integer id) throws NotFoundException {
        Optional<Question> question = questionRepository.findById(id);

        if (question.isPresent()) {
            return question.get();
        }

        throw new NotFoundException("Không tìm thấy câu hỏi với mã bằng " + id);
    }

    public boolean isContentDuplicated(Integer id, String content, boolean isEdit) {
        Question subject = questionRepository.findByContent(content);

        if (isEdit) {
            return Objects.nonNull(subject) && !Objects.equals(subject.getId(), id);
        } else {
            return Objects.nonNull(subject);
        }
    }

    public Page<Question> findAllQuestions(Map<String, String> filters) {
        int page = Integer.parseInt(filters.get("page"));
        String searchQuery = filters.get("query");
        String sortDir = filters.get("sortDir");
        String sortField = filters.get("sortField");

        Sort sort = Sort.by(sortField);
        sort = sortDir.equals("asc") ? sort.ascending() : sort.descending();
        Pageable pageable = PageRequest.of(page - 1, MAX_QUESTIONS_PER_PAGE, sort);

        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Question> criteriaQuery = criteriaBuilder.createQuery(Question.class);
        Root<Question> root = criteriaQuery.from(Question.class);

        List<Predicate> predicates = new ArrayList<>();

        if (!StringUtils.isEmpty(searchQuery)) {
            Expression<String> id = root.get("id");
            Expression<String> content = root.get("content");

            Expression<String> wantedQueryField = criteriaBuilder.concat(id, " ");
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, content);

            predicates.add(criteriaBuilder.and(criteriaBuilder.like(wantedQueryField, "%" + searchQuery + "%")));
        }

        criteriaQuery.where(criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()])));
        criteriaQuery.orderBy(QueryUtils.toOrders(pageable.getSort(), root, criteriaBuilder));

        TypedQuery<Question> typedQuery = entityManager.createQuery(criteriaQuery);

        int totalRows = typedQuery.getResultList().size();
        typedQuery.setFirstResult(pageable.getPageNumber() * pageable.getPageSize());
        typedQuery.setMaxResults(pageable.getPageSize());

        return new PageImpl<>(typedQuery.getResultList(), pageable, totalRows);
    }
}
