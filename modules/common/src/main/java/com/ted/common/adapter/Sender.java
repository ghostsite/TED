package com.ted.common.adapter;

import java.util.List;

public abstract interface Sender {
    public abstract <T> void send(String paramString, T paramT) throws Exception;

    public abstract <T> void send(List<String> paramList, T paramT) throws Exception;
}