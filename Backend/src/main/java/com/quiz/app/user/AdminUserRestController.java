package com.quiz.app.user;

import com.quiz.app.exception.NotFoundException;
import com.quiz.app.exception.VerifiedUserException;
import com.quiz.app.response.StandardJSONResponse;
import com.quiz.app.response.error.BadResponse;
import com.quiz.app.response.success.OkResponse;
import com.quiz.app.role.RoleService;
import com.quiz.app.user.dto.UsersDTO;
import com.quiz.app.utils.ExcelUtils;
import com.quiz.entity.Role;
import com.quiz.entity.User;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserRestController {
    @Autowired
    private UserService userService;

    @Autowired
    private RoleService roleService;

    @Value("${env}")
    private String environment;

    @GetMapping(value = "")
    public ResponseEntity<StandardJSONResponse<UsersDTO>> listings(
            @RequestParam(name = "page", defaultValue = "1") String page,
            @RequestParam(name = "query", required = false, defaultValue = "") String query,
            @RequestParam(name = "sortDir", required = false, defaultValue = "desc") String sortDir,
            @RequestParam(name = "sortField", required = false, defaultValue = "id") String sortField,
            @RequestParam(name = "role", required = false, defaultValue = "") String role,
            @RequestParam(name = "roleName", required = false, defaultValue = "") String roleName,
            @RequestParam(name = "limit", required = false, defaultValue = "0") Integer limit,
            @RequestParam(name = "creditClassId", required = false, defaultValue = "0") Integer creditClassId) throws NotFoundException {
        UsersDTO usersDTO = new UsersDTO();
        if (page.equals("0")) {
            List<User> users = new ArrayList<>();
            if (!StringUtils.isEmpty(role)) {
                if (role.equals("!SV")) {
                    users = userService.findUserIsNotStudent();
                } else {
                    if (limit > 0) {
                        // Lấy ra danh sách sinh viên chưa đăng ký lớp tín chỉ đó
                        users = userService.findByRole(roleService.findByName(role).getId(),
                                limit, creditClassId
                        );
                    } else {
                        users = userService.findByRole(roleService.findByName(role).getId());
                    }
                }
            }

            usersDTO.setUsers(users);
            usersDTO.setTotalPages((long) Math.ceil(users.size() / 10));
            usersDTO.setTotalElements(users.size());
        } else {
            Map<String, String> filters = new HashMap<>();
            filters.put("page", page);
            filters.put("query", query);
            filters.put("sortDir", sortDir);
            filters.put("sortField", sortField);
            filters.put("roleName", roleName);

            usersDTO = userService.findAllUsers(filters);
        }

        return new OkResponse<>(usersDTO).response();
    }

    @PostMapping("save/multiple")
    public ResponseEntity<StandardJSONResponse<String>> readExcelFile(
            @RequestParam(name = "file") MultipartFile file) throws IOException {
        List<User> users = new ArrayList<>();
        ExcelUtils excelUtils = new ExcelUtils((FileInputStream) file.getInputStream());
        excelUtils.readUserFromFile(users);
        int totalRecords = users.size();
        int i = 0;
        for (User user : users) {
            try {
                userService.findById(user.getId());
            } catch (NotFoundException e) {
                if (!userService.isEmailDuplicated(user.getId(), user.getEmail(), false)) {
                    Set<Role> roles = new HashSet<>();
                    if (user.getRolesStr().contains(",")) {
                        for (String roleName : user.getRolesStr().split(",")) {
                            Role role = null;
                            try {
                                role = roleService.findByName(roleName.trim());
                            } catch (NotFoundException exception) {
                                role = roleService.save(new Role(roleName.trim()));
                            }
                            roles.add(role);
                        }
                    } else {
                        Role role = null;
                        try {
                            System.out.println(user.getRolesStr());
                            role = roleService.findByName(user.getRolesStr().trim());
                        } catch (NotFoundException exception) {
                            role = roleService.save(new Role(user.getRolesStr().trim()));
                        }
                        roles.add(role);
                    }

                    user.setRoles(roles);
                    userService.encodePassword(user);
                    userService.save(user);
                    i++;
                }
            }
        }
        return new OkResponse<>(String.format("%d/%d người dùng được thêm thành công", i, totalRecords)).response();
    }

    @GetMapping("{id}")
    public ResponseEntity<StandardJSONResponse<User>> getUser(@PathVariable(value = "id") String id) {
        try {
            User user = userService.findById(id);

            return new OkResponse<>(user).response();
        } catch (NotFoundException e) {
            return new BadResponse<User>(e.getMessage()).response();
        }
    }

    @DeleteMapping("{id}")
    public ResponseEntity<StandardJSONResponse<String>> deleteUser(@PathVariable(value = "id") String userId) {
        try {
            return new OkResponse<>(userService.deleteById(userId)).response();
        } catch (VerifiedUserException e) {
            return new BadResponse<String>(e.getMessage()).response();
        }
    }

    @PutMapping("{id}/{action}")
    public ResponseEntity<StandardJSONResponse<String>> enableOrDisable(
            @PathVariable(value = "id") String id,
            @PathVariable(value = "action") String action) {
        try {
            User user = userService.findById(id);
            user.setStatus(action.equals("enable"));
            userService.save(user);

            return new OkResponse<>(action.equals("enable") ? "Kích hoạt người dùng thành công" :
                    "H" +
                            "ủy " +
                            "kích hoạt người dùng thành công").response();
        } catch (NotFoundException e) {
            return new BadResponse<String>(e.getMessage()).response();
        }
    }
}
