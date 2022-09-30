package com.quiz.app.exception;

public class ReserveDateInThePastException extends Exception {
    public ReserveDateInThePastException(String message) {
        super(message);
    }
}
