Ext.define('BAS.controller.task.TaskView', {
	extend : 'Ext.app.Controller',

	/* public methods */

	onKeyChange : function(view, keys) {
		SF.cf.clearFormFields(view);
		
		var self = this;
		
		if (keys.taskId) {
			view.taskForm.setVisible(true);

			view.down('button#btnModify').setVisible(false);
			view.down('button#btnApprove').setVisible(false);
			view.down('button#btnConfirm').setVisible(false);
			view.down('button#btnReject').setVisible(false);
			view.down('button#btnRelease').setVisible(false);
			view.down('button#btnCancel').setVisible(false);

			this.loadTask(view, keys, function(response, success) {

				if(!success) {
					return;
				}

				var data = response.result;
				
				/* 내가 지금 처리할 스텝을 찾는다. */
				var ownStep = self.findOwnStep(view, data.stepList);
				
				self.fillTitleView(view, data);
				self.fillTaskForm(view, data, ownStep);
				self.fillDocumentForm(view, data.document);
				
				self.controlButtons(view, data, ownStep);
				self.updateTitle(view, keys, ownStep);
			});
		} else {
			view.taskForm.setVisible(false);

			view.down('button#btnModify').setVisible(false);
			view.down('button#btnApprove').setVisible(false);
			view.down('button#btnConfirm').setVisible(false);
			view.down('button#btnReject').setVisible(false);
			view.down('button#btnRelease').setVisible(false);
			view.down('button#btnCancel').setVisible(false);

			this.loadEntity(view, keys, function(response, success) {
				if (success) {
					var document = response.result;
					var data = Ext.applyIf(document, keys);

					self.fillTitleView(view, {
						taskType : view.taskType,
						createUserId : document.createUserId,
						createTime : document.createTime,
						updateUserId : document.updateUserId,
						updateTime : document.updateTime
					});
					self.fillDocumentForm(view, data);
					self.updateTitle(view, keys);
				}
			});
		}
		
		this.blockEditables(view);
	},
	
	/* Button Click Handlers */
	
	onBtnClose : function(view) {
		view.close();
	},

	onBtnApprove : function(view) {
		var self = this;
		
		Ext.Msg.confirm(T('Caption.Other.Confirm'), T('Message.Task.Confirm Approve'), function(result) {
			if (result == 'yes') {
				var params = {
					procstep : '1',
					taskId : view.getKeys().taskId,
					opinion : view.down('textarea[name=opinion]').getValue(),
					approveList : self.buildApproveList(view)
				};
				
				if (self.checkCondition('approve', view, params) === false)
					return false;

				SF.cf.callService({
					url : 'service/basApproveTask.json',
					params : params,
					callback : function(response, success) {
						if (!success)
							return;
						this.close();
					},
					scope : view
				});
			}
		});
	},

	onBtnConfirm : function(view) {
		this.onBtnApprove(view);
	},

	onBtnReject : function(view) {
		var txtOpinion = view.down('textarea[name=opinion]');
		if(!txtOpinion.getValue()) {
			txtOpinion.markInvalid('Mandatory Field.');
			Ext.Msg.alert(T('Caption.Other.Confirm'), T('Message.Task.Enter Your Opinion'));
		} else {
			Ext.Msg.confirm(T('Caption.Other.Confirm'), T('Message.Task.Confirm Reject'), function(result) {
				if (result == 'yes') {
					SF.cf.callService({
						url : 'service/basRejectTask.json',
						params : {
							procstep : '1',
							taskId : view.getKeys().taskId,
							opinion : view.down('textarea[name=opinion]').getValue()
						},
						callback : function(response, success) {
							if (!success)
								return;
							this.close();
						},
						scope : view
					});
				}
			});
		}
	},

	onBtnRelease : function(view) {
		Ext.Msg.confirm(T('Caption.Other.Confirm'), T('Message.Task.Confirm Release'), function(result) {
			if (result == 'yes') {
				SF.cf.callService({
					url : 'service/basReleaseTask.json',
					params : {
						procstep : '1',
						taskId : view.getKeys().taskId,
						opinion : view.down('textarea[name=opinion]').getValue()
					},
					callback : function(response, success) {
						if (!success)
							return;
						this.close();
					},
					scope : view
				});
			}
		});
	},

	onBtnCancel : function(view) {
		Ext.Msg.confirm(T('Caption.Other.Confirm'), T('Message.Task.Confirm Cancel'), function(result) {
			if (result == 'yes') {
				SF.cf.callService({
					url : 'service/basCancelTask.json',
					params : {
						procstep : '1',
						taskId : view.getKeys().taskId,
						opinion : view.down('textarea[name=opinion]').getValue()
					},
					callback : function(response, success) {
						if (!success)
							return;
						this.close();
					},
					scope : view
				});
			}
		});
	},

	/* private methods */
	
	findOwnStep : function(view, stepList) {
		/* 내가 지금 처리할 스텝을 찾는다. */
		var ownStep = null;
		
		Ext.Array.each(stepList, function(step) {
			if(step.status === 'inprogress') {
				Ext.Array.each(step.user, function(user) {
					if(user.status === 'inprogress' && user.userId === SF.login.id) {
						ownStep = step;
						return false;
					}
				});
			}

			if(ownStep)
				return false;
		});
		
		return ownStep;
	},

	blockEditables : function(view) {
		/* 태스크 뷰 화면에서는 도큐먼트 컨텐츠를 수정하지 못하도록 하는 것이 원칙이므로, 수정과 관련된 컴포넌트들을 disable 시킨다. */
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
	
	loadTask : function(view, keys, callback) {

		var params = {
			procstep : '1',
			taskId : keys.taskId,
			includeStepFlag : 'Y'
		};

		SF.cf.callService({
			url : 'service/BasViewTask.json',
			scope : view,
			params : params,
			showErrorMsg : true,
			callback : callback
		});
	},

	loadEntity : function(view, keys, callback) {

		var addendum = {};

		Ext.Object.each(SF.task.get(view.taskType, 'entity.view.service.params'), function(key, value) {
			addendum[value] = keys[key];
		});

		var params = Ext.apply({
			procstep : SF.task.get(view.taskType, 'entity.view.service.procstep') || '1'
		}, addendum);

		this.complementLoadParams(view, params);

		SF.cf.callService({
			url : 'service/' + SF.task.get(view.taskType, 'entity.view.service.name') + '.json',
			scope : view,
			params : params,
			showErrorMsg : true,
			callback : callback
		});
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

	controlButtons : function(view, data, ownStep) {
		var btnModify = false;
		var btnApprove = false;
		var btnConfirm = false;
		var btnReject = false;
		var btnRelease = false;
		var btnCancel = false;
		var txtOpinion = false;

		if(ownStep) {
			txtOpinion = true;

			switch(ownStep.stepType) {
			case 'approve' :
				if(ownStep.approveType === 'confirm') {
					btnConfirm = true;
				} else { // should be 'approve'
					btnApprove = true;
					btnReject = true;
				}
				break;
			case 'release' :
				btnRelease = true;
				if(data.createUserId === SF.login.id)
					btnCancel = true;
				break;
			}
		}

		if(data.createUserId === SF.login.id) {
			switch(data.status) {
			case 'submitted' :
			case 'approved' :
				if(data.submitUserId === SF.login.id) {
					btnCancel = true;
				}
				break;
			case 'rejected' :
				if(data.submitUserId === SF.login.id) {
					btnCancel = true;
					/* TODO 수정 작성 기능은 보류 */
					// btnModify = true;
				}
				break;
			}
		}

		view.down('button#btnModify').setVisible(btnModify);
		view.down('button#btnApprove').setVisible(btnApprove);
		view.down('button#btnConfirm').setVisible(btnConfirm);
		view.down('button#btnReject').setVisible(btnReject);
		view.down('button#btnRelease').setVisible(btnRelease);
		view.down('button#btnCancel').setVisible(btnCancel);
		view.down('textarea[name=opinion]').setVisible(txtOpinion);
	},
	
	addToStepContainer : function(stepContainer, step, nth, userComponent) {
		stepContainer.add({
			xtype : 'container',
			cls : 'taskStepItem step_' + step.status,
			step : true,
			flex : 1,
			minWidth : 200,
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			items : [{
				xtype : 'dataview',
				data : {
					step : T('Caption.Task.Step') + nth,
					type : (!step.stepType || step.stepType === 'approve') ? T('Caption.Task.ApproveType.' + step.approveType) : T('Caption.Task.StepType.' + step.stepType)
				},
				itemSelector : 'div',
				tpl : [	'<tpl for=".">',
				       	'<div class="stepHeader"><span>{step}</span>{type}</div>',
				       	'</tpl>'
				       ]
			}, userComponent]		
		});
	},

	fillTitleView : function(view, data) {
		view.down('#dvTaskTitle').update(data);
	},
	
	fillTaskForm : function(view, data, ownStep) {
		/* Task 정보를 Task 정보 영역에 채워서 보여준다. */
		view.down('#dvDescription').update({
			description : data.stepList[0].user[0].opinion
		});
		view.down('#dvOpinionList').update(data.stepList.slice(1));
		
		var stepContainer = view.down('#cntStepList');
		stepContainer.removeAll();
		
		var reconfigurable = SF.task.get(view.taskType, 'task.approveStepReconfigurable');
		
		Ext.Array.each(data.stepList.slice(1), function(step, index) {
			if(step.status === 'notcreated' && reconfigurable && ownStep)
				return false;

			this.addToStepContainer(stepContainer, step, index + 1, {
				xtype : 'dataview',
				data : step.user,
				itemSelector : 'div',
				tpl : [ '<tpl for=".">',
				        '<div class="stepCase">{userId}</div>',
				        '</tpl>'
				       ]
			});
		}, this);
		
		if(!reconfigurable || !ownStep)
			return;
		
		/* 현재 결재자이고, approver재설정 가능으로 설정된 경우, 다음 결재자를 지정 또는 수정할 수 있도록 한다. */

		var stepConfig = SF.task.get(view.taskType, 'task.step') || [];
		
		var followingSteps = Ext.Array.filter(stepConfig, function(step) {
			return step.index >= data.stepList.length || data.stepList[step.index].status === 'notcreated';
		});
		
		Ext.Array.each(followingSteps, function(step) {
			var users = [];
			var actstep = (step.index >= data.stepList.length) ? null : data.stepList[step.index];
			var actusers = (actstep) ? actstep.user : null;
			
			for(var i = 0;i < step.maxUser;i++) {
				var actuser = actusers && actusers.length >= i ? actusers[i] : null;
				var actuserid = actuser ? actuser.userId : null;
				
				users.push({
					xtype : 'codeview',
					submitValue : false,
					allowBlank : false,
					value : actuserid,
					codeviewName : 'SvPrivilegeGroupUser',
					params : {
						procstep : '1',
						nextPrvGrpId : step.privilege
					}
				});
			}
			
			this.addToStepContainer(stepContainer, step, step.index, {
				xtype : 'container',
				layout : {
					type : 'vbox',
					align : 'stretch'
				},
				flex : 1,
				cls : 'stepCase',
				items : users
			});

		}, this);
	},
	
	fillDocumentForm : function(view, document) {
		view.documentForm.getForm().setValues(document);
	},
	
	checkCondition : function(step, view, data) {
		if(step === 'approve') {
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
				Ext.Msg.alert(T('Caption.Other.Confirm'), T('Message.Task.Current Reviewer Could Not Be Next Approver'));
				return false;
			}
		}

		return true;
	},
	
	updateTitle : function(view, keys, ownStep) {
		var viewtype = '';
		if(ownStep) {
			viewtype = T('Caption.Task.ApproveType.' + ownStep.approveType);
		} else if(keys.taskId) {
			viewtype = T('Caption.Task.Task');
		} else {
			viewtype = T('Caption.Task.Entity View');
		}
		return view.setTitle(T('Caption.Task.View Title', {
			tasktype : T('Caption.Task.Type.' + view.taskType),
			viewtype : viewtype
		}));
	},

	/* Overridables */
	
	complementLoadParams : Ext.emptyFn

});
