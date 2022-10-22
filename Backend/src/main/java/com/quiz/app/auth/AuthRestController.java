package com.quiz.app.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.quiz.app.classes.ClassService;
import com.quiz.app.email.SendEmail;
import com.quiz.app.exception.NotFoundException;
import com.quiz.app.exception.UserNotFoundException;
import com.quiz.app.jwt.JwtUtils;
import com.quiz.app.response.StandardJSONResponse;
import com.quiz.app.response.error.BadResponse;
import com.quiz.app.response.error.ForbiddenResponse;
import com.quiz.app.response.success.OkResponse;
import com.quiz.app.security.UserDetailsServiceImpl;
import com.quiz.app.user.UserService;
import com.quiz.app.user.dto.ForgotPasswordResponse;
import com.quiz.app.user.dto.RegisterDTO;
import com.quiz.app.user.dto.ResetPasswordDTO;
import com.quiz.entity.Class;
import com.quiz.entity.User;
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

@RestController
@RequestMapping("/api/auth")
public class AuthRestController {
    @Autowired
    private UserService userService;

    @Autowired
    private ClassService classService;

    @Autowired
    private ObjectMapper objectMapper;

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

            if (admin.equals("true") && !user.getRole().getName().equals("Admin")) {
                return new ForbiddenResponse<User>(
                        "Tài khoản của bạn không đủ quyền để truy cập tài nguyên này").response();
            }

            return new OkResponse<>(user).response();
        } catch (BadCredentialsException | UserNotFoundException e) {
            return new BadResponse<User>(e.getMessage()).response();
        }
    }

    @GetMapping("logout")
    public ResponseEntity<StandardJSONResponse<String>> logout() {
        return new OkResponse<>("Đăng xuất thành công").response();
    }

    @PostMapping("register")
    public ResponseEntity<StandardJSONResponse<User>> registerUser(@ModelAttribute RegisterDTO postUser
    ) {
        ArrayNode arrays = objectMapper.createArrayNode();

        if (userService.checkBirthday(LocalDate.parse(postUser.getBirthday()))) {
            ObjectNode node = objectMapper.createObjectNode();
            node.put("birthday", "Tuổi của bạn phải lớn hơn 18");
            arrays.add(node);
        }

        if (userService.isEmailDuplicated(postUser.getId(), postUser.getEmail(), false)) {
            ObjectNode node = objectMapper.createObjectNode();
            node.put("email", "Địa chỉ email đã được sử dụng");
            arrays.add(node);
        }

        if (arrays.size() > 0) {
            return new BadResponse<User>(arrays.toString()).response();
        }

        try {
            Class cls = null;
            if (Objects.nonNull(postUser.getRoleId()) && postUser.getRoleId().equals(1)) {
                cls = classService.findById(postUser.getClassId());
            }

            return new OkResponse<>(userService.save(User.build(postUser, cls))).response();
        } catch (NotFoundException e) {
            return new BadResponse<User>(e.getMessage()).response();
        }
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
        } catch (UserNotFoundException e) {
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
        } catch (UserNotFoundException e) {
            e.printStackTrace();
            return new BadResponse<String>(e.getMessage()).response();
        }
    }


}
