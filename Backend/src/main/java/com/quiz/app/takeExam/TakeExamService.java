package com.quiz.app.takeExam;

import com.quiz.app.exception.ConstrainstViolationException;
import com.quiz.app.exception.NotFoundException;
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
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@Service
public class TakeExamService {

    @Autowired
    TakeExamRepository takeExamRepository;

    @Autowired
    private EntityManager entityManager;

    public TakeExam save(TakeExam takeExam) {
        return takeExamRepository.save(takeExam);
    }

    @Transactional
    public void insertIntoTakeExamTable(int tryTime, int examId, int creditClassId,
                                        String studentId) {
        takeExamRepository.insertIntoTakeExamTable(tryTime, examId, creditClassId, studentId);
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
        return takeExamRepository.findByRegister(register.getCreditClass().getId(),
                register.getStudent().getId());
    }

    public int determineTryTime(Register register) throws ConstrainstViolationException {
        int tryTime = findByRegister(register).size() + 1;
        if (tryTime == 3) {
            throw new ConstrainstViolationException("Một đăng ký chỉ có thể thi tối đa 2 lần");
        }
        return tryTime;
    }

//    public TakeExam findByName(String name) throws NotFoundException {
//        TakeExam takeExam = takeExamRepository.findByName(name);
//
//        if (Objects.nonNull(takeExam)) {
//            return takeExam;
//        }
//
//        throw new NotFoundException("Không tìm thấy môn học với tên " + name);
//    }
//
//    public boolean isNameDuplicated(String id, String name, boolean isEdit) {
//        TakeExam takeExam = takeExamRepository.findByName(name);
//
//        if (isEdit) {
//            return Objects.nonNull(takeExam) && !Objects.equals(takeExam.getId(), id);
//        } else {
//            return Objects.nonNull(takeExam);
//        }
//    }

//    public boolean isIdDuplicated(TakeExamId id, boolean isEdit) {
//        try {
//            TakeExam takeExam = findById(id);
//
//            if (isEdit) {
//                return Objects.nonNull(takeExam) && !Objects.equals(takeExam.getId(), id);
//            } else {
//                return Objects.nonNull(takeExam);
//            }
//        } catch (NotFoundException e) {
//            return false;
//        }
//    }

    public List<TakeExam> findAll() {
        return (List<TakeExam>) takeExamRepository.findAll();
    }

    public Page<TakeExam> findAllSubjects(Map<String, String> filters) {
        int page = Integer.parseInt(filters.get("page"));
        String searchQuery = filters.get("query");
        String sortDir = filters.get("sortDir");
        String sortField = filters.get("sortField");

        Sort sort = Sort.by(sortField);
        sort = sortDir.equals("asc") ? sort.ascending() : sort.descending();
        Pageable pageable = PageRequest.of(page - 1, 10, sort);

        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<TakeExam> criteriaQuery = criteriaBuilder.createQuery(TakeExam.class);
        Root<TakeExam> root = criteriaQuery.from(TakeExam.class);

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

        TypedQuery<TakeExam> typedQuery = entityManager.createQuery(criteriaQuery);

        int totalRows = typedQuery.getResultList().size();
        typedQuery.setFirstResult(pageable.getPageNumber() * pageable.getPageSize());
        typedQuery.setMaxResults(pageable.getPageSize());

        return new PageImpl<>(typedQuery.getResultList(), pageable, totalRows);
    }

}
