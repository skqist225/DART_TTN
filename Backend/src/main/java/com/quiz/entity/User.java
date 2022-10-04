package com.quiz.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.quiz.app.user.dto.RegisterDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.PastOrPresent;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "users")
public class User {
    @Id
    private String id;

    @JsonIgnore
    private String avatar;

    private String token;

    @NotEmpty(message = "Tên không được để trống.")
    @Column(nullable = false, length = 48)
    private String firstName;

    @NotEmpty(message = "Họ không được để trống.")
    @Column(nullable = false, length = 48)
    private String lastName;

    @Enumerated(EnumType.STRING)
    @Column(length = 10, nullable = false)
    private Sex sex;

    @PastOrPresent(message = "Không thể chọn ngày lớn hơn hiện tại")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate birthday;

    @Email(message = "Không đúng định dạng email.")
    @NotEmpty(message = "Email không được để trống.")
    @Column(nullable = false, unique = true)
    private String email;

    @NotEmpty(message = "Mật khẩu không được để trống.")
    @Size(min = 8, max = 512, message = "Mật khẩu phải ít nhất 8 kí tự.")
    @Column(nullable = false, length = 255)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @JsonIgnore
    private String password;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;

    @JsonIgnore
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "address_id")
    private Address address;

    @Builder.Default
    @Column(name = "email_verified", columnDefinition = "boolean default false")
    private boolean emailVerified = false;

    @JsonIgnore
    private Integer resetPasswordCode;

    @JsonIgnore
    private LocalDateTime resetPasswordExpirationTime;

    @ManyToOne
    @JoinColumn(name = "class_id")
    private Class studentClass;

    @Builder.Default
    @ManyToMany
    @JoinTable(name = "user_subjects", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "subject_id"))
    private Set<Subject> subjects = new HashSet<>();

    @Transient
    @JsonIgnore
    public static User build(RegisterDTO registerDTO) {
        Sex sex = registerDTO.getSex().equals("MALE") ? Sex.MALE
                : (registerDTO.getSex().equals("FEMALE") ? Sex.FEMALE : Sex.OTHER);

        Role role = new Role(2);
        if (Objects.nonNull(registerDTO.getRoleId())) {
            role = new Role(registerDTO.getRoleId());
        }

        return User.builder().firstName(registerDTO.getFirstName()).lastName(registerDTO.getLastName())
                .email(registerDTO.getEmail()).password(registerDTO.getPassword()).sex(sex)
                .birthday(registerDTO.getBirthday()).role(role)
                .emailVerified(false)
                .build();
    }

    @Transient
    public String getAvatarPath() {
        if (this.getId() == null || this.avatar == null) {
            return "/images/default_user_avatar.png";
        }

        return String.format("/user_images/%s/%s", this.getId(), this.avatar);
    }

    @Transient
    public String getFullName() {
        return String.format("%s %s", this.firstName, this.lastName);
    }

    @Transient
    public String getFullPathAddress() {
        try {
            if (this.address != null) {
                City city = this.address.getCity();
                State state = city.getState();
                return String.format("%s, %s, %s, %s", this.address.getStreet(), city.getName(),
                        state.getName(), state.getCountry().getName());
            }
        } catch (NullPointerException ex) {
            return "";
        }

        return "";
    }

    @Transient
    public ObjectNode getAddressDetails() throws JsonProcessingException {
        try {
            ObjectMapper mapper = new ObjectMapper();
            ObjectNode objectNode = mapper.createObjectNode();
            ObjectNode countryNode = mapper.createObjectNode();
            ObjectNode stateNode = mapper.createObjectNode();
            ObjectNode cityNode = mapper.createObjectNode();

            if (this.address != null) {
                City city = this.address.getCity();
                State state = city.getState();
                Country country = state.getCountry();

                objectNode.set("country", countryNode.put("id", country.getId()).put("name", country.getName()));
                objectNode.set("state", stateNode.put("id", state.getId()).put("name", state.getName()));
                objectNode.set("city", cityNode.put("id", city.getId()).put("name", city.getName()));
                objectNode.put("street", this.address.getStreet());
            }

            return objectNode;
        } catch (NullPointerException ex) {
            return null;
        }
    }

    public boolean hasRole(String role) {
        return role.equals(this.getRole().getName());
    }
}
