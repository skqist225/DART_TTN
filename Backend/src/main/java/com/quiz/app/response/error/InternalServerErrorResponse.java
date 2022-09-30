package com.quiz.app.response.error;

import com.quiz.app.response.FailureResponse;

public class InternalServerErrorResponse<T> extends FailureResponse<T> {
    public InternalServerErrorResponse() {
        super.setMessage("Internal server error");
        super.setResponse(500, null);
    }
}
