package com.quiz.app.user;

import com.quiz.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    @Query(value = "SELECT * FROM nguoidung WHERE nguoidung.manguoidung = :id", nativeQuery = true)
    Optional<User> findById(String id);

    @Query(value = "SELECT * FROM nguoidung WHERE nguoidung.email = :email", nativeQuery = true)
    User findByEmail(String email);

    Page<User> findAll(Pageable pageable);

    @Query(value = "SELECT * FROM nguoidung as nd JOIN nguoidung_vaitro vt ON nd.manguoidung = vt" +
            ".manguoidung WHERE vt.mavaitro = :roleId GROUP BY nd.manguoidung", nativeQuery = true)
    List<User> findByRole(Integer roleId);

    @Query(value = "select temp.* from (select nd.* from nguoidung nd left join nguoidung_vaitro " +
            "ndvt on nd.manguoidung = ndvt.manguoidung where ndvt.mavaitro in (select vt.mavaitro" +
            " from vaitro vt where vt.mavaitro = :roleId)) as temp join dangky dk on dk.masv = " +
            "temp.manguoidung where dk.maltc not in (:creditClassId) GROUP BY temp.manguoidung LIMIT :limit",
            nativeQuery =
                    true)
    List<User> findByRole(Integer roleId, Integer limit, Integer creditClassId);

    @Query(value = "SELECT nd.* FROM nguoidung nd left join nguoidung_vaitro ndvt on nd" +
            ".manguoidung = ndvt.manguoidung join vaitro vt on vt.mavaitro = ndvt.mavaitro WHERE "
            + "vt.tenvaitro IN (\"Giảng viên\", \"Quản trị viên\") group by nd.manguoidung", nativeQuery = true)
    List<User> findUserIsNotStudent();

    @Query(value = "SELECT COUNT(*) FROM nguoidung", nativeQuery = true)
    int countAllUsers();

    @Query(value = "SELECT count(*) FROM nguoidung nd left join nguoidung_vaitro ndvt on nd" +
            ".manguoidung = ndvt.manguoidung" + " where ndvt.mavaitro in (select vt.mavaitro from" +
            " vaitro vt where vt.tenvaitro = \"Quản trị viên\") " + "and nd.manguoidung not in " +
            "(SELECT nd.manguoidung FROM nguoidung nd left join nguoidung_vaitro ndvt on nd" +
            ".manguoidung = ndvt.manguoidung " + "where ndvt.mavaitro in (select vt.mavaitro from " +
            "vaitro vt where vt.tenvaitro = \"Giảng viên\") group by nd.manguoidung)\n",
            nativeQuery = true)
    int countAllUsersAdmin();

    @Query(value = "SELECT count(*) FROM nguoidung nd left join nguoidung_vaitro ndvt on nd" +
            ".manguoidung = ndvt.manguoidung" + " where ndvt.mavaitro in (select vt.mavaitro from" +
            " vaitro vt where vt.tenvaitro = \"Giảng viên\") " + "and nd.manguoidung not in " +
            "(SELECT nd.manguoidung FROM nguoidung nd left join nguoidung_vaitro ndvt on nd" +
            ".manguoidung = ndvt.manguoidung " + "where ndvt.mavaitro in (select vt.mavaitro from " +
            "vaitro vt where vt.tenvaitro = \"Quản trị viên\") group by nd.manguoidung)\n",
            nativeQuery = true)
    int countAllUsersTeacher();

    @Query(value ="SELECT count(*) FROM nguoidung nd left join nguoidung_vaitro ndvt on nd" +
            ".manguoidung = ndvt.manguoidung" + " where ndvt.mavaitro in (select vt.mavaitro from" +
            " vaitro vt where vt.tenvaitro = \"Giảng viên\") " + "and nd.manguoidung in " +
            "(SELECT nd.manguoidung FROM nguoidung nd left join nguoidung_vaitro ndvt on nd" +
            ".manguoidung = ndvt.manguoidung " + "where ndvt.mavaitro in (select vt.mavaitro from " +
            "vaitro vt where vt.tenvaitro = \"Quản trị viên\") group by nd.manguoidung)\n",
            nativeQuery = true)
    int countAllUsersTeacherAndAdmin();

    @Query(value = "SELECT COUNT(*) FROM nguoidung nd left join nguoidung_vaitro ndvt on nd" +
            ".manguoidung = ndvt.manguoidung where ndvt.mavaitro in (select vt.mavaitro from vaitro vt " +
            "where vt.tenvaitro = \"Sinh viên\") ",
            nativeQuery = true)
    int countAllUsersStudent();
}
