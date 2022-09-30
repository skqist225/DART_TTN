package com.quiz.app.response.error;

import com.quiz.app.response.FailureResponse;

public class NotAuthenticatedResponse<T> extends FailureResponse<T> {
    public NotAuthenticatedResponse() {
        super.setMessage("user not authenticated");
        super.setResponse(401, null);
    }
}
