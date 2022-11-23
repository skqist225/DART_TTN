package com.quiz.app.statistics;


import com.quiz.app.response.StandardJSONResponse;
import com.quiz.app.response.success.OkResponse;
import com.quiz.app.statistics.dto.CountTestsBySubjectAndStatus;
import com.quiz.app.statistics.dto.CountTotalDTO;
import com.quiz.app.statistics.dto.DoughnutChartDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/statistics")
public class StatisticRestController {
    @Autowired
    private StatisticService statisticService;

    @GetMapping("")
    public ResponseEntity<StandardJSONResponse<CountTotalDTO>> countTotal() {
        return new OkResponse<>(statisticService.count()).response();
    }

    @GetMapping("doughnut")
    public ResponseEntity<StandardJSONResponse<DoughnutChartDTO>> countDoughnutChart() {
        return new OkResponse<>(statisticService.doughnut()).response();
    }

    @GetMapping("countTestsBySubjectAndStatus")
    public ResponseEntity<StandardJSONResponse<List<CountTestsBySubjectAndStatus>>> countTestsBySubjectAndStatus() {
        return new OkResponse<>(statisticService.countTestsBySubjectAndStatus()).response();
    }
}
