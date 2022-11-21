package com.quiz.app.utils;

import com.quiz.app.exception.NotFoundException;
import com.quiz.app.question.dto.ReadQuestionExcelDTO;
import com.quiz.app.subject.SubjectService;
import com.quiz.entity.Answer;
import com.quiz.entity.Role;
import com.quiz.entity.Sex;
import com.quiz.entity.User;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.FileInputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

public class ExcelUtils {
    private XSSFWorkbook workbook;
    private XSSFSheet sheet;

    @Autowired
    private SubjectService subjectService;

    public ExcelUtils(FileInputStream excelFile) {
        try {
            workbook = new XSSFWorkbook(excelFile);
            sheet = workbook.getSheetAt(0);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void readQuestionFromFile(List<ReadQuestionExcelDTO> questions) throws NotFoundException {
        char[] alphabet = "abcdefghijklmnopqrstuvwxyz".toCharArray();
        List<String> alphabets = new ArrayList<>();
        for (char c : alphabet) {
            alphabets.add(String.valueOf(c));
        }

        for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
            ReadQuestionExcelDTO question = new ReadQuestionExcelDTO();
            Row row = sheet.getRow(i);

            String type = row.getCell(0).getStringCellValue();
            if (type.equals("Kết thúc")) {
                break;
            }

            double numberOfChoices = row.getCell(1).getNumericCellValue();

            int answerCell = (int) (3 + numberOfChoices);
            List<Answer> answers = new ArrayList<>();

            List<Integer> ans = new ArrayList<>();
            if (type.equals("Một đáp án")) {
                ans.add((int) row.getCell(answerCell).getNumericCellValue());
            } else if (type.equals("Nhiều đáp án")) {
                for (String singleAns : row.getCell(answerCell).getStringCellValue().split(",")) {
                    ans.add(Integer.parseInt(singleAns));
                }
            }

            for (int c = 3; c < 3 + numberOfChoices; c++) {
                String content = null;
                if (Objects.equals(row.getCell(c).getCellType(), CellType.STRING)) {
                    content = row.getCell(c).getStringCellValue();
                } else if (Objects.equals(row.getCell(c).getCellType(), CellType.NUMERIC)) {
                    content = String.valueOf(row.getCell(c).getNumericCellValue());
                }
                boolean isAns = false;
                if (ans.contains(c - 2)) {
                    isAns = true;
                }

                Answer answer = new Answer(alphabets.get(c - 3).toUpperCase() + ". " + content,
                        type.equals("Đáp án điền") || isAns);
                answers.add(answer);
            }

            question.setId(i);
            question.setContent(row.getCell(2).getStringCellValue());
            question.setType(type);
            question.setAnswers(answers);
            question.setLevel(row.getCell(type.equals("Đáp án điền") ? answerCell : answerCell + 1).getStringCellValue());
            question.setChapterName(row.getCell(type.equals("Đáp án điền") ? answerCell + 1 :
                    answerCell + 2).getStringCellValue());
            question.setSubjectName(row.getCell(type.equals("Đáp án điền") ? answerCell + 2 :
                    answerCell + 3).getStringCellValue());
            question.setStatus(true);

            questions.add(question);
        }
    }

    public void readUserFromFile(List<User> users){
        for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
            User user = new User();
            Row row = sheet.getRow(i);

            String id = row.getCell(0).getStringCellValue();
            if (id.equals("Kết thúc")) {
                break;
            }

            String lastName = row.getCell(1).getStringCellValue();
            String firstName = row.getCell(2).getStringCellValue();
            Sex sex = User.lookUpSex(row.getCell(3).getStringCellValue());

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            LocalDate birthday = LocalDate.parse(row.getCell(4).getStringCellValue(), formatter);
            String address = row.getCell(5).getStringCellValue();
            String email = row.getCell(6).getStringCellValue();
            String rolesStr = row.getCell(7).getStringCellValue();
            Set<Role> roles = new HashSet<>();
            if (rolesStr.contains(",")) {
                for (String role : rolesStr.split(",")) {
                    roles.add(new Role(role));
                }
            }

            user.setId(id);
            user.setLastName(lastName);
            user.setFirstName(firstName);
            user.setSex(sex);
            user.setBirthday(birthday);
            user.setAddress(address);
            user.setEmail(email);
            user.setRoles(roles);

            users.add(user);
        }
    }

//    public void readRegisterFromFile(List<ReadQuestionExcelDTO> questions) throws NotFoundException {
//        char[] alphabet = "abcdefghijklmnopqrstuvwxyz".toCharArray();
//        List<String> alphabets = new ArrayList<>();
//        for (char c : alphabet) {
//            alphabets.add(String.valueOf(c));
//        }
//
//        for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
//            ReadQuestionExcelDTO question = new ReadQuestionExcelDTO();
//            Row row = sheet.getRow(i);
//
//            String type = row.getCell(0).getStringCellValue();
//            if (type.equals("Kết thúc")) {
//                break;
//            }
//
//            double numberOfChoices = row.getCell(1).getNumericCellValue();
//
//            int answerCell = (int) (3 + numberOfChoices);
//            List<Answer> answers = new ArrayList<>();
//
//            List<Integer> ans = new ArrayList<>();
//            if (type.equals("Một đáp án")) {
//                ans.add((int) row.getCell(answerCell).getNumericCellValue());
//            } else if (type.equals("Nhiều đáp án")) {
//                for (String singleAns : row.getCell(answerCell).getStringCellValue().split(",")) {
//                    ans.add(Integer.parseInt(singleAns));
//                }
//            }
//
//            for (int c = 3; c < 3 + numberOfChoices; c++) {
//                String content = null;
//                if (Objects.equals(row.getCell(c).getCellType(), CellType.STRING)) {
//                    content = row.getCell(c).getStringCellValue();
//                } else if (Objects.equals(row.getCell(c).getCellType(), CellType.NUMERIC)) {
//                    content = String.valueOf(row.getCell(c).getNumericCellValue());
//                }
//                boolean isAns = false;
//                if (ans.contains(c - 2)) {
//                    isAns = true;
//                }
//
//                Answer answer = new Answer(alphabets.get(c - 3).toUpperCase() + ". " + content,
//                        type.equals("Đáp án điền") || isAns);
//                answers.add(answer);
//            }
//
//            question.setId(i);
//            question.setContent(row.getCell(2).getStringCellValue());
//            question.setType(type);
//            question.setAnswers(answers);
//            question.setLevel(row.getCell(type.equals("Đáp án điền") ? answerCell : answerCell + 1).getStringCellValue());
//            question.setChapterName(row.getCell(type.equals("Đáp án điền") ? answerCell + 1 :
//                    answerCell + 2).getStringCellValue());
//            question.setSubjectName(row.getCell(type.equals("Đáp án điền") ? answerCell + 2 :
//                    answerCell + 3).getStringCellValue());
//            question.setStatus(true);
//
//            questions.add(question);
//        }
//    }
}
