package com.quiz.app.examPaper;

import com.quiz.app.response.StandardJSONResponse;
import com.quiz.app.response.error.BadResponse;
import com.quiz.app.response.success.OkResponse;
import com.quiz.app.security.UserDetailsImpl;
import com.quiz.app.examPaper.dto.PostCreateSubjectDTO;
import com.quiz.entity.Subject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Objects;


@RestController
@RequestMapping("/api/examPapers")
public class ExamPaperRestController {
    @Value("${env}")
    private String environment;

//    @Autowired
//    private Exam topicService;

    @PostMapping("save")
    public ResponseEntity<StandardJSONResponse<Subject>> fetchCitiesByState(
            @AuthenticationPrincipal UserDetailsImpl userDetailsImpl,
            @ModelAttribute PostCreateSubjectDTO postCreateSubjectDTO) throws IOException {
        Integer id = postCreateSubjectDTO.getId();
        Subject savedSubject = null;
        if (Objects.nonNull(id)) {
            if (Objects.isNull(postCreateSubjectDTO.getName())) {
                return new BadResponse<Subject>("Tên môn học không được để trống").response();
            }

//            if (topicService.checkNameDuplicated(id, postCreateSubjectDTO.getName()).equals("Duplicated")) {
//                return new BadResponse<Subject>("Tên môn học là duy nhất").response();
//            }
//
//            try {
//                Subject subject = topicService.findById(id);
//                subject.setName(postCreateSubjectDTO.getName());
//
//                savedSubject = topicService.save(subject);
//
//            } catch (NotFoundException exception) {
//                return new BadResponse<Subject>(exception.getMessage()).response();
//            }
        } else {
//            savedSubject = topicService.save(Subject.build(postCreateSubjectDTO));
        }

        return new OkResponse<>(savedSubject).response();
    }

//    @DeleteMapping("{id}/delete")
//    public ResponseEntity<StandardJSONResponse<String>> delete(@PathVariable("id") Integer id) {
//        try {
//            return new OkResponse<>(topicService.deleteById(id)).response();
//        } catch (ConstrainstViolationException ex) {
//            return new BadResponse<String>(ex.getMessage()).response();
//        }
//    }
}
