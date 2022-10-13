package com.quiz.app.user;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
// import com.quiz.app.address.AddressService;
import com.quiz.app.exception.UserNotFoundException;
import com.quiz.app.exception.VerifiedUserException;
import com.quiz.app.response.StandardJSONResponse;
import com.quiz.app.response.error.BadResponse;
import com.quiz.app.response.success.OkResponse;
import com.quiz.app.user.dto.UpdateUserDTO;
import com.quiz.app.user.dto.UserListResponse;
import com.quiz.entity.Sex;
import com.quiz.entity.User;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
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
import java.text.ParseException;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/admin/")
public class AdminUserRestController {
    @Autowired
    private UserService userService;

    // @Autowired
    // private AddressService addressService;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${env}")
    private String environment;

    @GetMapping(value = "/users/listings/{page}")
    public ResponseEntity<StandardJSONResponse<UserListResponse>> listings(
            @PathVariable("page") Integer page,
            @RequestParam(name = "roles", required = false, defaultValue = "User,Host,Admin") String roles,
            @RequestParam(name = "statuses", required = false, defaultValue = "1,0") String statuses,
            @RequestParam(name = "query", required = false, defaultValue = "") String query) throws ParseException {
        Map<String, String> filters = new HashMap<>();
        filters.put("query", query);
        filters.put("roles", roles);
        filters.put("statuses", statuses);

        UserListResponse userListResponse = userService.getAllUsers(filters, page);

        return new OkResponse<>(userListResponse).response();
    }

    @GetMapping("users/{id}")
    public ResponseEntity<StandardJSONResponse<User>> getUser(@PathVariable(value = "id") String id) {
        try {
            User user = userService.findById(id);

            return new OkResponse<>(user).response();
        } catch (UserNotFoundException e) {
            return new BadResponse<User>(e.getMessage()).response();
        }
    }

    @DeleteMapping("users/{userId}")
    public ResponseEntity<StandardJSONResponse<String>> deleteUser(@PathVariable(value = "userId") String userId) {
        try {
            return new OkResponse<>(userService.deleteById(userId)).response();
        } catch (UserNotFoundException | VerifiedUserException e) {
            return new BadResponse<String>(e.getMessage()).response();
        }
    }

    @PutMapping("users/{id}/{action}")
    public ResponseEntity<StandardJSONResponse<String>> disableUser(@PathVariable(value = "id") String id,
            @PathVariable(value = "action") String action) {
        try {
            User user = userService.findById(id);
            // user.setStatus(action.equals("enable"));
            userService.saveUser(user);

            return new OkResponse<>("Update User Successfully").response();
        } catch (UserNotFoundException e) {
            return new BadResponse<String>(e.getMessage()).response();
        }
    }

    @PutMapping("users/{id}/update")
    public ResponseEntity<StandardJSONResponse<User>> updateUser(@PathVariable(value = "id") String userId,
            @RequestBody UpdateUserDTO updateUserDTO) throws IOException {
        try {
            User user = userService.findById(userId);

            ArrayNode arrays = objectMapper.createArrayNode();

            if (userService.checkBirthday(LocalDate.parse(updateUserDTO.getBirthday()))) {
                ObjectNode node = objectMapper.createObjectNode();
                node.put("birthday", "Your age must be greater than 18");
                arrays.add(node);
            }

            if (updateUserDTO.getPhoneNumber().length() != 10) {
                ObjectNode node = objectMapper.createObjectNode();
                node.put("phoneNumberCharacter", "Phone number must be 10 characters");
                arrays.add(node);
            }

            Pattern pattern = Pattern.compile("^\\d{10}$");
            Matcher matcher = pattern.matcher(updateUserDTO.getPhoneNumber());
            if (!matcher.matches()) {
                ObjectNode node = objectMapper.createObjectNode();
                node.put("phoneNumberString", "Phone number must be 10 characters");
                arrays.add(node);
            }

            if (arrays.size() > 0) {
                return new BadResponse<User>(arrays.toString()).response();
            }

            user.setFirstName(updateUserDTO.getFirstName());
            user.setLastName(updateUserDTO.getLastName());

            String newSex = updateUserDTO.getSex();
            Sex sex = newSex.equals("MALE") ? Sex.MALE : newSex.equals("FEMALE") ? Sex.FEMALE : Sex.OTHER;
            user.setSex(sex);


            if (updateUserDTO.getPassword() != null) {
                user.setPassword(updateUserDTO.getPassword());
                userService.encodePassword(user);
            }

            user.setBirthday(LocalDate.parse(updateUserDTO.getBirthday()));

            new UserRestController().updateAvatar(user, updateUserDTO.getAvatar(), false,
                    environment);

            // if (updateUserDTO.getCity() != null && updateUserDTO.getStreet() != null) {
            // Address address = null;
            // if (user.getAddress() != null) {
            // address = addressService.findById(user.getAddress().getId());
            // }

            // if (address == null) {
            // if (Objects.nonNull(updateUserDTO.getCity()) &&
            // Objects.nonNull(updateUserDTO.getStreet())) {
            // address = new Address(new City(updateUserDTO.getCity()),
            // updateUserDTO.getStreet());

            // Address savedAddress = addressService.save(address);
            // user.setAddress(savedAddress);
            // }
            // } else {
            // if (updateUserDTO.getCity() != null) {
            // address.setCity(new City(updateUserDTO.getCity()));
            // }
            // if (updateUserDTO.getStreet() != null) {
            // address.setStreet(updateUserDTO.getStreet());
            // }

            // addressService.save(address);
            // }
            // }

            return new OkResponse<>(userService.saveUser(user)).response();
        } catch (UserNotFoundException e) {
            return new BadResponse<User>(e.getMessage()).response();
        }
    }
}
