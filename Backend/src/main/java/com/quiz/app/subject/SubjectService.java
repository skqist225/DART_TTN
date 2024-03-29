package com.quiz.app.subject;

import com.quiz.app.exception.ConstrainstViolationException;
import com.quiz.app.exception.NotFoundException;
import com.quiz.entity.Chapter;
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

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private EntityManager entityManager;

    public Integer countTotalSubjects() {
        return subjectRepository.countTotalSubjects();
    }

    public void saveAll(List<Subject> subjects) {
        subjectRepository.saveAll(subjects);
    }

    public Subject save(Subject subject) {
        return subjectRepository.save(subject);
    }

    public List<Subject> findByHaveChapter() {
        return subjectRepository.findByHaveChapter();
    }

    public List<Subject> findByHaveQuestion() {
        List<Subject> finSubjects = new ArrayList<>();
        List<Subject> subjects = subjectRepository.findByHaveChapter();
        for (Subject subject : subjects) {
            for (Chapter chapter : subject.getChapters()) {
                if (chapter.getNumberOfActiveQuestions() > 0) {
                    finSubjects.add(subject);
                    break;
                }
            }
        }

        return finSubjects;
    }

    public List<Subject> findByTeacher(String teacherId) {
        return subjectRepository.findSubjectsOfTeacher(teacherId);
    }

    public String deleteById(String id) throws ConstrainstViolationException {
        try {
            subjectRepository.deleteById(id);
            return "Xóa môn học thành công";
        } catch (Exception ex) {
            throw new ConstrainstViolationException("Không thể xóa môn học vì ràng buộc dữ liệu");
        }
    }

    public Subject findById(String id) throws NotFoundException {
        Optional<Subject> subject = subjectRepository.findById(id);
        if (subject.isPresent()) {
            return subject.get();
        }

        throw new NotFoundException("Không tìm thấy môn học với mã " + id);
    }

    public boolean isIdDuplicated(String id, boolean isEdit) {
        try {
            Subject subject = findById(id);

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
        Pageable pageable = PageRequest.of(page - 1, 12, sort);

        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Subject> criteriaQuery = criteriaBuilder.createQuery(Subject.class);
        Root<Subject> root = criteriaQuery.from(Subject.class);

        List<Predicate> predicates = new ArrayList<>();

        if (!StringUtils.isEmpty(searchQuery)) {
            Expression<String> id = root.get("id");
            Expression<String> name = root.get("name");
            Expression<String> numberOfTheoreticalPeriods = root.get("numberOfTheoreticalPeriods");
            Expression<String> numberOfPracticePeriods = root.get("numberOfPracticePeriods");

            Expression<String> wantedQueryField = criteriaBuilder.concat(id, " ");
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, name);
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, " ");
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, numberOfTheoreticalPeriods);
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, " ");
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, numberOfPracticePeriods);


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
