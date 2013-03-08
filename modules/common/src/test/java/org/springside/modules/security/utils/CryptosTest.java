package org.springside.modules.security.utils;

import static org.junit.Assert.*;

import org.junit.Test;
import org.springside.modules.utils.Encodes;

public class CryptosTest {
	

	@Test
	public void aes() {
		byte[] key = Cryptos.generateAesKey();
		System.out.println(key.length);
		System.out.println(new String(key));
		assertEquals(16, key.length);
		String input = "123";

		byte[] encryptResult = Cryptos.aesEncrypt(input.getBytes(), key);
		String descryptResult = Cryptos.aesDecrypt(encryptResult, key);

		System.out.println("aes key in hex            :" + Encodes.encodeHex(key));
		System.out.println("aes key in hex11            :" + descryptResult);
		System.out.println("aes encrypt in hex result :" + Encodes.encodeHex(encryptResult));
		assertEquals(input, descryptResult);
	}
}
