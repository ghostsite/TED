Ext.define('Opc.view.ViewLogInfo', {
	extend : 'Opc.view.BaseForm',
	
	xtype : 'viewloginfo',

	title : T('Caption.Other.Log'),
	
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	
	initComponent : function() {
		this.items = this.buildForm();
		this.callParent();
	},
	
	buildForm : function(){
		return {
			xtype : 'container',
			flex : 1,
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			items: [{
				xtype : 'panel',
				itemId : 'pnlLog',
				layout : 'fit',
				height : 200,
				items : [{
					xtype : 'grid',
					itemId : 'grdLogList',
					flex : 1,
					cls : 'navyGrid',
					store : Ext.getStore('CMN.store.LogStore'),
					autoScroll : true,
					selModel : Ext.create('Ext.selection.CheckboxModel'),
					multiSelect : true,
					columns : [{
						header : T('Caption.Other.Message'),
						dataIndex : 'code',
						flex : 1,
						renderer : function(value, metaData, record){
							var code = value;
							var params = record.get('params') ;
							return T('Message.' + code, params);
						}
					},{
						header : T('Caption.Other.Issue Date'),
						dataIndex : 'issueDate',
						width : 150
					}],
					dockedItems: [{
			            xtype: 'toolbar',
			            dock: 'bottom',
			            ui: 'footer',
			            layout: {
			                pack: 'end'
			            },
			            items: [{
			                minWidth: 80,
			                text : 'Delete',
							itemId : 'btnDel'
			            }]
					}]
				}]
			},{
				xtype : 'panel',
				flex : 1,
				layout : {
					type : 'vbox',
					align : 'stretch'
				},
				items: [{
					xtype : 'dataview',
					itemId : 'viewLog',
					autoScroll : true,
					itemSelector: 'div.thumb-wrap',
					flex : 1,
				    tpl: new Ext.XTemplate(
				    	'<tpl for=".">',
				    	'<div class="alarmHeader logHeader">',
					       	'<div class="subject alarmLevel levelE">{exMsg}<span>{issueTime}</span></div>',
					       		'<div class="alarmInfo">',
					       		'</div>',
					       	'</div>',
					       	
				       		'<tpl if="ex">',
						       	'<div class="alarmContent">{ex.message}</div>',
						       	'<div class="alarmTable">',
						       		'<table>',
						       		'<tr>',
				       					'<td class="label">Stack Trace</td>',
				       					'<td>{stackTrace}</td>',
				       				'</tr>',
				       				'</table>',
				       			'</div>',
			       			'</tpl>',
			       			
			       			'<tpl if="params && params.statusvalue != undefined && params.msgcate != undefined && params.msgcode != undefined">',
				       			'<div class="alarmContent">{params.msg}</div>',
				       			'<div class="logTable">',
					       		'<table>',
			       					'<tr>',
			       						'<td class="label">Status value</td>',
			       						'<td>{params.statusvalue}</td>',
			       						'<td class="label">Message cate</td>',
				       					'<td>{params.msgcate}</td>',
				       					'<td class="label">Message code</td>',
				       					'<td>{params.msgcode}</td>',
			       					'</tr>',
						       		
				       				'<tr>',
			       						'<td class="label">DB error Message</td>',
			       						'<td colspan=5>{params.dberrmsg}</td>',
			       					'</tr>',
			       					
				       				'<tpl if="params.fieldmsg">',
				       					'<tr>',
				       						'<td class="label">Field Message</td>',
				       						'<td colspan=5>',
				       							'<table>',
				       								'<tr>',
				       									'<td class="label">Name</td>',
				       									'<td class="label">Text</td>',
				       									'<td class="label">Type</td>',
				       								'</tr>',
				       								
				       								'<tpl for="params.fieldmsg">',     
				       									'<tr>',
				       										'<td>{name}</td>',
				       										'<td>{text}</td>',
				       										'<td>{type}</td>',
				       										'</tr>',
					       							'</tpl>',
				       							'</table>',
				       						'</td>',
				       					'</tr>',
					       			'</tpl>',
					       			
			       				'</table>',
			       				'</div>',
			       			'</tpl>',
		       				'</div>',
				        '</tpl>'
				    )
				}]				
			}]
		};
	}
});