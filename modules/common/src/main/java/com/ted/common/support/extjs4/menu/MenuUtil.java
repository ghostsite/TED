package com.ted.common.support.extjs4.menu;

import java.util.List;

public abstract class MenuUtil {
    /**
     * 给每个Menu添加一个checkall menuItem and '-' 
     */
    public static final void addCheckAllAndSeparatorItemCascade(Menu<Item> menu) {
        if (menu == null) {
            return;
        }
        List<Item> items = menu.getItems();
        if (items == null || items.size() == 0) {
            return;
        }
        for (Item item : items) {
            Menu<Item> subMenu = (Menu<Item>) item.getMenu();
            addCheckAllAndSeparatorItemCascade(subMenu);
        }
        //menu.addFirstItem(newSeparatorItem());///注释for extjs4,弄不出来，改在js端了。
        menu.addFirstItem(newCheckAllItem());
    }

    public static final CheckItem newCheckAllItem() {
        CheckItem checkItem = new CheckItem();
        checkItem.setText("选择所有");
        checkItem.setCheckHandler("SYS.view.authority.AuthorityManage.checkAllFun"); //改名字了，for extjs4
        checkItem.setHideOnClick(false);
        checkItem.setCls("menu-title");
        return checkItem;
    }

    public static final Item newSeparatorItem() {
        Separator separator = new Separator();
        //separator.setItemCls("x-menu-sep"); //this is for extjs3
        separator.setItemCls("menu-item-separator"); //extjs4
        return separator;
    }
    
    public static final void moveId2BeanId(Menu<Item> menu){
        if (menu == null) {
            return;
        }
        menu.setBeanId(menu.getId());
        menu.setId(null);//NOTE: This is for extjs4
        List<Item> items = menu.getItems();
        if (items == null || items.size() == 0) {
            return;
        }
        for (Item item : items) {
            item.setBeanId(item.getId());
            item.setId(null);//NOTE: This is for extjs4
            
            Menu<Item> subMenu = (Menu<Item>) item.getMenu();
            moveId2BeanId(subMenu);
        }
    }

}
