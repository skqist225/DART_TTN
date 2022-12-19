package com.quiz.app.creditClass;

import com.quiz.app.exception.ConstrainstViolationException;
import com.quiz.app.exception.NotFoundException;
import com.quiz.entity.CreditClass;
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
public class CreditClassService {

    @Autowired
    private CreditClassRepository creditClassRepository;

    @Autowired
    private EntityManager entityManager;

    public void saveAll(List<CreditClass> creditClasses) {
        creditClassRepository.saveAll(creditClasses);
    }

    public CreditClass save(CreditClass cls) {
        return creditClassRepository.save(cls);
    }

    public String deleteById(Integer id) throws ConstrainstViolationException {
        try {
            creditClassRepository.deleteById(id);
            return "Xóa lớp tín chỉ thành công";
        } catch (Exception ex) {
            throw new ConstrainstViolationException("Không thể xóa lớp tín chỉ vì ràng buộc dữ liệu");
        }
    }

    public CreditClass findById(Integer id) throws NotFoundException {
        Optional<CreditClass> cls = creditClassRepository.findById(id);
        if (cls.isPresent()) {
            return cls.get();
        }

        throw new NotFoundException("Không tìm thấy lớp học với mã " + id);
    }

    public List<CreditClass> findAll() {
        return (List<CreditClass>) creditClassRepository.findAll();
    }

    public List<CreditClass> findAllActiveCreditClassHaveRegister() {
        return creditClassRepository.findAllActiveCreditClassHaveRegister();
    }

    public List<CreditClass> findAllActiveCreditClass() {
        return creditClassRepository.findAllActiveCreditClass();
    }


    public List<CreditClass> findAllActiveCreditClassAndStudent(String studentId) {
        return creditClassRepository.findAllActiveCreditClassAndStudent(studentId);
    }

    public CreditClass findByUniqueKey(String schoolYear, double semester, String subjectId,
                                       int group) throws NotFoundException {
        CreditClass creditClass = creditClassRepository.findByUniqueKey(schoolYear, semester,
                subjectId,
                group);

        if (Objects.isNull(creditClass)) {
            throw new NotFoundException("Không tìm thấy lớp tín chỉ này");
        }

        return creditClass;
    }

    public boolean isUniqueKey(Integer id, String schoolYear, double semester, String subjectId, int group, boolean isEdit) {
        CreditClass creditClass = creditClassRepository.findByUniqueKey(schoolYear, semester,
                subjectId,
                group);
        if (isEdit) {
            return Objects.nonNull(creditClass) && !Objects.equals(creditClass.getId(), id);
        } else {
            return Objects.nonNull(creditClass);
        }
    }

    public Page<CreditClass> findAllCreditClasses(Map<String, String> filters) {
        int page = Integer.parseInt(filters.get("page"));
        String searchQuery = filters.get("query");
        String sortDir = filters.get("sortDir");
        String sortField = filters.get("sortField");
        String teacherId = filters.get("teacherId");
        String subjectId = filters.get("subjectId");

        Sort sort = Sort.by(sortField);
        sort = sortDir.equals("asc") ? sort.ascending() : sort.descending();
        Pageable pageable = PageRequest.of(page - 1, 10, sort);

        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<CreditClass> criteriaQuery = criteriaBuilder.createQuery(CreditClass.class);
        Root<CreditClass> root = criteriaQuery.from(CreditClass.class);

        List<Predicate> predicates = new ArrayList<>();

        if (!StringUtils.isEmpty(searchQuery)) {
            Expression<String> id = root.get("id");
            Expression<String> schoolYear= root.get("schoolYear");
            Expression<String> semester= root.get("semester");
            Expression<String> group= root.get("group");
            Expression<String> subjectName = root.get("subject").get("name");

            Expression<String> wantedQueryField = criteriaBuilder.concat(id, " ");
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, schoolYear);
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, " ");
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, semester);
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, " ");
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, group);
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, " ");
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, subjectName);

            predicates.add(criteriaBuilder.and(criteriaBuilder.like(wantedQueryField, "%" + searchQuery + "%")));
        }
        System.out.println(subjectId);
        if (!StringUtils.isEmpty(subjectId)) {
            Expression<String> subject = root.get("subject").get("id");
            predicates.add(criteriaBuilder.and(criteriaBuilder.equal(subject, subjectId)));
        }

        System.out.println(teacherId);
        if (!StringUtils.isEmpty(teacherId)) {
            Expression<String> teacher = root.get("teacher").get("id");
            predicates.add(criteriaBuilder.and(criteriaBuilder.equal(teacher, teacherId)));
        }

        criteriaQuery.where(criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()])));
        criteriaQuery.orderBy(QueryUtils.toOrders(pageable.getSort(), root, criteriaBuilder));

        TypedQuery<CreditClass> typedQuery = entityManager.createQuery(criteriaQuery);

        int totalRows = typedQuery.getResultList().size();
        typedQuery.setFirstResult(pageable.getPageNumber() * pageable.getPageSize());
        typedQuery.setMaxResults(pageable.getPageSize());

        return new PageImpl<>(typedQuery.getResultList(), pageable, totalRows);
    }

    public String enableOrDisable(Integer id, String action) throws NotFoundException {
        try {
            CreditClass creditClass = findById(id);
            String responseMessage = "";
            if (action.equals("enable")) {
                creditClass.setStatus(false);
                responseMessage = "Mở lớp tín chỉ thành công";
            } else {
                creditClass.setStatus(true);
                responseMessage = "Hủy lớp tín chỉ thành công";
            }

            creditClassRepository.save(creditClass);

            return responseMessage;
        } catch (NotFoundException ex) {
            throw new NotFoundException(ex.getMessage());
        }
    }

}
