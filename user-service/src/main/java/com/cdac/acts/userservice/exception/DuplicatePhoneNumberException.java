package com.cdac.acts.userservice.exception;

public class DuplicatePhoneNumberException extends RuntimeException {
    public DuplicatePhoneNumberException(String message) {
        super(message);
    }
}
