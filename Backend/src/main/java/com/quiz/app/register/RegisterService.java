package com.quiz.app.register;

import com.quiz.app.exception.ConstrainstViolationException;
import com.quiz.app.exception.NotFoundException;
import com.quiz.entity.CreditClass;
import com.quiz.entity.Register;
import com.quiz.entity.RegisterId;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@Service
public class RegisterService {

    @Autowired
    RegisterRepository registerRepository;

    @Autowired
    private EntityManager entityManager;

    public Register save(Register Register) {
        return registerRepository.save(Register);
    }

    public String deleteById(RegisterId id) throws ConstrainstViolationException {
        try {
            registerRepository.deleteById(id);
            return "Xóa môn học thành công";
        } catch (Exception ex) {
            throw new ConstrainstViolationException("Không thể xóa môn học vì ràng buộc dữ liệu");
        }
    }

    public Register findById(RegisterId id) throws NotFoundException {
        Optional<Register> Register = registerRepository.findById(id);
        if (Register.isPresent()) {
            return Register.get();
        }

        throw new NotFoundException("Không tìm thấy môn học với mã " + id);
    }

    public List<Register> findAll() {
        return (List<Register>) registerRepository.findAll();
    }

    public List<Register> findByCreditClass(Integer creditClassId) {
        return registerRepository.findByMyCreditClass(creditClassId);
    }

    public Page<Register> findAllRegisters(Map<String, String> filters) {
        int page = Integer.parseInt(filters.get("page"));
        String searchQuery = filters.get("query");
        String sortDir = filters.get("sortDir");
        String sortField = filters.get("sortField");

        Sort sort = Sort.by(sortField);
        sort = sortDir.equals("asc") ? sort.ascending() : sort.descending();
        Pageable pageable = PageRequest.of(page - 1, 10, sort);

        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Register> criteriaQuery = criteriaBuilder.createQuery(Register.class);
        Root<Register> root = criteriaQuery.from(Register.class);

        List<Predicate> predicates = new ArrayList<>();

        if (!StringUtils.isEmpty(searchQuery)) {
//            Expression<String> id = root.get("id");
//            Expression<String> name = root.get("name");

//            Expression<String> wantedQueryField = criteriaBuilder.concat(id, " ");
//            Expression<String> wantedQueryField = criteriaBuilder.concat("", name);

//            predicates.add(criteriaBuilder.and(criteriaBuilder.like(wantedQueryField, "%" + searchQuery + "%")));
        }

        criteriaQuery.where(criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()])));
//        criteriaQuery.orderBy(QueryUtils.toOrders(pageable.getSort(), root, criteriaBuilder));

        TypedQuery<Register> typedQuery = entityManager.createQuery(criteriaQuery);

        int totalRows = typedQuery.getResultList().size();
        typedQuery.setFirstResult(pageable.getPageNumber() * pageable.getPageSize());
        typedQuery.setMaxResults(pageable.getPageSize());

        return new PageImpl<>(typedQuery.getResultList(), pageable, totalRows);
    }

}