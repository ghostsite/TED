package com.ted.xplatform.exception;

import com.ted.common.exception.ErrorCode;

/**
 * 关于用户信息的异常编码
 * @author ghostzhang
 */
public enum UserErrorCode implements ErrorCode {
    ONLY_UPDATE_CURRENTUSER(001), USER_EXIST(002),NO_USERID(003);

    private final int number;

    private UserErrorCode(int number) {
        this.number = number;
    }

    @Override
    public int getNumber() {
        return number;
    }
}
