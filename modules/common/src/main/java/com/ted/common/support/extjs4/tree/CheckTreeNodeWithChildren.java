package com.ted.common.support.extjs4.tree;

import java.util.List;

import com.google.common.collect.Lists;

/**
 * 带2个孩子children的TreeNode
 * 注意：有级联，就最好不要用继承关系。因为dozer.map()会有问题。
 */
public class CheckTreeNodeWithChildren extends CheckNode {
    private static final long serialVersionUID = 612890382498954268L;
    public List<CheckTreeNodeWithChildren> children = Lists.newArrayList();

    public List<CheckTreeNodeWithChildren> getChildren() {
        return children;
    }

    public void setChildren(List<CheckTreeNodeWithChildren> findChildren) {
        this.children = findChildren;
    }
    
}
