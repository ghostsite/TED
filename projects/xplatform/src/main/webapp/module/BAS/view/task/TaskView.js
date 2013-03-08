Ext.define('BAS.view.task.TaskView', {
	extend : 'Ext.panel.Panel',
	
	xtype : 'task_view',

	requires : [ 'mixin.DeepLink', 
	             'CMN.plugin.Supplement', 
	             'BAS.model.BasViewTaskOut' ],

	mixins : {
		deeplink : 'mixin.DeepLink'
	},
	
	cls : 'taskView' ,

	bodyCls : 'paddingAll10',

	autoScroll : true,
	
	dockedItems : [{
		xtype : 'bas_base_buttons',
		items : [ '->', 'Modify', 'Approve','Reject', 'Release', 'Confirm', 'Cancel', 'Close' ]
	},
	{
		xtype : 'container',
		cls : 'taskViewContent',
		items : [{
			xtype : 'dataview',
			itemId : 'dvTaskTitle',
			itemSelector : '.inforMore',
			tpl : [ '<div class="infoWrap">',
			        '<tpl if="taskId">',
						'<div class="title">{title}<span>{[T("Caption.Task.Status." + values.status)]}</span></div>',
						'<table>',
							'<tr>',
								'<td class="tLabel">{[T("Caption.Task.Submit User")]}</td>',
								'<td class="tValue">{submitUserId}</td>',
								'<td class="tLabel">{[T("Caption.Task.Submit Time")]}</td>',
								'<td class="tValue">{[Ext.Date.parse(values.submitTime, "YmdHis")]}</td>',
							'</tr>',
						'</table>',
			        '<tpl else>',
						'<div class="title">{[T("Caption.Task.Type." + values.taskType)]}</div>',
						'<tpl if="createUserId">',
							'<table>',
							'<tr>',
								'<td class="tLabel">{[T("Caption.Task.Create Info")]}</td>',
								'<td class="tValue">{createUserId} ({[Ext.Date.parse(values.createTime, "YmdHis")]})</td>',
								'<td class="tLabel">{[T("Caption.Task.Update Info")]}</td>',
								'<td class="tValue">{updateUserId} ({[Ext.Date.parse(values.updateTime, "YmdHis")]})</td>',
							'</tr>',
							'</table>',
						'</tpl>',
			        '</tpl>',
					'</div>'
				]
		}]
	}],
	
	initComponent : function() {
		this.callParent();
		
		this.taskForm = this.add(this.buildTaskForm());
		this.documentForm = this.add(this.buildDocumentForm());
	},
	
	buildTaskForm : function() {
		return {
			xtype : 'panel',
			items : [ {
				xtype : 'dataview',
				itemId : 'dvDescription',
				itemSelector : 'div',
				tpl : ['<tpl for="."><div class="createDesc">{description}</div></tpl>']
			}, {
				xtype : 'container',
				itemId : 'cntStepList',
				cls : 'taskStep',
				layout : {
					type : 'hbox',
					align : 'stretch'
				}
			}, {
				xtype : 'dataview',
				itemId : 'dvOpinionList',
				itemSelector : '.infoItemSet',
				cls : 'taskViewOpinions',
				tpl : [ '<tpl for=".">',
				        	'<tpl if="this.hasOpinion(status)">',
					        	'<tpl for="user">',
					        		'<tpl if="this.hasOpinion(status)">',
					        			'<div class="{status}">',
					        				'<span class="user">{userId}</span>{opinion}',
					        				'<span class="dateTime">{[Ext.Date.parse(values.updateTime, "YmdHis")]}</span>',
					        				'<div class="tipTail"></div>',
					        			'</div>',
						        	'</tpl>',
					        	'</tpl>',
					        	'</div>',
				        	'</tpl>',
				        '</tpl>', 
				        {
							hasOpinion : function(status) {
								/* Step과 User의 상태가 approved 이거나 rejected 이어야 의견 정보가 있음. */
								return status === 'approved' || status === 'rejected';
							}
				        } ]
			}, {
				hidden : true,
				xtype : 'textareafield',
				emptyText : T('Message.Task.Enter Your Opinion'),
				height : 45,
				maxLength : 200,
				enforceMaxLength : true,
				itemId : 'txtOpinion',
				name : 'opinion'
			} ]
		};
	}
});