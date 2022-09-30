package com.quiz.app.response.error;

import com.quiz.app.response.FailureResponse;

public class ForbiddenResponse<T> extends FailureResponse<T> {
    public ForbiddenResponse() {
        super.setMessage("forbidden");
        super.setResponse(403, null);
    }

    public ForbiddenResponse(String message) {
        super.setMessage(message);
        super.setResponse(403, null);
    }
}
