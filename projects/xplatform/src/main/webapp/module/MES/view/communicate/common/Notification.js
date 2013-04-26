Ext.define('MES.view.communicate.common.Notification', {
	extend : 'Ext.tab.Panel',

	alias : 'widget.mes_notification',

	title : T('Caption.Other.Notification'),

	tabPosition : 'bottom',

	initComponent : function() {
		var self = this;

		this.items = [ {
			xtype : 'container',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			title : 'List',
			items : [ self.buildNoticeList(self), {
				xtype : 'splitter',
				height : 3
			}, self.buildNoticeView(self), 
			self.buildNoticeViewButton(self) 
			]
		}, 
		self.buildNoticeForm(self) 
		];

		this.callParent();

		var form = self.sub('view').getForm();
		form.reader = Ext.create('Ext.data.reader.Json', {
			model : 'MES.model.NoticeInfo',
			successProperty : 'success'
		});
		this.sub('grid').on('itemclick', function(grid, record) {
			form.load({ //TODO aa
				url : 'module/WMG/data/notice.json',
				method : 'GET',
				waitMsg : 'Form Loading...'
			});
//			self.sub('view').loadRecord(record);
//			self.sub('star' + record.get('severity')).checked = true;
		});
	},

	buildNoticeList : function(self) {
		return {
			xtype : 'grid',
			store : 'MES.store.NoticeInfo',
			itemId : 'grid',
			columns : [ {
				header : 'Notice title',
				dataIndex : 'title',
				flex : 1,
				renderer : function(v, meta, record) {
					var clazz = record.get('confirm') ? 'confirmed' : 'unconfirmed';
					
					return '<div class="' + clazz + '">' + v + '</div>';
				}
			}, {
				header : 'Period',
				dataIndex : 'period',
				align : 'center',
				width : 200
			}, {
				header : 'writer',
				dataIndex : 'writer',
				align : 'center'
			}, {
				header : '程度',
				dataIndex : 'severity',
				align : 'center',
				renderer : function(v) {
					var severity = parseInt(v);
					var dom = '';
					for(var i = 0;i<severity;i++)
						dom += '<span class="star"></span>';
					return dom;
				}
			} ],
			flex : 1
		};
	},
	
	buildNoticeView : function(self) {
		return {
			xtype : 'form',
			itemId : 'view',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			cls : 'noticeContent paddingRL10 paddingTB5',
			defaults : {
				xtype : 'displayfield'
			},
			items : [ {
				html : [
				         '<div class="notificationTitle">标题 </div>',
				         '<div class="notificationInfo">',
				          '<span class="period">period : 2012.03.01 08:00 ~ 2012.03.31 24:00</span>',
				          '<span class="writer">writer : CUIGUANG</span>',
				          '<span class="severity"><span class="star"></span><span class="star"></span><span class="star"></span><span class="star"></span></span>',
				         '</div>',
				         '<div class="notificationContent">Provides input field management, validation, submission, and form loading services for the collection of Field instances within a Ext.container.Container. It is recommended that you use a Ext.form.Panel as the form container, as that has logic to automatically hook up an instance of Ext.form.Basic (plus other conveniences related to field configuration.</div>'
				       ]
//			},{
//				name : 'title',
//				cls : 'notificationTitle'
					
//			}, {
//				name : 'period'
//			}, {
//				name : 'writer'
//			}, {
//				name : 'severity'
//			}, {
//				name : 'message'
			} ],
			flex : 1
		};
	},
	
	buildNoticeViewButton : function(self) {
		return {
			buttons : [ {
				text : 'list',
				handler : function(button) {
					//TODO....
					SmartFactory.addContentView(Ext.create('WIP.view.setup.OperationSetup', {
						title : 'Operation Setup'
					}));
				}
			},{
				text : 'write'
			} ]
		};
	},	
	
	buildNoticeForm : function(self) {
		return {
			xtype : 'form',
			title : 'New',
			itemId : 'new',
			bodyCls : 'paddingAll10',
			
			defaults : {
				xtype : 'textfield'
			},
			items : [ {
				name : 'title',
				fieldLabel : 'title',
				layout: 'anchor'
//			}, {
//				xtype : 'dateperiod',
//				name : 'period',
//				fieldLabel : 'period',
//				vertical : true
			}, {
				name : 'writer',
				fieldLabel : 'writer'
			}, {
				name : 'severity',
				fieldLabel : 'severity'
			}, 
//			self.buildStarRating(), 
			{
				xtype : 'textareafield',
				name : 'message',
				anchor    : '100%',
				fieldLabel : 'message',
				height: 150
			} ],
			buttons : [ {
				text : 'Send'
			},{
				text : 'Notice List'
			} ]
		};
	}
	
});