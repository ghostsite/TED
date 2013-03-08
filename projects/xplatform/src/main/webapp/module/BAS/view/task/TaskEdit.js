Ext.define('BAS.view.task.TaskEdit', {
	extend : 'Ext.form.Panel',

	xtype : 'task_edit',

	requires : [ 'mixin.DeepLink', 'CMN.plugin.Supplement', 'BAS.model.BasViewTaskOut' ],

	mixins : {
		deeplink : 'mixin.DeepLink'
	},

	cls : 'taskView' ,

	bodyCls : 'paddingAll10',

	autoScroll : true,

	dockedItems : [ {
		xtype : 'bas_base_buttons',
		items : [ 'Save', '->', 'Submit', 'Cancel', 'Close' ]
	}, {
		xtype : 'container',
		cls : 'taskViewContent',
		items : [{
			xtype : 'dataview',
			itemId : 'dvTaskTitle',
			itemSelector : '.inforMore',
			tpl : [ '<tpl for="."><div class="infoWrap">',
					'<div class="title">{title}</div>',
					'<table>',
						'<tr>',
							'<td class="tLabel">{[T("Caption.Task.Submit User")]}</td>',
							'<td class="tValue">{submitUserId}</td>',
							'<td class="tLabel">{[T("Caption.Task.Submit Time")]}</td>',
							'<td class="tValue">{[Ext.Date.parse(values.submitTime, "YmdHis")]}</td>',
						'</tr>',
					'</table>',
					'</div></tpl>'
				]
		}]
	} ],
	
	initComponent : function() {
		this.plugins = [ Ext.create('CMN.plugin.Supplement') ];

		if (this.buildSupplement != Ext.emptyFn) {
			this.supplement = this.buildSupplement();
		}

		this.callParent();

		this.taskForm = this.add(this.buildTaskForm());
		this.documentForm = this.add(this.buildDocumentForm());

		/** form 설정 */
		this.documentForm.getForm().trackResetOnLoad = true;
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
					        		'<div class="{status}">', // TODO status class 스타일에서 사용하는지 확인 필요.(사용하지 않으면 class 삭제)
					        			'<span class="user">{userId}</span>{opinion}',
					        			'<span class="dateTime">{[Ext.Date.parse(values.updateTime, "YmdHis")]}</span>',
					        			'<div class="tipTail"></div>',
					        		'</div>',
					        	'</tpl>',
					        	'</div>',
				        	'</tpl>',
				        '</tpl>', 
				        {
							hasOpinion : function(status) {
								return status === 'approved' || status === 'rejected';
							}
				        } ]
			}, {
				xtype : 'textareafield',
				emptyText : T('Message.Task.Enter Your Opinion'),
				height : 45,
				maxLength : 200,
				enforceMaxLength : true,
				itemId : 'txtOpinion',
				name : 'opinion'
			} ]
		};
	},
	
	buildSupplement : Ext.emptyFn,

	buildDocumentForm : function(main) {
		return {
			xtype : 'form'
		};
	}
});
