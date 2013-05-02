package com.ted.xplatform.web;

import java.util.List;
import java.util.Map;

import org.apache.commons.collections.keyvalue.DefaultKeyValue;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.common.collect.Lists;
import com.ted.common.util.CollectionUtils;
import com.ted.xplatform.service.CommunicatorService;

@Controller
@RequestMapping(value = "/communicator/*")
public class CommunicatorController {
    /**
     * 查询
     */
    @RequestMapping(value = "/getOnLineUsers")
    public @ResponseBody
    List<Map> getOnLineUsers() {
        List<DefaultKeyValue> users = CommunicatorService.getOnLineUsers();
        List<Map> onLineUsers = Lists.newArrayList();
        for (DefaultKeyValue user : users) {
            Map mapUser = CollectionUtils.newMap("status", "on", "loginname", user.getKey() == null ? "" : user.getKey().toString(), "username", user.getValue() == null ? "" : user.getValue().toString());
            onLineUsers.add(mapUser);
        }
        return onLineUsers;
    };
}
