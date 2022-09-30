package com.quiz.app.user.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordByPhoneNumberDTO {
	private String phone;
	private String newPassword;
	private String confirmNewPassword;
}
