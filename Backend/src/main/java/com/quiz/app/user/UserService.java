package com.quiz.app.user;

import com.quiz.app.exception.NotFoundException;
import com.quiz.app.exception.VerifiedUserException;
import com.quiz.app.user.dto.CountUserByRole;
import com.quiz.app.user.dto.UsersDTO;
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

    public CountUserByRole countUserByRole() {
        return null;
        // return new CountUserByRole(userRepository.countUserByRole(1),
        // userRepository.countUserByRole(2),
        // userRepository.countUserByRole(3));
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
        String roles = filters.get("roles");
        String statuses = filters.get("statuses");
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

        Expression<String> userId = root.get("id");
        Expression<String> firstName = root.get("firstName");
        Expression<String> lastName = root.get("lastName");
        Expression<String> email = root.get("email");
        Expression<String> birthday = root.get("birthday");

        if (!StringUtils.isEmpty(searchQuery)) {
            Expression<String> wantedQueryField = criteriaBuilder.concat(userId, " ");
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, firstName);
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, " ");
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, lastName);
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, " ");
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, email);
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, " ");
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, birthday);

            predicates.add(criteriaBuilder.and(criteriaBuilder.like(wantedQueryField, "%" + searchQuery + "%")));
        }

//        List<String> userRoles = new ArrayList<>();
//        if (roles.split(",").length > 0) {
//            for (String role : roles.split(",")) {
//                if (Objects.equals(role, "Student")) {
//                    userRoles.add("Student");
//                } else if (Objects.equals(role, "Teacher")) {
//                    userRoles.add("Teacher");
//                } else {
//                    userRoles.add("Admin");
//                }
//            }
//        }

//        if (userRoles.size() > 0) {
//            predicates.add(criteriaBuilder.and(roleName.in(userRoles)));
//        }

//        List<Boolean> statusesID = new ArrayList<>();
//        if (statuses.split(",").length > 0) {
//            for (String statuss : statuses.split(",")) {
//                if (Objects.equals(statuss, "1")) {
//                    statusesID.add(true);
//                } else {
//                    statusesID.add(false);
//                }
//            }
//        }

//        if (statusesID.size() > 0) {
//            predicates.add(criteriaBuilder.and(status.in(statusesID)));
//        }
//

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
