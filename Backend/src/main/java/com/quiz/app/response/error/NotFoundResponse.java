package com.quiz.app.response.error;

import com.quiz.app.response.FailureResponse;

public class NotFoundResponse<T> extends FailureResponse<T> {
    public NotFoundResponse() {
        super.setMessage("not found");
        super.setResponse(404, null);
    }

    public NotFoundResponse(String message) {
        super.setMessage(message);
        super.setResponse(404, null);
    }
}
