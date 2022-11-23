package com.quiz.app.exam;

import com.quiz.app.exception.ConstrainstViolationException;
import com.quiz.app.exception.NotFoundException;
import com.quiz.app.statistics.dto.CountExamByCreditClassDTO;
import com.quiz.entity.Exam;
import com.quiz.entity.TakeExam;
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
import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@Service
public class ExamService {

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private EntityManager entityManager;

    public Exam save(Exam subject) {
        return examRepository.save(subject);
    }

    public List<CountExamByCreditClassDTO> countExamByCreditClass() {
        return examRepository.countExamByCreditClass();
    }

    public List<Exam> findByStudentAndTaken(String studentId) {
        return examRepository.findByStudentAndTaken(studentId);
    }


    public String deleteById(Integer id) throws ConstrainstViolationException {
        try {
            examRepository.deleteById(id);
            return "Xóa môn học thành công";
        } catch (Exception ex) {
            throw new ConstrainstViolationException("Không thể xóa môn học vì ràng buộc dữ liệu");
        }
    }

    public Exam findById(Integer id) throws NotFoundException {
        Optional<Exam> subject = examRepository.findById(id);
        if (subject.isPresent()) {
            return subject.get();
        }

        throw new NotFoundException("Không tìm thấy môn học với mã " + id);
    }

    public String enableOrDisable(Integer id, String action) throws NotFoundException {
        try {
            Exam exam = findById(id);
            String responseMessage = "";
            if (action.equals("enable")) {
                exam.setStatus(false);
                responseMessage = "Kích họat ca thi thành công";
            } else {
                exam.setStatus(true);
                responseMessage = "Hủy ca thi thành công";
            }

            examRepository.save(exam);

            return responseMessage;
        } catch (NotFoundException ex) {
            throw new NotFoundException(ex.getMessage());
        }
    }

    public List<Exam> findAll() {
        return (List<Exam>) examRepository.findAll();
    }

    public List<Exam> findAllExamsIdByCreditClass(Integer creditClassId) {
        return examRepository.findAllExamsByCreditClass(creditClassId);
    }

    public int countTotalExams() {
        return examRepository.countTotalExams();
    }

    public Page<Exam> findAllExams(Map<String, String> filters) {
        int page = Integer.parseInt(filters.get("page"));
        String searchQuery = filters.get("query");
        String sortDir = filters.get("sortDir");
        String sortField = filters.get("sortField");
        String teacherId = filters.get("teacherId");
        String creditClassId = filters.get("creditClassId");
        String studentId = filters.get("studentId");
        String schoolYear = filters.get("schoolYear");
        String semester = filters.get("semester");
        String type = filters.get("type");
        String taken = filters.get("taken");
        Sort sort = null;
//        if(sortField.equals("subjectId")) {
//            sort = Sort.by(sortField);
//        } else if(sortField.equals("subjectName")) {
//            sort = Sort.by(sortField);
//        } else {
//            sort = Sort.by(sortField);
//        }
        sort = Sort.by(sortField);
        sort = sortDir.equals("asc") ? sort.ascending() : sort.descending();
        Pageable pageable = PageRequest.of(page - 1, 10, sort);

        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Exam> criteriaQuery = criteriaBuilder.createQuery(Exam.class);
        Root<Exam> root = criteriaQuery.from(Exam.class);

        List<Predicate> predicates = new ArrayList<>();

        if (!StringUtils.isEmpty(searchQuery)) {
            Expression<String> id = root.get("id");

            Expression<String> wantedQueryField = criteriaBuilder.concat(id, " ");
//            wantedQueryField = criteriaBuilder.concat(wantedQueryField, name);

            predicates.add(criteriaBuilder.and(criteriaBuilder.like(wantedQueryField, "%" + searchQuery + "%")));
        }

        if (!StringUtils.isEmpty(creditClassId)) {
            Join<Exam, TakeExam> joinOptions = root.join("takeExams", JoinType.LEFT);
            Expression<String> creditClassIdExp = joinOptions.get("register").get("creditClass").get("id");
            predicates.add(criteriaBuilder.and(criteriaBuilder.equal(creditClassIdExp, creditClassId)));
        }

        if (!StringUtils.isEmpty(teacherId)) {
            Expression<String> teacher = root.get("teacher").get("id");
            predicates.add(criteriaBuilder.and(criteriaBuilder.equal(teacher, teacherId)));
        }

        if (!StringUtils.isEmpty(studentId)) {
            Join<Exam, TakeExam> joinOptions = root.join("takeExams", JoinType.LEFT);
            Expression<String> studentIdExp = joinOptions.get("register").get("student").get(
                    "id");
            predicates.add(criteriaBuilder.and(criteriaBuilder.equal(studentIdExp, studentId)));
        }

//        if (!StringUtils.isEmpty(schoolYear)) {
//            Expression<String> teacher = root.get("teacher").get("id");
//            predicates.add(criteriaBuilder.and(criteriaBuilder.equal(teacher, teacherId)));
//        }

        if (!StringUtils.isEmpty(type)) {
            Expression<String> typeExp = root.get("type");
            predicates.add(criteriaBuilder.and(criteriaBuilder.equal(typeExp, type)));
        }

        criteriaQuery.where(criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()])));
        criteriaQuery.orderBy(QueryUtils.toOrders(pageable.getSort(), root, criteriaBuilder)).groupBy(root.get("id"));

        TypedQuery<Exam> typedQuery = entityManager.createQuery(criteriaQuery);

        int totalRows = typedQuery.getResultList().size();
        typedQuery.setFirstResult(pageable.getPageNumber() * pageable.getPageSize());
        typedQuery.setMaxResults(pageable.getPageSize());

        return new PageImpl<>(typedQuery.getResultList(), pageable, totalRows);
    }

}
