package com.quiz.app.question;

import com.quiz.app.exception.ConstrainstViolationException;
import com.quiz.app.exception.NotFoundException;
import com.quiz.entity.Question;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;


@Service
public class QuestionService {
    private final String DELETE_SUCCESSFULLY = "Xóa câu hỏi thành công";
    private final String DELETE_FORBIDDEN = "Không thể xóa câu hỏi này vì ràng buộc dữ liệu";

    @Autowired
    QuestionRepository questionRepository;

    public Question save(Question question) {
        return questionRepository.save(question);
    }

    public String deleteById(Integer id) throws ConstrainstViolationException {
        try {
            questionRepository.deleteById(id);
            return DELETE_SUCCESSFULLY;
        } catch (Exception ex) {
            throw new ConstrainstViolationException(DELETE_FORBIDDEN);
        }
    }

    public Question findById(Integer id) throws NotFoundException {
        Optional<Question> question =questionRepository.findById(id);
        if(question.isPresent()) {
            return question.get();
        }

        throw new NotFoundException("Không tìm thấy câu hỏi với id " + id);
    }

    public String checkContentDuplicated(Integer id, String content) {
        Question question = questionRepository.findByContent(content);

        if (Objects.nonNull(question) && !Objects.equals(question.getId(), id)) {
            return "Duplicated";
        }

        return "OK";
    }
}
