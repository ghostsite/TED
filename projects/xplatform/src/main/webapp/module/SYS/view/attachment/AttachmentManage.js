Ext.define('SYS.view.attachment.AttachmentManage', {
	extend : 'MES.view.form.BaseForm',
	xtype : 'admin_attachment',
	requires : ['SYS.model.Attachment', 'Ext.ux.ProgressBarPager'],

	title : T('Caption.Menu.SYS.view.attachment.AttachmentManage'),
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
		var store = Ext.create('SYS.store.Attachment');
		//store.getProxy().url = 'attachment/getAllAttachment';
		store.getProxy().url = 'attachment/pagedAllAttachment';
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
					itemId : 'attachmentgrid',
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
					}],
					bbar : SF.getContextBbar(store)
				}, {
					xtype:'image',
					itemId:'showattachmentpic',
					autoEl: 'div', // wrap in a div
					width : 240,
					height : 300,
					autoScroll: true,
					cls : 'paddingL10'
					
					/**
					xtype : 'box',
					cls:'paddingL10',
					id : 'showattachmentpic',
					width : 240,
					name : 'showpic',
					autoEl : {
						tag : 'img',
						src : '',
						// class:'ImageStyle'
						width : 240,
						height : 300
					}*/
				}]
			}, Ext.create('MES.view.form.field.MultiFileUploader', {
				title : '附件管理',
				uploadUrl : 'attachment/upload',
				downloadUrl : 'attachment/download'
			})]
		};
	}
});