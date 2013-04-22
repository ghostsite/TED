package com.ted.common.aspect;


import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;

import com.ted.common.util.JsonUtils;

//@Aspect
//@Service
public class ExceptionTransfer {
    public static final Logger logger = LoggerFactory.getLogger(ExceptionTransfer.class);
    
    @Pointcut("execution(* com.ted..*Service.*(..)) || execution(* com.ted..*Controller.*(..))")
    //@Pointcut("execution(* com.ted..*Controller.*(..))")
    public void serviceMethod() {
    }

    @Inject
    private MessageSource messageSource;

    @AfterThrowing(pointcut = "serviceMethod()", throwing = "exception")
    public void transfer(JoinPoint thisJoinPoint, Exception exception) throws Exception {
        Object target = thisJoinPoint.getTarget();
        Object[] arguments = thisJoinPoint.getArgs();
        for (Object arg : arguments) {
            if (arg instanceof HttpServletResponse) {
                StringBuilder messageBuilder = new StringBuilder(exception.toString()+"\r\n");
                StackTraceElement[] trace = exception.getStackTrace();
                for (int i=0; i < trace.length; i++){
                    messageBuilder.append("\tat " + trace[i]+"\r\n");
                }
                
                HttpServletResponse response = (HttpServletResponse)arg;
                JsonUtils.write(exception.toString(), response.getOutputStream());
                return;
            }
        }
        //        while (target instanceof Advised) {
        //            try {
        //                target = ((Advised) target).getTargetSource().getTarget();
        //            } catch (Exception e) {
        //                LogFactory.getLog(this.getClass()).error("Fail to get target object from JointPoint.", e);
        //                break;
        //            }
        //        }
        //
        //        String className = target.getClass().getSimpleName().toLowerCase();
        //        String opName = (thisJoinPoint.getSignature().getName()).toLowerCase();
        //        Log logger = LogFactory.getLog(target.getClass());
        //
        //        if (exception instanceof ChinaPortalException) {
        //            ChinaPortalException cpEx = (ChinaPortalException) exception;
        //            logger.error(cpEx.getMessage(), cpEx);
        //            throw cpEx;
        //        }
        //
        //        if (exception instanceof BaseException) {
        //            BaseException baseEx = (BaseException) exception;
        //            logger.error(baseEx.getMessage(), baseEx);
        //            throw new ChinaPortalException(messageSource, "error." + className + "." + opName, new String[] {}, exception);
        //        }
        //        logger.error(messageSource.getMessage("error." + className + "." + opName, new String[] {}, "no messages", Locale.getDefault()), exception);
        //        throw new ChinaPortalException(messageSource, "error." + className + "." + opName, new String[] {}, exception);
    }
}
