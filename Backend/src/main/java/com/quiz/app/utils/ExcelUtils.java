package com.quiz.app.utils;

import com.quiz.app.exception.NotFoundException;
import com.quiz.app.subject.SubjectService;
import com.quiz.entity.Level;
import com.quiz.entity.Question;
import com.quiz.entity.Subject;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.FileInputStream;
import java.util.List;
import java.util.Objects;

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

    public void readQuestionFromFile(List<Question> questions) throws NotFoundException {
        for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
            Row row = sheet.getRow(i);
            Question question = new Question();

            question.setContent(row.getCell(0).getStringCellValue());
            question.setAnswerA(row.getCell(1).getStringCellValue());
            question.setAnswerB(row.getCell(2).getStringCellValue());
            question.setAnswerC(row.getCell(3).getStringCellValue());
            question.setAnswerD(row.getCell(4).getStringCellValue());
            question.setFinalAnswer(row.getCell(5).getStringCellValue());

            String levelStr = row.getCell(6).getStringCellValue();
            Level level = Level.EASY;
            if (Objects.equals(levelStr, "Khó")) {
                level = Level.HARD;
            } else if (Objects.equals(levelStr, "Trung bình")) {
                level = Level.MEDIUM;
            }

            question.setLevel(level);
            question.setChapter((int) row.getCell(7).getNumericCellValue());

            try {
                Subject subject = subjectService.findByName(row.getCell(8).getStringCellValue());
                question.setSubject(subject);
            } catch (NotFoundException e) {
                throw new NotFoundException(e.getMessage());
            }

            questions.add(question);
        }
    }
}




