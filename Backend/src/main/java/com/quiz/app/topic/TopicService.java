package com.quiz.app.topic;

import com.quiz.app.exception.ConstrainstViolationException;
import com.quiz.app.exception.NotFoundException;
import com.quiz.entity.Topic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;


@Service
public class TopicService {
    private final String DELETE_SUCCESSFULLY = "Xóa bộ đề thành công";
    private final String DELETE_FORBIDDEN = "Không thể xóa bộ đề này vì ràng buộc dữ liệu";

    @Autowired
    TopicRepository topicRepository;

    public Topic save(Topic topic) {
        return topicRepository.save(topic);
    }

    public String deleteById(Integer id) throws ConstrainstViolationException {
        try {
            topicRepository.deleteById(id);
            return DELETE_SUCCESSFULLY;
        } catch (Exception ex) {
            throw new ConstrainstViolationException(DELETE_FORBIDDEN);
        }
    }

    public Topic findById(Integer id) throws NotFoundException {
        Optional<Topic> topic =topicRepository.findById(id);
        if(topic.isPresent()) {
            return topic.get();
        }

        throw new NotFoundException("Không tìm thấy bộ đề với id " + id);
    }
}
