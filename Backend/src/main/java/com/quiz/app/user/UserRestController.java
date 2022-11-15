package com.quiz.app.user;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.quiz.app.exception.NotFoundException;
import com.quiz.app.response.StandardJSONResponse;
import com.quiz.app.response.error.BadResponse;
import com.quiz.app.response.success.OkResponse;
import com.quiz.app.security.UserDetailsImpl;
import com.quiz.app.user.dto.PostUpdateUserDTO;
import com.quiz.app.user.dto.UserSexDTO;
import com.quiz.app.utils.ProcessImage;
import com.quiz.entity.Sex;
import com.quiz.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/users/")
public class UserRestController {

    public final String DEV_STATIC_DIR = "src/main/resources/static/user_images/";
    public final String PROD_STATIC_DIR = "/opt/tomcat/webapps/ROOT/WEB-INF/classes/static/user_images/";
    public final String PROD_STATIC_PATH = "static/user_images/";


    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserService userService;

    @Value("${env}")
    private String environment;

    @GetMapping("{id}")
    public ResponseEntity<StandardJSONResponse<User>> getUser(@PathVariable(value = "id") String id) {
        try {
            User user = userService.findById(id);

            return new OkResponse<>(user).response();
        } catch (NotFoundException e) {
            return new BadResponse<User>(e.getMessage()).response();
        }
    }

    @GetMapping("sex")
    public ResponseEntity<StandardJSONResponse<List<UserSexDTO>>> getSexs() {
        List<UserSexDTO> sexs = new ArrayList<>();

        for (Sex sex : Sex.values()) {
            sexs.add(new UserSexDTO(sex.toString(),
                    sex.toString().equals("MALE") ? "Nam" : sex.toString().equals("FEMALE") ? "Nữ" : "Khác"));
        }

        return new OkResponse<>(sexs).response();
    }

    public void updateAvatar(User user, MultipartFile newAvatar, String environment)
            throws IOException {
        String devUploadDir = String.format("%s/%s/", DEV_STATIC_DIR, user.getId());
        String prodUploadDir = String.format("%s/%s/", PROD_STATIC_DIR, user.getId());
        String staticPath = String.format("%s/%s/", PROD_STATIC_PATH, user.getId());

        ProcessImage.uploadImage(devUploadDir, prodUploadDir, staticPath, newAvatar, environment);
        user.setAvatar(newAvatar.getOriginalFilename());
    }

    @PutMapping("update-avatar")
    public ResponseEntity<StandardJSONResponse<User>> updateUserAvatar(
            @AuthenticationPrincipal UserDetailsImpl userDetailsImpl,
            @RequestParam(name = "newAvatar", required = false) MultipartFile newAvatar) throws IOException {
        User user = userDetailsImpl.getUser();

        updateAvatar(user, newAvatar, environment);
        User savedUser = userService.saveUser(user);
        return new OkResponse<>(savedUser).response();
    }
}
