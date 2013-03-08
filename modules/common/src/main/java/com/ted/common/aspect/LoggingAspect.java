package com.ted.common.aspect;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;

//@Aspect
//@Service
public class LoggingAspect {
    @Pointcut("execution(* com.goshen..*Service.*(..)) || execution(* com.goshen..*Service.*(..))")
    public void serviceMethod() {
    }

    @Before("serviceMethod()")
    public void beforeLogging(JoinPoint thisJoinPoint) {
        Class<? extends Object> clazz = thisJoinPoint.getTarget().getClass();
        String methodName = thisJoinPoint.getSignature().getName();
        Object[] arguments = thisJoinPoint.getArgs();

        StringBuffer argBuf = new StringBuffer();
        StringBuffer argValueBuf = new StringBuffer();
        int i = 0;
        for (Object argument : arguments) {
            if (null == argument)
                return;
            String argClassName = argument.getClass().getSimpleName();
            if (i > 0) {
                argBuf.append(", ");
            }
            argBuf.append(argClassName + " arg" + ++i);
            argValueBuf.append(".arg" + i + " : " + argument.toString() + "\n");
        }

        if (i == 0) {
            argValueBuf.append("No arguments\n");
        }

        StringBuffer messageBuf = new StringBuffer();
        messageBuf.append("before executing " + methodName + "(" + argBuf.toString() + ") method");
        messageBuf.append("\n-------------------------------------------------------------------------------\n");
        messageBuf.append(argValueBuf.toString());
        messageBuf.append("-------------------------------------------------------------------------------");

        Log logger = LogFactory.getLog(clazz);
        if (logger.isDebugEnabled()) {
            logger.debug(messageBuf.toString());
        }
    }
}
