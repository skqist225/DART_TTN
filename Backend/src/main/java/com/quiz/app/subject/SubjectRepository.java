package com.quiz.app.subject;

import com.quiz.app.statistics.dto.CountQuestionsBySubjectDTO;
import com.quiz.entity.Subject;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface SubjectRepository extends CrudRepository<Subject, String> {

    Subject findByName(String name);

    @Query("SELECT count(*) FROM Subject")
    int countTotalSubjects();

    @Query(value = "select temp.tenmh as subjectName, count(c.macauhoi) as numberOfQuestions" +
            " from (select mh.mamh, mh.tenmh, ch.machuong from monhoc mh" +
            " left join chuong ch on ch.mamh = mh.mamh) as temp" +
            " left join cauhoi c on temp.machuong = c.machuong" +
            " group by temp.tenmh ", nativeQuery = true)
    List<CountQuestionsBySubjectDTO> countQuestionsBySubject();

    @Query(value = "select mh.* from monhoc mh where mh.mamh in (select c.mamh from chuong c)", nativeQuery = true)
    List<Subject> findByHaveChapter();
}
