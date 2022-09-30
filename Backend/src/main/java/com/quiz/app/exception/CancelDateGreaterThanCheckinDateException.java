package com.quiz.app.exception;

public class CancelDateGreaterThanCheckinDateException extends Exception {
    public CancelDateGreaterThanCheckinDateException(String message) {
        super(message);
    }
}
