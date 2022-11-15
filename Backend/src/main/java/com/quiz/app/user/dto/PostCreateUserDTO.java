package com.quiz.app.user.dto;

import com.quiz.entity.Role;
import com.quiz.entity.Sex;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class PostCreateUserDTO {
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String sex;
    private String address;
    private String birthday;
    private Set<Integer> roles;
    private MultipartFile avatar;
}
