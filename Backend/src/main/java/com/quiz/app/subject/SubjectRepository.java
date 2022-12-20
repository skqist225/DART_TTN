package com.quiz.app.subject;

import com.quiz.app.statistics.dto.CountQuestionsBySubjectDTO;
import com.quiz.entity.Subject;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface SubjectRepository extends CrudRepository<Subject, String> {

    @Query("SELECT count(*) FROM Subject")
    Integer countTotalSubjects();

    @Query(value = "select mh.* from monhoc mh where mh.mamh in (select c.mamh from chuong c)", nativeQuery = true)
    List<Subject> findByHaveChapter();

    @Query(value = "select * from (select mh.* from loptinchi ltc left join monhoc mh on mh.mamh " +
            "= ltc.mamh where magv = :teacherId) temp where temp.mamh in (select c.mamh from chuong c)\n"
            ,nativeQuery = true)
    List<Subject> findSubjectsOfTeacher(String teacherId);

}
