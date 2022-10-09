package com.quiz.app.subject;

import com.quiz.app.exception.ConstrainstViolationException;
import com.quiz.app.exception.NotFoundException;
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
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;


@Service
public class SubjectService {
    private final String DELETE_SUCCESSFULLY = "Xóa môn học thành công";
    private final String DELETE_FORBIDDEN = "Không thể xóa môn học vì ràng buộc dữ liệu";

    private final Integer MAX_SUBJECTS_PER_PAGE = 20;

    @Autowired
    SubjectRepository subjectRepository;

    @Autowired
    private EntityManager entityManager;

    public Subject save(Subject subject) {
        return subjectRepository.save(subject);
    }

    public String deleteById(String id) throws ConstrainstViolationException {
        try {
            subjectRepository.deleteById(id);
            return DELETE_SUCCESSFULLY;
        } catch (Exception ex) {
            throw new ConstrainstViolationException(DELETE_FORBIDDEN);
        }
    }

    public Subject findById(String id) throws NotFoundException {
        Optional<Subject> subject = subjectRepository.findById(id);
        if (subject.isPresent()) {
            return subject.get();
        }

        throw new NotFoundException("Không tìm thấy môn học với mã " + id);
    }

    public boolean isNameDuplicated(String id, String name, boolean isEdit) {
        Subject subject = subjectRepository.findByName(name);

        if (isEdit) {
            return Objects.nonNull(subject) && !Objects.equals(subject.getId(), id);
        } else {
            return Objects.nonNull(subject);
        }
    }

    public boolean isIdDuplicated(String id, boolean isEdit) {
        Subject subject = null;
        try {
            subject = findById(id);

            if (isEdit) {
                return Objects.nonNull(subject) && !Objects.equals(subject.getId(), id);
            } else {
                return Objects.nonNull(subject);
            }
        } catch (NotFoundException e) {
            return false;
        }
    }

    public List<Subject> findAll() {
        return (List<Subject>) subjectRepository.findAll();
    }

    public Page<Subject> findAllSubjects(Map<String, String> filters) {
        int page = Integer.parseInt(filters.get("page"));
        String searchQuery = filters.get("query");
        String sortDir = filters.get("sortDir");
        String sortField = filters.get("sortField");

        Sort sort = Sort.by(sortField);
        sort = sortDir.equals("asc") ? sort.ascending() : sort.descending();
        Pageable pageable = PageRequest.of(page - 1, MAX_SUBJECTS_PER_PAGE, sort);

        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Subject> criteriaQuery = criteriaBuilder.createQuery(Subject.class);
        Root<Subject> root = criteriaQuery.from(Subject.class);

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

        TypedQuery<Subject> typedQuery = entityManager.createQuery(criteriaQuery);

        int totalRows = typedQuery.getResultList().size();
        typedQuery.setFirstResult(pageable.getPageNumber() * pageable.getPageSize());
        typedQuery.setMaxResults(pageable.getPageSize());

        return new PageImpl<>(typedQuery.getResultList(), pageable, totalRows);
    }

}
