Ext.define('SYS.view.user.UserPopup', {
	extend : 'BAS.view.common.BasePopup',
	xtype : 'admin_userpopup',
	title : '用户信息',
	autoScroll : true,
	width : 600,
	height : 450,
	modal : true,
	layout : 'fit',
	iconCls : 'user',

	dockedItems : [{
		xtype : 'bas_base_buttons',
		items : ['->', 'Save', 'Close']
	}],

	initComponent : function() {
		this.items = [this.buildForm(this)];
		this.callParent();
	},

	buildForm : function(me) {
		return {
			xtype : 'form',
			layout : 'anchor',
			itemId : 'formId',
			bodyCls : 'paddingAll10',
			frame : true,
			border : false,
			defaults : {
				labelWidth : 80
			},
			items : [{
				xtype : 'container',
				layout : {
					type : 'hbox',
					align : 'stretch'
				},
				items : [{
					xtype : 'container',
					layout : 'anchor',
					cls : 'marginR10',
					flex : 1,
					defaults : {
						labelSeparator : '',
						labelWidth : 80
					},
					items : [{
						xtype : 'container',
						layout : {
							xtype : 'hbox',
							align : 'stretch'
						},
						anchor : '100%',
						flex : 1,
						items : [{
							xtype : 'displayfield',
							name : 'organization.name',
							itemId : 'organization.name',
							cls : 'marginT5',
							labelWidth : 80,
							fieldLabel : '所属部门',
							readOnly : true
						}, {
							xtype : 'textfield',
							fieldLabel : T('Caption.Other.Login Name'),
							labelWidth : 80,
							name : 'loginName',
							readOnly : true,
							flex : 1
						}, {
							xtype : 'textfield',
							name : 'id',
							itemId : 'id',
							flex : 1,
							hidden : true
						}, {
							xtype : 'textfield',
							name : 'organization.id',
							itemId : 'organization.id',
							hidden : true
						}]
					}, {
						xtype : 'textfield',
						fieldLabel : T('Caption.Other.User Name'),
						name : 'userName',
						cls : 'marginTR5',
						labelWidth : 80,
						anchor : '100%'
					}, {
						xtype : 'container',
						layout : 'hbox',
						cls : 'marginT5',
						items : [{
							xtype : 'combobox',
							fieldLabel : '状态',
							//anchor : '100%',
							labelWidth : 80,
							flex:1,
							cls : 'marginR5',
							store : Ext.create('Ext.data.ArrayStore', {
								fields : ['stateValue', 'stateName'],
								data : [[1, '启用'], [0, '停用']]
							}),
							displayField : 'stateName',
							valueField : 'stateValue',
							editable : false,
							name : 'state',
							itemId : 'state'
						}, {
							xtype : 'numberfield',
							flex:1,
							labelWidth : 30,
							cls : 'marginR5',
							fieldLabel : '序号',
							minValue : 0,
							name : 'idx'
						}]
					}, {
						xtype : 'textfield',
						fieldLabel : T('Caption.Other.Email'),
						name : 'email',
						cls : 'marginTR5',
						labelWidth : 80,
						anchor : '100%'
					}, {
						xtype : 'radiogroup',
						fieldLabel : T('Caption.Other.Sex'),
						width : 400,
						items : [{
							boxLabel : T('Caption.Other.Male'),
							name : 'sex',
							inputValue : 1
						}, {
							boxLabel : T('Caption.Other.Female'),
							name : 'sex',
							inputValue : 0
						}]
					}]
				}, {
					xtype:'image',
					itemId:'showuserpicforpopup',
					autoEl: 'div', // wrap in a div
					autoScroll: true,
					width : 100,
					height : 100
					
					/**
					xtype : 'box',
					id : 'showuserpicforpopup',
					width : 150,
					autoEl : {
						tag : 'img',
						// src : 'image/bgSupplement.gif',
						src : '',
						// class:'ImageStyle'
						width : 100,
						height : 100
					}*/
				}]
			}, {
				xtype : 'container',
				layout : 'hbox',
				cls : 'marginT5',
				items : [{
					xtype : 'textfield',
					fieldLabel : T('Caption.Other.Phone Mobile'),
					name : 'mobile',
					cls : 'marginR10',
					labelWidth : 80,
					flex : 1
				}, {
					xtype : 'textfield',
					fieldLabel : T('Caption.Other.Phone Home'),
					name : 'phoneHome',
					labelWidth : 110,
					flex : 1
				}]
			}, {
				xtype : 'container',
				layout : 'hbox',
				cls : 'marginT5',
				items : [{
					xtype : 'textfield',
					fieldLabel : T('Caption.Other.Phone Office'),
					name : 'phoneWork',
					cls : 'marginR10',
					labelWidth : 80,
					flex : 1
				}, {
					xtype : 'textfield',
					fieldLabel : T('Caption.Other.Phone Other'),
					name : 'phoneOther',
					labelWidth : 110,
					flex : 1
				}]
			}, {
				xtype : 'container',
				layout : 'hbox',
				cls : 'marginT5',
				items : [{
					xtype : 'datefield',
					fieldLabel : T('Caption.Other.Birthday'),
					name : 'birthday',
					format : 'Y-m-d',
					submitFormat : 'Y-m-d',
					cls : 'marginR10',
					labelWidth : 80,
					flex : 1
				}, {
					xtype : 'datefield',
					fieldLabel : T('Caption.Other.Enter Date'),
					name : 'enterDate',
					format : 'Y-m-d',
					submitFormat : 'Y-m-d',
					labelWidth : 110,
					flex : 1
				}]
			}, {
				xtype : 'textfield',
				fieldLabel : T('Caption.Other.Address'),
				cls : "marginT5",
				anchor : '100%',
				name : "address"
			}, {
				xtype : 'container',
				layout : 'hbox',
				anchor : '100%',
				cls : "marginT5",
				items : [{
					xtype : 'filefield',
					fieldLabel : T('Caption.Other.Pic'),
					emptyText : '选择一张图片....',
					labelWidth : 80,
					flex : 1,
					buttonText : '',
					buttonConfig : {
						iconCls : 'upload-icon'
					},
					itemId : 'userpic',
					name : 'userpic' // 如果命名为pic，则跟user.pic
					// （Attachment）冲突，会发生bind错误。
				}, {
					xtype : 'checkbox',
					boxLabel : T('Caption.Other.Change Pic Flag'),
					name : 'needToUpdatePic',
					itemId : 'needToUpdatePic',
					inputValue : 1,
					uncheckedValue : 0,
					cls : 'marginL5',
					width : 70
				}]
			}, {
				xtype : 'textarea',
				fieldLabel : T('Caption.Other.Remark'),
				cls : "marginT5",
				anchor : '100%',
				name : "remark"
			}, {
				xtype : 'separator'
			}]
		};
	}
});