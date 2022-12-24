package com.quiz.app.takeExam;

import com.quiz.app.creditClass.CreditClassService;
import com.quiz.app.exception.ConstrainstViolationException;
import com.quiz.app.exception.NotFoundException;
import com.quiz.entity.Exam;
import com.quiz.entity.Register;
import com.quiz.entity.TakeExam;
import com.quiz.entity.TakeExamId;
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
import java.util.Objects;
import java.util.Optional;


@Service
public class TakeExamService {

    @Autowired
    private TakeExamRepository takeExamRepository;

    @Autowired
    private CreditClassService creditClassService;

    @Autowired
    private EntityManager entityManager;

    public TakeExam save(TakeExam takeExam) {
        return takeExamRepository.save(takeExam);
    }

    @Transactional
    public void insertIntoTakeExamTable(int tryTime, int examId, int creditClassId,
                                        String studentId, int testId) {
        takeExamRepository.insertIntoTakeExamTable(tryTime, examId, creditClassId, studentId,
                testId);
    }

    public Integer getStudentRankingPosition(String studentId, Integer creditClassId,
                                             String examType) {
        Integer score = takeExamRepository
                .getStudentRankingPosition(creditClassId, examType, studentId);
        if (Objects.isNull(score)) {
            return 0;
        }
        return score;
    }

    public String deleteById(TakeExamId id) throws ConstrainstViolationException {
        try {
            takeExamRepository.deleteById(id);
            return "Xóa đăng ký thành công";
        } catch (Exception ex) {
            throw new ConstrainstViolationException("Không thể xóa đăng ký vì ràng buộc dữ liệu");
        }
    }

    public TakeExam findById(TakeExamId id) throws NotFoundException {
        Optional<TakeExam> takeExam = takeExamRepository.findById(id);
        if (takeExam.isPresent()) {
            return takeExam.get();
        }

        throw new NotFoundException("Không tìm thấy môn học với mã " + id);
    }

    public List<TakeExam> findByRegister(Register register) {
        return takeExamRepository.findByRegister(register.getCreditClass().getId(), register.getStudent().getId());
    }

    public boolean isTakeExamTested(String studentId, Integer examId) {
        return takeExamRepository.isTakeExamTested(studentId, examId);
    }

    @Transactional
    public void updateTakeExamScore(String studentId, Integer examId, float mark) {
        takeExamRepository.updateTakeExamScore(studentId, examId, mark);
    }

    @Transactional
    public void updateTakeExamTested(String studentId, Integer examId) {
        takeExamRepository.updateTakeExamTested(studentId, examId);
    }

    public TakeExam findByStudentAndExam(String studentId, Integer examId) {
        return takeExamRepository.findByStudentAndExam(studentId, examId);
    }

    public int determineTryTime(Register register) throws ConstrainstViolationException {
        int tryTime = findByRegister(register).size() + 1;
        if (tryTime == 3) {
            throw new ConstrainstViolationException("Một đăng ký chỉ có thể thi tối đa 2 lần");
        }
        return tryTime;
    }

    public List<Integer> testedExam(String studentId) {
        return takeExamRepository.testedExam(studentId);
    }

    public Float getStudentScoreByExamAndId(String studentId, Integer examId) {
        return takeExamRepository.getStudentScoreByExamAndId(studentId, examId);
    }

    public List<TakeExam> findAll() {
        return (List<TakeExam>) takeExamRepository.findAll();
    }

    public Page<TakeExam> findAllTakeExams(Map<String, String> filters) {
        int page = Integer.parseInt(filters.get("page"));
        String searchQuery = filters.get("query");
        String sortDir = filters.get("sortDir");
        String sortField = filters.get("sortField");
        String creditClassId = filters.get("creditClassId");
        String examType = filters.get("examType");

        Sort sort = null;
        Sort sortByScore = Sort.by(sortField);
        Sort sortByStudentId = Sort.by("register.student.id");

        sort = sortByScore.and(sortByStudentId);
        sort = sortDir.equals("asc") ? sort.ascending() : sort.descending();
        Pageable pageable = PageRequest.of(page - 1, 15, sort);

        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<TakeExam> criteriaQuery = criteriaBuilder.createQuery(TakeExam.class);
        Root<TakeExam> root = criteriaQuery.from(TakeExam.class);

        List<Predicate> predicates = new ArrayList<>();
        Join<TakeExam, Register> joinOptions = root.join("register", JoinType.INNER);

        if (!StringUtils.isEmpty(searchQuery)) {
            Expression<String> id = joinOptions.get("student").get("id");
            Expression<String> firstName = joinOptions.get("student").get("firstName");
            Expression<String> lastName = joinOptions.get("student").get("firstName");

            Expression<String> wantedQueryField = criteriaBuilder.concat(id, " ");
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, firstName);
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, " ");
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, lastName);
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, " ");

            predicates.add(criteriaBuilder.and(criteriaBuilder.like(wantedQueryField, "%" + searchQuery + "%")));
        }

        System.out.println(creditClassId);
        if (!StringUtils.isEmpty(creditClassId)) {
            Expression<Integer> creditClassIdExp = joinOptions.get("creditClass").get("id");

            List<Integer> arrays = new ArrayList<>();
            arrays.add(Integer.parseInt(creditClassId));

            predicates.add(criteriaBuilder.and(creditClassIdExp.in(arrays)));
        }

        System.out.println(examType);
        if (!StringUtils.isEmpty(examType)) {
            Join<TakeExam, Exam> examJoinOptions = root.join("exam", JoinType.INNER);
            predicates.add(criteriaBuilder.and(criteriaBuilder.equal(examJoinOptions.get("type"), examType)));
        }

        criteriaQuery.where(criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()])));
        criteriaQuery.orderBy(QueryUtils.toOrders(pageable.getSort(), root, criteriaBuilder));

        TypedQuery<TakeExam> typedQuery = entityManager.createQuery(criteriaQuery);

        int totalRows = typedQuery.getResultList().size();
        typedQuery.setFirstResult(pageable.getPageNumber() * pageable.getPageSize());
        typedQuery.setMaxResults(pageable.getPageSize());

        List<TakeExam> takeExams = typedQuery.getResultList();
        for (int i = 0; i < takeExams.size(); i++) {
            takeExams.get(i).setRankOrder(i + 1);
        }

        return new PageImpl<>(typedQuery.getResultList(), pageable, totalRows);
    }

}
