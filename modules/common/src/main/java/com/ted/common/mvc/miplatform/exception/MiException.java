package com.ted.common.mvc.miplatform.exception;

public class MiException extends Exception{

	private static final long serialVersionUID = -1143521300925234662L;

	public MiException(){
		super("Mi platform create platformRequest is wrong, set HttpServletRequest first!");
	}
	
	public MiException(String ex){
		super(ex);
	}
}
