package com.ted.common.util;

import org.springframework.expression.Expression;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;

/**
 * SPEL utils
 */
public abstract class SpelUtils {
    private static final ExpressionParser parser = new SpelExpressionParser();

    /**
     * 获得嵌套的对象的值
     */
    public static final Object getValue(Object obj, String expression) {
        Expression exp = parser.parseExpression(expression);
        return exp.getValue(obj);
    };
    
}
