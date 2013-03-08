Ext.define('BAS.view.common.TaskRequestView', {
	extend : 'MES.view.form.BaseForm',

	alternateClassName : 'RequestView',
	xtype : 'bas_requestview',
	requires : ['BAS.model.BasViewTaskRequestOut', 'BAS.model.BasViewTaskRequestOut.activityList'],
	title : T('Caption.Other.Task Request View'),
	
	mixins : {
		buttonHandler : 'MES.mixin.ButtonHandler'
	},
	
	layout : {
		align : 'stretch',
		type : 'vbox'
	},
	dockedItems : [ {
		xtype : 'mes_task_buttons',
		items : [ 'Save', '->', 'Approve','Reject', 'Release', 'Cancel', 'Close' ]
	}],
	
	initComponent : function() {
		this.store = Ext.create('BAS.store.BasViewTaskRequestOut');
		// 의견 역순 정렬 추가 요청 2012.09.21 KKH
		this.actStore = Ext.create('Ext.data.Store',{
			model : 'BAS.model.BasViewTaskRequestOut.activityList'
		});

		this.items = [ this.buildReqForm(), {
			cls : 'marginT5',
			hidden : true,
			xtype : 'textareafield',
			fieldLabel : 'Opinion',
			height : 45,
			maxLength : 200,
			enforceMaxLength : true,
			itemId : 'txtOpinion',
			name : 'opinion'
		}];
		
		this.callParent(arguments);
		var self = this;
		
		this.store.on('load',function(store, records, success){
	    	var btnSave = false;
			var btnApprove = false;
			var btnReject = false;
			var btnRelease = false;
			var btnCancel = false;
			var txtOpinion = false;
			
			if(success){
				var data = records[0].data;
				if(data.activityList){
					self.actStore.loadData(data.activityList);
					for(var i in data.activityList){
						if(data.activityList[i].status == 'inprogress'){
							self.sub('txtOpinion').setValue(data.activityList[i].opinion||'');
							break;
						}
					}
				}

				self.fireEvent('afterformload',self,data, true);

				var status = data.status;

				if(status !== 'created' && status !== 'released' && status !== 'canceled' && data.createUserId === SF.login.id) {
					/*
					 * 생성자는 언제든지 취소할 수 있다. (이미 릴리즈된 경우는 제외)
					 */
					btnCancel = true;
	    			txtOpinion = true;
				}

				if(status === 'submitted' && data.approveUserId === SF.login.id) {
					/*
					 * Submit 된 상태에서 승인자는 '승인' 또는 '반려'를 선택할 수 있고, '임시저장' 할 수 있다.
					 */
					btnApprove = true;
	    			btnReject = true;
	    			txtOpinion = true;
	    			btnSave = true;
				} else if(status === 'approved' && data.createUserId === SF.login.id) {
					/*
					 * 승인된 상태에서 생성자는 '릴리즈' 또는 '임시저장'을 할 수 있다.
					 */
					btnRelease = true;
					txtOpinion = true;
					btnSave = true;
				}
			}
			else{
				self.fireEvent('afterformload',self, {}, false);
				self.store.removeAll();
				self.actStore.removeAll();
			}
			
			self.sub('btnSave').setVisible(btnSave);
			self.sub('btnApprove').setVisible(btnApprove);
			self.sub('btnReject').setVisible(btnReject);
			self.sub('btnRelease').setVisible(btnRelease);
			self.sub('btnCancel').setVisible(btnCancel);
			self.sub('txtOpinion').setVisible(txtOpinion);
		});
	}, 
	
	buildReqForm : function(){
		return {
			xtype : 'panel',
			bodyCls : 'paddingAll5',
			cls : 'marginB5 requestView',
			title : 'Request Infomation',
			items : [  {
				xtype : 'dataview',
				itemId : 'dvRequest',
				store : this.store,
				itemSelector : '.inforMore',
				tpl : [ '<tpl for="."><div class="infoWrap">',
						'<div class="title">{title}<span>{status}</span></div>',
						'<table>',
							'<tr>',
								'<td class="tLabel">Approve User</td>',
								'<td class="tValue">{approveUserId}</td>',
								'<td class="tLabel">Create User</td>',
								'<td class="tValue">{createUserId}</td>',
							'</tr>',
							'<tr>',
								'<td class="tLabel">Factory</td>',
								'<td class="tValue">{factory}</td>',
								'<td class="tLabel">Request Time</td>',
								'<td class="tValue">{reqTime}</td>',
								'</tr>',
						'</table>',
						'</div></tpl>'
						]
			}, {
				xtype : 'label',
				cls : 'opinionTitle',
				text : 'Opinion List'
			}, {
				xtype : 'dataview',
				itemId : 'dvActList',
				autoScroll : true,
				maxHeight : 60,
				store : this.actStore,
				itemSelector : '.infoItemSet',
				tpl : [ '<div class="opinionList">',
				        '<tpl for=".">',
				        	'<div><span class="user">{userId}</span>:<span class="status">[{status}]</span>{opinion}</div>',
				        '</tpl>',
				        '</div>' ]
			} ]
		};
	}
});
	
	