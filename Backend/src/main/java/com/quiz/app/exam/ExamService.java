package com.quiz.app.exam;

import com.quiz.app.exam.dto.TakeExamDTO;
import com.quiz.app.exception.ConstrainstViolationException;
import com.quiz.app.exception.NotFoundException;
import com.quiz.app.takeExam.TakeExamService;
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
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class ExamService {

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private TakeExamService takeExamService;


    @Autowired
    private EntityManager entityManager;

    public Exam save(Exam subject) {
        return examRepository.save(subject);
    }

    public List<Exam> findByStudentAndTaken(String studentId) {
        return examRepository.findByStudentAndTaken(studentId);
    }

    @Transactional
    public String deleteById(Integer id) throws ConstrainstViolationException {
        try {
            Exam exam = findById(id);

            if (!exam.isTaken() && exam.isStatus()) {
                examRepository.deleteTakeExamDetail(id);
                examRepository.deleteTakeExam(id);
                examRepository.updateExamOfTest(id);
                examRepository.deleteExam(id);

                return "Xóa ca thi thành công";
            }

            return "Không thể xóa ca thi";
        } catch (Exception ex) {
            throw new ConstrainstViolationException("Không thể xóa ca thi vì ràng buộc dữ liệu");
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

    public Page<Exam> findAllExams(Map<String, String> filters) {
        int page = Integer.parseInt(filters.get("page"));
        String searchQuery = filters.get("query");
        String sortDir = filters.get("sortDir");
        String sortField = filters.get("sortField");
        String teacherId = filters.get("teacherId");
        String creditClassId = filters.get("creditClassId");
        String studentId = filters.get("studentId");
        String type = filters.get("type");
        String taken = filters.get("taken");
        String examType = filters.get("examType");


        Sort sort = null;
        sort = Sort.by(sortField);
        sort = sortDir.equals("asc") ? sort.ascending() : sort.descending();
        Pageable pageable = PageRequest.of(page - 1, 12, sort);

        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Exam> criteriaQuery = criteriaBuilder.createQuery(Exam.class);
        Root<Exam> root = criteriaQuery.from(Exam.class);

        List<Predicate> predicates = new ArrayList<>();

        if (!StringUtils.isEmpty(searchQuery)) {
            Expression<String> id = root.get("id");
            Expression<String> name = root.get("name");
            Expression<String> examDate = root.get("examDate");
            Expression<String> noticePeriod = root.get("noticePeriod");
            Expression<String> taken2 = root.get("taken");

            Expression<String> wantedQueryField = criteriaBuilder.concat(name, " ");
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, id);
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, " ");
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, examDate);
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, " ");
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, noticePeriod);
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, " ");

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
            // Ca thi của sinh viên: SV chưa thi, chưa hủy
            System.out.println(studentId);
            Join<Exam, TakeExam> joinOptions = root.join("takeExams", JoinType.LEFT);
            Expression<String> studentIdExp = joinOptions.get("register").get("student").get(
                    "id");
            predicates.add(criteriaBuilder.and(criteriaBuilder.equal(studentIdExp, studentId)));

            Expression<Boolean> takenExp = joinOptions.get("tested");
            Expression<Boolean> statusExp = root.get("status");
            if (!StringUtils.isEmpty(taken)) {
                if (taken.equals("true")) {
                    predicates.add(criteriaBuilder.and(criteriaBuilder.equal(takenExp, true)));
                } else if (taken.equals("false")) {
                    predicates.add(criteriaBuilder.and(criteriaBuilder.equal(takenExp, false)));
                }
            }
            predicates.add(criteriaBuilder.and(criteriaBuilder.equal(statusExp, false)));
        }

        if (!StringUtils.isEmpty(examType)) {
            Expression<String> typeExp = root.get("type");
            predicates.add(criteriaBuilder.and(criteriaBuilder.equal(typeExp, examType)));
        }

        criteriaQuery.where(criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()])));
        criteriaQuery.orderBy(QueryUtils.toOrders(pageable.getSort(), root, criteriaBuilder)).groupBy(root.get("id"));

        TypedQuery<Exam> typedQuery = entityManager.createQuery(criteriaQuery);

        int totalRows = typedQuery.getResultList().size();
        typedQuery.setFirstResult(pageable.getPageNumber() * pageable.getPageSize());
        typedQuery.setMaxResults(pageable.getPageSize());

        if (!StringUtils.isEmpty(studentId)) {
            for (Exam exam : typedQuery.getResultList()) {
                Float score = takeExamService.getStudentScoreByExamAndId(studentId, exam.getId());
                exam.setStudentScore(score);
            }
        }

        List<Exam> tempExams = new ArrayList<>();
        for (Exam exam : typedQuery.getResultList()) {
            if (exam.getTakeExams().size() > 0) {
                exam.setTempTakeExams(exam.getTakeExams().stream().map(takeExam ->
                        new TakeExamDTO(takeExam.getRegister().getStudent().getId(),
                                takeExam.getRegister().getStudent().getFullName(), takeExam.getScore(),
                                takeExam.getTest().getName())).collect(Collectors.toList()));
            }
            tempExams.add(exam);
        }

        return new PageImpl<>(tempExams, pageable, totalRows);
    }

}
