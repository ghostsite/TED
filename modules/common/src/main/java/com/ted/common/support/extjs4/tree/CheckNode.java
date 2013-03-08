package com.ted.common.support.extjs4.tree;

public class CheckNode extends TreeNode{
    private static final long serialVersionUID = 1L;
    private boolean checked;
	
	public boolean isChecked() {
		return checked;
	}
	public void setChecked(boolean checked) {
		this.checked = checked;
	}
}
