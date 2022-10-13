package com.quiz.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.quiz.app.user.dto.RegisterDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;
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

    @Column(nullable = false, length = 48)
    private String firstName;

    @Column(nullable = false, length = 48)
    private String lastName;

    @Enumerated(EnumType.STRING)
    @Column(length = 10, nullable = false)
    private Sex sex;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate birthday;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, length = 255)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @JsonIgnore
    private String password;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;

    @Builder.Default
    @Column(name = "email_verified", columnDefinition = "boolean default false")
    private boolean emailVerified = false;

    @ManyToOne
    @JoinColumn(name = "class_id")
    private Class cls;

    @Builder.Default
    @ManyToMany
    @JoinTable(name = "user_subjects", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "subject_id"))
    private Set<Subject> subjects = new HashSet<>();

    @Column(columnDefinition = "TEXT", nullable = false)
    private String address;

    private boolean status;

    @JsonIgnore
    private Integer resetPasswordCode;

    @JsonIgnore
    private LocalDateTime resetPasswordExpirationTime;

    @Transient
    @JsonIgnore
    public static User build(RegisterDTO registerDTO) {
        String id = registerDTO.getId();
        String firstName = registerDTO.getFirstName();
        String lastName = registerDTO.getLastName();
        String email = registerDTO.getEmail();
        String password = registerDTO.getPassword();
        Sex sex = registerDTO.getSex();
        LocalDate birthday = registerDTO.getBirthday();
        Integer roleId = registerDTO.getRoleId();

        Role role = new Role(2);
        if (Objects.nonNull(roleId)) {
            role = new Role(roleId);
        }

        return User.builder().id(id).firstName(firstName).lastName(lastName)
                .email(email).password(password).sex(sex)
                .birthday(birthday).role(role)
                .emailVerified(false)
                .status(true)
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

    public boolean hasRole(String role) {
        return role.equals(this.getRole().getName());
    }
}
