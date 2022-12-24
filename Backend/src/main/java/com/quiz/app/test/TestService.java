package com.quiz.app.test;

import com.quiz.app.exception.ConstrainstViolationException;
import com.quiz.app.exception.NotFoundException;
import com.quiz.entity.Subject;
import com.quiz.entity.Test;
import com.quiz.entity.User;
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
public class TestService {

    @Autowired
    private TestRepository testRepository;

    @Autowired
    private EntityManager entityManager;

    public Test save(Test subject) {
        return testRepository.save(subject);
    }

    public String deleteById(Integer id) throws ConstrainstViolationException {
        try {
            testRepository.deleteById(id);
            return "Xóa đề thi thành công";
        } catch (Exception ex) {
            throw new ConstrainstViolationException("Không thể xóa đề thi ràng buộc dữ liệu");
        }
    }

    public List<Test> findBySubject(Subject subject) {
        return testRepository.findBySubject(subject);
    }

    public List<Test> findBySubjectAndUsed(Subject subject) {
        return testRepository.findBySubjectAndUsedAndStatus(subject, false, true);
    }

    public List<Test> findByTeacher(User user) {
        return testRepository.findTop10ByTeacherOrderByIdDesc(user);
    }


    public Test findByStudentAndExam(String studentId, Integer examId) {
        return testRepository.findByStudentAndExam(studentId, examId);
    }

    public Test findById(Integer id) throws NotFoundException {
        Optional<Test> subject = testRepository.findById(id);
        if (subject.isPresent()) {
            return subject.get();
        }

        throw new NotFoundException("Không tìm thấy môn học với mã " + id);
    }

    public Test findByName(String name) throws NotFoundException {
        Test subject = testRepository.findByName(name);

        if (Objects.nonNull(subject)) {
            return subject;
        }

        throw new NotFoundException("Không tìm thấy môn học với tên " + name);
    }

    public boolean isNameDuplicated(Integer id, String name, boolean isEdit) {
        Test test = testRepository.findByName(name);

        if (isEdit) {
            return Objects.nonNull(test) && !Objects.equals(test.getId(), id);
        } else {
            return Objects.nonNull(test);
        }
    }

    public List<Test> findAll() {
        return (List<Test>) testRepository.findAll();
    }

    public String enableOrDisable(Integer id, String action) throws NotFoundException {
        try {
            Test test = findById(id);
            String responseMessage = "";
            if (action.equals("enable")) {
                test.setStatus(true);
                responseMessage = "Mở đề thi thành công";
            } else {
                test.setStatus(false);
                responseMessage = "Hủy đề thi thành công";
            }

            testRepository.save(test);

            return responseMessage;
        } catch (NotFoundException ex) {
            throw new NotFoundException(ex.getMessage());
        }
    }

    public Page<Test> findAllTests(Map<String, String> filters) {
        int page = Integer.parseInt(filters.get("page"));
        String searchQuery = filters.get("query");
        String sortDir = filters.get("sortDir");
        String sortField = filters.get("sortField");
        String subjectId = filters.get("subjectId");

        Sort sort = null;
        if (sortField.equals("numberOfQuestions")) {

        } else {
            sort = Sort.by(sortField);
        }

        sort = sortDir.equals("asc") ? sort.ascending() : sort.descending();
        Pageable pageable = PageRequest.of(page - 1, 12, sort);

        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Test> criteriaQuery = criteriaBuilder.createQuery(Test.class);
        Root<Test> root = criteriaQuery.from(Test.class);

        List<Predicate> predicates = new ArrayList<>();

        if (!StringUtils.isEmpty(searchQuery)) {
            Expression<String> id = root.get("id");
            Expression<String> name = root.get("name");
            Expression<String> teacherFirstName = root.get("teacher").get("firstName");
            Expression<String> teacherLastName = root.get("teacher").get("lastName");
            Expression<String> subjectName = root.get("subject").get("name");

            Expression<String> wantedQueryField = criteriaBuilder.concat(id, " ");
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, name);
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, " ");
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, teacherLastName);
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, " ");
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, teacherFirstName);
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, " ");
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, subjectName);

            predicates.add(criteriaBuilder.and(criteriaBuilder.like(wantedQueryField, "%" + searchQuery + "%")));
        }

        if (!StringUtils.isEmpty(subjectId)) {
            Expression<String> subject = root.get("subject").get("id");
            predicates.add(criteriaBuilder.and(criteriaBuilder.equal(subject, subjectId)));
        }

        criteriaQuery.where(criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()])));
        criteriaQuery.orderBy(QueryUtils.toOrders(pageable.getSort(), root, criteriaBuilder));

        TypedQuery<Test> typedQuery = entityManager.createQuery(criteriaQuery);

        int totalRows = typedQuery.getResultList().size();
        typedQuery.setFirstResult(pageable.getPageNumber() * pageable.getPageSize());
        typedQuery.setMaxResults(pageable.getPageSize());

        return new PageImpl<>(typedQuery.getResultList(), pageable, totalRows);
    }
}
