package com.cdac.acts.walletservice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_GATEWAY) // Optional: a hint for Spring's default exception handlers
public class TransactionServiceException extends RuntimeException {

    public TransactionServiceException(String message) {
        super(message);
    }
    public TransactionServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}