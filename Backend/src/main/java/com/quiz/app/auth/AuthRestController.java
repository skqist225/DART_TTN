package com.quiz.app.auth;

import com.quiz.app.common.CommonUtils;
import com.quiz.app.email.SendEmail;
import com.quiz.app.exception.NotFoundException;
import com.quiz.app.jwt.JwtUtils;
import com.quiz.app.response.StandardJSONResponse;
import com.quiz.app.response.error.BadResponse;
import com.quiz.app.response.error.ForbiddenResponse;
import com.quiz.app.response.success.OkResponse;
import com.quiz.app.security.UserDetailsServiceImpl;
import com.quiz.app.user.UserService;
import com.quiz.app.user.dto.ForgotPasswordResponse;
import com.quiz.app.user.dto.PostCreateUserDTO;
import com.quiz.app.user.dto.ResetPasswordDTO;
import com.quiz.entity.User;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
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

import javax.mail.MessagingException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Objects;
import java.util.Random;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/auth")
public class AuthRestController {
    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsServiceImpl userDetailsServiceImpl;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("login")
    public ResponseEntity<StandardJSONResponse<User>> login(
            @RequestBody LoginDTO loginDTO,
            @RequestParam(value = "admin", defaultValue = "false") String admin) {
        try {
            authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(loginDTO.getId(),
                            loginDTO.getPassword()));

            final UserDetails userDetails = userDetailsServiceImpl.loadUserByUsername(loginDTO.getId());
            final String token = jwtUtils.generateToken(userDetails);
            User user = userService.findById(loginDTO.getId());
            user.setToken(token);

            if (admin.equals("true") && !user.hasRole("Quản trị viên")) {
                return new ForbiddenResponse<User>(
                        "Tài khoản của bạn không đủ quyền để truy cập tài nguyên này").response();
            }

            return new OkResponse<>(user).response();
        } catch (BadCredentialsException | NotFoundException e) {
            return new BadResponse<User>(e.getMessage()).response();
        }
    }

    @GetMapping("logout")
    public ResponseEntity<StandardJSONResponse<String>> logout() {
        return new OkResponse<>("Đăng xuất thành công").response();
    }

    public void catchUserInputException(CommonUtils commonUtils, String id,
                                        String firstName,
                                        String lastName,
                                        String email,
                                        String password,
                                        String birthday,
                                        String sexStr,
                                        Set<Integer> roles
    ) {
        if (Objects.isNull(id) || StringUtils.isEmpty(id)) {
            commonUtils.addError("id", "Mã ND không được để trống");
        } else if (id.length() > 10) {
            commonUtils.addError("id", "Mã ND tối đa 10 ký tự");
        }

        if (Objects.isNull(firstName) || StringUtils.isEmpty(firstName)) {
            commonUtils.addError("firstName", "Tên không được để trống");
        }

        if (Objects.isNull(lastName) || StringUtils.isEmpty(lastName)) {
            commonUtils.addError("lastName", "Họ không được để trống");
        }

        Pattern pattern = Pattern.compile("[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}");
        if (Objects.isNull(email) || StringUtils.isEmpty(email)) {
            commonUtils.addError("email", "Email không được để trống");
        } else {
            Matcher mat = pattern.matcher(email);
            if (!mat.matches()) {
                commonUtils.addError("email", "Địa chỉ email không hợp lệ");
            }
        }

        if (Objects.isNull(password)) {
            commonUtils.addError("password", "Mật khẩu không được để trống");
        } else if (password.length() < 8) {
            commonUtils.addError("password", "Mật khẩu ít nhất 8 ký tự");
        }

        if (Objects.isNull(birthday) || StringUtils.isEmpty(birthday)) {
            commonUtils.addError("birthday", "Ngày sinh không được để trống");
        }

        if (Objects.isNull(sexStr) || StringUtils.isEmpty(sexStr)) {
            commonUtils.addError("sexStr", "Giới tính không được để trống");
        }

        if (roles.size() == 0) {
            commonUtils.addError("sexStr", "Vai trò không được để trống");
        } else {
            for (Integer roleId : roles) {

            }
        }
    }

    @PostMapping("register")
    public ResponseEntity<StandardJSONResponse<User>> registerUser(
            @ModelAttribute PostCreateUserDTO postCreateUserDTO,
            @RequestParam(name = "isEdit", required = false, defaultValue = "false") boolean isEdit
    ) {
        CommonUtils commonUtils = new CommonUtils();
        User user = null;

        String id = postCreateUserDTO.getId();
        String firstName = postCreateUserDTO.getFirstName();
        String lastName = postCreateUserDTO.getLastName();
        String email = postCreateUserDTO.getEmail();
        String password = postCreateUserDTO.getPassword();
        String birthday = postCreateUserDTO.getBirthday();
        String address = postCreateUserDTO.getAddress();
        String sexStr = postCreateUserDTO.getSex();
        Set<Integer> roles = postCreateUserDTO.getRoles();

        catchUserInputException(commonUtils, id, firstName, lastName, email, password, birthday, sexStr,
                roles);

        if (commonUtils.getArrayNode().size() > 0) {
            return new BadResponse<User>(commonUtils.getArrayNode().toString()).response();
        } else {
            if (userService.isIdDuplicated(id)) {
                commonUtils.addError("id", "Mã ND đã tồn tại");
            }

            if (userService.isBirthdayGreaterThanOrEqualTo18(LocalDate.parse(postCreateUserDTO.getBirthday()))) {
                commonUtils.addError("birthday", "Tuổi của bạn phải lớn hơn 18");
            }

            if (userService.isEmailDuplicated(id, email, false)) {
                commonUtils.addError("email", "Địa chỉ email đã được sử dụng");
            }
        }

        if(isEdit) {
            try {
                user =userService.findById(id);
            } catch (NotFoundException e) {

            }
        }else {
            user = userService.saveUser(User.build(postCreateUserDTO));
        }


        return new OkResponse<>(userService.save(User.build(postCreateUserDTO))).response();
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
            userService.saveUser(user);

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
            userService.saveUser(user);

            return new OkResponse<>("Your password has been changed successfully").response();
        } catch (NotFoundException e) {
            e.printStackTrace();
            return new BadResponse<String>(e.getMessage()).response();
        }
    }


}
