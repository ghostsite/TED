package com.ted.service;


import java.util.List;

import javax.inject.Inject;

import org.junit.Test;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ContextConfiguration;
import org.springside.modules.test.spring.SpringTransactionalTestCase;

import com.ted.xplatform.pojo.common.User;
import com.ted.xplatform.service.RoleService;

@DirtiesContext
@ContextConfiguration(locations = { "/spring/applicationContext.xml" })
// 如果存在多个transactionManager，可以需显式指定
public class RoleServiceTest extends SpringTransactionalTestCase {

    @Inject
    private RoleService roleService;
    
    public void setRoleService(RoleService roleService) {
        this.roleService = roleService;
    }

    @Test
    public void testRoleHasUsers(){
        List<User> users = roleService.getUserListByRoleId(1L);
        for(User u : users){
            System.out.println(u.getLoginName());
        }
    }

}
