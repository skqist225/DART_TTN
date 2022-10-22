package com.quiz.app.utils;

import com.quiz.app.exception.NotFoundException;
import com.quiz.app.question.dto.ReadQuestionExcelDTO;
import com.quiz.app.subject.SubjectService;
import org.apache.poi.ss.usermodel.CellType;
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

    public void readQuestionFromFile(List<ReadQuestionExcelDTO> questions) throws NotFoundException {
        System.out.println(sheet.getLastRowNum());

        for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
            Row row = sheet.getRow(i);
            ReadQuestionExcelDTO question = new ReadQuestionExcelDTO();

            question.setId(i);

            question.setContent(row.getCell(0).getStringCellValue());

            if (row.getCell(0).getStringCellValue().equals("")) {
                break;
            }

            if (Objects.equals(row.getCell(1).getCellType(), CellType.STRING)) {
                question.setAnswerA(row.getCell(1).getStringCellValue());
            } else if (Objects.equals(row.getCell(1).getCellType(), CellType.NUMERIC)) {
                question.setAnswerA(String.valueOf(row.getCell(1).getNumericCellValue()));
            }

            if (Objects.equals(row.getCell(2).getCellType(), CellType.STRING)) {
                question.setAnswerB(row.getCell(2).getStringCellValue());
            } else if (Objects.equals(row.getCell(2).getCellType(), CellType.NUMERIC)) {
                question.setAnswerB(String.valueOf(row.getCell(2).getNumericCellValue()));
            }

            if (Objects.equals(row.getCell(3).getCellType(), CellType.STRING)) {
                question.setAnswerC(row.getCell(3).getStringCellValue());
            } else if (Objects.equals(row.getCell(3).getCellType(), CellType.NUMERIC)) {
                question.setAnswerC(String.valueOf(row.getCell(3).getNumericCellValue()));
            }

            if (Objects.equals(row.getCell(4).getCellType(), CellType.STRING)) {
                question.setAnswerD(row.getCell(4).getStringCellValue());
            } else if (Objects.equals(row.getCell(4).getCellType(), CellType.NUMERIC)) {
                question.setAnswerD(String.valueOf(row.getCell(4).getNumericCellValue()));
            }

            question.setFinalAnswer(row.getCell(5).getStringCellValue());
            question.setLevel(row.getCell(6).getStringCellValue());
            question.setChapter((int) row.getCell(7).getNumericCellValue());
            question.setSubjectName(row.getCell(8).getStringCellValue());

            questions.add(question);
        }
    }
}




