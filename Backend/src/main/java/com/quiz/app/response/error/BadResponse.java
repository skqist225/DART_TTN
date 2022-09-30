package com.quiz.app.response.error;

import com.quiz.app.response.FailureResponse;

public class BadResponse<T> extends FailureResponse<T> {
    public BadResponse(String message) {
        super.setMessage(message);
        super.setResponse(400, null);
    }
}