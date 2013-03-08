package com.ted.common.support.extjs4.menu;

public class Separator extends Item {
    private String  separatorCls = "menu-item-separator";

    private boolean plain        = true;

    public boolean isPlain() {
        return plain;
    }

    public void setPlain(boolean plain) {
        this.plain = plain;
    }

    public String getSeparatorCls() {
        return separatorCls;
    }

    public void setSeparatorCls(String separatorCls) {
        this.separatorCls = separatorCls;
    }

}
