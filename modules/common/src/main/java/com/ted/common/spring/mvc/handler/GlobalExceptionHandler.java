/*
 * Copyright 2002-2011 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.ted.common.spring.mvc.handler;

import java.nio.charset.Charset;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import com.ted.common.exception.BusinessException;
import com.ted.common.spring.mvc.method.annotation.ExtensionExceptionHandlerExceptionResolver;

/**
 * A class with "global" {@code @ExceptionHandler} methods for use across controllers. 
 * 
 * <p>Enabled through {@link ExtensionExceptionHandlerExceptionResolver}.
 * @see XPlatformGlobalExceptionHandler
 */
public class GlobalExceptionHandler {
    @ExceptionHandler(value={MaxUploadSizeExceededException.class, BusinessException.class})
	public ResponseEntity<String> handle(Exception exception) {
	    if(exception instanceof BusinessException){
	        BusinessException businessException = (BusinessException)exception;
	        HttpHeaders headers = new HttpHeaders();
	        MediaType mt=new MediaType("text","html",Charset.forName("utf-8"));  
	         headers.setContentType(mt);  
	        //headers.set("Accept-Charset", "UTF-8");
	        //headers.setContentType(MediaType.TEXT_HTML);
	        return new ResponseEntity<String>("{success:false, errorMessage:'"+businessException.getMessage()+"'}", headers, HttpStatus.EXPECTATION_FAILED);//EXCEPTION_FAILURE
	    }
	    if(exception instanceof MaxUploadSizeExceededException){
	        
	    }
	    return null;
	}

}
