package com.quiz.app.user.dto;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class ForgotPasswordResponse {
    public int resetPasswordCode;
    public String message;
    public String email;
}
