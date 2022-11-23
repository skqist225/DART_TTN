package com.quiz.app.test;

import com.quiz.app.statistics.dto.CountTestsBySubjectAndStatus;
import com.quiz.entity.Subject;
import com.quiz.entity.Test;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface TestRepository extends CrudRepository<Test, Integer> {

    @Query(value = "SELECT * FROM dethi where tendethi = :name", nativeQuery = true)
    public Test findByName(String name);

    public List<Test> findBySubject(Subject subject);

    @Query("SELECT count(*) FROM Test")
    public int countTotalTests();

    @Query(value =
            "select temp1.tenmh as subjectName, temp1.used as used, temp2.notused as notUsed from" +
                    " " +
                    "(select " +
                    "mh" +
                    ".mamh, " +
                    "mh.tenmh, " +
                    "count" +
                    "(dt.madethi) as used from monhoc mh join dethi dt on dt.mamh = mh.mamh where dt.dasudung = 1 group by mh.mamh) temp1 left join \n" +
                    "(select mh.mamh ,mh.tenmh, count(dt.madethi) as notused from monhoc mh join dethi dt on dt.mamh = mh.mamh where dt.dasudung = 0 group by mh.mamh) temp2 on temp1.mamh = temp2.mamh", nativeQuery = true)
    public List<CountTestsBySubjectAndStatus> countTestBySubjectAndStatus();

    @Query(value = "select dt.* from (select * from thi t where  t.masv = :studentId AND " +
            "macathi = :examId) temp join dethi dt on dt.madethi = temp.madethi", nativeQuery = true)
    public Test findByStudentAndExam(String studentId, Integer examId);
}
