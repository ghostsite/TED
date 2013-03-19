package com.ted.common.support.cas.server.jdbc;

import java.util.Map;

import javax.validation.constraints.NotNull;

import org.jasig.cas.adaptors.jdbc.AbstractJdbcUsernamePasswordAuthenticationHandler;
import org.jasig.cas.authentication.handler.AuthenticationException;
import org.jasig.cas.authentication.principal.UsernamePasswordCredentials;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.ted.common.util.PasswordUtils;

/**
 * 由于gasig-cas 4.0版本后才支持Salt Query,故3.5.2只能自己扩展了。
 * 使用方法：把这个类编译后放到cas server的web-inf/classes下(和依赖的类,and c3p0 and mysql.jar)，然后配置deployerConfigContext.xml
 * like this:
 * <bean class="com.ted.common.support.cas.server.jdbc.SaltQueryDatabaseAuthenticationHandler">
       <property name="dataSource" ref="casDataSource" />
       <property name="sql" value="select password,passwordKey from users where lower(loginName) = lower(?)" />
   </bean> 
 */
public class SaltQueryDatabaseAuthenticationHandler extends AbstractJdbcUsernamePasswordAuthenticationHandler {
    public static final Logger logger = LoggerFactory.getLogger(SaltQueryDatabaseAuthenticationHandler.class);

    @NotNull
    protected String           sql;

    @Override
    protected final boolean authenticateUsernamePasswordInternal(final UsernamePasswordCredentials credentials) throws AuthenticationException {
        final String username = getPrincipalNameTransformer().transform(credentials.getUsername());
        String password = credentials.getPassword();
        Map<String, Object> bitrixPassword = getJdbcTemplate().queryForMap(this.getSql(), username);
        if (bitrixPassword != null && !bitrixPassword.isEmpty()) {
            String encryptedPassword = PasswordUtils.encryptPassword(password, (String) bitrixPassword.get("passwordKey"));
            return encryptedPassword.equals((String) bitrixPassword.get("password"));//这个地方有点bind死了。不太好//password, passwordKey
        } else {
            return false;
        }
    };

    public String getSql() {
        return sql;
    }

    public void setSql(String sql) {
        this.sql = sql;
    }

}
