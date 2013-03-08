package com.ted.common.util;

import org.springside.modules.security.utils.Cryptos;
import org.springside.modules.utils.Encodes;

public abstract class PasswordUtils {
    /**
     * 加密，返回明文。
     * re[0] = 密钥
     * rs[1] = 加密后的密码
     * @param plainPassword
     */
    public static final String[] encrypto(String plainPassword) {
        String[] result = new String[2];
        byte[] key = Cryptos.generateAesKey();
        byte[] encryptResult = Cryptos.aesEncrypt(plainPassword.getBytes(), key);

        String hexKey = Encodes.encodeHex(key);
        String hexResult = Encodes.encodeHex(encryptResult);

        result[0] = hexKey;
        result[1] = hexResult;
        return result;
    }

    public static final String encrypto(String plainPassword, String key) {
        byte[] decodeKey = Encodes.decodeHex(key);
        byte[] encryptResult = Cryptos.aesEncrypt(plainPassword.getBytes(), decodeKey);
        String hexResult = Encodes.encodeHex(encryptResult);
        return hexResult;
    }

    public static final String[] getDefaultKeyEncrypto() {
        String plainPassword = ConfigUtils.getDefaultPassword();
        return encrypto(plainPassword);
    }
}
