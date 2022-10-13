package com.quiz.app.examPaper;

import com.quiz.app.exception.NotFoundException;
import com.quiz.entity.ExamPaper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class ExamPaperService {
    private final String DELETE_SUCCESSFULLY = "Xóa bộ đề thành công";
    private final String DELETE_FORBIDDEN = "Không thể xóa bộ đề này vì ràng buộc dữ liệu";

    @Autowired
    ExamPaperRepository topicRepository;

    public ExamPaper save(ExamPaper topic) {
        return topicRepository.save(topic);
    }

//    public String deleteById(Integer id) throws ConstrainstViolationException {
//        try {
//            topicRepository.deleteById(id);
//            return DELETE_SUCCESSFULLY;
//        } catch (Exception ex) {
//            throw new ConstrainstViolationException(DELETE_FORBIDDEN);
//        }
//    }

    public ExamPaper findById(Integer id) throws NotFoundException {
        Optional<ExamPaper> topic =topicRepository.findById(id);
        if(topic.isPresent()) {
            return topic.get();
        }

        throw new NotFoundException("Không tìm thấy bộ đề với mã " + id);
    }
}
