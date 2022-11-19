package com.quiz.app.register;

import com.quiz.app.common.CommonUtils;
import com.quiz.app.exception.ConstrainstViolationException;
import com.quiz.app.exception.NotFoundException;
import com.quiz.app.register.dto.PostCreateRegisterDTO;
import com.quiz.app.register.dto.RegistersDTO;
import com.quiz.app.response.StandardJSONResponse;
import com.quiz.app.response.error.BadResponse;
import com.quiz.app.response.success.OkResponse;
import com.quiz.entity.Register;
import com.quiz.entity.RegisterId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;


@RestController
@RequestMapping("/api/registers")
public class RegisterRestController {
    @Autowired
    private RegisterService registerService;

    @GetMapping("")
    public ResponseEntity<StandardJSONResponse<RegistersDTO>> fetchAllSubjects(
            @RequestParam("page") String page,
            @RequestParam(name = "query", required = false, defaultValue = "") String query,
            @RequestParam(name = "sortDir", required = false, defaultValue = "desc") String sortDir,
            @RequestParam(name = "sortField", required = false, defaultValue = "id") String sortField,
            @RequestParam(name = "creditClass", required = false, defaultValue = "") Integer creditClass
    ) {
        RegistersDTO subjectsDTO = new RegistersDTO();

        if(page.equals("0")) {
            List<Register> registers = null;
            if(Objects.nonNull(creditClass)) {
                
            } else {
                registers = registerService.findAll();
            }

            subjectsDTO.setRegisters(registers);
            subjectsDTO.setTotalElements(registers.size());
            subjectsDTO.setTotalPages(0);

        } else {
            Map<String, String> filters = new HashMap<>();
            filters.put("page", page);
            filters.put("query", query);
            filters.put("sortDir", sortDir);
            filters.put("sortField", sortField);

            Page<Register> subjectsPage = registerService.findAllRegisters(filters);

            subjectsDTO.setRegisters(subjectsPage.getContent());
            subjectsDTO.setTotalElements(subjectsPage.getTotalElements());
            subjectsDTO.setTotalPages(subjectsPage.getTotalPages());
        }

        return new OkResponse<>(subjectsDTO).response();
    }

    @PostMapping("save")
    public ResponseEntity<StandardJSONResponse<Register>> saveSubject(
            @RequestBody PostCreateRegisterDTO postCreateRegisterDTO,
            @RequestParam(name = "isEdit", required = false, defaultValue = "false") boolean isEdit
    ) {
        Register savedSubject = null;
        CommonUtils commonUtils = new CommonUtils();

        String id = postCreateRegisterDTO.getId();
        String name = postCreateRegisterDTO.getName();
        String numberOfTheoreticalPeriods = postCreateRegisterDTO.getNumberOfTheoreticalPeriods();
        String numberOfPracticePeriods = postCreateRegisterDTO.getNumberOfPracticePeriods();

        if (Objects.isNull(id)) {
            commonUtils.addError("id", "Mã môn học không được để trống");
        }

        if (Objects.isNull(name)) {
            commonUtils.addError("name", "Tên môn học không được để trống");
        }

        if (Objects.isNull(numberOfTheoreticalPeriods)) {
            commonUtils.addError("numberOfTheoreticalPeriods", "Số tiết lý thuyết không được để trống");
        }

        if (Objects.isNull(numberOfPracticePeriods)) {
            commonUtils.addError("numberOfPracticePeriods", "Số tiết thực hành không được để " +
                    "trống");
        }

        if (commonUtils.getArrayNode().size() > 0) {
            return new BadResponse<Register>(commonUtils.getArrayNode().toString()).response();
        } else {
    
            int numberOfTheoreticalPeriodsInt = 0, numberOfPracticePeriodsInt = 0;
            try {
                numberOfTheoreticalPeriodsInt = Integer.parseInt(numberOfTheoreticalPeriods);
            } catch (final NumberFormatException e) {
                commonUtils.addError("numberOfTheoreticalPeriods", "Số tiết lý thuyết không hợp " +
                        "lệ");
            }

            try {
                numberOfPracticePeriodsInt = Integer.parseInt(numberOfPracticePeriods);
            } catch (final NumberFormatException e) {
                commonUtils.addError("numberOfPracticePeriods", "Số tiết thực hành không hợp " +
                        "lệ");
            }

            if (commonUtils.getArrayNode().size() > 0) {
                return new BadResponse<Register>(commonUtils.getArrayNode().toString()).response();
            }

            if ((numberOfPracticePeriodsInt + numberOfTheoreticalPeriodsInt) % 3 != 0) {
                commonUtils.addError("numberOfPracticePeriods", "Số tiết lý thuyết + thực " +
                        "hành phải là bội số của 3 "
                );
            }

            if (commonUtils.getArrayNode().size() > 0) {
                return new BadResponse<Register>(commonUtils.getArrayNode().toString()).response();
            }
        }

        if (isEdit) {
            try {
                Register register = registerService.findById(new RegisterId());

                savedSubject = registerService.save(register);
            } catch (NotFoundException exception) {
                return new BadResponse<Register>(exception.getMessage()).response();
            }
        } else {
            savedSubject = registerService.save(Register.build(postCreateRegisterDTO));
        }

        return new OkResponse<>(savedSubject).response();
    }
}
