package com.quiz.app.user;

import com.quiz.app.exception.NotFoundException;
import com.quiz.app.exception.VerifiedUserException;
import com.quiz.app.user.dto.CountUserByRole;
import com.quiz.app.user.dto.UsersDTO;
import com.quiz.entity.Role;
import com.quiz.entity.User;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.query.QueryUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
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
import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@Transactional
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EntityManager entityManager;

    public void saveAll(List<User> users) {
        userRepository.saveAll(users);
    }

    public List<User> findByRole(Integer roleId) {
        return userRepository.findByRole(roleId);
    }

    public List<User> findByRole(Integer roleId, Integer limit, Integer creditClassId) {
        return userRepository.findByRole(roleId, limit, creditClassId);
    }

    public void encodePassword(User user) {
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
    }

    public String getEncodedPassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }

    public boolean isPasswordMatch(String rawPass, String hashPass) {
        return passwordEncoder.matches(rawPass, hashPass);
    }

    public List<User> findUserIsNotStudent() {
        return userRepository.findUserIsNotStudent();
    }

    public User findByEmail(String email) throws NotFoundException {
        User user = userRepository.findByEmail(email);
        if (Objects.nonNull(user)) {
            return user;
        }

        throw new NotFoundException(String.format("Không tìm thấy người dùng với email %s", email));
    }

    public boolean isIdDuplicated(String id) {
        return  userRepository.findById(id).isPresent();
    }

    public boolean isEmailDuplicated(String id, String email, boolean isEdit) {
        User user = userRepository.findByEmail(email);
        if (isEdit) {
            return Objects.nonNull(user) && !Objects.equals(user.getId(), id);
        } else {
            return Objects.nonNull(user);
        }
    }

    public boolean isBirthdayGreaterThanOrEqualTo18(LocalDate birthday) {
        return Period.between(birthday, LocalDate.now()).getYears() < 18;
    }

    @Transactional
    public User save(User user) {
        return userRepository.save(user);
    }

    @Transactional
    public void save(List<User> users) {
        userRepository.saveAll(users);
    }

    public String deleteById(String id)
            throws VerifiedUserException {
        try {
            userRepository.deleteById(id);
            return "Xóa người dùng thành công";
        } catch (Exception ex) {
            return "Không thể xóa người dùng vì ràng buộc dữ liệu";
        }
    }

    public User findById(String id) throws NotFoundException {
        return userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng với mã " + id));
    }

    public UsersDTO findAllUsers(Map<String, String> filters) {
        int page = Integer.parseInt(filters.get("page"));
        String searchQuery = filters.get("query");
        String sortDir = filters.get("sortDir");
        String sortField = filters.get("sortField");
        String roleName = filters.get("roleName");

        Sort sort = null;
        if (sortField.equals("fullName")) {
            sort = Sort.by("lastName").by("firstName");
        } else {
            sort = Sort.by(sortField);
        }
        sort = sortDir.equals("asc") ? sort.ascending() : sort.descending();
        Pageable pageable = PageRequest.of(page - 1, 10, sort);

        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<User> criteriaQuery = criteriaBuilder.createQuery(User.class);
        Root<User> root = criteriaQuery.from(User.class);

        List<Predicate> predicates = new ArrayList<>();

        if (!StringUtils.isEmpty(searchQuery)) {
            Expression<String> id = root.get("id");
            Expression<String> firstName = root.get("firstName");
            Expression<String> lastName = root.get("lastName");

            Expression<String> wantedQueryField = criteriaBuilder.concat(id, " ");
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, lastName);
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, " ");
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, firstName);

            predicates.add(criteriaBuilder.and(criteriaBuilder.like(wantedQueryField, "%" + searchQuery + "%")));
        }

        if (!StringUtils.isEmpty(roleName)) {
            Join<User, Role> joinOptions = root.join("roles", JoinType.LEFT);
            predicates.add(criteriaBuilder.and(criteriaBuilder.equal(
                    joinOptions.get("name"), roleName
            )));
        }

        criteriaQuery
                .where(criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()])))
                .orderBy(QueryUtils.toOrders(pageable.getSort(), root, criteriaBuilder));

        TypedQuery<User> typedQuery = entityManager.createQuery(criteriaQuery);
        int totalRows = typedQuery.getResultList().size();
        typedQuery.setFirstResult(pageable.getPageNumber() * pageable.getPageSize());
        typedQuery.setMaxResults(pageable.getPageSize());

        Page<User> result = new PageImpl<>(typedQuery.getResultList(), pageable, totalRows);

        return new UsersDTO(result.getContent(), result.getTotalElements(), result.getTotalPages());
    }
}
