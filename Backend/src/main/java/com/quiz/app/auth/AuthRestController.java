package com.quiz.app.auth;

import com.quiz.app.email.SendEmail;
import com.quiz.app.exception.NotFoundException;
import com.quiz.app.jwt.JwtUtils;
import com.quiz.app.response.StandardJSONResponse;
import com.quiz.app.response.error.BadResponse;
import com.quiz.app.response.error.ForbiddenResponse;
import com.quiz.app.response.success.OkResponse;
import com.quiz.app.role.RoleService;
import com.quiz.app.security.UserDetailsServiceImpl;
import com.quiz.app.user.UserService;
import com.quiz.app.user.dto.ForgotPasswordResponse;
import com.quiz.app.user.dto.PostCreateUserDTO;
import com.quiz.app.user.dto.ResetPasswordDTO;
import com.quiz.app.utils.CommonUtils;
import com.quiz.app.utils.ProcessImage;
import com.quiz.entity.Role;
import com.quiz.entity.User;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.mail.MessagingException;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Random;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/auth")
public class AuthRestController {
    public final String DEV_STATIC_DIR = "src/main/resources/static/user_images";
    public final String PROD_STATIC_DIR = "/opt/tomcat/webapps/ROOT/WEB-INF/classes/static" + "/user_images";
    public final String PROD_STATIC_PATH = "static/user_images";

    @Autowired
    private UserService userService;

    @Autowired
    private RoleService roleService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsServiceImpl userDetailsServiceImpl;

    @Value("${env}")
    private String environment;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("login")
    public ResponseEntity<StandardJSONResponse<User>> login(
            @RequestBody LoginDTO loginDTO) {
        try {
            authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(loginDTO.getId().trim(),
                            loginDTO.getPassword().trim()));

            final UserDetails userDetails = userDetailsServiceImpl.loadUserByUsername(loginDTO.getId());
            final String token = jwtUtils.generateToken(userDetails);
            User user = userService.findById(loginDTO.getId());

            if (!user.isStatus()) {
                return new ForbiddenResponse<User>("T??i kho???n ??ang b??? v?? hi???u h??a").response();
            }

            user.setToken(token);

            return new OkResponse<>(user).response();
        } catch (BadCredentialsException | NotFoundException e) {
            return new BadResponse<User>("T??i kho???n ho???c m???t kh???u kh??ng ????ng").response();
        }
    }

    @GetMapping("logout")
    public ResponseEntity<StandardJSONResponse<String>> logout() {
        return new OkResponse<>("????ng xu???t th??nh c??ng").response();
    }

    public void catchUserInputException(CommonUtils commonUtils, String id,
                                        String firstName,
                                        String lastName,
                                        String email,
                                        String password,
                                        String birthday,
                                        String sexStr,
                                        Set<Integer> roles,
                                        boolean isEdit
    ) {
        if (Objects.isNull(id) || StringUtils.isEmpty(id)) {
            commonUtils.addError("id", "M?? ng?????i d??ng kh??ng ???????c ????? tr???ng");
        } else if (id.length() > 10) {
            commonUtils.addError("id", "M?? ng?????i d??ng t???i ??a 10 k?? t???");
        }

        if (Objects.isNull(firstName) || StringUtils.isEmpty(firstName)) {
            commonUtils.addError("firstName", "T??n kh??ng ???????c ????? tr???ng");
        }

        if (Objects.isNull(lastName) || StringUtils.isEmpty(lastName)) {
            commonUtils.addError("lastName", "H??? kh??ng ???????c ????? tr???ng");
        }

        Pattern pattern = Pattern.compile("[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}");
        if (Objects.isNull(email) || StringUtils.isEmpty(email)) {
            commonUtils.addError("email", "Email kh??ng ???????c ????? tr???ng");
        } else {
            Matcher matcher = pattern.matcher(email);
            if (!matcher.matches()) {
                commonUtils.addError("email", "?????a ch??? email kh??ng h???p l???");
            }
        }

        if (!isEdit) {
            if (Objects.isNull(password)) {
                commonUtils.addError("password", "M???t kh???u kh??ng ???????c ????? tr???ng");
            } else if (password.length() < 8) {
                commonUtils.addError("password", "M???t kh???u ??t nh???t 8 k?? t???");
            }
        }

        if (Objects.isNull(birthday) || StringUtils.isEmpty(birthday)) {
            commonUtils.addError("birthday", "Ng??y sinh kh??ng ???????c ????? tr???ng");
        }

        if (Objects.isNull(sexStr) || StringUtils.isEmpty(sexStr)) {
            commonUtils.addError("sexStr", "Gi???i t??nh kh??ng ???????c ????? tr???ng");
        }

        if (roles.size() == 0) {
            commonUtils.addError("sexStr", "Vai tr?? kh??ng ???????c ????? tr???ng");
        }
    }

    @PostMapping("register")
    public ResponseEntity<StandardJSONResponse<String>> registerUser(@ModelAttribute PostCreateUserDTO postCreateUserDTO, @RequestParam(name = "isEdit", required = false, defaultValue = "false") boolean isEdit) throws IOException, NotFoundException {
        CommonUtils commonUtils = new CommonUtils();
        User user = null;

        String id = postCreateUserDTO.getId();
        String firstName = postCreateUserDTO.getFirstName();
        String lastName = postCreateUserDTO.getLastName();
        String email = postCreateUserDTO.getEmail();
        String password = postCreateUserDTO.getPassword();
        String birthdayStr = postCreateUserDTO.getBirthday();
        String address = postCreateUserDTO.getAddress();
        String sexStr = postCreateUserDTO.getSex();
        Set<Integer> rolesInt = postCreateUserDTO.getRoles();
        MultipartFile avatar = postCreateUserDTO.getImage();
        boolean needVerifyUser = postCreateUserDTO.isNeedVerifyUser();

        catchUserInputException(commonUtils, id, firstName, lastName, email, password, birthdayStr, sexStr, rolesInt, isEdit);

        if (commonUtils.getArrayNode().size() > 0) {
            return new BadResponse<String>(commonUtils.getArrayNode().toString()).response();
        } else {
            if (!isEdit) {
                if (userService.isIdDuplicated(id)) {
                    commonUtils.addError("id", "M?? ng?????i d??ng ???? t???n t???i");
                }
            }

            if (userService.isBirthdayGreaterThanOrEqualTo18(LocalDate.parse(postCreateUserDTO.getBirthday()))) {
                commonUtils.addError("birthday", "Tu???i ph???i l???n h??n 18");
            }

            if (userService.isEmailDuplicated(id, email, isEdit)) {
                commonUtils.addError("email", "?????a ch??? email ???? t???n t???i");
            }
            if (commonUtils.getArrayNode().size() > 0) {
                return new BadResponse<String>(commonUtils.getArrayNode().toString()).response();
            }
        }

        if(isEdit) {
            try {
                user = userService.findById(id);
                user.setFirstName(firstName);
                user.setLastName(lastName);
                user.setEmail(email);
                if (!StringUtils.isEmpty(password)) {
                    user.setPassword(password);
                    userService.encodePassword(user);
                    try {
                        SendEmail.send("n18dccn220@student.ptithcm.edu.vn", "?????i m???t kh???u",
                                "M???t kh???u m???i cu??? b???n l??: " + password);
                    } catch (MessagingException e) {
                    }
                }
                if (avatar != null) {
                    user.setAvatar(avatar.getOriginalFilename());
                }

                LocalDate birthday = LocalDate.parse(birthdayStr);
                user.setBirthday(birthday);
                user.setAddress(address);
                user.setSex(User.lookUpSex(sexStr));

                if (!StringUtils.isEmpty(password)) {
                    user.setPassword(password);
                    userService.encodePassword(user);
                }

                for (Integer role : rolesInt) {
                    // Add new role
                    user.addRole(new Role(role));
                }

                List<Role> roles = new ArrayList<>();
                for (Role role : user.getRoles()) {
                    boolean shouldDelete = true;

                    for (Integer a : rolesInt) {
                        if (role.getId().equals(a)) {
                            shouldDelete = false;
                            break;
                        }
                    }
                    // Remove none mentioned role
                    if (shouldDelete) {
                        roles.add(role);
                    }
                }

                for (Role role : roles) {
                    user.removeRole(role);
                }

                user = userService.save(user);
            } catch (NotFoundException e) {
                return new BadResponse<String>(e.getMessage()).response();
            }
        }else {
            boolean userStatus = true;
            //N???u vai tr?? l?? sinh vi??n th?? kh??ng c???n x??c th???c.
            //N???u vai tr?? l?? ng?????i d??ng th?? c???n x??c th???c.
            if (needVerifyUser) {
                Role role = roleService.findById(rolesInt.iterator().next());
                if (role.getName().equals("Gi???ng vi??n")) {
                    userStatus = false;
                }
            }

            User tempUser = User.build(postCreateUserDTO, userStatus);
            userService.encodePassword(tempUser);

            for (Integer role : rolesInt) {
                tempUser.addRole(new Role(role));
            }

            user = userService.save(tempUser);
        }

        if (avatar != null) {
            String devUploadDir = String.format("%s/%s/", DEV_STATIC_DIR, user.getId());
            String prodUploadDir = String.format("%s/%s/", PROD_STATIC_DIR, user.getId());
            String staticPath = String.format("%s/%s/", PROD_STATIC_PATH, user.getId());
            ProcessImage.uploadImage(devUploadDir, prodUploadDir, staticPath, avatar, environment);
        }

        String responseMessage = "";

        if (isEdit) {
            responseMessage = "C???p nh???t th??ng tin ng?????i d??ng th??nh c??ng";
        } else if (!needVerifyUser) {
            responseMessage = "Th??m ng?????i d??ng th??nh c??ng";
        } else {
            responseMessage = "????ng k?? th??nh c??ng";
        }

        return new OkResponse<>(responseMessage).response();
    }

    @PostMapping("forgot-password")
    public ResponseEntity<StandardJSONResponse<ForgotPasswordResponse>> forgotPassword(
            @RequestBody Map<String, String> payLoad) throws MessagingException {
        String email = payLoad.get("email");
        try {
            User user = userService.findByEmail(email);

            String msg = "Hi " + user.getFullName() + "<div>Need to reset your password?</div>" + "</div>"
                    + "<div>Click on the link below and enter the secret code above.</div>"
                    + "<a href='http://localhost:3000/auth/reset-password'>Reset your password</a>"
                    + "<div>If you did not forget your password, you can ignore this email.</div>";

            SendEmail.send(user.getEmail(), "Reset your password - AirJ18", msg);

            Random rand = new Random();
            int resetPasswordCode = rand.nextInt(999999) + 1;

            user.setResetPasswordCode(resetPasswordCode);
            user.setResetPasswordExpirationTime(LocalDateTime.now().plusMinutes(30));
            userService.save(user);

            String message = "Your reset password link has been sent to your email: " + user.getEmail();
            ForgotPasswordResponse forgotPasswordResponse = new ForgotPasswordResponse(resetPasswordCode, message,
                    email);

            return new OkResponse<>(forgotPasswordResponse).response();
        } catch (NotFoundException e) {
            return new BadResponse<ForgotPasswordResponse>(e.getMessage()).response();
        }
    }

    @PutMapping("reset-password")
    public ResponseEntity<StandardJSONResponse<String>> resetPassword(@RequestBody ResetPasswordDTO resetPassword) {
        if (resetPassword.getEmail().isEmpty()) {
            return new BadResponse<String>("Email is required to reset password. Discard reset password session.")
                    .response();
        }
        int resetPasswordCode = resetPassword.getResetPasswordCode();
        String email = resetPassword.getEmail();
        String newPassword = resetPassword.getNewPassword();
        String confirmNewPassword = resetPassword.getConfirmNewPassword();
        LocalDateTime now = LocalDateTime.now();

        try {
            User user = userService.findByEmail(email);

            if (resetPasswordCode != user.getResetPasswordCode())
                return new BadResponse<String>("Invalid reset code").response();

            boolean isAfter = now.isAfter(user.getResetPasswordExpirationTime());
            if (isAfter)
                return new BadResponse<String>("Reset password session is out of time").response();

            if (!newPassword.equals(confirmNewPassword))
                return new BadResponse<String>("New password does not match confirm new password").response();

            user.setPassword(userService.getEncodedPassword(newPassword));
            user.setResetPasswordExpirationTime(null);
            user.setResetPasswordCode(null);
            userService.save(user);

            return new OkResponse<>("Your password has been changed successfully").response();
        } catch (NotFoundException e) {
            e.printStackTrace();
            return new BadResponse<String>(e.getMessage()).response();
        }
    }


}
