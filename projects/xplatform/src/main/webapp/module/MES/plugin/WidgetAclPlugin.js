/**
 * 这个是给页面控件控制用的，reaonly disabled view 这个是嫁接在FormForm.js or BaseFormComposite
 * BaseFormTabs SupplementForm SupplementGridForm SupplementTabs or
 * Ext.panel.Panel...上的。
 * <p>
 * 如果不是上面的顶定义的6个基类控件，需要自己写plugin=[Ext.create('MES.plugin.WidgetAclPlugin')]
 * 
 * @author zhang
 */
Ext.define('MES.plugin.WidgetAclPlugin', {
	extend : 'Ext.AbstractPlugin',
	constructor : function() {
		this.callParent(arguments);

		var baseForm = this.getCmp(); // baseForm is
		// undefined....RowExpander.js也是？
	},

	init : function(baseForm) {
		this.callParent(arguments);

		this.baseForm = baseForm;
		baseForm.on('afterrender', this.setWidgetStatus, this);
	},

	/**
	 * 设置页面控件的状态，逻辑如下： 1 Ext.ComponentQuery
	 * 查询baseForm(也有可能是BaseFormComposite,Ext.panel.Panel...)权限列表中的控件,by itemId,
	 * 找到了就设置权限列表状态。 2 如果baseFrom有getSupplement则再执行一遍Supplement，依照1的逻辑。
	 * <p>
	 * <b>NOTE:</b>权限列表只对pageCode查询出来的列表进行控制，包括了Supplement中的控件。pageCode =
	 * baseForm.itemId
	 */
	setWidgetStatus : function() {
		var pageCode = 'page|' + this.baseForm.itemId; // SYS.view.menuresource.MenuResourceManage
		var url = 'widgetresource/currentUserWidgetAcls';
		var params = {
			pageCode : pageCode
		};

		var aclsRs = SF.cf.callServiceSync({
			url : url,
			params : params
		});

		this.setComponentStatus(this.baseForm, aclsRs.result.data);
		if (this.baseForm.getSupplement) {
			this.setComponentStatus(this.baseForm.getSupplement(), aclsRs.result.data);
		}
	},

	/**
	 * panel can be Ext.panel.Panel
	 * ,MES.view.form.BaseForm,MES.view.form.SupplementForm and so on.
	 */
	setComponentStatus : function(panel, acls) {
		Ext.Object.each(acls, function(itemIdWidthPageId, operations, myself) {
			var itemId = itemIdWidthPageId.split('|');
			if (itemId.length > 0) {
				itemId = itemId[1];
			}

			// var component = panel.getComponent(itemId);
			// //这种方式找不到，因为getDockedItems() return base_buttons，不是Button
			var component = Ext.ComponentQuery.query('#' + itemId, panel);
			if (component.length > 0) {
				component = component[0];
			}
			if (component && typeof component === 'object' && component instanceof Ext.Component) {
				Ext.Array.each(operations, function(oper) {
					if (oper.code === 'readonly') {
						component.setReadOnly(true);
					} else if (oper.code === 'disabled') {
						component.setDisabled(true);
					} else if (oper.code === 'hide') {
						component.setVisible(false);
					} else if (oper.code === 'view') {
						component.setVisible(true);
						component.setReadOnly(false);
						component.setDisabled(false);
					}
				});
			}
		});
	}

});