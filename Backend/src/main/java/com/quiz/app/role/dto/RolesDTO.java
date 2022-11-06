package com.quiz.app.role.dto;


import com.quiz.entity.Role;
import com.quiz.entity.Subject;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RolesDTO {
    private List<Role> roles;
    private long totalElements;
    private long totalPages;
}
