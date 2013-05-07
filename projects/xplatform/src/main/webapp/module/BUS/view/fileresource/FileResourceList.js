Ext.define('BUS.view.fileresource.FileResourceList', {
	extend : 'MES.view.form.BaseForm',
	xtype : 'bus_fileresource',
	requires : ['SYS.model.FileResource', 'Ext.ux.ProgressBarPager'],

	title : T('Caption.Menu.BUS.view.fileresource.FileResourceList'),
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
		var store = Ext.create('SYS.store.FileResource');
		store.getProxy().url = 'fileresource/getCurrentUserFiles';
		var params = {
			start : 0,
			limit : SF.page.pageSize
		}
		
		store.load({
			params:params
		});
		return {
			xtype : 'container',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			items : [{
				xtype : 'container',
				layout : 'hbox',
				items : [{
					xtype : 'grid',
					cls : 'navyGrid',
					stripeRows : true,
					autoScroll : true,
					itemId : 'fileresourcegrid',
					height : 300,
					forceFit : true,
					flex : 2,
					store : store,
					tbar : [{
						cls : 'navRefreshBtn',
						listeners : {
							click : function(button) {
								store.load({params:params});
							}
						}
					}],
					bbar : SF.getContextBbar(store),
					columns : [{
						header : '种类',
						dataIndex : 'typeCode',
						flex : 1
					}, {
						header : '文件名',
						dataIndex : 'originName',
						flex : 2
					}, {
						header : '文件大小',
						dataIndex : 'fileSize',
						flex : 1
					}, {
						header : '后缀',
						dataIndex : 'fileType',
						flex : 1
					}]
				}, {
					xtype : 'box',
					cls : 'paddingL10',
					id : 'showfilepicforbus',
					width : 240,
					name : 'showpic',
					autoEl : {
						tag : 'img',
						src : '',
						// class:'ImageStyle'
						width : 240,
						height : 300
					}
				}]
			}]
		};
	}
});