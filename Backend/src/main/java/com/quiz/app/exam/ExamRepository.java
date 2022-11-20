package com.quiz.app.exam;

import com.quiz.entity.Exam;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ExamRepository extends CrudRepository<Exam, Integer> {
    @Query(value = "select ct.* from (SELECT macathi FROM quiz.dangky dk join thi t on t.masv = " +
            "dk.masv where dk.maltc = :creditClassId group by t.macathi) temp left join cathi ct on ct.macathi = temp.macathi", nativeQuery = true)
    public List<Exam> findAllExamsIdByCreditClass(Integer creditClassId);
}