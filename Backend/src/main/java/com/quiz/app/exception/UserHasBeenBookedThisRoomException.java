package com.quiz.app.exception;

public class UserHasBeenBookedThisRoomException extends Exception {
    public UserHasBeenBookedThisRoomException(String message) {
        super(message);
    }
}
