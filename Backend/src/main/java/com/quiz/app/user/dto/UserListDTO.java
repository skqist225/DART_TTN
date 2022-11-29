package com.quiz.app.user.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.quiz.entity.Role;
import com.quiz.entity.User;

import lombok.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserListDTO {
    private String id;
    private String fullName;
    private String avatar;
    private String sex;
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate birthday;
    private Set<String> roles;
    private boolean emailVerified;
    private boolean phoneVerified;
    private boolean identityVerified;
    private Integer numberOfReviews;
    private boolean status;

    public static UserListDTO build(User user) {
        Set<String> roles = new HashSet<>();

        for(Role role : user.getRoles()) {
            roles.add(role.getName());
        }

        return UserListDTO.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .avatar(user.getAvatarPath())
                .sex(user.getSex().toString())
                .roles(roles)
                .birthday(user.getBirthday())
                .identityVerified(false)
                .build();
    }
}
