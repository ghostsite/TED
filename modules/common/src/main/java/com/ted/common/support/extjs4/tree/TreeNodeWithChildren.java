package com.ted.common.support.extjs4.tree;

import java.util.List;

import com.google.common.collect.Lists;

/**
 * 带2个孩子children的TreeNode
 * 注意：有级联，就最好不要用继承关系。因为dozer.map()会有问题。
 */
public class TreeNodeWithChildren extends TreeNode {
    private static final long serialVersionUID = 612890382498154268L;
    public List<TreeNodeWithChildren> children = Lists.newArrayList();

    public List<TreeNodeWithChildren> getChildren() {
        return children;
    }

    public void setChildren(List<TreeNodeWithChildren> findChildren) {
        this.children = findChildren;
    }
    
}
