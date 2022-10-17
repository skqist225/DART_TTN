package com.quiz.app.role;

import com.quiz.app.exception.NotFoundException;
import com.quiz.entity.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService {

    @Autowired
    RoleRepository roleRepository;

    public List<Role> findAllRoles() {
        return (List<Role>) roleRepository.findAll();
    }

    public Role findById(Integer id) throws NotFoundException {
        return roleRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy vai trò với mã " + id));
    }
}
