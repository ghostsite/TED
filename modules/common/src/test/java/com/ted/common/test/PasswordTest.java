package com.ted.common.test;

import org.apache.commons.collections.KeyValue;
import org.springside.modules.security.utils.Digests;
import org.springside.modules.utils.Encodes;

import com.ted.common.util.PasswordUtils;

public class PasswordTest {
    public static void main(String[] args) {
        KeyValue encryptPassword = PasswordUtils.encryptPassword("123");
        System.out.println("salt = " + encryptPassword.getKey());
        System.out.println("pwd = " + encryptPassword.getValue());
        
        System.out.println(PasswordUtils.encryptPassword("123","e8878aca582ad294"));
        
        byte[] salt = Digests.generateSalt(8);
        String en = Encodes.encodeHex(salt);
        byte[] ensalt = Encodes.decodeHex(en);
        System.out.println(en);
        System.out.println(salt);
        System.out.println(ensalt);
    }
    
}
