package com.quiz.app.user;

import com.quiz.app.common.CommonUtils;
import com.quiz.app.creditClass.CreditClassService;
import com.quiz.app.exception.NotFoundException;
import com.quiz.app.exception.VerifiedUserException;
import com.quiz.app.response.StandardJSONResponse;
import com.quiz.app.response.error.BadResponse;
import com.quiz.app.response.success.OkResponse;
import com.quiz.app.role.RoleService;
import com.quiz.app.user.dto.RegisterDTO;
import com.quiz.app.user.dto.UsersDTO;
import com.quiz.entity.Role;
import com.quiz.entity.User;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserRestController {
    @Autowired
    private UserService userService;

    @Autowired
    private RoleService roleService;

    @Autowired
    private CreditClassService classService;

    @Value("${env}")
    private String environment;

    @GetMapping(value = "")
    public ResponseEntity<StandardJSONResponse<UsersDTO>> listings(
            @RequestParam(name = "page", defaultValue = "1") Integer page,
            @RequestParam(name = "roles", required = false, defaultValue = "") String roles,
            @RequestParam(name = "role", required = false, defaultValue = "") String roleName,
            @RequestParam(name = "statuses", required = false, defaultValue = "1,0") String statuses,
            @RequestParam(name = "query", required = false, defaultValue = "") String query) {
        UsersDTO usersDTO = new UsersDTO();
        if (page == 0) {
            if (!StringUtils.isEmpty(roleName)) {
                Role role = null;
                try {
                    role = roleService.findByName(roleName);
                    List<User> users = userService.findByRole(role.getId());
                    usersDTO.setUsers(users);
                    usersDTO.setTotalPages((long) Math.ceil(users.size() / 10));
                    usersDTO.setTotalElements(users.size());
                } catch (NotFoundException e) {
                }
            }
        } else {
            Map<String, String> filters = new HashMap<>();
            filters.put("query", query);
            filters.put("roles", roles);
            filters.put("statuses", statuses);

            usersDTO = userService.findAllUsers(filters, page);
        }

        return new OkResponse<>(usersDTO).response();
    }

    @GetMapping("users/{id}")
    public ResponseEntity<StandardJSONResponse<User>> getUser(@PathVariable(value = "id") String id) {
        try {
            User user = userService.findById(id);

            return new OkResponse<>(user).response();
        } catch (NotFoundException e) {
            return new BadResponse<User>(e.getMessage()).response();
        }
    }

    @DeleteMapping("users/{userId}")
    public ResponseEntity<StandardJSONResponse<String>> deleteUser(@PathVariable(value = "userId") String userId) {
        try {
            return new OkResponse<>(userService.deleteById(userId)).response();
        } catch (VerifiedUserException e) {
            return new BadResponse<String>(e.getMessage()).response();
        }
    }

    @PutMapping("users/{id}/{action}")
    public ResponseEntity<StandardJSONResponse<String>> enableOrDisable(@PathVariable(value = "id") String id,
                                                                        @PathVariable(value = "action") String action) {
        try {
            User user = userService.findById(id);
            userService.saveUser(user);

            return new OkResponse<>("Update User Successfully").response();
        } catch (NotFoundException e) {
            return new BadResponse<String>(e.getMessage()).response();
        }
    }

    @PutMapping("update")
    public ResponseEntity<StandardJSONResponse<User>> updateUser(
            @RequestBody RegisterDTO updateUserDTO) throws IOException {
        try {
            User user = userService.findById(updateUserDTO.getId());

            CommonUtils commonUtils = new CommonUtils();

            if (userService.checkBirthday(LocalDate.parse(updateUserDTO.getBirthday()))) {
                commonUtils.addError("birthday", "Tuổi phải lớn hơn 18");
            }

            if (userService.isEmailDuplicated(updateUserDTO.getId(), updateUserDTO.getEmail(),
                    true)) {
                commonUtils.addError("email", "Địa chỉ email đã được sử dụng");
            }

            if (commonUtils.getArrayNode().size() > 0) {
                return new BadResponse<User>(commonUtils.getArrayNode().toString()).response();
            }

            user.setFirstName(updateUserDTO.getFirstName());
            user.setLastName(updateUserDTO.getLastName());
            user.setEmail(updateUserDTO.getEmail());
            user.setSex(updateUserDTO.getSex());
            user.setAddress(updateUserDTO.getAddress());
            user.setBirthday(LocalDate.parse(updateUserDTO.getBirthday()));

            try {
                Role role = roleService.findById(updateUserDTO.getRoleId());
//                user.setRole(role);
            } catch (NotFoundException e) {
                commonUtils.addError("roleId", "Vai trò không tồn tại");
            }

//            try {
//                Class cls = classService.findById(updateUserDTO.getClassId());
//                user.setCls(cls);
//            } catch (NotFoundException e) {
//                addError("classId", "Lớp không tồn tại");
//            }

            if (commonUtils.getArrayNode().size() > 0) {
                return new BadResponse<User>(commonUtils.getArrayNode().toString()).response();
            }

            if (updateUserDTO.getPassword() != null) {
                user.setPassword(updateUserDTO.getPassword());
                userService.encodePassword(user);
            }

            if (updateUserDTO.getAvatar() != null) {
                new UserRestController().updateAvatar(user, updateUserDTO.getAvatar(),
                        environment);
            }

            return new OkResponse<>(userService.saveUser(user)).response();
        } catch (NotFoundException e) {
            return new BadResponse<User>(e.getMessage()).response();
        }
    }
}
