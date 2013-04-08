// 这个存在的意义在于，当你使用cardlayout in Center的时候，第一个页面是有问题的，mesplus做法是添加一个欢迎页。
Ext.define('SYS.view.Welcome', {
	extend : 'MES.view.form.BaseForm',
	xtype : 'admin_welcome',
	// layout : 'fit',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},

	initComponent : function() {
		this.callParent();

		this.on('afterrender', function() {
		});
	},

	buildForm : function(me) {
		return {
			xtype : 'box',
			cls : 'paddingL10',
			id : 'showpic',
			width : 240,
			name : 'showpic',
			autoEl : {
				tag : 'img',
				cls: 'introImg',//in menu.css
				//src :'image/introImg.gif',
				width : 240,
				height : 400
				//height: '100%',
				//width:'100%''
			}
		}
	}
});