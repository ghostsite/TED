package com.ted.common.support.page;

import org.springframework.data.domain.PageRequest;

public abstract class PageHelper {
    public static final PageRequest getPageRequestByStartLimit(int start ,int limit){
        int pageNo = 1;
        int pageSize = 20000;
        if(limit > 0){
            pageNo = start/limit+1;
            pageSize = limit;
        }
        return new PageRequest(pageNo, pageSize);
    }
}
