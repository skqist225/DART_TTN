package com.quiz.app.register;

import com.quiz.app.creditClass.CreditClassService;
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
import com.quiz.app.utils.CommonUtils;
import com.quiz.app.utils.ExcelUtils;
import com.quiz.entity.CreditClass;
import com.quiz.entity.Register;
import com.quiz.entity.RegisterId;
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
import org.springframework.web.bind.annotation.PostMapping;
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

        if(page.equals("0")) {
            List<Register> registers = new ArrayList<>();
            if (Objects.nonNull(creditClassId)) {
                List<Register> tempRegisters = registerService.findByCreditClass(Integer.parseInt(creditClassId));

                for (Register register : tempRegisters) {
                    List<TakeExam> takeExams = takeExamService.findByRegister(register);
                    for (TakeExam takeExam : takeExams) {
                        if (takeExam.getExam().getType().equals("Giữa kỳ")) {
                            register.setBelongToMidTerm(true);
                        } else if(takeExam.getExam().getType().equals("Cuối kỳ")) {
                            register.setBelongToEndOfTerm(true);
                        }
                    }
                    registers.add(register);
                }
                registers.sort(Comparator.comparing(register->register.getStudent().getFullName()));
            } else {
                registers = registerService.findAll();
            }

            registersDTO.setRegisters(registers);
            registersDTO.setTotalElements(registers.size());
            registersDTO.setTotalPages(0);
        } else {
            Map<String, String> filters = new HashMap<>();
            filters.put("page", page);
            filters.put("query", query);
            filters.put("sortDir", sortDir);
            filters.put("sortField", sortField);
            filters.put("creditClassId", creditClassId);

            Page<Register> subjectsPage = registerService.findAllRegisters(filters);

            registersDTO.setRegisters(subjectsPage.getContent());
            registersDTO.setTotalElements(subjectsPage.getTotalElements());
            registersDTO.setTotalPages(subjectsPage.getTotalPages());
        }

        return new OkResponse<>(registersDTO).response();
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

        }

        return new OkResponse<>(savedSubject).response();
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
}
