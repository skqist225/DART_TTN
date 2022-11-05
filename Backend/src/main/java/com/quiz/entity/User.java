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
@Table(name = "NGUOIDUNG")
public class User {
    @Id
    @Column(name = "MANGUOIDUNG", columnDefinition = "NCHAR(10)")
    private String id;

    @Column(name = "TEN", columnDefinition = "NVARCHAR(50)", nullable = false)
    private String firstName;

    @Column(name = "HO", columnDefinition = "NVARCHAR(10)", nullable = false)
    private String lastName;

    @ManyToOne
    @JoinColumn(name = "MALOP")
    private Class cls;

    @Enumerated(EnumType.STRING)
    @Column(name = "GIOITINH", length = 10, nullable = false)
    private Sex sex;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(name = "NGAYSINH", nullable = false)
    private LocalDate birthday;

    @Column(name = "DIACHI", columnDefinition = "NVARCHAR(255)")
    private String address;

    @Column(name = "EMAIL", nullable = false, unique = true)
    private String email;

    @JsonIgnore
    @Column(name = "MATKHAU", nullable = false, length = 255)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @Column(name = "DANGHIHOC", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean status;

    @JsonIgnore
    @Column(name = "MADOIMATKHAU")
    private Integer resetPasswordCode;

    @JsonIgnore
    @Column(name = "THOIHANDOIMATKHAU")
    private LocalDateTime resetPasswordExpirationTime;

    @Builder.Default
    @ManyToMany
    @JoinTable(name = "VAITRO", joinColumns = @JoinColumn(name = "MANGUOIDUNG"),
            inverseJoinColumns = @JoinColumn(name = "MAVAITRO"))
    private Set<Role> roles = new HashSet<>();

    @Builder.Default
    @Column(columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean emailVerified = false;

    @JsonIgnore
    @Column(name = "ANHDAIDIEN")
    private String avatar;

    @Transient
    private String token;

    @Transient
    @JsonIgnore
    public static User build(RegisterDTO registerDTO, Class cls) {
        String id = registerDTO.getId();
        String firstName = registerDTO.getFirstName();
        String lastName = registerDTO.getLastName();
        String email = registerDTO.getEmail();
        String password = registerDTO.getPassword();
        Sex sex = registerDTO.getSex();
        LocalDate birthday = LocalDate.parse(registerDTO.getBirthday());
        Integer roleId = registerDTO.getRoleId();
        String address = registerDTO.getAddress();

        Set<Role> roles = new HashSet<>();
        Role role = new Role(2);
        roles.add(role);
        if (Objects.nonNull(roleId) && !roleId.equals(2)) {
            role = new Role(roleId);
            roles.add(role);
        }

        return User.builder().id(id).firstName(firstName).lastName(lastName)
                .email(email).password(password).sex(sex)
                .birthday(birthday).roles(roles)
                .emailVerified(false)
                .status(true)
                .cls(cls)
                .address(address)
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
        for (Role rle : roles) {
            if (rle.getName().equals(role)) {
                return true;
            }
        }

        return false;
    }
}
