package com.ted.common.util;

import org.apache.commons.collections.KeyValue;
import org.apache.commons.collections.keyvalue.DefaultKeyValue;
import org.springside.modules.security.utils.Digests;
import org.springside.modules.utils.Encodes;

public abstract class PasswordUtils {
    public static final String HASH_ALGORITHM   = "SHA-1";
    public static final int    HASH_INTERATIONS = 1024;
    private static final int   SALT_SIZE        = 8;      //这3个是给用户加密用的

    /**
     * Key is salt ,value is password
     */
    public static final KeyValue encryptPassword(String plainPassword) {
        byte[] salt = Digests.generateSalt(SALT_SIZE);
        DefaultKeyValue keyValue = new DefaultKeyValue(Encodes.encodeHex(salt), encryptPassword(plainPassword, salt));
        return keyValue;
    }

    public static final String encryptPassword(String plainPassword, String salt) { // salt is Encodes.encodeHex(salt)之后的值
        return encryptPassword(plainPassword, Encodes.decodeHex(salt));
    }
    
    private static final String encryptPassword(String plainPassword, byte[] salt) {
        return Encodes.encodeHex(Digests.sha1(plainPassword.getBytes(), salt, HASH_INTERATIONS));
    }

    public static final KeyValue getDefaultKeyEncrypt() {
        String plainPassword = ConfigUtils.getDefaultPassword();
        return encryptPassword(plainPassword);
    }
}
