package com.quiz.app.takeExam;

import com.quiz.app.response.StandardJSONResponse;
import com.quiz.app.response.success.OkResponse;
import com.quiz.app.security.UserDetailsImpl;
import com.quiz.app.takeExam.dto.TakeExamsDTO;
import com.quiz.entity.TakeExam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/takeExams")
public class TakeExamRestController {
    @Autowired
    private TakeExamService takeExamService;

    @GetMapping("")
    public ResponseEntity<StandardJSONResponse<TakeExamsDTO>> fetchAllSubjects(
            @RequestParam("page") String page,
            @RequestParam(name = "query", required = false, defaultValue = "") String query,
            @RequestParam(name = "sortDir", required = false, defaultValue = "desc") String sortDir,
            @RequestParam(name = "sortField", required = false, defaultValue = "score") String sortField,
            @RequestParam(name = "creditClass", required = false, defaultValue = "") String creditClassId,
            @RequestParam(name = "examType", required = false, defaultValue = "Giữa kỳ") String examType
    ) {
        TakeExamsDTO subjectsDTO = new TakeExamsDTO();

        if (page.equals("0")) {
            List<TakeExam> takeExams = takeExamService.findAll();

            subjectsDTO.setTakeExams(takeExams);
            subjectsDTO.setTotalElements(takeExams.size());
            subjectsDTO.setTotalPages(0);

        } else {
            Map<String, String> filters = new HashMap<>();
            filters.put("page", page);
            filters.put("query", query);
            filters.put("sortDir", sortDir);
            filters.put("sortField", sortField);
            filters.put("creditClassId", creditClassId);
            filters.put("examType", examType);

            Page<TakeExam> takeExamPage = takeExamService.findAllTakeExams(filters);
            subjectsDTO.setTakeExams(takeExamPage.getContent());
            subjectsDTO.setTotalElements(takeExamPage.getTotalElements());
            subjectsDTO.setTotalPages(takeExamPage.getTotalPages());
        }

        return new OkResponse<>(subjectsDTO).response();
    }

    @GetMapping("getTestedExam")
    public ResponseEntity<StandardJSONResponse<List<Integer>>> getTestedExam(@AuthenticationPrincipal UserDetailsImpl userDetailsImpl) {
        return new OkResponse<>(takeExamService.testedExam(userDetailsImpl.getUser().getId())).response();
    }

    @GetMapping("getStudentRankingPosition")
    public ResponseEntity<StandardJSONResponse<Integer>> getStudentRankingPosition(
            @AuthenticationPrincipal UserDetailsImpl userDetailsImpl,
            @RequestParam("creditClass") Integer creditClassId,
            @RequestParam("examType") String examType
    ) {
        return new OkResponse<>(takeExamService.getStudentRankingPosition(userDetailsImpl.getUser()
                .getId(), creditClassId, examType)).response();
    }

}
