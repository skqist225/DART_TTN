package com.quiz.app.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

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
    private String sex;
    private LocalDate birthday;
    private Integer roleId;
}
