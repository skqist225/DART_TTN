package com.quiz.app.utils;

import com.quiz.app.exception.NotFoundException;
import com.quiz.app.question.dto.ReadQuestionExcelDTO;
import com.quiz.app.subject.SubjectService;
import com.quiz.entity.Answer;
import org.apache.commons.lang.StringUtils;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.FileInputStream;
import java.util.ArrayList;
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
        for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
            ReadQuestionExcelDTO question = new ReadQuestionExcelDTO();
            Row row = sheet.getRow(i);

            String type = row.getCell(0).getStringCellValue();
            if (Objects.isNull(type) || StringUtils.isEmpty(type)) {
                break;
            }

            double numberOfChoices = row.getCell(1).getNumericCellValue();
            question.setContent(row.getCell(2).getStringCellValue());

            int answerCell = (int) (3 + numberOfChoices);
            List<Answer> answers = new ArrayList<>();

            List<Integer> ans = new ArrayList<>();
            if (type.equals("Một đáp án")) {
                ans.add((int) row.getCell(answerCell).getNumericCellValue());
            } else {
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

                Answer answer = new Answer(content, isAns);
                answers.add(answer);
            }

            question.setAnswers(answers);
            question.setLevel(row.getCell(answerCell + 1).getStringCellValue());
            question.setChapterName(row.getCell(answerCell + 2).getStringCellValue());
            question.setSubjectName(row.getCell(answerCell + 3).getStringCellValue());
            question.setStatus(true);

            questions.add(question);
        }
    }
}




