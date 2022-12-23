package com.quiz.app.test;

import com.quiz.app.statistics.dto.CountTestsBySubjectAndStatus;
import com.quiz.entity.Subject;
import com.quiz.entity.Test;
import com.quiz.entity.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface TestRepository extends CrudRepository<Test, Integer> {

    @Query(value = "SELECT * FROM dethi where tendethi = :name", nativeQuery = true)
    Test findByName(String name);

    List<Test> findBySubject(Subject subject);

    List<Test> findBySubjectAndUsedAndStatus(Subject subject, boolean used, boolean status);

    @Query("SELECT count(*) FROM Test")
    int countTotalTests();

    @Query("SELECT count(*) FROM Test t where t.used = true")
    int countTotalTestsUsed();

    @Query("SELECT count(*) FROM Test t where t.used = false and t.status = true")
    int countTotalTestsNotUsed();

    @Query("SELECT count(*) FROM Test  t where t.status = false")
    int countTotalTestsCancelled();

    @Query(value =
            "select temp1.tenmh as subjectName, temp1.used as used, temp2.notused as notUsed, temp3.cancelled as cancelled from " +
                    "(select mh.mamh, mh.tenmh, count(dt.madethi) as used from monhoc mh join dethi dt on dt.mamh = mh.mamh where dt.dasudung = 1 group by mh.mamh) temp1 left join " +
                    "(select mh.mamh, count(dt.madethi) as notused from monhoc mh join " +
                    "dethi dt on dt.mamh = mh.mamh where dt.dasudung = 0 and dt.consudung = 1 group by mh.mamh) temp2 on temp1.mamh = temp2.mamh left join " +
                    "(select mh.mamh, count(dt.madethi) as cancelled from monhoc mh " +
                    "join dethi dt on dt.mamh = mh.mamh where dt.consudung = 0 group by mh.mamh) temp3 on temp3.mamh = temp1.mamh", nativeQuery = true)
    List<CountTestsBySubjectAndStatus> countTestBySubjectAndStatus();

    @Query(value = "select dt.* from (select * from thi t where  t.masv = :studentId AND " +
            "macathi = :examId) temp join dethi dt on dt.madethi = temp.madethi", nativeQuery = true)
    Test findByStudentAndExam(String studentId, Integer examId);


    List<Test> findTop10ByTeacherOrderByIdDesc(User user);
}
