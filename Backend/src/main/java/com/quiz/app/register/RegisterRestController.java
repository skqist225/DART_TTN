package com.quiz.app.register;

import com.quiz.app.creditClass.CreditClassService;
import com.quiz.app.creditClass.dto.CreditClassDTO;
import com.quiz.app.exception.NotFoundException;
import com.quiz.app.register.dto.PostCreateRegisterDTO;
import com.quiz.app.register.dto.RegistersDTO;
import com.quiz.app.response.StandardJSONResponse;
import com.quiz.app.response.error.BadResponse;
import com.quiz.app.response.success.OkResponse;
import com.quiz.app.role.RoleService;
import com.quiz.app.subject.SubjectService;
import com.quiz.app.takeExam.TakeExamService;
import com.quiz.app.user.UserService;
import com.quiz.app.utils.ExcelUtils;
import com.quiz.entity.CreditClass;
import com.quiz.entity.Register;
import com.quiz.entity.Role;
import com.quiz.entity.Sex;
import com.quiz.entity.Subject;
import com.quiz.entity.TakeExam;
import com.quiz.entity.User;
import org.apache.commons.lang.StringUtils;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileInputStream;
import java.io.IOException;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;


@RestController
@RequestMapping("/api/registers")
public class RegisterRestController {
    @Autowired
    private RegisterService registerService;

    @Autowired
    private TakeExamService takeExamService;

    @Autowired
    private UserService userService;

    @Autowired
    private SubjectService subjectService;

    @Autowired
    private CreditClassService creditClassService;

    @Autowired
    private RoleService roleService;


    @GetMapping("")
    public ResponseEntity<StandardJSONResponse<RegistersDTO>> fetchAllSubjects(
            @RequestParam("page") String page,
            @RequestParam(name = "query", required = false, defaultValue = "") String query,
            @RequestParam(name = "sortDir", required = false, defaultValue = "desc") String sortDir,
            @RequestParam(name = "sortField", required = false, defaultValue = "id") String sortField,
            @RequestParam(name = "creditClass", required = false, defaultValue = "") String creditClassId
    ) {
        RegistersDTO registersDTO = new RegistersDTO();
        List<Register> registers = new ArrayList<>();
        long totalElements = 0,
                totalPages = 0;

        if (page.equals("0")) {
            if (!StringUtils.isEmpty(creditClassId)) {
                List<Register> tempRegisters = registerService.findByCreditClass(Integer.parseInt(creditClassId));

                for (Register register : tempRegisters) {
                    List<TakeExam> takeExams = takeExamService.findByRegister(register);
                    for (TakeExam takeExam : takeExams) {
                        if (takeExam.getExam().getType().equals("Giữa kỳ")) {
                            register.setBelongToMidTerm(true);
                        } else if (takeExam.getExam().getType().equals("Cuối kỳ")) {
                            register.setBelongToEndOfTerm(true);
                        }
                    }
                    registers.add(register);
                }
                registers.sort(Comparator.comparing(register -> register.getStudent().getFullName()));
            } else {
                registers = registerService.findAll();
            }
            totalElements = registers.size();
            totalPages = (long) Math.ceil(registers.size() / 10.0);

        } else {
            Map<String, String> filters = new HashMap<>();
            filters.put("page", page);
            filters.put("query", query);
            filters.put("sortDir", sortDir);
            filters.put("sortField", sortField);
            filters.put("creditClassId", creditClassId);

            Page<Register> registersPage = registerService.findAllRegisters(filters);

            registers = registersPage.getContent();
            totalElements = registersPage.getTotalElements();
            totalPages = registersPage.getTotalPages();
        }

        for (Register register : registers) {
            CreditClass creditClass = register.getCreditClass();
            register.setTempCreditClass(new CreditClassDTO(creditClass.getId(), creditClass.getSchoolYear(),
                    creditClass.getSemester(), creditClass.getSubjectName(), creditClass.getTeacherName()));
        }

        registersDTO.setRegisters(registers);
        registersDTO.setTotalElements(totalElements);
        registersDTO.setTotalPages(totalPages);

        return new OkResponse<>(registersDTO).response();
    }

    @PostMapping("save/multiple")
    public ResponseEntity<StandardJSONResponse<String>> readExcelFile(
            @RequestParam(name = "file") MultipartFile file) throws IOException {
        try {
            ExcelUtils excelUtils = new ExcelUtils((FileInputStream) file.getInputStream());

            Sheet sheet = excelUtils.getSheet();
            int count = 0;

            List<User> users = new ArrayList<>();
            List<Subject> subjects = new ArrayList<>();
            List<CreditClass> creditClasses = new ArrayList<>();
            List<Register> registers = new ArrayList<>();

            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                System.out.println(i);
                String studentId = row.getCell(0).getStringCellValue();
                String subjectId = row.getCell(4).getStringCellValue();
                String subjectName = row.getCell(8).getStringCellValue();
                String schoolYear = row.getCell(5).getStringCellValue();
                Integer semester = Double.valueOf(row.getCell(6).getNumericCellValue()).intValue();
                Integer group = Double.valueOf(row.getCell(10).getNumericCellValue()).intValue();

                if (Objects.isNull(studentId) || StringUtils.isEmpty(studentId) ||
                        Objects.isNull(subjectId) || StringUtils.isEmpty(subjectId) ||
                        Objects.isNull(schoolYear) || StringUtils.isEmpty(schoolYear)) {
                    continue;
                }

                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
                LocalDate birthday = LocalDate.parse("01/01/2000", formatter);
                User student = new User();
                try {
                    student = userService.findById(studentId);
                } catch (NotFoundException e) {
                    student.setId(studentId);
                    student.setLastName(row.getCell(1).getStringCellValue());
                    student.setFirstName(row.getCell(2).getStringCellValue());
                    student.setEmail(String.format("%s@student.ptithcm.edu.vn",
                            studentId.toLowerCase()));
                    student.setPassword(studentId.toLowerCase());
                    student.setBirthday(birthday);
                    student.setSex(Sex.MALE);
                    Role role = new Role();
                    try {
                        role = roleService.findByName("Sinh viên");
                    } catch (NotFoundException ex) {
                        role.setName("Sinh viên");
                        role = roleService.save(role);
                    }
                    student.addRole(role);
                    student.setStatus(true);
                    userService.encodePassword(student);
                    student = userService.save(student);
                    users.add(student);
                }

                //subject
                Subject subject = new Subject();
                try {
                    subject = subjectService.findById(subjectId);
                } catch (NotFoundException e) {
                    subject.setId(subjectId);
                    subject.setName(subjectName);
                    subject.setNumberOfTheoreticalPeriods(35);
                    subject.setNumberOfPracticePeriods(10);
                    subject = subjectService.save(subject);
                    subjects.add(subject);
                }

                System.out.println(subject);

                NumberFormat nf = DecimalFormat.getInstance();
                nf.setMaximumFractionDigits(0);
                String teacherId = null;
                if (Objects.equals(row.getCell(7).getCellType(), CellType.STRING)) {
                    teacherId = row.getCell(7).getStringCellValue();
                } else if (Objects.equals(row.getCell(7).getCellType(), CellType.NUMERIC)) {
                    teacherId = nf.format(row.getCell(7).getNumericCellValue());
                }

                String[] splitName = row.getCell(9).getStringCellValue().split("\\s");
                String teacherLastName = String.join(" ", Arrays.copyOf(splitName, splitName.length - 1));
                String teacherFirstName = splitName[splitName.length - 1];

                User teacher = new User();
                try {
                    teacher = userService.findById(teacherId);
                } catch (NotFoundException e) {
                    teacher.setId(teacherId);
                    teacher.setLastName(teacherLastName);
                    teacher.setFirstName(teacherFirstName);
                    teacher.setEmail(String.format("%s@teacher.ptithcm.edu.vn",
                            teacherId.toLowerCase()));
                    teacher.setPassword("giangvien");
                    teacher.setBirthday(birthday);
                    teacher.setSex(Sex.MALE);
                    Role role = new Role();
                    try {
                        role = roleService.findByName("Giảng viên");
                    } catch (NotFoundException ex) {
                        role.setName("Giảng viên");
                        role = roleService.save(role);
                    }
                    teacher.addRole(role);
                    teacher.setStatus(true);
                    userService.encodePassword(teacher);
                    teacher = userService.save(teacher);
                    users.add(teacher);
                }

                CreditClass creditClass = new CreditClass();
                try {
                    creditClass = creditClassService.findByUniqueKey(schoolYear, semester,
                            subjectId,
                            group);
                } catch (NotFoundException e) {
                    creditClass.setSubject(subject);
                    creditClass.setSchoolYear(schoolYear);
                    creditClass.setSemester(Integer.parseInt(String.valueOf(semester)));
                    creditClass.setGroup(Integer.parseInt(String.valueOf(group)));
                    creditClass.setStatus(false);
                    creditClass.setTeacher(teacher);
                    creditClasses.add(creditClass);

                }

                // register
                Register register = new Register();
                register.setStudent(student);
                register.setCreditClass(creditClass);
                registers.add(register);
//            registerService.save(register);
                count++;
                creditClass.addRegister(register);
                creditClass = creditClassService.save(creditClass);
            }

//        registerService.saveAllFromExcel(users, subjects, creditClasses, registers);

            return new OkResponse<>(String.format("%d/%d đăng ký được thêm thành công", count,
                    registers.size())).response();
        } catch (IllegalStateException ex) {
            return new OkResponse<>("Không thể đọc file Excel").response();
        }
    }

    @PutMapping("{creditClassId}/{studentId}")
    public ResponseEntity<StandardJSONResponse<String>> enableOrDisable(
            @PathVariable("creditClassId") Integer creditClassId,
            @PathVariable("studentId") String studentId,
            @RequestParam(name = "action") String action) {
        try {
            String message = registerService
                    .enableOrDisable(creditClassId, studentId, action);

            return new OkResponse<>(message).response();
        } catch (NotFoundException ex) {
            return new BadResponse<String>(ex.getMessage()).response();
        }
    }

    @PostMapping("save")
    public ResponseEntity<StandardJSONResponse<String>> saveSubject(
            @RequestBody PostCreateRegisterDTO postCreateRegisterDTO,
            @RequestParam(name = "isEdit", required = false, defaultValue = "false") boolean isEdit) {
        Integer creditClassId = postCreateRegisterDTO.getCreditClassId();
        List<String> registerList = postCreateRegisterDTO.getRegisterList();
        List<String> existed = new ArrayList<>();

        String messageResponse = "";

        if (isEdit) {

        } else {
            for (String register : registerList) {
                if (registerService.isRegisterExist(register, creditClassId)) {
                    existed.add(register);
                } else {
                    registerService.addRegister(register, creditClassId);
                }
            }
        }

        if (existed.size() > 0) {
            messageResponse += String.join(",", existed);
        }

        return new OkResponse<>("Thêm đăng ký thành công").response();
    }
}
