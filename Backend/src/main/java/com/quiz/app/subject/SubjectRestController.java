package com.quiz.app.subject;

import com.quiz.app.exception.ConstrainstViolationException;
import com.quiz.app.exception.NotFoundException;
import com.quiz.app.response.StandardJSONResponse;
import com.quiz.app.response.error.BadResponse;
import com.quiz.app.response.success.OkResponse;
import com.quiz.app.security.UserDetailsImpl;
import com.quiz.app.subject.dto.PostCreateSubjectDTO;
import com.quiz.app.utils.ProcessImage;
import com.quiz.entity.Question;
import com.quiz.entity.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Objects;


@RestController
@RequestMapping("/api/subjects")
public class SubjectRestController {
    public final String DEV_STATIC_DIR = "src/main/resources/static/question_images";
    public final String PROD_STATIC_DIR = "/opt/tomcat/webapps/ROOT/WEB-INF/classes/static/question_images";
    public final String PROD_STATIC_PATH = "static/question_images";

    @Value("${env}")
    private String environment;

    @Autowired
    private SubjectService subjectService;

    @PostMapping("save")
    public ResponseEntity<StandardJSONResponse<Subject>> fetchCitiesByState(
            @RequestBody PostCreateSubjectDTO postCreateSubjectDTO) {
        Integer id = postCreateSubjectDTO.getId();
        Subject savedSubject = null;

        if (Objects.isNull(postCreateSubjectDTO.getName())) {
            return new BadResponse<Subject>("Tên môn học không được để trống").response();
        }

        if (Objects.nonNull(id)) {


            if (subjectService.checkNameDuplicated(id, postCreateSubjectDTO.getName()).equals("Duplicated")) {
                return new BadResponse<Subject>("Tên môn học là duy nhất").response();
            }

            try {
                Subject subject = subjectService.findById(id);
                subject.setName(postCreateSubjectDTO.getName());

                savedSubject = subjectService.save(subject);

            } catch (NotFoundException exception) {
                return new BadResponse<Subject>(exception.getMessage()).response();
            }
        } else {
            savedSubject = subjectService.save(Subject.build(postCreateSubjectDTO));
        }

        return new OkResponse<>(savedSubject).response();
    }

    @DeleteMapping("{id}/delete")
    public ResponseEntity<StandardJSONResponse<String>> delete(@PathVariable("id") Integer id) {
        try {
            return new OkResponse<>(subjectService.deleteById(id)).response();
        } catch (ConstrainstViolationException ex) {
            return new BadResponse<String>(ex.getMessage()).response();
        }
    }
}
