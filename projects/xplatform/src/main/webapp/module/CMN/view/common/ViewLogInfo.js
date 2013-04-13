Ext.define('CMN.view.common.ViewLogInfo', {
	extend : 'Ext.container.Container',
	
	alias : 'widget.cmn.viewloginfo',

	title : T('Caption.Other.Log'),
	
	icon:'image/menuIcon/0069_16.png',
	
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	
	initComponent : function() {
		this.callParent();
		
		this.add(this.buildForm());
		
		var self = this;
		var store = this.sub('grdLogList').getStore();

		//그리드 아이템 선택
		this.sub('grdLogList').on('itemclick', function(grid, record) {
			record.set('confirmedFlag', true);
			
			var data = Ext.clone(record.data);
			
			data.exMsg = T('Message.' + data.code, data.params);
			data.exMsg = data.exMsg ? data.exMsg.substr(0,150) + ' ...'  : '';
			
			if(data.ex){
				data.stackTrace = printStackTrace({
					e : data.ex
				}).join('<br/>');
			}
			
			self.sub('viewLog').update(data);
			self.refreshCount();
		});
		
		this.sub('pnlLog').on('afterrender', function() {
			self.sub('btnRemove').on('click', function(){
				var selectedRow = self.sub('grdLogList').selModel.getSelection();
				for(var i=0; i< selectedRow.length; i++){
					store.remove(selectedRow[i]);
				}
				
				self.refreshCount();
			});
		});
	},
	
	// statusbar - log 갯수 출력
	refreshCount : function(){
		var store = this.sub('grdLogList').getStore();
		var findModels = store.query('confirmedFlag', false);
		
		Ext.getCmp('log_tray').setText(findModels.length || '0'); 
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
				flex : 1,
				cls : 'noPanelTitle',
				tools : [{
					xtype : 'button',
					itemId : 'btnRemove',
					text : T('Caption.Button.Remove')
				} ],
				items : [{
					xtype : 'grid',
					itemId : 'grdLogList',
					flex : 1,
					autoScroll : true,
					multiSelect : true,
					cls : 'navyGrid',
					store : Ext.getStore('CMN.store.LogStore'),
					selModel : Ext.create('Ext.selection.CheckboxModel'),
					columns : [ {
						header : T('Caption.Other.Level'),
						dataIndex : 'level',
						align : 'center',
						width : 120
					},{
						header : T('Caption.Other.Message'),
						dataIndex : 'code',
						flex : 1,
						renderer : function(value, metaData, record){
							var code = value;
							var params = record.get('params') ;
							
							return '[' + code + '] ' + T('Message.' + code, params);
						}
					},{
						header : T('Caption.Other.Issue Date'),
						dataIndex : 'issueDate',
						width : 150
					}],
					viewConfig : {
						getRowClass : function(record, rowIndex, rowParams, store) {
							if (record.get('confirmedFlag') === false) {
								return 'unconfirmed';
							}else{
								return '';
							}
						}
					}
				}]
			},{
				xtype : 'panel',
				flex : 2,
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