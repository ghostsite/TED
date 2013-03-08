Ext.define('BAS.controller.task.TaskEdit', {
	extend : 'Ext.app.Controller',

	/* public methods */

	onKeyChange : function(view, keys) {
		SF.cf.clearFormFields(view);
		delete view.taskId;

		/* 생성 외에 수정, 삭제 시에 변경되어서는 안되는 필드의 경우는 Read Only 처리를 해주어야 한다. */
		var serviceConfig = SF.task.get(keys.taskType, 'entity.view.service') || {};

		if (keys.reqType === 'create') {
			Ext.Object.each(serviceConfig.params, function(key, value) {
				// 주의 : 의미적인 키는 실제로 서비스 params에 매핑된 값을 이름으로 하는 폼 필드로 매핑되게 된다. 
				var field = view.documentForm.down('field[name=' + value + ']');
				if (field && field.setReadOnly) {
					field.setReadOnly(false);
				}
			});
		} else {
			Ext.Object.each(serviceConfig.params, function(key, value) {
				var field = view.documentForm.down('field[name=' + value + ']');
				if (field && field.setReadOnly)
					field.setReadOnly(true);
			});
		}

		if (keys.taskId || (keys.reqType !== 'create' && keys.reqType !== 'import'))
			this.load(view, keys);
		else {
			var task = this.getBrandNewTaskData(view, keys);
			this.fillTaskForm(view, task);
			this.controlButtons(view, task);
		}
		
		if(keys.reqType === 'delete') {
			this.blockEditables(view);
		}
	},
	
	/* Button Click Event Handlers */
	
	onBtnClose : function(view) {
		view.close();
	},

	onBtnSubmit : function(view) {
		var params = this.buildParams.call(this, view);

		if (this.checkCondition('submit', view, params) === false)
			return false;

		SF.cf.callService({
			url : 'service/basSubmitTask.json',
			params : params,
			scope : view,
			callback : function(response, success) {
				if (success) {
					view.close();
				}
			}
		});
	},

	onBtnSave : function(view) {
		var params = this.buildParams.call(this, view);

		if (this.checkCondition('save', view, params) === false)
			return false;

		SF.cf.callService({
			url : 'service/basUpdateTask.json',
			params : params,
			scope : view,
			callback : function(response, success) {
				if (success) {
					view.close();
				}
			}
		});
	},

	onBtnCancel : function(view) {
		var params = this.buildParams.call(this, view);

		if (params.taskId) {
			SF.cf.callService({
				url : 'service/basCancelTask.json',
				params : {
					procstep : '1',
					taskId : params.taskId
				},
				scope : view,
				callback : function(response, success) {
					if (success) {
						view.close();
					}
				}
			});
		}
	},

	/* private methods */

	load : function(view, keys) {
		if (!keys)
			return false;
		
		var self = this;

		this.complementLoadParams(view, keys);
		
		var serviceConfig = SF.task.get(view.taskType, 'entity.view.service') || {};

		var params = {
			procstep : '1',
			taskType : view.taskType,
			includeStepFlag : 'Y'
		};

		if (keys.taskId) {
			/* 작업중인 태스크 아이디를 알고 있는 경우 : Task List에서 실행되는 경우이다. */
			params.taskId = keys.taskId;
		} else {
			/* 작업중인 태스크 아이디를 모르고 있는 경우 : Entity List에서 실행되는 경우이다. */
			var parameter = [ {
				name : 'procstep',
				value : serviceConfig.procstep
			} ];

			Ext.Object.each(serviceConfig.params || {}, function(key, value) {
				parameter.push({
					name : value,
					value : keys[key]
				});
			});
			
			/* ProcStep 3 : 임시 저장중인 내가 만든 태스크 정보를 조회하는 서비스. */
			params.procstep = '3';
			params.serviceName = serviceConfig.name;
			params.parameter = parameter;
		}

		SF.cf.callService({
			url : 'service/basViewTask.json',
			scope : view,
			params : params,
			showErrorMsg : true,
			callback : function(response, success) {
				if (success) {
					var task = response.result;

					if (task.inprogressTaskId) {
						/* Entity Key 로 현재 작업 중인 내 태스크를 조회한 경우에, 결과 값 중 inprogressTaskId에 값이 있다면, 사용자에게 알려준다. */
						Ext.Msg.alert(T('Caption.Other.Confirm'), T('Message.Task.Duplicated Task Is Inprogress'));
						view.taskId = task.inprogressTaskId;
					}
					
					if (task.taskId) {
						if (params.procstep === '3') {
							/* 새로 생성하는 시도인데, taskId 가 있는 데이타가 내려온다면, 작업중인 태스크의 내용이 열린다고 알려준다. */
							Ext.Msg.alert(T('Caption.Other.Confirm'), T('Message.Task.Working Task Exist'));
						}
						view.taskId = task.taskId;
						
						self.fillTaskForm(view, task);
					} else {
						self.fillTaskForm(view, self.getBrandNewTaskData(view, keys));
					}

					self.fillDocumentForm(view, task.document);
					
					self.controlButtons(view, task);
				}
			}
		});
	},
	
	getBrandNewTaskData : function(view, keys) {
		return {
			title : this.buildTitle(keys.taskType, keys.reqType, keys),
			status : 'addnew',
			submitUserId : SF.login.id,
			submitTime : new Date().getTime(),
			stepList : []
		};
	},
	
	buildParams : function(view) {

		var document = this.buildDocument(view);
		var reqType = view.getKeys().reqType;
		
		var params = {
			procstep : '1',
			title : this.buildTitle(view.taskType, reqType, document),
			taskId : view.taskId,
			taskType : view.taskType,
			reqType : reqType,
			document : document,
			approveList : this.buildApproveList(view),
			opinion : view.down('textarea[name=opinion]').getValue(),
			autoReleaseFlag : 'Y'
		};
		
		/*
		 * View에 ProcessID가 설정되어있으면, 태스크 생성시 파라미터로 추가한다.
		 */
		if(view.processId)
			params.prcId = view.processId;

		return params;
	},
	
	buildApproveList : function(view) {
		var opinionList = view.down('#dvOpinionList').data; 

		var approveList = [];
		
		Ext.Array.each(opinionList, function(step) {
			if(step.status !== 'notcreated') {
				var approvers = [];
				
				Ext.Array.each(approveList.user, function(user) {
					approvers.push(user.userId);
				});
				
				approveList.push({
					userId : approvers,
					approveType : step.approveType
				});
			}
		});
		
		var stepContainer = view.down('#cntStepList');
		
		var stepConfig = SF.task.get(view.taskType, 'task.step');
		
		Ext.Array.each(stepContainer.query('container[step]'), function(step, index) {
			var approverComponents = step.query('codeview');
			var approvers = [];
			
			Ext.Array.each(approverComponents, function(comp) {
				if(comp.getValue()) {
					approvers.push(comp.getValue());
				}
			});
			
			var approveType = stepConfig ? (stepConfig[index] ? stepConfig[index].approveType : 'approve') : 'approve';

			approveList.push({
				userId : approvers,
				approveType : approveType
			});
		});

		return approveList;
	},

	buildTitle : function(taskType, reqType, document) {
		var info = [];
		var params = SF.task.get(taskType, 'entity.view.service.params');
		
		Ext.Object.each(params, function(key, value) {
			info.push(document[value]);
		});
		var keyinfo = info.join('-');

		return T('Message.Task.Title', {
			reqType : T('Caption.Task.Request.' + reqType),
			taskType : T('Caption.Task.Type.' + taskType),
			keyinfo : keyinfo
		});
	},

	checkCondition : function(step, view, data) {
		if(step === 'submit') {
			if(!view.getForm().isValid())
				return false;
			
			var sameAsLoginUser = false;

			Ext.Array.each(data.approveList, function(approve) {
				Ext.Array.each(approve.userId, function(user) {
					if(login.username === user) {
						sameAsLoginUser = true;
						return false;
					}
				});
				if(sameAsLoginUser)
					return false;
			});
			if(sameAsLoginUser) {
				Ext.Msg.alert(T('Caption.Other.Confirm'), T('Message.Task.Submitter Could Not Be Approver'));
				return false;
			}
		}

		return true;
	},

	buildDocument : function(view) {
		var document = view.documentForm.getValues();

		document.procstep = SF.task.get(view.taskType, 'task.request.' + view.getKeys().reqType + '.service.procstep');

		this.complementDocument(view, document);

		return document;
	},
	
	fillTaskForm : function(view, data) {
		/* Task 정보를 Task 정보 영역에 채워서 보여준다. */
		view.down('#dvTaskTitle').update(data);
		
		var opinion = data.stepList[0] ? data.stepList[0].user[0].opinion : '';
		view.down('#dvDescription').update({
			description : opinion
		});
		view.down('textarea[name=opinion]').setValue(opinion);

		view.down('#dvOpinionList').update(data.stepList.slice(1));
		
		var stepContainer = view.down('#cntStepList');
		stepContainer.removeAll();
		
		/* Step 별 Approver를 위한 설정 컴포넌트를 셋업한다. */
		var stepConfig = SF.task.get(view.taskType, 'task.step') || [];
		
		Ext.Array.each(stepConfig, function(step) {
			var users = [];
			var actstep = (step.index >= data.stepList.length) ? null : data.stepList[step.index];
			var actusers = (actstep) ? actstep.user : null;
			
			for(var i = 0;i < step.maxUser;i++) {
				var actuser = actusers && actusers.length >= i ? actusers[i] : null;
				var actuserid = actuser ? actuser.userId : null;
				
				users.push({
					xtype : 'codeview',
					submitValue : false,
//					allowBlank : false,
					value : actuserid,
					codeviewName : 'SvPrivilegeGroupUser',
					params : {
						procstep : '1',
						nextPrvGrpId : step.privilege
					}
				});
			}

			stepContainer.add({
				xtype : 'container',
				cls : 'taskStepItem step_' + step.status,
				step : true,
				flex : 1,
				layout : {
					type : 'vbox',
					align : 'stretch'
				},
				items : [{
					xtype : 'dataview',
					data : {
						step : T('Caption.Task.Step') + ' ' + step.index,
						type : T('Caption.Task.ApproveType.' + step.approveType)
					},
					itemSelector : 'div',
					tpl : [	'<tpl for=".">',
					       	'<div class="stepHeader"><span>{step}</span>{type}</div>',
					       	'</tpl>'
					       ]
				}, {
					xtype : 'container',
					layout : {
						type : 'vbox',
						align : 'stretch'
					},
					flex : 1,
					cls : 'stepCase',
					items : users
				}
				]
			});
		});
	},
	
	fillDocumentForm : function(view, document) {
		if (view.documentForm.getForm()) {
			view.documentForm.getForm().setValues(Ext.applyIf(document, view.getKeys()));
		}
	},
	
	controlButtons : function(view, task) {
		var btnCancel = view.down('button#btnCancel');
		
		if(btnCancel) {
			if(task.taskId)
				btnCancel.show();
			else
				btnCancel.hide();
		}
	},
	
	blockEditables : function(view) {
		/* 삭제를 위한 태스크 에디트 화면에서는 도큐먼트 컨텐츠를 수정하지 못하도록 하는 것이 원칙이므로, 수정과 관련된 컴포넌트들을 disable 시킨다. */
		view.documentForm.getForm().getFields().each(function(f) {
			f.setReadOnly(true);
		});
		
		Ext.Array.each(view.documentForm.query('button'), function(button) {
			button.hide();
		});

		Ext.Array.each(view.documentForm.query('grid'), function(grid) {
			grid.disable(true);
		});
	},

	/*
	 * Complement Functions
	 * 
	 * 1. complementLoadParams :
	 * 		Entity를 로드하기 위해서 부가적으로 필요한 파라미터를 보충해주는 용도로 사용됨.
	 * 2. complementDocument :
	 * 		Submit을 하기 전에 Submit 파라미터 정보에 포함될 document 를 보완할 때 사용됨.
	 *
	 */
	
	complementLoadParams : Ext.emptyFn,

	complementDocument : Ext.emptyFn

});