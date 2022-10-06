package com.quiz.app.subject;

import com.quiz.app.exception.ConstrainstViolationException;
import com.quiz.app.exception.NotFoundException;
import com.quiz.entity.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;


@Service
public class SubjectService {
    private final String DELETE_SUCCESSFULLY = "Xóa môn học thành công";
    private final String DELETE_FORBIDDEN = "Không thể xóa môn học vì ràng buộc dữ liệu";

    @Autowired
    SubjectRepository subjectRepository;

    public Subject save(Subject subject) {
        return subjectRepository.save(subject);
    }

    public String deleteById(Integer id) throws ConstrainstViolationException {
        try {
            subjectRepository.deleteById(id);
            return DELETE_SUCCESSFULLY;
        } catch (Exception ex) {
            throw new ConstrainstViolationException(DELETE_FORBIDDEN);
        }
    }

    public Subject findById(Integer id) throws NotFoundException {
        Optional<Subject> subject =subjectRepository.findById(id);
        if(subject.isPresent()) {
            return subject.get();
        }

        throw new NotFoundException("Không tìm thấy môn học với id " + id);
    }

    public String checkNameDuplicated(Integer id, String content) {
        Subject subject = subjectRepository.findByName(content);

        if (Objects.nonNull(subject) && !Objects.equals(subject.getId(), id)) {
            return "Duplicated";
        }

        return "OK";
    }
}
