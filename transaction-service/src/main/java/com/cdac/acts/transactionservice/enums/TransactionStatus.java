package com.cdac.acts.transactionservice.enums;


public enum TransactionStatus {
    PENDING,
    SUCCESS,
    FAILED,
    CANCELLED, // won't work need to add in DB as allowed values
}
