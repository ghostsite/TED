package com.ted.xplatform.aware;

import org.springframework.data.domain.AuditorAware;

import com.ted.xplatform.pojo.common.User;
import com.ted.xplatform.util.PlatformUtils;

/**
 * 给审计用的
 *
 */
public class XPlatformAuditorAware implements AuditorAware<User> {

    @Override
    public User getCurrentAuditor() {
        return PlatformUtils.getCurrentUser();
    }

}
