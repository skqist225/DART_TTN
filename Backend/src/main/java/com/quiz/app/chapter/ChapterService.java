package com.quiz.app.chapter;

import com.quiz.app.exception.ConstrainstViolationException;
import com.quiz.app.exception.NotFoundException;
import com.quiz.entity.Chapter;
import com.quiz.entity.Subject;
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
import java.util.Objects;
import java.util.Optional;


@Service
public class ChapterService {

    @Autowired
    ChapterRepository chapterRepository;

    @Autowired
    private EntityManager entityManager;


    public List<Chapter> saveAll(List<Chapter> chapters) {
        return (List<Chapter>) chapterRepository.saveAll(chapters);
    }

    public Chapter save(Chapter chapter) {
        return chapterRepository.save(chapter);
    }

    @Transactional
    public String deleteById(Integer id) throws ConstrainstViolationException {
        try {
            chapterRepository.deleteById(id);
            return "Xóa chương thành công";
        } catch (Exception ex) {
            throw new ConstrainstViolationException("Không thể xóa chương vì ràng buộc dữ liệu");
        }
    }

    @Transactional
    public void updateById(Integer id, String name) {
        chapterRepository.updateById(id, name);
    }

    public List<Chapter> findBySubject(Subject subject) {
        return chapterRepository.findBySubject(subject);

    }

    public Chapter findById(Integer id) throws NotFoundException {
        Optional<Chapter> chapter = chapterRepository.findById(id);
        if (chapter.isPresent()) {
            return chapter.get();
        }

        throw new NotFoundException("Không tìm thấy môn học với mã " + id);
    }

    public Chapter findByName(String name) throws NotFoundException {
        Chapter chapter = chapterRepository.findByName(name);

        if (Objects.nonNull(chapter)) {
            return chapter;
        }

        throw new NotFoundException("Không tìm thấy môn học với tên " + name);
    }

    public boolean isNameDuplicated(Integer id, String name, boolean isEdit) {
        Chapter chapter = chapterRepository.findByName(name);

        if (isEdit) {
            return Objects.nonNull(chapter) && !Objects.equals(chapter.getId(), id);
        } else {
            return Objects.nonNull(chapter);
        }
    }

    public boolean isIdDuplicated(Integer id, boolean isEdit) {
        Chapter chapter = null;
        try {
            chapter = findById(id);

            if (isEdit) {
                return Objects.nonNull(chapter) && !Objects.equals(chapter.getId(), id);
            } else {
                return Objects.nonNull(chapter);
            }
        } catch (NotFoundException e) {
            return false;
        }
    }

    public List<Chapter> findAll() {
        return (List<Chapter>) chapterRepository.findAll();
    }

    public Page<Chapter> findAllSubjects(Map<String, String> filters) {
        int page = Integer.parseInt(filters.get("page"));
        String searchQuery = filters.get("query");
        String sortDir = filters.get("sortDir");
        String sortField = filters.get("sortField");
        String subjectId = filters.get("subjectId");

        Sort sort = Sort.by(sortField);
        sort = sortDir.equals("asc") ? sort.ascending() : sort.descending();
        Integer MAX_SUBJECTS_PER_PAGE = 20;
        Pageable pageable = PageRequest.of(page - 1, MAX_SUBJECTS_PER_PAGE, sort);

        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Chapter> criteriaQuery = criteriaBuilder.createQuery(Chapter.class);
        Root<Chapter> root = criteriaQuery.from(Chapter.class);

        List<Predicate> predicates = new ArrayList<>();

        if (!StringUtils.isEmpty(searchQuery)) {
            Expression<String> id = root.get("id");
            Expression<String> name = root.get("name");

            Expression<String> wantedQueryField = criteriaBuilder.concat(id, " ");
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, name);

            predicates.add(criteriaBuilder.and(criteriaBuilder.like(wantedQueryField, "%" + searchQuery + "%")));
        }

        if (!StringUtils.isEmpty(subjectId)) {
            Expression<String> subject = root.get("subject").get("id");
            predicates.add(criteriaBuilder.and(criteriaBuilder.equal(subject, subjectId)));
        }

        criteriaQuery.where(criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()])));
        criteriaQuery.orderBy(QueryUtils.toOrders(pageable.getSort(), root, criteriaBuilder));

        TypedQuery<Chapter> typedQuery = entityManager.createQuery(criteriaQuery);

        int totalRows = typedQuery.getResultList().size();
        typedQuery.setFirstResult(pageable.getPageNumber() * pageable.getPageSize());
        typedQuery.setMaxResults(pageable.getPageSize());

        return new PageImpl<>(typedQuery.getResultList(), pageable, totalRows);
    }

}
