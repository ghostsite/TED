package com.ted.xplatform.vo.communicate;

/**
 * @author ghostzhang
 */
public class ChatInfo implements java.io.Serializable, Cloneable {
    private static final long serialVersionUID = 1L;
    private Long              userId;               //User.id
    private String            loginName;            //User.loginName
    private String            userName;             //User.userName

    private String            chatTime;             //交流的时间

    private String            msg;                  //交流的信息。

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

    public String getChatTime() {
        return chatTime;
    }

    public void setChatTime(String chatTime) {
        this.chatTime = chatTime;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public static long getSerialversionuid() {
        return serialVersionUID;
    }

}
