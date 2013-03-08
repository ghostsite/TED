package com.ted.common.support.extjs4.tree;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.google.common.collect.Lists;

/**
 * 带2个孩子children的TreeNode
 * 注意：有级联，就最好不要用继承关系。因为dozer.map()会有问题。
 * 之所以不继承CheckTreeNodeWithChildren，是因为TreeNodeUtil List<CheckTreeNodeWithChildren2>转化时有问题。
 */
public class CheckTreeNodeWithChildren2 extends CheckNode {
    private static final long serialVersionUID = -3623192827614009691L;
    public List<CheckTreeNodeWithChildren2> children = Lists.newArrayList();
    public List<CheckTreeNodeWithChildren2> children2 = Lists.newArrayList();

    public List<CheckTreeNodeWithChildren2> getChildren() {
        return children;
    }

    public void setChildren(List<CheckTreeNodeWithChildren2> findChildren) {
        this.children = findChildren;
    }
    
    @JsonIgnore
    public List<CheckTreeNodeWithChildren2> getChildren2() {
        return children2;
    }

    public void setChildren2(List<CheckTreeNodeWithChildren2> findChildren) {
        this.children2 = findChildren;
    }
}
