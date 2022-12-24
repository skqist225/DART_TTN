package com.quiz.app.exam;

import com.quiz.app.statistics.dto.CountExamByCreditClassDTO;
import com.quiz.entity.Exam;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ExamRepository extends CrudRepository<Exam, Integer> {
    @Query(value = "select ct.* from (SELECT macathi FROM quiz.thi where maltc = :creditClassId group by " +
            "macathi) temp left join cathi ct on ct.macathi = temp.macathi", nativeQuery = true)
    List<Exam> findAllExamsByCreditClass(Integer creditClassId);

//    @Query(value = "select ct.* from (SELECT macathi FROM quiz.thi where maltc = :creditClassId group by " +
//            "macathi) temp left join cathi ct on ct.macathi = temp.macathi WHERE CONCAT(ct" +
//            ".macathi, ' ', ct.tencathi) LIKE %:query%",
//            nativeQuery =
//            true)
//    public List<Exam> findAllExamsIdByCreditClassAndIdAndName(Integer creditClassId, String query);

    @Query(value = "select temp.nienkhoa as schoolYear, temp.hocky as semester, temp.nhom as " +
            "grp, mh" +
            ".tenmh as subjectName, temp.socathi as numberOfExams from" +
            "(select ltc" +
            ".nienkhoa, ltc.hocky, ltc.mamh, ltc.nhom, count(temp.macathi) as socathi from " +
            "(select t.macathi, t.maltc from loptinchi ltc left join thi t on t.maltc = ltc.maltc" +
            " group by t.macathi,t.maltc) as temp right join loptinchi ltc on ltc.maltc = temp" +
            ".maltc group by ltc.maltc) temp left join monhoc mh on mh.mamh = temp.mamh", nativeQuery = true)
    List<CountExamByCreditClassDTO> countExamByCreditClass();

    @Query(value = "select ct.* from (select * from thi t where t.masv = :studentId and t.dathi " +
            "= 0) temp" +
            " " +
            "left join cathi ct on ct.macathi = temp.macathi where ct.dahuy = 0 and ct.dathi " +
            " = 0 order by ct.macathi desc",
            nativeQuery =
                    true)
    List<Exam> findByStudentAndTaken(String studentId);

    @Query(value = "SELECT count(*) FROM cathi", nativeQuery = true)
    int countTotalExams();

    @Query(value = "SELECT count(*) FROM cathi where dathi = true", nativeQuery = true)
    int countTotalExamsUsed();

    @Query(value = "SELECT count(*) FROM cathi where dathi = false and dahuy = false", nativeQuery =
            true)
    int countTotalExamsNotUsed();

    @Query(value = "SELECT count(*) FROM cathi where dahuy = true", nativeQuery =
            true)
    int countTotalExamsCancelled();

    @Modifying
    @Query(value = "delete from chitietthi where macathi = :examId", nativeQuery = true)
    void deleteTakeExamDetail(Integer examId);

    @Modifying
    @Query(value = "delete from thi where macathi = :examId", nativeQuery = true)
    void deleteTakeExam(Integer examId);

    @Modifying
    @Query(value = "update dethi set macathi = null, dasudung = false where macathi = :examId",
            nativeQuery = true)
    void updateExamOfTest(Integer examId);

    @Modifying
    @Query(value = "delete from cathi where macathi = :examId", nativeQuery = true)
    void deleteExam(Integer examId);
}
