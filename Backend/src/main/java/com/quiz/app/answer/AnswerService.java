package com.quiz.app.answer;

import com.quiz.app.exception.ConstrainstViolationException;
import com.quiz.app.exception.NotFoundException;
import com.quiz.entity.Answer;
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
import java.util.Optional;


@Service
public class AnswerService {
    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private EntityManager entityManager;

    public Answer save(Answer answer) {
        return answerRepository.save(answer);
    }

    public void saveAll(List<Answer> answers) {
        answerRepository.saveAll(answers);
    }

    public String deleteById(Integer id) throws ConstrainstViolationException {
        try {
            answerRepository.deleteById(id);
            return "Xóa lựa chọn thành công";
        } catch (Exception ex) {
            throw new ConstrainstViolationException("Không thể xóa môn học vì ràng buộc dữ liệu");
        }
    }

    public Answer findById(Integer id) throws NotFoundException {
        Optional<Answer> answer = answerRepository.findById(id);
        if (answer.isPresent()) {
            return answer.get();
        }

        throw new NotFoundException("Không tìm thấy môn học với mã " + id);
    }

    public List<Answer> findAll() {
        return (List<Answer>) answerRepository.findAll();
    }

    public Page<Answer> findAllSubjects(Map<String, String> filters) {
        int page = Integer.parseInt(filters.get("page"));
        String searchQuery = filters.get("query");
        String sortDir = filters.get("sortDir");
        String sortField = filters.get("sortField");

        Sort sort = Sort.by(sortField);
        sort = sortDir.equals("asc") ? sort.ascending() : sort.descending();
        Pageable pageable = PageRequest.of(page - 1, 10, sort);

        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Answer> criteriaQuery = criteriaBuilder.createQuery(Answer.class);
        Root<Answer> root = criteriaQuery.from(Answer.class);

        List<Predicate> predicates = new ArrayList<>();

        if (!StringUtils.isEmpty(searchQuery)) {
            Expression<String> id = root.get("id");
            Expression<String> name = root.get("name");

            Expression<String> wantedQueryField = criteriaBuilder.concat(id, " ");
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, name);

            predicates.add(criteriaBuilder.and(criteriaBuilder.like(wantedQueryField, "%" + searchQuery + "%")));
        }

        criteriaQuery.where(criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()])));
        criteriaQuery.orderBy(QueryUtils.toOrders(pageable.getSort(), root, criteriaBuilder));

        TypedQuery<Answer> typedQuery = entityManager.createQuery(criteriaQuery);

        int totalRows = typedQuery.getResultList().size();
        typedQuery.setFirstResult(pageable.getPageNumber() * pageable.getPageSize());
        typedQuery.setMaxResults(pageable.getPageSize());

        return new PageImpl<>(typedQuery.getResultList(), pageable, totalRows);
    }

}
