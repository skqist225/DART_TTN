package com.quiz.app.classes;

import com.quiz.app.exception.ConstrainstViolationException;
import com.quiz.app.exception.NotFoundException;
import com.quiz.entity.Class;
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
public class ClassService {
    private final String DELETE_SUCCESSFULLY = "Xóa lớp học thành công";
    private final String DELETE_FORBIDDEN = "Không thể xóa lớp học vì ràng buộc dữ liệu";

    private final Integer MAX_SUBJECTS_PER_PAGE = 20;

    @Autowired
    ClassRepository classRepository;

    @Autowired
    private EntityManager entityManager;

    public Class save(Class cls) {
        return classRepository.save(cls);
    }

    public String deleteById(String id) throws ConstrainstViolationException {
        try {
            classRepository.deleteById(id);
            return DELETE_SUCCESSFULLY;
        } catch (Exception ex) {
            throw new ConstrainstViolationException(DELETE_FORBIDDEN);
        }
    }

    public Class findById(String id) throws NotFoundException {
        Optional<Class> cls = classRepository.findById(id);
        if (cls.isPresent()) {
            return cls.get();
        }

        throw new NotFoundException("Không tìm thấy lớp học với mã " + id);
    }

    public boolean isNameDuplicated(String id, String name, boolean isEdit) {
        Class subject = classRepository.findByName(name);

        if (isEdit) {
            return Objects.nonNull(subject) && !Objects.equals(subject.getId(), id);
        } else {
            return Objects.nonNull(subject);
        }
    }

    public boolean isIdDuplicated(String id, boolean isEdit) {
        Class cls = null;
        try {
            cls = findById(id);

            if (isEdit) {
                return Objects.nonNull(cls) && !Objects.equals(cls.getId(), id);
            } else {
                return Objects.nonNull(cls);
            }
        } catch (NotFoundException e) {
            return false;
        }
    }

    public List<Class> findAll() {
        return (List<Class>) classRepository.findAll();
    }

    public Page<Class> findAllSubjects(Map<String, String> filters) {
        int page = Integer.parseInt(filters.get("page"));
        String searchQuery = filters.get("query");
        String sortDir = filters.get("sortDir");
        String sortField = filters.get("sortField");

        Sort sort = Sort.by(sortField);
        sort = sortDir.equals("asc") ? sort.ascending() : sort.descending();
        Pageable pageable = PageRequest.of(page - 1, MAX_SUBJECTS_PER_PAGE, sort);

        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Class> criteriaQuery = criteriaBuilder.createQuery(Class.class);
        Root<Class> root = criteriaQuery.from(Class.class);

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

        TypedQuery<Class> typedQuery = entityManager.createQuery(criteriaQuery);

        int totalRows = typedQuery.getResultList().size();
        typedQuery.setFirstResult(pageable.getPageNumber() * pageable.getPageSize());
        typedQuery.setMaxResults(pageable.getPageSize());

        return new PageImpl<>(typedQuery.getResultList(), pageable, totalRows);
    }

//    public boolean enableClass(String classId, String action) {
//        try {
//            Class cls = findById(classId);
//            if(action.equals("enable")) {
//                cls.set
//            }
//        } catch (NotFoundException ex) {
//            return false;
//        }
//    }

}
