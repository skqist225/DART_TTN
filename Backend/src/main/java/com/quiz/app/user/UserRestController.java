package com.quiz.app.user;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.quiz.app.FileUploadUtil;
// import com.quiz.app.address.AddressService;
import com.quiz.app.common.GetResource;
import com.quiz.app.exception.UserNotFoundException;
import com.quiz.app.response.StandardJSONResponse;
import com.quiz.app.response.error.BadResponse;
import com.quiz.app.response.success.OkResponse;
import com.quiz.app.security.UserDetailsImpl;
import com.quiz.app.user.dto.PostUpdateUserDTO;
import com.quiz.app.user.dto.UserSexDTO;
import com.quiz.entity.Sex;
import com.quiz.entity.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.FileAttribute;
import java.nio.file.attribute.PosixFilePermission;
import java.nio.file.attribute.PosixFilePermissions;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user/")
public class UserRestController {

    public final String DEV_STATIC_PATH = "src/main/resources/static/user_images/";
    public final String PROD_STATIC_PATH = "/opt/tomcat/webapps/ROOT/WEB-INF/classes/static/user_images/";

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserService userService;

    @Value("${env}")
    private String environment;

    // @Autowired
    // private AddressService addressService;

    @GetMapping("{id}")
    public ResponseEntity<StandardJSONResponse<User>> getUser(@PathVariable(value = "id") Integer id) {
        try {
            User user = userService.findById(id);

            return new OkResponse<>(user).response();
        } catch (UserNotFoundException e) {
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

    @PutMapping("update-personal-info")
    public ResponseEntity<StandardJSONResponse<User>> updatePersonalInfo(
            @AuthenticationPrincipal UserDetailsImpl userDetailsImpl, @RequestBody PostUpdateUserDTO postUpdateUserDTO)
            throws IOException {
        User currentUser = userDetailsImpl.getUser();

        User savedUser = null;
        String updatedField = postUpdateUserDTO.getUpdatedField();
        Map<String, String> updateData = postUpdateUserDTO.getUpdateData();

        switch (updatedField) {
            case "firstNameAndLastName": {
                if (updateData.get("firstName") == null && updateData.get("lastName") == null) {
                    return new BadResponse<User>("First name or last name is required").response();
                }

                if (updateData.get("firstName") != null) {
                    currentUser.setFirstName(updateData.get("firstName"));
                }
                if (updateData.get("lastName") != null) {
                    currentUser.setLastName(updateData.get("lastName"));
                }
                savedUser = userService.saveUser(currentUser);
                break;
            }
            case "sex": {
                String newSex = updateData.get("sex");
                Sex sex = newSex.equals("MALE") ? Sex.MALE : newSex.equals("FEMALE") ? Sex.FEMALE : Sex.OTHER;
                currentUser.setSex(sex);
                savedUser = userService.saveUser(currentUser);
                break;
            }
            case "gender": {
                if (updateData.get("gender") == null) {
                    return new BadResponse<User>("Gender is required").response();
                }
                String newSex = updateData.get("gender");
                Sex sex = newSex.equals("MALE") ? Sex.MALE : newSex.equals("FEMALE") ? Sex.FEMALE : Sex.OTHER;
                currentUser.setSex(sex);
                savedUser = userService.saveUser(currentUser);
                break;
            }
            case "birthday": {
                String birthdayStr = updateData.get("birthday");
                if (Objects.isNull(birthdayStr)) {
                    return new BadResponse<User>("Birthday is required").response();
                }

                LocalDate birthday = LocalDate.parse(updateData.get("birthday"));
                System.out.println(birthday);
                if (userService.checkBirthday(birthday)) {
                    return new BadResponse<User>("Your age must be greater than 18").response();
                }

                currentUser.setBirthday(birthday);
                savedUser = userService.saveUser(currentUser);
                break;
            }
            case "address": {
                int cityId = Integer.parseInt(updateData.get("city"));
                String street = updateData.get("street");

                // Address address = addressService.findByStreetAndCity(street, new
                // City(cityId));
                // if (address != null) {
                // currentUser.setAddress(address);
                // } else {
                // address = new Address(new City(cityId), street);
                // currentUser.setAddress(addressService.save(address));
                // }

                savedUser = userService.saveUser(currentUser);
                break;
            }
            case "password": {
                String oldPassword = updateData.get("oldPassword");
                String newPassword = updateData.get("newPassword");

                ArrayNode arrays = objectMapper.createArrayNode();

                if (!userService.isPasswordMatch(oldPassword, currentUser.getPassword())) {
                    ObjectNode node = objectMapper.createObjectNode();
                    node.put("oldPassword", "Old password does not correct");
                    arrays.add(node);
                }

                if (newPassword.length() < 8) {
                    ObjectNode node = objectMapper.createObjectNode();
                    node.put("newPassword", "New password length must be greater than 8 characters");
                    arrays.add(node);
                }

                if (arrays.size() > 0) {
                    return new BadResponse<User>(arrays.toString()).response();
                }

                currentUser.setPassword(newPassword);
                userService.encodePassword(currentUser);
                savedUser = userService.saveUser(currentUser);
                break;
            }
            case "phoneNumber": {
                String newPhoneNumber = updateData.get("phoneNumber");

                ArrayNode arrays = objectMapper.createArrayNode();

                // if (userService.checkPhoneNumber(newPhoneNumber, true, currentUser.getId()))
                // {
                // ObjectNode node = objectMapper.createObjectNode();
                // node.put("phoneNumber", "Phone number has already been taken");
                // arrays.add(node);
                // }

                try {
                    Integer.parseInt(newPhoneNumber);
                } catch (Exception ex) {
                    ObjectNode node = objectMapper.createObjectNode();
                    node.put("phoneNumber", "Phone number is not valid");
                    arrays.add(node);
                }

                if (arrays.size() > 0) {
                    return new BadResponse<User>(arrays.toString()).response();
                }

                savedUser = userService.saveUser(currentUser);
                break;
            }
        }

        return new OkResponse<User>(savedUser).response();
    }

    public User updateAvatar(User user, MultipartFile newAvatar, boolean isCallFromInternal, String environment)
            throws IOException {
        if (newAvatar != null) {
            String fileName = StringUtils.cleanPath(newAvatar.getOriginalFilename());
            String uploadDir = "";
            if (environment.equals("development")) {
                uploadDir = DEV_STATIC_PATH + user.getId() + "/";
            } else {
                String filePath = PROD_STATIC_PATH + user.getId() + "/";
                Path uploadPath = Paths.get(filePath);
                if (!Files.exists(uploadPath)) {
                    Set<PosixFilePermission> permissions = PosixFilePermissions.fromString("rwxr--r--");
                    FileAttribute<Set<PosixFilePermission>> fileAttributes = PosixFilePermissions
                            .asFileAttribute(permissions);

                    Files.createDirectories(uploadPath, fileAttributes);
                }
                uploadDir = GetResource.getResourceAsFile("static/user_images/" + user.getId() + "/");
                System.out.println(uploadDir);
            }

            FileUploadUtil.cleanDir(uploadDir);
            FileUploadUtil.saveFile(uploadDir, fileName, newAvatar);
            user.setAvatar(fileName);
        } else {
            if (isCallFromInternal) {
                return null;
            }
        }

        return user;
    }

    @PutMapping("update-avatar")
    public ResponseEntity<StandardJSONResponse<User>> updateUserAvatar(
            @AuthenticationPrincipal UserDetailsImpl userDetailsImpl,
            @RequestParam(name = "newAvatar", required = false) MultipartFile newAvatar) throws IOException {
        User user = userDetailsImpl.getUser();

        User savedAvatarUser = updateAvatar(user, newAvatar, true, environment);
        if (savedAvatarUser != null) {
            User savedUser = userService.saveUser(savedAvatarUser);
            return new OkResponse<>(savedUser).response();
        }

        return new BadResponse<User>("Please add image").response();
    }

    @GetMapping("info")
    public ResponseEntity<StandardJSONResponse<User>> getUserInfo(
            @AuthenticationPrincipal UserDetailsImpl userDetailsImpl) {
        return new OkResponse<>(userDetailsImpl.getUser()).response();
    }
}
