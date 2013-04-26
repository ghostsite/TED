package com.ted.xplatform.vo.communicate;

public class ChatUser implements java.io.Serializable, Cloneable {
    private static final long serialVersionUID = 1L;

    private Long              userId;               //User.id
    private String            loginName;            //User.loginName
    private String            userName;             //User.userName

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getLoginName() {
        return loginName;
    }

    public void setLoginName(String loginName) {
        this.loginName = loginName;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public static long getSerialversionuid() {
        return serialVersionUID;
    }

}
