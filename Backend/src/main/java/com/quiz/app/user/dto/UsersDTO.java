package com.quiz.app.user.dto;

import java.util.List;

import com.quiz.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UsersDTO {
    private List<User> users;
    private long totalElements;
    private long totalPages;
}
