package com.quiz.app.user.dto;

import com.quiz.entity.Sex;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class RegisterDTO {
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private Sex sex;
    private String address;
    private String birthday;
    private Integer roleId;
    private String classId;
    private MultipartFile avatar;
}
