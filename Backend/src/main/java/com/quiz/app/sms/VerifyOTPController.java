package com.quiz.app.sms;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.quiz.app.response.StandardJSONResponse;
import com.quiz.app.response.error.BadResponse;
import com.quiz.app.response.success.OkResponse;

@RestController
public class VerifyOTPController {

    @PostMapping("/api/verify-otp")
    public ResponseEntity<StandardJSONResponse<String>> verifyOTP(@RequestBody TempOTP sms) {
        if (sms.getOtp() == StoreOTP.getOtp()) {
            return new OkResponse<String>("Correct OTP").response();
        }

        return new BadResponse<String>("Incorrect OTP").response();
    }
}
