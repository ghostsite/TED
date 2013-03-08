Ext.define('ALM.view.setup.AlarmSetup', {
	extend : 'MES.view.form.BaseFormTabs',

	requires : [ 'ALM.model.AlmViewAlarmMsgOut' ],

	title : T('Caption.Menu.Alarm Setup'),

	buttonsOpt : [ {
		itemId : 'btnCreate',
		url : 'service/AlmUpdateAlarmMsg.json'
	}, {
		itemId : 'btnUpdate',
		url : 'service/AlmUpdateAlarmMsg.json'
	}, {
		itemId : 'btnDelete',
		url : 'service/AlmUpdateAlarmMsg.json',
		confirm : {
			fields : {
				field1 : 'alarmId'
			}
		}
	} ],

	initComponent : function() {
		this.callParent();

		this.getForm().reader = Ext.create('Ext.data.reader.Json', {
			model : 'ALM.model.AlmViewAlarmMsgOut'
		});

		var self = this;

		var baseTabs = this.getTabPanel();
		baseTabs.add(this.buildTabGeneral());
		baseTabs.add(this.buildTabReceiveInfo());
		baseTabs.add(this.buildTabMessage());
		baseTabs.add(this.buildTabComment());
		baseTabs.add(this.buildTabImage());
		baseTabs.add(this.buildTabEvent());
		baseTabs.add(this.buildTabClearEvent());
		baseTabs.add(this.buildCustomFieldSetupTab());
		baseTabs.setActiveTab(0);

		this.add(this.hiddenField());
		this.on('afterrender', function() {
			var supplement = self.getSupplement();

			// user, secgrp, prvgrp 그리드 처음엔 user 호출
			this.sub('grdPrvGrpList').store.load({
				params : {
					procstep : '1'
				}
			});

			// supplement combobox 변경시
			supplement.sub('cmbAlmTypeFlag').on('change', function(record) {
				supplement.refreshGrid(true);
			});

			// TODO : Tran code 콤보박스 변경시 (cmf 재정의 수정중...)
			self.sub('cmbTranCode').on('change', function(me, newValue, oldValue) {
				self.sub('fdcHold').setVisible(false);
				self.sub('fdcFuture').setVisible(false);
				self.sub('fdcRework').setVisible(false);

				if (newValue == 'HOLD') {
					self.sub('fdcHold').setVisible(true);
//					self.sub('tabCmfsetup').reloadForm({
//						cmfItemName : SF_CMF_TRN_HOLD,
//						cmfFieldNamePrefix : 'cmf',
//						cmfMaxCnt : 20
//					});
				} else if (newValue == 'FHLD') {
					self.sub('fdcFuture').setVisible(true);
//					self.sub('tabCmfsetup').reloadForm({
//						cmfItemName : SF_CMF_TRN_HOLD,
//						cmfFieldNamePrefix : 'cmf',
//						cmfMaxCnt : 20
//					});
				} else if (newValue == 'REWORK') {
					self.sub('fdcRework').setVisible(true);
//					self.sub('tabCmfsetup').reloadForm({
//						cmfItemName : SF_CMF_TRN_REWORK,
//						cmfFieldNamePrefix : 'cmf',
//						cmfMaxCnt : 20
//					});
				} else {
//					self.sub('tabCmfsetup').reloadForm({
//						cmfItemName : 'nothing',
//						cmfFieldNamePrefix : 'nothing',
//						cmfMaxCnt : 'nothing'
//					});
				}
			});

			supplement.on('supplementSelected', function(record) {
				self.reloadForm(self, record.data.alarmId);

				// receiver grid 호출
				self.sub('grdReceiverList').store.load({
					params : {
						procstep : '1',
						alarmId : record.data.alarmId
					},
					callback : function(records, operation, success) {
						if (success)
							self.grdReceiverCheck(self);
					}
				});
			});

			// hold코드나 패스워드 변경시 hidden필드에 입력
			this.sub('cdvHoldCode').on('change', function(me, newValue) {
				self.sub('hidHoldCode').setValue(newValue);
			});
			this.sub('txtHoldPsw').on('change', function(me, newValue) {
				self.sub('hidHoldPwd').setValue(newValue);
			});
			this.sub('cdvFutureHoldCode').on('change', function(me, newValue) {
				self.sub('hidHoldCode').setValue(newValue);
			});
			this.sub('txtFutureHoldPsw').on('change', function(me, newValue) {
				self.sub('hidHoldPwd').setValue(newValue);
			});

			// 리시브 info tab 라디오 버튼 변경시 store load
			this.sub('rdoSecLevel').on('change', function(me, newValue, oldValue, eOpt) {
				if (me.getChecked().length == 1) {
					// 각 라디오버튼에 따른 config
					self.reConfigureGrid();

					self.sub('grdPrvGrpList').store.load({
						params : {
							procstep : '1'
						}
					});
				}
			});

			// 그리드 선택시
			var selectedUserList = [];
			this.sub('grdReceiverList').on('select', function(rowModel, record, index, opts) {
				selectedUserList = rowModel.getSelection();
			});
			var selectedGroupList = [];
			this.sub('grdPrvGrpList').on('select', function(rowModel, record, index, opts) {
				selectedGroupList = rowModel.getSelection();
			});

			// attach 버튼
			this.sub('btnAttach').on('click', function(button, event, opts) {
				if (!selectedGroupList)
					return;

				self.updateReceiver(self, selectedGroupList, 'attach');
			});

			// detach 버튼
			this.sub('btnDetach').on('click', function(button, event, opts) {
				if (!selectedUserList)
					return;

				self.updateReceiver(self, selectedUserList, 'detach');
			});

			this.sub('cdvEventId').on('change', function(me, newValue) {
				self.vewEvent(self, newValue, self.getForm().reader.jsonData);
			});
			this.sub('cdvClearEventId').on('change', function(me, newValue) {
				self.vewClearEvent(self, newValue, self.getForm().reader.jsonData);
			});

			// 파일버튼에서 파일 선택시 파일필드에 파일 정보넣어줌 파일필드에서 setValue가 안됨 ㅠ
			this.sub('fileOpen').on('change', function(me, newValue) {
				self.sub('txtFileName').setValue(newValue);
			});

			// 파일이름 필드 체인지시 ''인지 체크하고 ''이면 파일 hidden필드도 삭제
			this.sub('txtFileName').on('change', function(me, newValue) {
				if (newValue == '') {
					self.sub('filehidden').setValue('');
				}
			});

			// rework flow 값 유무에 따라 disabled
			this.sub('cdvReworkFlow').on('change', function(me, newValue) {
				self.checkCondition('cdvReworkFlow');
			});

			// rework flow 값 유무에 따라 disabled
			this.sub('cdvReworkFlow').on('changetext', function(me, newValue) {
				self.checkCondition('cdvReworkFlow');
			});

			// rework return flow 값 유무에 따라 disabled
			this.sub('cdvReturnFlow').on('change', function(me, newValue) {
				self.checkCondition('cdvReturnFlow');
			});

			// rework return flow 값 유무에 따라 disabled
			this.sub('cdvReturnFlow').on('changetext', function(me, newValue) {
				self.checkCondition('cdvReturnFlow');
			});

			// future flow 값 유무에 따라 disabled
			this.sub('cdvFutureFlow').on('change', function(me, newValue) {
				self.checkCondition('cdvFutureFlow');
			});

			// future flow 값 유무에 따라 disabled
			this.sub('cdvFutureFlow').on('changetext', function(me, newValue) {
				self.checkCondition('cdvFutureFlow');
			});
		});
	},

	checkCondition : function(step, form, addParams) {
		var self = this;

		switch (step) {
		case 'cdvReworkFlow':
			if (self.sub('cdvReworkFlow').getValue() == '') {
				self.sub('cdvReworkOper').setValue('');
				self.sub('cdvReworkOper').setDisabled(true);
				self.sub('cdvStopOper').setValue('');
				self.sub('cdvStopOper').setDisabled(true);
			} else {
				self.sub('cdvReworkOper').setDisabled(false);
				self.sub('cdvStopOper').setDisabled(false);
			}
			break;

		case 'cdvReturnFlow':
			if (self.sub('cdvReturnFlow').getValue() == '') {
				self.sub('cdvReturnOper').setValue('');
				self.sub('cdvReturnOper').setDisabled(true);
			} else {
				self.sub('cdvReturnOper').setDisabled(false);
			}
			break;

		case 'cdvFutureFlow':
			if (self.sub('cdvFutureFlow').getValue() == '') {
				self.sub('cdvFutureOper').setValue('');
				self.sub('cdvFutureOper').setDisabled(true);
			} else {
				self.sub('cdvFutureOper').setDisabled(false);
			}
			break;

		}

		if (addParams) {
			switch (addParams.procstep) {
			case SF_STEP_CREATE:
			case SF_STEP_UPDATE:
				if (self.sub('txtAlarmId').getValue() == '') {
					self.getTabPanel().setActiveTab(0);
					SmartFactory.msgBox('Mes Client', T('Message.108'), 'OK');
					self.sub('txtAlarmId').focus();
					return false;
				}

				if (self.sub('txtareaMsg1').getValue() == '') {
					self.getTabPanel().setActiveTab(2);
					SmartFactory.msgBox('Mes Client', T('Message.108'), 'OK');
					self.sub('txtAlarmId').focus();
					return false;
				}

				if (self.sub('cmbTranCode').getValue() == 'HOLD') {
					if (self.sub('cdvHoldCode').getValue() == '') {
						SmartFactory.msgBox('Mes Client', T('Message.108'), 'OK');
						self.sub('cdvHoldCode').getField(0).focus();
						return false;
					}
				} else if (self.sub('cmbTranCode').getValue() == 'FHLD') {
					if (self.sub('cdvFutureHoldCode').getValue() == '') {
						self.getTabPanel().setActiveTab(0);
						SmartFactory.msgBox('Mes Client', T('Message.108'), 'OK');
						self.sub('cdvFutureHoldCode').getField(0).focus();
						return false;
					}
					if (self.sub('cdvFutureOper').getValue() == '') {
						self.getTabPanel().setActiveTab(0);
						SmartFactory.msgBox('Mes Client', T('Message.108'), 'OK');
						self.sub('cdvFutureOper').getField(0).focus();
						return false;
					}
				} else if (self.sub('cmbTranCode').getValue() == 'REWORK') {
					if (self.sub('cdvReworkCode').getValue() == '') {
						self.getTabPanel().setActiveTab(0);
						SmartFactory.msgBox('Mes Client', T('Message.108'), 'OK');
						self.sub('cdvReworkCode').getField(0).focus();
						return false;
					}
					if (self.sub('cdvReworkFlow').getValue() == '') {
						self.getTabPanel().setActiveTab(0);
						SmartFactory.msgBox('Mes Client', T('Message.108'), 'OK');
						self.sub('cdvReworkFlow').getField(0).focus();
						return false;
					}
					if (self.sub('cdvReworkOper').getValue() == '') {
						self.getTabPanel().setActiveTab(0);
						SmartFactory.msgBox('Mes Client', T('Message.108'), 'OK');
						self.sub('cdvReworkOper').getField(0).focus();
						return false;
					}
				}
				break;
			}
		}
	},

	// Receiver list에 있으면 오른쪽 list에 파랑색으로 표시
	/*
	 * TODO : 처음 load 시 체크가 안됨.. 왜!?
	 */
	grdReceiverCheck : function(self) {
		var store = self.sub('grdPrvGrpList').store;

		Ext.Array.each(store.data.items, function(record, index) {
			self.sub('grdPrvGrpList').getView().removeRowCls(record, 'textColorBlue');
		});
		Ext.Array.each(self.sub('grdReceiverList').store.data.items, function(record, index) {
			var findIndex = null;
			self.sub('grdPrvGrpList').getView().removeRowCls(record, 'textColorBlue');
			if ('U' == self.sub('rdoSecLevel').getChecked()[0].inputValue) {
				findIndex = store.find('userId', record.data.rcvrId);
			} else if ('S' == self.sub('rdoSecLevel').getChecked()[0].inputValue) {
				findIndex = store.find('secGrpId', record.data.rcvrId);
			} else if ('P' == self.sub('rdoSecLevel').getChecked()[0].inputValue) {
				findIndex = store.find('prvGrpId', record.data.rcvrId);
			}
			self.sub('grdPrvGrpList').getView().addRowCls(store.getAt(findIndex), 'textColorBlue');
		});
	},

	makeParams : function(self, form, addParams) {
		var grdRcvList = self.sub('grdReceiverList');
		var rcvList = [];
		Ext.Array.each(grdRcvList.store.data.items, function(record, index) {
			var rd = record.data;
			rcvList.push(rd);
		});

		addParams['rcvrList'] = Ext.Array.map(rcvList, function(v) {
			return Ext.JSON.encode(v);
		});
	},

	onBeforeCreate : function(form, addParams, url) {
		var self = this;
		self.makeParams(self, form, addParams);
	},

	onBeforeUpdate : function(form, addParams, url) {
		var self = this;
		self.makeParams(self, form, addParams);
	},

	onAfterCreate : function(form, action, success) {
		if (success) {
			var select = {
				column : 'alarmId',
				value : form.getValues().alarmId
			};
			this.getSupplement().refreshGrid(true, select);
		}
	},

	onAfterUpdate : function(form, action, success) {
		if (success) {
			var select = {
				column : 'alarmId',
				value : form.getValues().alarmId
			};
			this.getSupplement().refreshGrid(true, select);
		}
	},

	onAfterDelete : function(form, action, success) {
		if (!success)
			return;
		this.getForm().getFields().each(function(f) {
			f.setValue(null);
		});
		this.getSupplement().refreshGrid(true);
		this.sub('grdReceiverList').store.removeAll();
		// this.sub('grdPrvGrpList').store.removeAll();
	},

	// 이벤트 조회
	vewEvent : function(self, eventId, dataList) {
		if(!eventId)
			return;
		Ext.Ajax.request({
			url : 'service/RasViewEvent.json',
			method : 'GET',

			params : {
				procstep : '1',
				eventId : eventId
			},

			success : function(response, opts) {
				var tableSpec = Ext.JSON.decode(response.responseText);
				var eventList = [];

				self.sub('fdcEvenList').removeAll(true);
				if (tableSpec.msgcode === 'CMN-0000') {
					for ( var i = 1; i <= 10; i++) { // viewRasEvent 서비스 값으로
						// 필드생성 및 value 넣어줌
						var value = '';
						if (tableSpec['chgSts' + i] != undefined && tableSpec['chgSts' + i] != '') // rasViewEvent
						// 반환값에
						// chgSts
						// 있을때
						{
							if (dataList['chgSts' + i] != undefined && dataList['chgSts' + i] != '') { // formload로
								// alarmView서비스
								// 반환값이
								// 있을때
								// value에
								// 넣어줌
								value = dataList['chgSts' + i];
							} else { // 없으면 ras 서비스 반환값 넣어줌
								value = tableSpec['chgSts' + i];
							}
						} else if (dataList['chgSts' + i] != undefined && dataList['chgSts' + i] != '') {
							value = dataList['chgSts' + i];
						}

						if (tableSpec['chgFlag' + i] == 'O') { // event설정이
							// override일때
							if (tableSpec['tbl' + i] != undefined) { // tbl에
								// 값이
								// 있을떄
								eventList.push({
									xtype : 'codeview',
									fieldLabel : T('Caption.Other.Change Status') + i,
									name : 'chgSts' + i,
									codeviewName : 'GCM',
									itemId : 'txtChgSts' + i,
									table : tableSpec['tbl' + i],
									value : value
								});
							} else {
								eventList.push({
									xtype : 'textfield',
									fieldLabel : T('Caption.Other.Change Status') + i,
									name : 'chgSts' + i,
									itemId : 'txtChgSts' + i,
									value : value
								});
							}
						} else { // override가 아닐때
							if (tableSpec['chgFlag' + i] == 'Y') {// event
								// 설정이
								// change일때
								eventList.push({
									xtype : 'textfield',
									readOnly : true,
									fieldLabel : T('Caption.Other.Change Status') + i,
									name : 'chgSts' + i,
									itemId : 'txtChgSts' + i,
									value : value
								});
							} else {
								eventList.push({
									xtype : 'textfield',
									readOnly : true,
									fieldLabel : T('Caption.Other.Change Status') + i,
									name : 'chgSts' + i,
									itemId : 'txtChgSts' + i,
									value : value
								});
							}
						}
					}

					/*
					 * TODO : 나중에 삭제
					 */
					// 스크롤바 끝쪽이 짤려서 공백을 위해 필드 하나 넣어줌
					eventList.push({
						xtype : 'displayfield',
						submitValue : false,
						height : 30
					});
					// 필드셋에 만든 코드뷰 & 텍스트필드 리스트를 넣어줌

					self.sub('fdcEvenList').add(eventList);
				}
			},
			scope : self
		});
	},

	// 이벤트 조회
	vewClearEvent : function(self, eventId, dataList) {
		if(!eventId)
			return;
		Ext.Ajax.request({
			url : 'service/RasViewEvent.json',
			method : 'GET',

			params : {
				procstep : '1',
				eventId : eventId
			},

			success : function(response, opts) {
				var tableSpec = Ext.JSON.decode(response.responseText);
				var eventList = [];
				self.sub('fdcClearEvenList').removeAll(true);
				if (tableSpec.msgcode === 'CMN-0000') {
					for ( var i = 1; i <= 10; i++) { // viewRasEvent 서비스 값으로
						// 필드생성 및 value 넣어줌
						var value = '';
						if (tableSpec['clearChgSts' + i] != undefined && tableSpec['clearChgSts' + i] != '') {
							if (dataList['clearChgSts' + i] != undefined && dataList['clearChgSts' + i] != '') {
								value = dataList['clearChgSts' + i];
							} else {
								value = tableSpec['clearChgSts' + i];
							}
						} else if (dataList['clearChgSts' + i] != undefined && dataList['clearChgSts' + i] != '') {
							value = dataList['clearChgSts' + i];
						}

						if (tableSpec['chgFlag' + i] == 'O') { // event설정이
							// override일때
							if (tableSpec['tbl' + i] != undefined) { // tbl에
								// 값이
								// 있을떄
								eventList.push({
									xtype : 'codeview',
									fieldLabel : T('Caption.Other.Change Status') + i,
									name : 'clearChgSts' + i,
									codeviewName : 'GCM',
									itemId : 'txtClearChgSts' + i,
									table : tableSpec['tbl' + i],
									value : value
								});
							} else {
								eventList.push({
									xtype : 'textfield',
									fieldLabel : T('Caption.Other.Change Status') + i,
									name : 'clearChgSts' + i,
									itemId : 'txtClearChgSts' + i,
									value : value
								});
							}
						} else { // override가 아닐때
							if (tableSpec['chgFlag' + i] == 'Y') {// event
								// 설정이
								// change일때
								eventList.push({
									xtype : 'textfield',
									readOnly : true,
									fieldLabel : T('Caption.Other.Change Status') + i,
									name : 'clearChgSts' + i,
									itemId : 'txtClearChgSts' + i,
									value : value
								});
							} else {
								eventList.push({
									xtype : 'textfield',
									readOnly : true,
									fieldLabel : T('Caption.Other.Change Status') + i,
									name : 'clearChgSts' + i,
									itemId : 'txtClearChgSts' + i,
									value : value
								});
							}
						}
					}

					/*
					 * TODO : 나중에 삭제
					 */
					// 스크롤바 끝쪽이 짤려서 공백을 위해 필드 하나 넣어줌
					eventList.push({
						xtype : 'displayfield',
						submitValue : false,
						height : 30
					});

					// 필드셋에 만든 코드뷰 & 텍스트필드 리스트를 넣어줌
					self.sub('fdcClearEvenList').add(eventList);
				}
			},
			scope : self
		});
	},

	// 서비스를 호출하지 않고 그리드안에 내용만 이동시켜준다. 실질적인 update는 알람 전체 업데이트 할때..
	updateReceiver : function(self, selectedlist, flag) {
		if (flag == 'detach') {
			self.sub('grdReceiverList').store.remove(selectedlist);
		} else {
			var shift = ''; // 근무조 설정

			Ext.Array.each(self.sub('chkShift').items.items, function(record, index) {
				// 0 ~ 3
				if (record.value) {
					shift += 'X';
				} else {
					shift += '_';
				}
			});

			// 근무조 4개가 다 체크되었을경우 모두 false처리
			if (shift == 'XXXX') {
				self.sub('chkShift1').setValue(false);
				self.sub('chkShift2').setValue(false);
				self.sub('chkShift3').setValue(false);
				self.sub('chkShift4').setValue(false);
				shift = '____'; // 하마ㅋ
			}

			// attach시 라디오 버튼에 따라 attach하는 값을 바꿔준다
			for ( var i = 0; i < selectedlist.length; i++) {
				if (flag == 'attach') {
					if ('U' == self.sub('rdoSecLevel').getChecked()[0].inputValue) {
						self.sub('grdReceiverList').store.add({
							rcvrId : selectedlist[i].data.userId,
							relLevel : 'U',
							rcvShift : shift
						});
					} else if ('S' == self.sub('rdoSecLevel').getChecked()[0].inputValue) {
						self.sub('grdReceiverList').store.add({
							rcvrId : selectedlist[i].data.secGrpId,
							relLevel : 'S',
							rcvShift : shift
						});
					} else if ('P' == self.sub('rdoSecLevel').getChecked()[0].inputValue) {
						self.sub('grdReceiverList').store.add({
							rcvrId : selectedlist[i].data.prvGrpId,
							relLevel : 'P',
							rcvShift : shift
						});
					}

				}
			}
		}
	},

	// 리비서 탭 라디오버튼 변경시 그리드를 재구성해준다
	reConfigureGrid : function() {
		var self = this;
		var grdColumn = [];
		var store = null;
		if ('U' == self.sub('rdoSecLevel').getChecked()[0].inputValue) {
			grdColumn.push({
				dataIndex : 'userId',
				flex : 1,
				header : T('Caption.Other.User ID')
			});
			grdColumn.push({
				dataIndex : 'userDesc',
				flex : 1,
				header : T('Caption.Other.Description')
			});
			store = Ext.create('SEC.store.SecViewUserListOut.List');
		} else if ('S' == self.sub('rdoSecLevel').getChecked()[0].inputValue) {
			grdColumn.push({
				dataIndex : 'secGrpId',
				flex : 1,
				header : T('Caption.Other.Security Group')
			});
			grdColumn.push({
				dataIndex : 'secGrpDesc',
				flex : 1,
				header : T('Caption.Other.Description')
			});
			store = Ext.create('SEC.store.SecViewSecgrpListOut.List');
		} else if ('P' == self.sub('rdoSecLevel').getChecked()[0].inputValue) {
			grdColumn.push({
				dataIndex : 'prvGrpId',
				flex : 1,
				header : T('Caption.Other.Privilege Group')
			});
			grdColumn.push({
				dataIndex : 'prvGrpDesc',
				flex : 1,
				header : T('Caption.Other.Description')
			});
			store = Ext.create('SEC.store.SecViewPrivilegeGroupListOut.List');
		}
		self.sub('grdPrvGrpList').reconfigure(store, grdColumn);
	},

	reloadForm : function(self, alarmId) {
		this.getForm().load({
			url : 'service/AlmViewAlarmMsg.json',
			params : {
				procstep : '1',
				alarmId : alarmId
			},
			success : function(form, action) {
				// lot action에서 hold와 f hold일때 holdCode, holdPassword 컬럼을 같이쓴다
				// 이를 방지하기위해.. holdCode와 holdPassword를 hidden으로 놓고 사용
				if (action.result.data.alarmLotAction == 'HOLD') {
					self.sub('cdvHoldCode').setValue(action.result.data.holdCode);
					self.sub('txtHoldPsw').setValue(action.result.data.holdPassword);
				} else if (action.result.data.alarmLotAction == 'FHLD') {
					self.sub('cdvFutureHoldCode').setValue(action.result.data.holdCode);
					self.sub('txtFutureHoldPsw').setValue(action.result.data.holdPassword);
				}

				self.vewEvent(self, action.result.data.eventId, action.result.data);

				// alarm type이 R일경우 tab에 container 활성화
				if (action.result.data.alarmType == 'R') {
					self.sub('fdcCdv').setDisabled(false);
					self.sub('fdcClearEvenList').setDisabled(false);
					self.sub('txtClearComment').setDisabled(false);
					self.vewClearEvent(self, action.result.data.clearEventId, action.result.data);
				} else {
					self.sub('fdcCdv').setDisabled(true);
					self.sub('fdcClearEvenList').setDisabled(true);
					self.sub('txtClearComment').setDisabled(true);
				}

				// 파일 관련
				if (action.result.data.fileinfo[0] != undefined) {
					var fileName = action.result.data.fileinfo[0].fileName;
					var fileId = action.result.data.fileinfo[0].fileId;
					self.sub('txtFileName').setValue(fileName);
					self.sub('filehidden').setValue(fileName);
					
					var src = 'service/bas_download_file/' + fileId + '.do';
					self.sub('img').setSrc(src);
					
				} else {
					self.sub('txtFileName').setValue('');
					self.sub('filehidden').setValue('');
				}
			},
			failure : function(form, action) {
				// form data clear
				self.getForm().getFields().each(function(f) {
					f.setValue(null);
				});
			}
		});
	},

	getOperParams : function(me, codeview) {
		var params = {
			procstep : '1'
		};
		// lotAction 조건에 따라 플로우, 오퍼가 틀리므로 itemId로 구분
		if (codeview.itemId == 'cdvFutureOper') {
			if (me.sub('cdvFutureFlow').getValue() != '') {
				params.flow = me.sub('cdvFutureFlow').getValue();
				params.procstep = '2';
			}
		} else if (codeview.itemId == 'cdvReworkOper' || codeview.itemId == 'cdvStopOper') {
			if (me.sub('cdvReworkFlow').getValue() != '') {
				params.flow = me.sub('cdvReworkFlow').getValue();
				params.procstep = '2';
			}
		} else if (codeview.itemId == 'cdvReturnOper') {
			if (me.sub('cdvReturnFlow').getValue() != '') {
				params.flow = me.sub('cdvReturnFlow').getValue();
				params.procstep = '2';
			}
		}
		return params;
	},

	hiddenField : function() {
		return [ {
			xtype : 'hidden',
			name : 'holdCode',
			itemId : 'hidHoldCode'
		}, {
			xtype : 'hidden',
			name : 'holdPassword',
			itemId : 'hidHoldPwd'
		}, {
			xtype : 'hidden',
			submitValue : false,
			itemId : 'hidRdoValue'
		} ];
	},

	buildTopPart : function() {
		return [ {
			xtype : 'fieldcontainer',
			layout : {
				type : 'hbox'
			},
			items : [ {
				xtype : 'textfield',
				name : 'alarmId',
				itemId : 'txtAlarmId',
				fieldLabel : T('Caption.Other.Alarm ID'),
				labelStyle : 'font-weight:bold',
				labelSeparator : '',
				allowBlank : false,
				labelWidth : 140,
				maxLength : 20,
				enforceMaxLength : true,
				flex : 1
			}, {
				xtype : 'checkbox',
				boxLabel : T('Caption.Other.Resource Alarm Flag'),
				name : 'alarmType',
				itemId : 'chkAalrmType',
				inputValue : 'R',
				uncheckedValue : 'N',
				cls : 'marginL7',
				flex : 1
			} ]
		}, {
			xtype : 'textfield',
			name : 'alarmDesc',
			fieldLabel : T('Caption.Other.Description'),
			maxLength : 50,
			labelWidth : 140,
			enforceMaxLength : true
		} ];
	},

	buildTabGeneral : function() {
		return {
			xtype : 'container',
			cls : 'paddingAll7',
			title : T('Caption.Other.General'),
			items : [ {
				xtype : 'fieldset',
				layout : {
					type : 'hbox'
				},
				height : 45,
				title : T('Caption.Other.Alarm Level'),
				items : {
					xtype : 'radiogroup',
					cls : 'borderAllNone',
					layout : {
						type : 'hbox',
						align : 'stretch'
					},
					flex : 1,
					itemId : 'rdoLevelFlag',
					items : [ {
						boxLabel : T('Caption.Other.Information'),
						name : 'alarmLevelFlag',
						flex : 1,
						inputValue : 'I'
					}, {
						boxLabel : T('Caption.Other.Warning'),
						name : 'alarmLevelFlag',
						flex : 1,
						inputValue : 'W'
					}, {
						boxLabel : T('Caption.Other.Error'),
						name : 'alarmLevelFlag',
						flex : 1,
						inputValue : 'E'
					} ]
				}
			}, {
				xtype : 'fieldset',
				layout : {
					type : 'hbox'
				},
				height : 45,
				title : T('Caption.Other.Alarm Action'),
				items : [ {
					xtype : 'checkbox',
					boxLabel : T('Caption.Other.Display'),
					name : 'actionDisplayFlag',
					flex : 1,
					cls : 'marginL7',
					inputValue : 'Y',
					uncheckedValue : ' '
				}, {
					xtype : 'checkbox',
					boxLabel : T('Caption.Other.Mail'),
					name : 'actionMailFlag',
					flex : 1,
					inputValue : 'Y',
					uncheckedValue : ' '
				}, {
					xtype : 'checkbox',
					boxLabel : T('Caption.Other.Message'),
					name : 'actionMsgFlag',
					flex : 1,
					inputValue : 'Y',
					uncheckedValue : ' '
				} ]
			}, {
				xtype : 'fieldset',
				layout : {
					type : 'hbox'
				},
				cls : 'paddingAll7',
				title : T('Caption.Other.Lot Action'),
				items : [ {
					xtype : 'fieldset',
					flex : 1,
					cls : 'borderTNone borderRNone borderBNone borderLNone paddingAll3',
					items : [ {
						xtype : 'combobox',
						fieldLabel : T('Caption.Other.Tran Code'),
						editable : false,
						labelWidth : 130,
						itemId : 'cmbTranCode',
						displayField : 'name',
						valueField : 'value',
						anchor : '50%',
						cls : 'marginR5',
						name : 'alarmLotAction',
						labelSeparator : '',
						store : Ext.create('Ext.data.Store', {
							fields : [ 'name', 'value' ],
							data : [ {
								'name' : '　',
								'value' : ' '
							}, {
								'name' : 'HOLD',
								'value' : 'HOLD'
							}, {
								'name' : 'FUTURE HOLD',
								'value' : 'FHLD'
							}, {
								'name' : 'REWORK',
								'value' : 'REWORK'
							} ]
						})
					}, { // hold
						xtype : 'container',
						itemId : 'fdcHold',
						hidden : true,
						layout : 'hbox',
						flex : 1,
						items : [ {
							xtype : 'container',
							layout : {
								type : 'hbox',
								align : 'stretch'
							},
							flex : 1,
							items : [ {
								xtype : 'codeview',
								fieldLabel : T('Caption.Other.Hold Code'),
								labelSeparator : '',
								labelWidth : 130,
								codeviewName : 'HoldCode',
								itemId : 'cdvHoldCode',
								submitValue : false,
								flex : 1
							}, {
								xtype : 'textfield',
								cls : 'marginL10',
								submitValue : false,
								labelSeparator : '',
								labelWidth : 130,
								itemId : 'txtHoldPsw',
								fieldLabel : T('Caption.Other.Password'),
								inputType : 'password',
								maxLength : 20,
								enforceMaxLength : true,
								flex : 1
							} ]
						} ]
					}, { // Future
						xtype : 'container',
						itemId : 'fdcFuture',
						hidden : true,
						layout : 'hbox',
						flex : 1,
						items : [ {
							xtype : 'container',
							layout : {
								type : 'vbox',
								align : 'stretch'
							},
							flex : 1,
							items : [ {
								xtype : 'container',
								layout : {
									type : 'hbox',
									align : 'stretch'
								},
								flex : 1,
								items : [ {
									xtype : 'codeview',
									fieldLabel : T('Caption.Other.Hold Code'),
									labelSeparator : '',
									labelWidth : 130,
									codeviewName : 'HoldCode',
									submitValue : false,
									itemId : 'cdvFutureHoldCode',
									flex : 1
								}, {
									xtype : 'textfield',
									cls : 'marginL10',
									labelSeparator : '',
									labelWidth : 130,
									submitValue : false,
									itemId : 'txtFutureHoldPsw',
									fieldLabel : T('Caption.Other.Password'),
									inputType : 'password',
									maxLength : 20,
									enforceMaxLength : true,
									flex : 1
								} ]
							}, {
								xtype : 'fieldcontainer',
								layout : {
									type : 'hbox'
								},
								items : [ {
									xtype : 'codeview',
									fieldLabel : T('Caption.Other.Flow'),
									labelSeparator : '',
									codeviewName : 'SvFlow',
									labelWidth : 130,
									itemId : 'cdvFutureFlow',
									name : 'flow',
									flex : 1
								}, {
									xtype : 'codeview',
									cls : 'marginL10',
									codeviewName : 'SvOperation',
									itemId : 'cdvFutureOper',
									labelWidth : 130,
									disabled : true,
									fieldLabel : T('Caption.Other.Operation'),
									labelSeparator : '',
									name : 'oper',
									paramsScope : this,
									params : this.getOperParams,
									flex : 1
								} ]
							} ]
						} ]
					}, { // Rework
						xtype : 'container',
						itemId : 'fdcRework',
						hidden : true,
						layout : 'hbox',
						flex : 1,
						items : [ {
							xtype : 'container',
							layout : {
								type : 'vbox',
								align : 'stretch'
							},
							flex : 1,
							items : [ {
								xtype : 'codeview',
								fieldLabel : T('Caption.Other.Rework Code'),
								labelSeparator : '',
								codeviewName : 'ReworkCode',
								itemId : 'cdvReworkCode',
								labelWidth : 130,
								name : 'rwkCode'
							}, {
								xtype : 'fieldcontainer',
								layout : {
									type : 'hbox'
								},
								items : [ {
									xtype : 'codeview',
									codeviewName : 'SvFlow',
									itemId : 'cdvReworkFlow',
									fieldLabel : T('Caption.Other.Rework Flow'),
									labelSeparator : '',
									labelWidth : 130,
									flex : 1,
									paramsScope : this,
									name : 'rwkFlow'
								}, {
									xtype : 'codeview',
									codeviewName : 'SvOperation',
									itemId : 'cdvReworkOper',
									name : 'rwkOper',
									cls : 'marginL10',
									flex : 1,
									labelWidth : 130,
									fieldLabel : T('Caption.Other.Rework Operation'),
									labelSeparator : '',
									disabled : true,
									paramsScope : this,
									params : this.getOperParams
								} ]
							}, {
								xtype : 'fieldcontainer',
								layout : {
									type : 'hbox'
								},
								items : [ {
									xtype : 'hidden',
									submitValue : false,
									flex : 1
								}, {
									xtype : 'codeview',
									codeviewName : 'SvOperation',
									submitValue : false,
									disabled : true,
									itemId : 'cdvStopOper',
									name : 'rwkStopOper',
									cls : 'marginL10',
									flex : 1,
									labelWidth : 130,
									fieldLabel : T('Caption.Other.Stop Operation'),
									labelSeparator : '',
									paramsScope : this,
									params : this.getOperParams
								} ]
							}, {
								xtype : 'fieldcontainer',
								layout : {
									type : 'hbox'
								},
								items : [ {
									xtype : 'codeview',
									codeviewName : 'SvFlow',
									itemId : 'cdvReturnFlow',
									labelWidth : 130,
									fieldLabel : T('Caption.Other.Return Flow'),
									labelSeparator : '',
									flex : 1,
									name : 'retFlow'
								}, {
									xtype : 'codeview',
									codeviewName : 'SvOperation',
									itemId : 'cdvReturnOper',
									disabled : true,
									labelWidth : 130,
									fieldLabel : T('Caption.Other.Return Operation'),
									labelSeparator : '',
									cls : 'marginL10',
									flex : 1,
									name : 'retOper',
									paramsScope : this,
									params : this.getOperParams
								} ]
							}, {
								xtype : 'fieldcontainer',
								layout : {
									type : 'hbox'
								},
								items : [ {
									xtype : 'combobox',
									submitValue : false,
									fieldLabel : T('Caption.Other.Return Option'),
									itemId : 'cmbReturnOption',
									displayField : 'name',
									labelWidth : 130,
									valueField : 'value',
									labelSeparator : '',
									editable : false,
									flex : 1,
									name : 'retClearFlag',
									store : Ext.create('Ext.data.Store', {
										fields : [ 'name', 'value' ],
										data : [ {
											'name' : 'Keep Rework',
											'value' : ' '
										}, {
											'name' : 'Clear Rework',
											'value' : 'Y'
										}, {
											'name' : 'Clear Rework and Move to Next Operation',
											'value' : 'A'
										}, {
											'name' : 'Keep Rework and Move to Next Operation',
											'value' : 'B'
										} ]
									})
								}, {
									xtype : 'container',
									cls : 'marginL10',
									flex : 1
								} ]
							} ]
						} ]
					} ]
				} ]
			}, {
				xtype : 'textfield',
				name : 'lotComment',
				cls : 'marginT5',
				labelWidth : 140,
				width : 800,
				fieldLabel : T('Caption.Other.Lot Comment'),
				labelSeparator : ''
			} ]
		};
	},

	buildTabReceiveInfo : function() {
		return {
			xtype : 'container',
			cls : 'paddingAll7',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			title : T('Caption.Other.Receive Information'),
			items : [ {
				xtype : 'fieldset',
				title : T('Caption.Other.Send Information'),
				height : 45,
				items : {
					xtype : 'checkbox',
					boxLabel : T('Caption.Other.Send To Occur Alarm User'),
					name : 'sendToUserFlag',
					flex : 1,
					inputValue : 'Y',
					uncheckedValue : ' '
				}
			}, { // 중간 그리드 부분
				xtype : 'fieldset',
				layout : {
					type : 'hbox',
					align : 'stretch'
				},
				flex : 1,
				title : T('Caption.Other.Receive Information'),
				items : [ {
					xtype : 'panel',
					layout : 'fit',
					flex : 1,
					items : [ {
						xtype : 'grid',
						itemId : 'grdReceiverList',
						multiSelect : true,
						cls : 'navyGrid',
						selModel : Ext.create('Ext.selection.RowModel', {
							mode : 'MULTI'
						}),
						store : Ext.create('ALM.store.AlmViewAlarmReceiverListOut.rcvrList'),
						columns : [ {
							header : T('Caption.Other.Receiver'),
							dataIndex : 'rcvrId',
							flex : 2
						}, {
							header : T('Caption.Other.Type'),
							dataIndex : 'relLevel',
							flex : 1
						}, {
							header : T('Caption.Other.Shift'),
							dataIndex : 'rcvShift',
							flex : 1
						} ]
					} ]
				}, { // 왼쪽 오른쪽 버튼
					xtype : 'container',
					layout : {
						type : 'vbox',
						pack : 'center',
						align : 'center'
					},
					width : 40,
					items : [ {
						xtype : 'button',
						itemId : 'btnAttach',
						cls : 'btnArrowLeft marginB5',
						width : 24
					}, {
						xtype : 'button',
						itemId : 'btnDetach',
						cls : 'btnArrowRight',
						width : 24
					} ]
				}, {
					xtype : 'container',
					layout : {
						type : 'vbox',
						align : 'stretch'
					},
					flex : 1,
					items : [ {
						xtype : 'radiogroup',
						itemId : 'rdoSecLevel',
						columns : 3,
						submitValue : false,
						vertical : true,
						cls : 'borderAllNone',
						items : [ {
							boxLabel : T('Caption.Other.User'),
							itemId : 'rdoUser',
							checked : true,
							name : 'rdo',
							submitValue : false,
							inputValue : 'U'
						}, {
							boxLabel : T('Caption.Other.Security Group'),
							itemId : 'rdoSecGrp',
							submitValue : false,
							name : 'rdo',
							inputValue : 'S'
						}, {
							boxLabel : T('Caption.Other.Privilege Group'),
							itemId : 'rdoPrvGrp',
							submitValue : false,
							name : 'rdo',
							inputValue : 'P'
						} ]
					}, {
						xtype : 'container',
						layout : {
							type : 'hbox'
						},
						items : [ {
							xtype : 'displayfield',
							submitValue : false,
							flex : 1,
							height : '30',
							cls : 'marginL10',
							value : T('Caption.Other.Occured Alarm Shift')
						}, {
							xtype : 'checkboxgroup',
							itemId : 'chkShift',
							vertical : false,
							flex : 3,
							height : '30',
							columns : 4,
							cls : 'borderAllNone',
							items : [ {
								boxLabel : '1',
								boxLabelAlign : 'before',
								itemId : 'chkShift1',
								submitValue : false,
								inputValue : 'Y',
								labelSeparator : ''
							}, {
								boxLabel : '2',
								boxLabelAlign : 'before',
								itemId : 'chkShift2',
								inputValue : 'Y',
								labelSeparator : '',
								submitValue : false
							}, {
								boxLabel : '3',
								boxLabelAlign : 'before',
								itemId : 'chkShift3',
								inputValue : 'Y',
								labelSeparator : '',
								submitValue : false
							}, {
								boxLabel : '4',
								boxLabelAlign : 'before',
								inputValue : 'Y',
								labelSeparator : '',
								itemId : 'chkShift4',
								submitValue : false
							} ]
						} ]
					}, {
						xtype : 'panel',
						layout : 'fit',
						flex : 1,
						items : [ {
							xtype : 'grid',
							itemId : 'grdPrvGrpList',
							multiSelect : true,
							cls : 'navyGrid',
							selModel : Ext.create('Ext.selection.RowModel', {
								mode : 'MULTI'
							}),
							columns : [ {
								header : T('Caption.Other.User ID'),
								dataIndex : 'userId',
								flex : 1
							}, {
								header : T('Caption.Other.Description'),
								dataIndex : 'userDesc',
								flex : 2
							} ],
							store : Ext.create('SEC.store.SecViewUserListOut.List', {
								params : {
									procstep : '1'
								}
							})
						} ]
					} ]
				} ]
			} ]
		};
	},

	buildTabMessage : function() {
		return {
			xtype : 'container',
			cls : 'paddingAll7',
			title : T('Caption.Other.Message Data'),
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			flex : 1,
			minHeight : 300,
			items : [ {
				xtype : 'fieldset',
				layout : {
					type : 'vbox',
					align : 'stretch'
				},
				defaults : {
					labelWidth : 120
				},
				flex : 1,
				items : [ {
					xtype : 'textfield',
					fieldLabel : T('Caption.Other.Subject'),
					itemId : 'txtMsgId',
					name : 'alarmSubject',
					cls : 'marginT10',
					height : 60,
					maxLength : 200,
					enforceMaxLength : true
				}, {
					xtype : 'separator'
				}, {
					xtype : 'textareafield',
					fieldLabel : T('Caption.Other.Message 1'),
					itemId : 'txtareaMsg1',
					name : 'alarmMsg1',
					flex : 1,
					minHeight : 60,
					maxLength : 1000,
					enforceMaxLength : true
				}, {
					xtype : 'textareafield',
					fieldLabel : T('Caption.Other.Message 2'),
					itemId : 'txtareaMsg2',
					name : 'alarmMsg2',
					flex : 1,
					minHeight : 60,
					maxLength : 1000,
					enforceMaxLength : true
				}, {
					xtype : 'textareafield',
					fieldLabel : T('Caption.Other.Message 3'),
					itemId : 'txtareaMsg3',
					name : 'alarmMsg3',
					flex : 1,
					minHeight : 60,
					maxLength : 1000,
					enforceMaxLength : true
				} ]
			} ]
		};
	},

	buildTabComment : function() {
		return {
			xtype : 'container',
			cls : 'paddingAll7',
			title : T('Caption.Other.Comment'),
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			flex : 1,
			minHeight : 350,
			items : [ {
				xtype : 'fieldset',
				layout : {
					type : 'vbox',
					align : 'stretch'
				},
				flex : 1,
				defaults : {
					labelWidth : 120
				},
				items : [ {
					xtype : 'textareafield',
					fieldLabel : T('Caption.Other.Comment') + '1',
					itemId : 'txtAreaComment1',
					name : 'alarmComment1',
					cls : 'marginT10',
					flex : 1,
					minHeight : 60,
					maxLength : 1000,
					enforceMaxLength : true
				}, {
					xtype : 'textareafield',
					fieldLabel : T('Caption.Other.Comment') + '2',
					itemId : 'txtAreaComment2',
					name : 'alarmComment2',
					flex : 1,
					minHeight : 60,
					maxLength : 1000,
					enforceMaxLength : true
				}, {
					xtype : 'textareafield',
					fieldLabel : T('Caption.Other.Comment') + '3',
					itemId : 'txtAreaComment3',
					name : 'alarmComment3',
					flex : 1,
					minHeight : 60,
					maxLength : 1000,
					enforceMaxLength : true
				}, {
					xtype : 'textareafield',
					fieldLabel : T('Caption.Other.Comment') + '4',
					itemId : 'txtAreaComment4',
					name : 'alarmComment4',
					flex : 1,
					minHeight : 60,
					maxLength : 1000,
					enforceMaxLength : true
				}, {
					xtype : 'textareafield',
					fieldLabel : T('Caption.Other.Comment') + '5',
					itemId : 'txtAreaComment5',
					name : 'alarmComment5',
					flex : 1,
					minHeight : 60,
					maxLength : 1000,
					enforceMaxLength : true
				} ]
			} ]
		};
	},

	buildTabImage : function() {
		return {
			xtype : 'container',
			cls : 'paddingAll7',
			layout : 'anchor',
			title : T('Caption.Other.Image'),
			items : [ {
				xtype : 'container',
				layout : {
					type : 'hbox'
				},
				items : [ {
					xtype : 'textfield',
					itemId : 'txtFileName',
					submitValue : false,
					flex : 1
				}, {
					xtype : 'filefield',
					cls : 'marginL3',
					itemId : 'fileOpen',
					name : '__DATA_1',
					buttonText: T('Caption.Button.File Open'),
					buttonOnly : true
				}, {
					xtype : 'hidden',
					name : '___DATA_1',
					itemId : 'filehidden',
					flex : 1
				} ]
			}, {
				xtype : 'separator'
			}, {
				xtype : 'container',
				layout : {
					type : 'anchor'
				},
				items : [ {
					xtype : 'image',
					itemId : 'img'
				} ]
			} ]
		};
	},

	buildTabEvent : function() {
		return {
			xtype : 'container',
			title : T('Caption.Other.Event'),
			cls : 'paddingAll7',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			items : [ {
				xtype : 'fieldset',
				title : T('Caption.Other.Event'),
				height : 45,
				items : [ {
					xtype : 'codeview',
					codeviewName : 'SvEvent',
					itemId : 'cdvEventId',
					name : 'eventId',
					labelWidth : 120,
					anchor : '50%',
					fieldLabel : T('Caption.Other.Event'),
					labelSeparator : ''
				} ]
			}, {
				xtype : 'fieldset',
				itemId : 'fdcEvenList',
				autoScroll : true,
				flex : 1,
				defaults : {
					anchor : '100%',
					labelWidth : 120
				},
				title : T('Caption.Other.Status')
			}, {
				xtype : 'textfield',
				fieldLabel : T('Caption.Other.Resource Comment'),
				name : 'resComment',
				labelSeparator : '',
				height : '24',
				labelWidth : 120
			} ]
		};
	},

	buildTabClearEvent : function() {
		return {
			xtype : 'container',
			title : T('Caption.Other.Clear Event'),
			cls : 'paddingAll7',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			items : [ {
				xtype : 'fieldset',
				disabled : true,
				itemId : 'fdcCdv',
				title : T('Caption.Other.Clear Event'),
				items : [ {
					xtype : 'codeview',
					codeviewName : 'SvEvent',
					itemId : 'cdvClearEventId',
					name : 'clearEventId',
					labelWidth : 120,
					anchor : '50%',
					fieldLabel : T('Caption.Other.Event'),
					labelSeparator : ''
				} ]
			}, {
				xtype : 'fieldset',
				disabled : true,
				flex : 1,
				autoScroll : true,
				itemId : 'fdcClearEvenList',
				defaults : {
					anchor : '100%',
					labelWidth : 120
				},
				title : T('Caption.Other.Status')
			}, {
				xtype : 'textfield',
				fieldLabel : T('Caption.Other.Clear Comment'),
				name : 'clearResComment',
				itemId : 'txtClearComment',
				disabled : true,
				height : '24',
				labelWidth : 120,
				labelSeparator : ''
			} ]
		};
	},

	buildCustomFieldSetupTab : function() {
		return {
			xtype : 'wip_view_groupsetup',
			title : T('Caption.Other.Customized Field'),
			itemId : 'tabCmfsetup',
			itemName : 'nothing',
			fieldNamePrefix : 'nothing',
			cmfMaxCnt : 'nothing'
		};
	},

	buildSupplement : function() {
		return {
			xtype : 'gridsup',

			fields : {
				xtype : 'combobox',
				fieldLabel : T('Caption.Other.Alarm Type'),
				labelAlign : 'top',
				itemId : 'cmbAlmTypeFlag',
				displayField : 'name',
				valueField : 'value',
				name : 'alarmType',
				store : Ext.create('Ext.data.Store', {
					fields : [ 'name', 'value' ],
					data : [ {
						'name' : 'ALL Alarm List',
						'value' : ' '
					}, {
						'name' : 'Only Normal Alarm',
						'value' : 'N'
					}, {
						'name' : 'Only Resource Alarm',
						'value' : 'R'
					}, {
						'name' : 'Only Automatic Collected Alarm',
						'value' : 'A'
					} ]
				})
			},

			grid : {
				store : Ext.create('SEC.store.AlmViewAlarmMsgListOut.alarmList'),
				params : {
					procstep : '1'
				},
				columns : [ {
					header : T('Caption.Other.Alarm ID'),
					dataIndex : 'alarmId',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'alarmDesc',
					flex : 1
				} ]
			}
		};
	}
});
