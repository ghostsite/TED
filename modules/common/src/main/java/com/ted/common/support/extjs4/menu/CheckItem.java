package com.ted.common.support.extjs4.menu;

public class CheckItem extends Item {
    private boolean checked;
    private String  group;
    private String  groupClass;
    private String  checkHandler;

    public String getCheckHandler() {
        return checkHandler;
    }

    public void setCheckHandler(String checkHandler) {
        this.checkHandler = checkHandler;
    }

    public boolean isChecked() {
        return checked;
    }

    public void setChecked(boolean checked) {
        this.checked = checked;
    }

    public String getGroup() {
        return group;
    }

    public void setGroup(String group) {
        this.group = group;
    }

    public String getGroupClass() {
        return groupClass;
    }

    public void setGroupClass(String groupClass) {
        this.groupClass = groupClass;
    }

}
