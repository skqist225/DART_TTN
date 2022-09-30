package com.quiz.app.response.success;

import com.quiz.app.response.SuccessResponse;

public class OkResponse<T> extends SuccessResponse<T> {
    public OkResponse(T data) {
        super.setResponse(200, data);
    }
}
