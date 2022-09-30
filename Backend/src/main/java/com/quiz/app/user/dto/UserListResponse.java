package com.quiz.app.user.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserListResponse {
    private List<UserListDTO> users;
    private long totalElements;
    private long totalPages;
}
