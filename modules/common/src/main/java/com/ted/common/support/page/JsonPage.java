package com.ted.common.support.page;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

/**
 * 与具体ORM实现无关的分页查询结果封装.
 * @param <T> Page中记录的类型.
 * this is for extjs4
 */
public class JsonPage<T> extends PageImpl<T> {
    private static final long serialVersionUID = 1L;

    protected boolean         success          = true;

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public JsonPage(List<T> content, Pageable pageable, long total) {
        super(content, pageable, total);
    }

    public JsonPage(List<T> content) {
        super(content);
    }

    public JsonPage() {
        super(new ArrayList());
    }
}
