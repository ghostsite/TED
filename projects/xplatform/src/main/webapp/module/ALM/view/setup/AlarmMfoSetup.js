Ext.define('ALM.view.setup.AlarmMfoSetup', {
	extend : 'MES.view.form.BaseFormTabs',
	title : T('Caption.Menu.Attach Alarm to MFO/Resource'),

	requires : [ 'ALM.model.AlmViewAlarmMsgOut' ],

	payload : {
		submit : true
	},

	buttonsOpt : [ {
		itemId : 'btnExport', // Export의 itemId를 설정
		targetGrid : 'grdMfo', // Export를 수행할 대상이되는 grid의 itemId를 입력한다.
		url : 'service/AlmViewAlarmRelationList.xls' // grid에 표시되는 서비스의 url를
	// 확장자를 'xls'로 하여 선언한다.
	// params : {} // 기본으로 설정되는 params가 있으면 설정한다. 동적인 params가 있으면 onBeforeExport
	// 함수에 정의한다.
	}, {
		itemId : 'tbfill'
	}, {
		itemId : 'btnCreate',
		url : 'service/AlmUpdateAlarmRelation.json'
	}, {
		itemId : 'btnUpdate',
		url : 'service/AlmUpdateAlarmRelation.json'
	}, {
		itemId : 'btnDelete',
		url : 'service/AlmUpdateAlarmRelation.json',
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

		this.on('afterrender', function() {
			var supplement = self.getSupplement();
			var btnExport = self.getButtons().sub('btnExport');
			var mfoTab = supplement.getTabPanel().getComponent('tabMfo');
			var resTab = supplement.getTabPanel().getComponent('tabRes');

			// supplement tab 변경시 그리드 visible 변경, condition변경
			self.getSupplement().getTabPanel().on('tabchange', function(me, newCard) {
				if (newCard.itemId == 'tabRes') {
					btnExport.userConfig.targetGrid = 'grdRes';
					self.sub('ctnMfoCondition').setVisible(false);
					self.sub('ctnResCondition').setVisible(true);
					self.sub('grdMfo').setVisible(false);
					self.sub('grdRes').setVisible(true);
				} else {
					btnExport.userConfig.targetGrid = 'grdMfo';
					self.sub('ctnResCondition').setVisible(false);
					self.sub('ctnMfoCondition').setVisible(true);
					self.sub('grdRes').setVisible(false);
					self.sub('grdMfo').setVisible(true);
				}
			});
			// Load 시 Tran code에 따라변경
			self.sub('cmbTranCode').on('change', function(me, newValue, oldValue) {
				self.sub('fdcHold').setVisible(false);
				self.sub('fdcFuture').setVisible(false);
				self.sub('fdcRework').setVisible(false);
				// TODO : 변경요청
				if (newValue == 'HOLD') {
					self.sub('fdcHold').setVisible(true);
					// self.sub('tabCmfsetup').reloadForm({
					// cmfItemName : SF_CMF_TRN_HOLD,
					// cmfFieldNamePrefix : 'cmf',
					// cmfMaxCnt : 20
					// });
				} else if (newValue == 'FHLD') {
					self.sub('fdcFuture').setVisible(true);
					// self.sub('tabCmfsetup').reloadForm({
					// cmfItemName : SF_CMF_TRN_HOLD,
					// cmfFieldNamePrefix : 'cmf',
					// cmfMaxCnt : 20
					// });
				} else if (newValue == 'REWORK') {
					self.sub('fdcRework').setVisible(true);
					// self.sub('tabCmfsetup').reloadForm({
					// cmfItemName : SF_CMF_TRN_REWORK,
					// cmfFieldNamePrefix : 'cmf',
					// cmfMaxCnt : 20
					// });
				} else {
					// self.sub('tabCmfsetup').reloadForm({
					// cmfItemName : 'nothing',
					// cmfFieldNamePrefix : 'nothing',
					// cmfMaxCnt : 'nothing'
					// });
				}

			});

			// tree 선택시
			mfoTab.on("selectnode", function(selectedNode, selectedData) {
				if (selectedNode.data.nodeType == "O") { // Operation 선택시만 조회
					self.reloadGrid(self);
				}
			});
			// tree 선택시
			resTab.on("selectnode", function(selectedNode, selectedData) {
				// resource 또는 팩토리 클릭시 조회
				if (selectedNode.data.nodeType == "R" || selectedNode.data.nodeType == "F") {
					self.reloadGrid(self);
				}
			});

			// supplement MFO Tab
			mfoTab.on("onlysetdata", function(chkValue) {
				if (chkValue && mfoTab.isSelectedLevel()) {
					self.viewMfoSetData(mfoTab);
				}
			});
			// supplement Res Tab
			resTab.on("onlysetdata", function(chkValue) {
				if (chkValue && resTab.isSelectedLevel()) {
					self.viewResSetData(resTab);
				}
			});

			// mfo supplement refersh
			mfoTab.on('refreshgrid', function() {
				self.refreshOnlySetMfo(mfoTab, true);
			});

			// mfo supplement search
			mfoTab.on('searchgrid', function() {
				self.refreshOnlySetMfo(mfoTab, false);
			});

			// res supplement refersh
			resTab.on('refreshgrid', function() {
				self.refreshOnlySetRes(resTab, true);
			});

			// res supplement search
			resTab.on('searchgrid', function() {
				self.refreshOnlySetRes(resTab, false);
			});

			// mfo selector 그리드 row click
			mfoTab.on("selectrow", function(selectedRow, selectedData) {
				self.reloadGrid(self);
			});
			// res selector 그리드 row click
			resTab.on("selectrow", function(selectedRow, selectedData) {
				self.reloadGrid(self);
			});

			// 그리드 row 선택시 form load
			self.sub('grdMfo').on('select', function(rowModel, record, index, eOpts) {
				self.reloadForm(self, record.data.alarmId, '2', record.data.tranPoint, record.data.eventId);
				// reciever tab load
				self.sub('grdReceiverList').store.load({
					params : {
						procstep : '1',
						alarmId : record.data.alarmId
					}
				});
				// 선택한 row의 트랜잭션 코드를 폼에 있는라디오 그룹에 설정
				self.sub('rdoTranPoint').setValue({
					tranPoint : record.data.tranPoint
				});
				// 선택한 row lotid를 폼 lotid로 이동
				self.sub('txtLotId').setValue(record.data.lotId);

				// 선택한 row의 fromTime을 폼에 설정
				if (record.data.applyFromTime) {
					self.sub('chkFromTime').setValue(true);
					self.sub('dateFrom').setValue(record.data.applyFromTime);
					self.sub('timeFrom').setValue(record.data.applyFromTime);
				} else {
					self.sub('chkFromTime').setValue(false);
				}
				// 선택한 row의 toTime을 폼에 설정
				if (record.data.applyToTime) {
					self.sub('chkToTime').setValue(true);
					self.sub('dateTo').setValue(record.data.applyToTime);
					self.sub('timeTo').setValue(record.data.applyToTime);
				} else {
					self.sub('chkToTime').setValue(false);
				}

			});
			// 그리드 row 선택시 form load
			self.sub('grdRes').on('select', function(rowModel, record, index, eOpts) {
				self.reloadForm(self, record.data.alarmId, '2', record.data.eventId);
				// reciever tab load
				self.sub('grdReceiverList').store.load({
					params : {
						procstep : '1',
						alarmId : record.data.alarmId
					}
				});

				// 선택한 row eventID 입력
				self.sub('cdvEventId').setValue(record.data.eventId);

				// 선택한 row의 fromTime을 폼에 설정
				if (record.data.applyFromTime) {
					self.sub('chkFromTime').setValue(true);
					self.sub('dateFrom').setValue(record.data.applyFromTime);
					self.sub('timeFrom').setValue(record.data.applyFromTime);
				} else {
					self.sub('chkFromTime').setValue(false);
				}
				// 선택한 row의 toTime을 폼에 설정
				if (record.data.applyToTime) {
					self.sub('chkToTime').setValue(true);
					self.sub('dateTo').setValue(record.data.applyToTime);
					self.sub('timeTo').setValue(record.data.applyToTime);
				} else {
					self.sub('chkToTime').setValue(false);
				}

				// need confirm flag 설정
				if (record.data.needConfirmFlag == 'Y')
					self.sub('chkNeedConfirm').setValue(true);
				else
					self.sub('chkNeedConfirm').setValue(false);
			});

			// apply time 체크박스 선택시 disable config 변경
			self.sub('chkFromTime').on('change', function(me, newValue) {
				self.sub('dateFrom').setDisabled(true);
				self.sub('timeFrom').setDisabled(true);
				if (newValue) {
					self.sub('dateFrom').setDisabled(false);
					self.sub('timeFrom').setDisabled(false);
				}
			});
			// apply time 체크박스 선택시 disable config 변경
			self.sub('chkToTime').on('change', function(me, newValue) {
				self.sub('dateTo').setDisabled(true);
				self.sub('timeTo').setDisabled(true);
				if (newValue) {
					self.sub('dateTo').setDisabled(false);
					self.sub('timeTo').setDisabled(false);
				}
			});
			// lot Id 필드에 값이 들어갈경우 체크된다
			self.sub('txtLotId').on('change', function(me, newValue) {
				if (newValue == '') {
					self.sub('chkInherit').setDisabled(true);
					self.sub('chkInherit').setValue(false);
				} else {
					if (self.sub('chkInherit').disabled == true) {
						if (SF.option.get('MP_InheritAlarmToChild').value1 == 'Y') {
							self.sub('chkInherit').setDisabled(false);
							self.sub('chkInherit').setValue(true);
						}
					}
				}
			});

			// 메세지 override
			self.sub('chkMsgOver').on('change', function(me, newValue) {
				self.sub('txtMsgId').setReadOnly(true);
				self.sub('txtareaMsg1').setReadOnly(true);
				self.sub('txtareaMsg2').setReadOnly(true);
				self.sub('txtareaMsg3').setReadOnly(true);
				if (newValue) {
					self.sub('txtMsgId').setReadOnly(false);
					self.sub('txtareaMsg1').setReadOnly(false);
					self.sub('txtareaMsg2').setReadOnly(false);
					self.sub('txtareaMsg3').setReadOnly(false);
				}
			});

			// 코멘트 오버라이드
			self.sub('chkCmtOver').on('change', function(me, newValue) {
				self.sub('txtAreaComment1').setReadOnly(true);
				self.sub('txtAreaComment2').setReadOnly(true);
				self.sub('txtAreaComment3').setReadOnly(true);
				self.sub('txtAreaComment4').setReadOnly(true);
				self.sub('txtAreaComment5').setReadOnly(true);
				if (newValue) {
					self.sub('txtAreaComment1').setReadOnly(false);
					self.sub('txtAreaComment2').setReadOnly(false);
					self.sub('txtAreaComment3').setReadOnly(false);
					self.sub('txtAreaComment4').setReadOnly(false);
					self.sub('txtAreaComment5').setReadOnly(false);
				}
			});

			// cdvAlarmId 선택시
			self.sub('cdvAlarmId').on('select', function(record) {
				self.reloadForm(self, record.get('alarmId'), '1');

				// reciever tab load
				self.sub('grdReceiverList').store.load({
					params : {
						procstep : '1',
						alarmId : record.get('alarmId')
					}
				});
				self.sub('rdoTranPoint').setValue({
					tranPoint : ''
				});
			});
		});
	},

	onBeforeExport : function(form, addParams, url) {
		var self = this;
		var btnExport = self.getButtons().sub('btnExport');

		var grid = form.sub(btnExport.userConfig.targetGrid);
		if (!grid || !grid.lastParams) {
			return false;
		}

		Ext.apply(addParams, grid.lastParams);
		if (!addParams)
			return false;

		return true;
	},

	refreshOnlySetMfo : function(supplement, bremote) {

		// 필터삭제
		supplement.sub('grdMfo').store.clearFilter();

		// 서버전체 조회
		if (bremote) {
			this.viewMfoSetData(supplement);
		}

		// 데이타 필터
		if (supplement.getSearchText() != '') {
			var mLevel = supplement.getSelectedLevel();
			switch (mLevel) {
			case 'MFO':
				supplement.sub('grdMfo').store.filter("matId", supplement.getSearchText());
				break;
			case 'FO':
				supplement.sub('grdMfo').store.filter("flow", supplement.getSearchText());
				break;
			case 'O':
				supplement.sub('grdMfo').store.filter("oper", supplement.getSearchText());
				break;
			case 'MO':
				supplement.sub('grdMfo').store.filter("oper", supplement.getSearchText());
				break;
			}
		}
	},

	refreshOnlySetRes : function(supplement, bremote) {

		// 필터삭제
		supplement.sub('grdRes').store.clearFilter();

		// 서버전체 조회
		if (bremote) {
			this.viewResSetData(supplement);
		}

		// 데이타 필터
		if (supplement.getSearchText() != '') {
			var mLevel = supplement.getSelectedLevel();

			switch (mLevel) {
			case 'F':
				supplement.sub('grdRes').store.filter("factory", supplement.getSearchText());
				break;
			case 'TR':
				supplement.sub('grdRes').store.filter("resId", supplement.getSearchText());
				break;
			case 'GR':
				supplement.sub('grdRes').store.filter("resId", supplement.getSearchText());
				break;
			}
		}
	},

	viewMfoSetData : function(supTabMfo) {
		var mLevel = supTabMfo.getSelectedLevel();
		var cols = '';

		switch (mLevel) {
		case 'MFO':
			cols = 'MAT_ID as "matId" , MAT_VER as "matVer", FLOW as "flow", OPER as "oper"';
			query = "SELECT " + cols + " FROM MALMMFORES WHERE FACTORY = '" + SmartFactory.login.factory
					+ "' AND REL_LEVEL = '1' AND MAT_ID <> ' ' AND MAT_VER > 0 AND FLOW <> ' ' AND OPER <> ' ' "
					+ "GROUP BY MAT_ID, MAT_VER, FLOW, OPER ORDER BY MAT_ID ASC, MAT_VER DESC, FLOW ASC, OPER ASC";
			break;
		case 'FO':
			cols = 'FLOW as "flow", OPER as "oper"';
			query = "SELECT " + cols + " FROM MALMMFORES WHERE FACTORY = '" + SmartFactory.login.factory
					+ "' AND REL_LEVEL = '2' AND MAT_ID = ' ' AND MAT_VER = 0 AND FLOW <> ' ' AND OPER <> ' ' "
					+ "GROUP BY FLOW, OPER ORDER BY FLOW ASC, OPER ASC";
			break;
		case 'O':
			cols = 'OPER as "oper"';
			query = "SELECT " + cols + " FROM MALMMFORES WHERE FACTORY = '" + SmartFactory.login.factory
					+ "' AND REL_LEVEL = '3' AND MAT_ID = ' ' AND MAT_VER = 0 AND FLOW = ' ' AND OPER <> ' ' " + "GROUP BY OPER ORDER BY OPER ASC";
			break;
		case 'MO':
			cols = 'MAT_ID as "matId" , MAT_VER as "matVer", OPER as "oper"';
			query = "SELECT " + cols + " FROM MALMMFORES WHERE FACTORY = '" + SmartFactory.login.factory
					+ "' AND REL_LEVEL = '4' AND MAT_ID <> ' ' AND MAT_VER > 0 AND FLOW = ' ' AND OPER <> ' ' "
					+ "GROUP BY MAT_ID, MAT_VER, OPER ORDER BY MAT_ID ASC, MAT_VER DESC, OPER ASC";
			break;
		}
		var procstep = '1';

		supTabMfo.callBasSqlQuery(query, procstep);
	},

	viewResSetData : function(supTabRes) {
		var mLevel = supTabRes.getSelectedLevel();
		var mLevelChar = '';

		switch (mLevel) {
		case 'F':
			mLevelChar = 'F';
			break;
		case 'TR':
			mLevelChar = "T','R";
			break;
		case 'GR':
			mLevelChar = "G','R";
			break;
		}
		var cols = 'FACTORY as "factory" , RES_TYPE as "resType", RESG_ID as "resgId", RES_ID as "resId"';
		query = "SELECT " + cols + " FROM MALMMFORES WHERE FACTORY = '" + SmartFactory.login.factory + "' AND REL_LEVEL IN ('" + mLevelChar + "')"
				+ "GROUP BY FACTORY, RES_TYPE, RESG_ID, RES_ID " + "ORDER BY FACTORY, RES_TYPE, RESG_ID, RES_ID";

		var procstep = '1';

		supTabRes.callBasSqlQuery(query, procstep);
	},

	reloadForm : function(self, alarmId, step, tranpoint, eventId) {
		// step 2 : mfo relation된 alarm 조회
		// step 1 : 단순 코드뷰 변경으로 인한 조회
		var supplement = this.getSupplement().getTabPanel();

		var relLevel = null;
		var matId = null;
		var matVer = null;
		var flow = null;
		var oper = null;
		var resId = null;
		// var resgId = null;
		// var resType = null;
		var eventId = null;
		if (step != '1') {
			relLevel = supplement.activeTab.getSelectedLevelChar();
			if (relLevel == 'TR' || relLevel == 'GR') {
				relLevel = 'R';
			}
			var selectedData = supplement.activeTab.getSelectedData();

			if (selectedData.matId != undefined)
				matId = selectedData.matId;
			if (selectedData.matVer != undefined)
				matVer = selectedData.matVer;
			if (selectedData.flow != undefined)
				flow = selectedData.flow;
			if (selectedData.oper != undefined)
				oper = selectedData.oper;
			if (selectedData.resId != undefined)
				resId = selectedData.resId;
			if (selectedData.eventId != undefined)
				eventId = selectedData.eventId;
			// if (selectedData.resgId != undefined)
			// resgId = selectedData.resgId;
			// if (selectedData.key1 != undefined)
			// resType = selectedData.key1;
		}

		this.getForm().load({
			url : 'service/AlmViewAlarmMsg.json',
			params : {
				procstep : step,
				alarmId : alarmId,
				relLevel : relLevel,
				matId : matId,
				matVer : matVer,
				flow : flow,
				oper : oper,
				resId : resId,
				// resgId : resgId,
				// resType : resType,
				eventId : eventId,
				tranPoint : tranpoint
			},
			success : function(form, action) {
				// lot action에서 hold와 f hold일때 holdCode, holdPassword 컬럼을 같이쓴다
				// 이를 방지하기위해.. holdCode와 holdPassword를 hidden으로 놓고 사용
				if (action.result.data.alarmLotAction == 'HOLD') {
					self.sub('txtHoldCode').setValue(action.result.data.holdCode);
					self.sub('txtHoldPsw').setValue(action.result.data.holdPassword);
				} else if (action.result.data.alarmLotAction == 'FHLD') {
					self.sub('txtFutureHoldCode').setValue(action.result.data.holdCode);
					self.sub('txtFutureHoldPsw').setValue(action.result.data.holdPassword);
				}
				self.sub('txtEventId').setValue(action.result.data.eventId);

				if (!action.result.data.fileinfo || !action.result.data.fileinfo[0]) {
					self.sub('imgAlarm').setSrc('');
				} else {
					self.sub('imgAlarm').setSrc('/mesplus/service/bas_download_file/' + action.result.data.fileinfo[0].fileId + '.do');
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

	reloadGrid : function(self) {
		var supplement = this.getSupplement().getTabPanel();

		var relLevel = null;
		var matId = null;
		var matVer = null;
		var flow = null;
		var oper = null;
		var resId = null;
		// 기존 클라이언트에선 Res 그룹과 Res Type 안씀
		// var resgId = '';
		// var resType = '';

		relLevel = supplement.activeTab.getSelectedLevelChar();
		if (relLevel == 'TR' || relLevel == 'GR') {
			relLevel = 'R';
		}

		var selectedData = supplement.activeTab.getSelectedData();

		if (selectedData.matId != undefined)
			matId = selectedData.matId;
		if (selectedData.matVer != undefined)
			matVer = selectedData.matVer;
		if (selectedData.flow != undefined)
			flow = selectedData.flow;
		if (selectedData.oper != undefined)
			oper = selectedData.oper;
		if (selectedData.resId != undefined)
			resId = selectedData.resId;
		// if (selectedData.resgId != undefined)
		// resgId = selectedData.resgId;
		// if (selectedData.key1 != undefined)
		// resType = selectedData.key1;

		if (supplement.activeTab.itemId == 'tabMfo') {
			self.sub('grdMfo').store.load({
				params : {
					procstep : '1',
					relLevel : relLevel,
					matId : matId,
					matVer : matVer,
					flow : flow,
					oper : oper,
					resId : resId
				// resgId : resgId,
				// resType : resType
				},
				callback : function(records, operation, success) {
					if (!success || !records)
						return;
					self.sub('grdMfo').lastParams = {
						procstep : '1',
						relLevel : relLevel,
						matId : matId,
						matVer : matVer,
						flow : flow,
						oper : oper,
						resId : resId
					};
				}
			});
		} else if (supplement.activeTab.itemId == 'tabRes') {
			if (relLevel != 'F') // factory가 아니면 모두 R
				relLevel = 'R';
			self.sub('grdRes').store.load({
				params : {
					procstep : '1',
					relLevel : relLevel,
					resId : resId
				},
				callback : function(records, operation, success) {
					if (!success || !records)
						return;
					self.sub('grdRes').lastParams = {
						procstep : '1',
						relLevel : relLevel,
						resId : resId
					};
				}
			});
		}
		// 그리드 refresh시 폼필드 삭제
		self.getForm().getFields().each(function(f) {
			f.setValue(null);
		});
	},

	checkCondition : function(step, form, addParams) {
		var supplement = this.getSupplement().getTabPanel();
		var selectedData = supplement.activeTab.getSelectedData();
		var level = supplement.activeTab.getSelectedLevelChar();
		var newDate = new Date();
		if (supplement.activeTab.itemId == 'tabMfo') {
			if (!selectedData || !selectedData.oper) {
				SmartFactory.msgBox('Mes Client', T('Message.109'), 'OK');
				return false;
			}
		}

		if (supplement.activeTab.itemId == 'tabRes') {
			if (level != 'F') {
				if (!selectedData || !selectedData.resId) {
					SmartFactory.msgBox('Mes Client', T('Message.109'), 'OK');
					return false;
				}
			}
		}

		if (addParams) {
			if (addParams.procstep == SF_STEP_CREATE) {
				if (this.sub('chkFromTime').checked) {
					if (SF.cf.toStandardTime(newDate, SF_CONVERT_DATE_FORMAT).localeCompare(
							SF.cf.toStandardTime(this.sub('dateFrom').getValue(), SF_CONVERT_DATE_FORMAT)) > 0) {
						SmartFactory.msgBox('Mes Client', T('Message.177') + ' From Date', 'OK');
						return false;
					}

					if (SF.cf.toStandardTime(newDate, SF_CONVERT_DATETIME_FORMAT).localeCompare(
							SF.cf.toStandardTime(this.sub('dateFrom').getValue(), SF_CONVERT_DATE_FORMAT)
									+ SF.cf.toStandardTime(this.sub('timeFrom').getValue(), SF_CONVERT_TIME_FORMAT)) > 0) {
						SmartFactory.msgBox('Mes Client', T('Message.177') + ' From Date Time', 'OK');
						return false;
					}
				}
			}

			switch (addParams.procstep) {
			case SF_STEP_CREATE:
			case SF_STEP_UPDATE:
				if (this.sub('chkToTime').checked) {
					if (SF.cf.toStandardTime(newDate, SF_CONVERT_DATE_FORMAT).localeCompare(
							SF.cf.toStandardTime(this.sub('dateTo').getValue(), SF_CONVERT_DATE_FORMAT)) > 0) {
						SmartFactory.msgBox('Mes Client', T('Message.177') + ' To Date', 'OK');
						return false;
					}

					if (SF.cf.toStandardTime(newDate, SF_CONVERT_DATETIME_FORMAT).localeCompare(
							SF.cf.toStandardTime(this.sub('dateTo').getValue(), SF_CONVERT_DATE_FORMAT)
									+ SF.cf.toStandardTime(this.sub('timeTo').getValue(), SF_CONVERT_TIME_FORMAT)) > 0) {
						SmartFactory.msgBox('Mes Client', T('Message.177') + ' To Date Time', 'OK');
						return false;
					}
				}
			}
		}
		return true;
	},

	addParamsData : function(form, addParams, url) {
		var self = this;
		var supplement = this.getSupplement().getTabPanel();
		var relLevel = ' ';
		var matId = ' ';
		var matVer = 0;
		var flow = ' ';
		var oper = ' ';
		var resId = ' ';
		var fromDate = '';
		var toDate = '';

		relLevel = supplement.activeTab.getSelectedLevelChar();
		var selectedData = supplement.activeTab.getSelectedData();

		// 기존 클라이언트에 이렇게 되어있음. TR이나 GR도 그냥 R로 구분
		if (relLevel == 'TR' || relLevel == 'GR') {
			addParams.relLevel = 'R';
		} else {
			addParams.relLevel = relLevel;
		}

		// fromDate, Todate 설정
		if (this.sub('chkFromTime').checked) {
			fromDate = Ext.Date.format(self.sub('dateFrom').getValue(), 'Ymd');
			fromDate += Ext.Date.format(self.sub('timeFrom').getValue(), 'His');
			addParams.applyFromTime = fromDate;
		}

		if (this.sub('chkToTime').checked) {
			toDate = Ext.Date.format(self.sub('dateTo').getValue(), 'Ymd');
			toDate += Ext.Date.format(self.sub('timeTo').getValue(), 'His');
			addParams.applyToTime = toDate;
		}

		if (supplement.activeTab.itemId == 'tabMfo') {
			if (selectedData.matId != undefined)
				matId = selectedData.matId;
			if (selectedData.matVer != undefined)
				matVer = selectedData.matVer;
			if (selectedData.flow != undefined)
				flow = selectedData.flow;
			if (selectedData.oper != undefined)
				oper = selectedData.oper;

			addParams.matId = matId;
			addParams.matVer = matVer;
			form.setValues({
				flow : flow
			});
			form.setValues({
				oper : oper
			});
			if (form.getValues().eventId != '')
				form.setValues({
					eventId : ' '
				});
		} else {
			if (relLevel != 'F')
				relLevel = 'R';
			if (selectedData && selectedData.resId)
				resId = selectedData.resId;

			addParams.eventId = self.sub('cdvEventId').getValue();
			addParams.resId = resId;
		}
	},

	onBeforeCreate : function(form, addParams, url) {
		this.addParamsData(form, addParams);
	},

	onBeforeUpdate : function(form, addParams, url) {
		this.addParamsData(form, addParams);
	},

	onBeforeDelete : function(form, addParams, url) {
		this.addParamsData(form, addParams);
	},

	onAfterCreate : function(form, action, success) {
		if (!success)
			return;
		this.reloadGrid(this);
	},

	onAfterUpdate : function(form, action, success) {
		if (!success)
			return;
		this.reloadGrid(this);
	},

	onAfterDelete : function(form, action, success) {
		if (!success)
			return;
		this.reloadGrid(this);
		this.getForm().getFields().each(function(f) {
			f.setValue(null);
		});
	},

	getAlarmParams : function(me) {
		// only normal 체크여부에 따라 코드뷰 param값을 설정
		var params = {
			procstep : '1'
		};

		if (me.sub('chkOnlyNormal').getValue()) {
			params.alarmType = 'N';
		}
		return params;
	},

	buildTopPart : function() {
		return [ {
			xtype : 'grid',
			height : 110,
			itemId : 'grdMfo',
			cls : 'navyGrid',
			store : Ext.create('ALM.store.AlmViewAlarmRelationListOut.alarmList'),
			columns : [ {
				header : T('Caption.Other.Alarm ID'),
				dataIndex : 'alarmId',
				flex : 1
			}, {
				header : T('Caption.Other.Level'),
				dataIndex : 'alarmLevel',
				align : 'center',
				width : 80
			}, {
				header : T('Caption.Other.Transaction'),
				dataIndex : 'tranPoint',
				align : 'center',
				width : 80
			}, {
				header : T('Caption.Other.Lot ID'),
				dataIndex : 'lotId',
				flex : 1
			}, {
				header : T('Caption.Other.Apply From Time'),
				dataIndex : 'applyFromTime',
				width : 130
			}, {
				header : T('Caption.Other.Apply To Time'),
				dataIndex : 'applyToTime',
				width : 130
			} ]
		}, {
			xtype : 'grid',
			height : 110,
			hidden : true,
			itemId : 'grdRes',
			cls : 'navyGrid',
			store : Ext.create('ALM.store.AlmViewAlarmRelationListOut.alarmList'),
			columns : [ {
				header : T('Caption.Other.Alarm ID'),
				dataIndex : 'alarmId',
				flex : 1
			}, {
				header : T('Caption.Other.Level'),
				dataIndex : 'alarmLevel',
				flex : 1
			}, {
				header : T('Caption.Other.Event ID'),
				dataIndex : 'eventId',
				flex : 1
			}, {
				header : T('Caption.Other.Apply From Time'),
				dataIndex : 'applyFromTime',
				flex : 1
			}, {
				header : T('Caption.Other.Apply To Time'),
				dataIndex : 'applyToTime',
				flex : 1
			}, {
				// alarmRelationList에 있는 needConfirmFlag받기 위해 hidden
				hidden : true,
				dataIndex : 'needConfirmFlag'
			} ]
		}, {
			xtype : 'fieldset',
			title : T('Caption.Other.Alarm Condition'),
			itemId : 'fdsCondition',
			layout : {
				type : 'hbox',
				align : 'stretch'
			},
			items : [ {
				xtype : 'container',
				layout : {
					type : 'anchor'
				},
				items : [ {
					xtype : 'container',
					layout : {
						type : 'hbox',
						align : 'stretch'
					},
					flex : 1,
					items : [ {
						xtype : 'displayfield',
						fieldLabel : T('Caption.Other.Alarm ID'),
						labelStyle : 'font-weight:bold',
						labelSeparator : '',
						cls : 'marginL5',
						width : 120,
						submitValue : false
					}, {
						xtype : 'checkbox',
						itemId : 'chkOnlyNormal',
						boxLabelAlign : 'before',
						boxLabel : T('Caption.Other.Only Normal'),
						submitValue : false,
						cls : 'marginR7',
						labelSeparator : ''
					}, {
						xtype : 'codeview',
						codeviewName : 'SERVICE',
						itemId : 'cdvAlarmId',
						labelSeparator : '',
						allowBlank : false,
						flex : 1,
						popupConfig : {
							title : T('Caption.Other.Alarm ID'),
							columns : [ {
								header : T('Caption.Other.Alarm ID'),
								dataIndex : 'alarmId',
								flex : 1
							}, {
								header : T('Caption.Other.Description'),
								dataIndex : 'alarmDesc',
								flex : 1
							} ]
						},
						paramsScope : this,
						store : 'SEC.store.AlmViewAlarmMsgListOut.alarmList',
						params : this.getAlarmParams,
						name : 'alarmId',
						fields : [ {
							column : 'alarmId',
							maxLength : 20,
							enforceMaxLength : true
						} ]
					} ]
				}, {
					xtype : 'container',
					layout : {
						type : 'hbox',
						align : 'stretch'
					},
					flex : 1,
					items : [ {
						xtype : 'displayfield',
						fieldLabel : T('Caption.Other.Apply Time'),
						submitValue : false,
						width : 120,
						cls : 'marginL5',
						labelSeparator : ''
					}, {
						xtype : 'checkbox',
						submitValue : false,
						itemId : 'chkFromTime',
						labelSeparator : '',
						width : 20
					}, {
						// TODO 현재 날짜 / 시간 설정
						xtype : 'datefield',
						editable : false,
						flex : 1,
						disabled : true,
						itemId : 'dateFrom',
						submitValue : false
					}, {
						xtype : 'timefield',
						flex : 1,
						increment : 1,
						disabled : true,
						editable : false,
						itemId : 'timeFrom',
						submitValue : false
					} ]
				}, {
					xtype : 'container',
					layout : {
						type : 'hbox',
						align : 'stretch'
					},
					flex : 1,
					items : [ {
						xtype : 'displayfield',
						submitValue : false,
						width : 120,
						cls : 'marginL5'
					}, {
						xtype : 'checkbox',
						submitValue : false,
						itemId : 'chkToTime',
						labelSeparator : '',
						width : 20
					}, {
						// TODO 현재 날짜 / 시간 설정
						xtype : 'datefield',
						anchor : '100%',
						flex : 1,
						disabled : true,
						editable : false,
						itemId : 'dateTo',
						submitValue : false
					}, {
						xtype : 'timefield',
						flex : 1,
						increment : 1,
						disabled : true,
						editable : false,
						itemId : 'timeTo',
						submitValue : false
					} ]

				} ]
			}, { // mfoTab 설택시 보여질 condition
				xtype : 'container',
				itemId : 'ctnMfoCondition',
				layout : {
					type : 'anchor'
				},
				flex : 1,
				cls : 'marginL5',
				items : [ {
					xtype : 'textfield',
					fieldLabel : T('Caption.Other.Lot ID'),
					itemId : 'txtLotId',
					name : 'lotId',
					anchor : '100%',
					maxLength : 25,
					enforceMaxLength : true
				}, {
					xtype : 'checkbox',
					fieldLabel : T('Caption.Other.Inherit Child Lot'),
					labelSeparator : '',
					name : 'inheritChildFlag',
					itemId : 'chkInherit',
					inputValue : 'Y',
					disabled : true,
					uncheckedValue : ' '
				}, {
					xtype : 'fieldset',
					title : T('Caption.Other.Transaction'),
					items : {
						xtype : 'radiogroup',
						itemId : 'rdoTranPoint',
						anchor : '100%',
						cls : 'borderAllNone',
						items : [ {
							boxLabel : T('Caption.Other.Start'),
							name : 'tranPoint',
							inputValue : 'S',
							checked : true,
							value : 'S'
						}, {
							boxLabel : T('Caption.Other.Split'),
							name : 'tranPoint',
							inputValue : 'P',
							value : 'P'
						}, {
							boxLabel : T('Caption.Other.End'),
							name : 'tranPoint',
							inputValue : 'E',
							value : 'E'
						}, {
							boxLabel : T('Caption.Other.Rework'),
							name : 'tranPoint',
							inputValue : 'R',
							value : 'R'
						} ]
					}
				} ]
			}, { // restab 선택시 보여질 화면
				xtype : 'container',
				itemId : 'ctnResCondition',
				hidden : true,
				layout : {
					type : 'anchor'
				},
				flex : 1,
				cls : 'marginL10',
				items : [ {
					xtype : 'codeview',
					codeviewName : 'SvEvent',
					itemId : 'cdvEventId',
					submitValue : false,
					anchor : '100%',
					fieldLabel : T('Caption.Other.Event'),
					labelSeparator : ''
				}, {
					xtype : 'checkbox',
					boxLabelAlign : 'before',
					boxLabel : T('Caption.Other.Need User Confirmation'),
					itemId : 'chkNeedConfirm',
					labelSeparator : '',
					name : 'needConfirmFlag',
					inputValue : 'Y',
					uncheckedValue : ' '
				} ]
			} ]
		} ];
	},

	buildTabGeneral : function() {
		return {
			xtype : 'container',
			cls : 'paddingAll7',
			title : T('Caption.Other.General'),
			items : [ {
				xtype : 'fieldset',
				title : T('Caption.Other.Alarm Level'),
				layout : {
					type : 'hbox'
				},
				height : 50,
				items : {
					xtype : 'radiogroup',
					cls : 'borderAllNone',
					layout : {
						type : 'hbox'
					},
					itemId : 'rdoLevelFlag',
					defaults : {
						submitValue : false,
						disabled : true
					},
					flex : 1,
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
				title : T('Caption.Other.Alarm Action'),
				defaults : {
					disabled : true,
					submitValue : false
				},
				height : 50,
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
				title : T('Caption.Other.Lot Action'),
				layout : {
					type : 'hbox'
				},
				items : [ {
					xtype : 'fieldset',
					flex : 1,
					cls : 'borderTNone borderRNone borderBNone borderLNone paddingAll3',
					items : [ {
						xtype : 'combobox',
						submitValue : false,
						fieldLabel : T('Caption.Other.Tran Code'),
						itemId : 'cmbTranCode',
						displayField : 'name',
						valueField : 'value',
						labelWidth : 120,
						cls : 'marginR5',
						anchor : '50%',
						disabled : true,
						name : 'alarmLotAction',
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
							defaults : {
								readOnly : true,
								flex : 1
							},
							items : [ {
								xtype : 'textfield',
								itemId : 'txtHoldCode',
								labelWidth : 120,
								fieldLabel : T('Caption.Other.Rework Code'),
								labelSeparator : '',
								submitValue : false
							}, {
								xtype : 'textfield',
								submitValue : false,
								labelSeparator : '',
								cls : 'marginL10',
								labelWidth : 120,
								itemId : 'txtHoldPsw',
								fieldLabel : T('Caption.Other.Password'),
								inputType : 'password'
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
								defaults : {
									readOnly : true,
									labelWidth : 120,
									flex : 1
								},
								items : [ {
									xtype : 'textfield',
									submitValue : false,
									fieldLabel : T('Caption.Other.Hold Code'),
									itemId : 'txtFutureHoldCode'
								}, {
									xtype : 'textfield',
									labelSeparator : '',
									submitValue : false,
									cls : 'marginL10',
									itemId : 'txtFutureHoldPsw',
									fieldLabel : T('Caption.Other.Hold Password'),
									inputType : 'password'
								} ]
							}, {
								xtype : 'container',
								layout : {
									type : 'hbox',
									align : 'stretch'
								},
								defaults : {
									readOnly : true,
									labelWidth : 120,
									flex : 1
								},
								items : [ {
									xtype : 'textfield',
									itemId : 'txtFutureFlow',
									name : 'flow',
									fieldLabel : T('Caption.Other.Flow'),
									labelSeparator : ''
								}, {
									xtype : 'textfield',
									itemId : 'txtFutureOper',
									cls : 'marginL10',
									fieldLabel : T('Caption.Other.Operation'),
									labelSeparator : '',
									name : 'oper'
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
							defaults : {
								readOnly : true,
								labelWidth : 120,
								flex : 1
							},
							items : [ {
								xtype : 'textfield',
								itemId : 'txtReworkCode',
								fieldLabel : T('Caption.Other.Rework Code'),
								submitValue : false,
								name : 'rwkCode'
							}, {
								xtype : 'container',
								layout : {
									type : 'hbox'
								},
								defaults : {
									readOnly : true,
									submitValue : false,
									labelWidth : 120,
									flex : 1
								},
								items : [ {
									xtype : 'textfield',
									itemId : 'txtReworkFlow',
									fieldLabel : T('Caption.Other.Rework Flow'),
									labelSeparator : '',
									name : 'rwkFlow'
								}, {
									xtype : 'textfield',
									itemId : 'txtReworkOper',
									name : 'rwkOper',
									cls : 'marginL10',
									fieldLabel : T('Caption.Other.Rework Operation'),
									labelSeparator : ''
								} ]
							}, {
								xtype : 'container',
								layout : {
									type : 'hbox'
								},
								defaults : {
									readOnly : true,
									submitValue : false,
									labelWidth : 120,
									flex : 1
								},
								items : [ {
									xtype : 'container'
								}, {
									xtype : 'textfield',
									itemId : 'txtStopOper',
									name : 'rwkStopOper',
									fieldLabel : T('Caption.Other.Stop Operation'),
									labelSeparator : '',
									cls : 'marginL10'
								} ]
							}, {
								xtype : 'container',
								layout : {
									type : 'hbox',
									align : 'stretch'
								},
								defaults : {
									readOnly : true,
									submitValue : false,
									labelWidth : 120,
									flex : 1
								},
								items : [ {
									xtype : 'textfield',
									itemId : 'txtReturnFlow',
									fieldLabel : T('Caption.Other.Return Flow'),
									labelSeparator : '',
									name : 'retFlow'
								}, {
									xtype : 'textfield',
									itemId : 'txtReturnOper',
									cls : 'marginL10',
									fieldLabel : T('Caption.Other.Return Operation'),
									labelSeparator : '',
									name : 'retOper'
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
									valueField : 'value',
									labelWidth : 120,
									labelSeparator : '',
									flex : 1,
									readOnly : false,
									name : 'retClearFlag',
									store : Ext.create('Ext.data.Store', {
										fields : [ 'name', 'value' ],
										data : [ {
											'name' : 'Keep Rework',
											'value' : undefined
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
				cls : 'paddingT5',
				labelWidth : 130,
				width : 800,
				readOnly : true,
				submitValue : false,
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
				items : {
					xtype : 'checkbox',
					boxLabel : T('Caption.Other.Send To Occur Alarm User'),
					name : 'sendToUserFlag',
					flex : 1,
					inputValue : 'Y',
					uncheckedValue : ' ',
					// readOnly : true,
					disabled : true,
					submitValue : false
				}
			}, {
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
						cls : 'navyGrid',
						autoScroll : true,
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
				} ]
			} ]
		};
	},

	buildTabMessage : function() {
		return {
			xtype : 'container',
			cls : 'paddingAll7',
			title : T('Caption.Other.Message'),
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
					readOnly : true,
					labelWidth : 120
				},
				flex : 1,
				items : [ {
					xtype : 'checkbox',
					boxLabel : T('Caption.Other.Override'),
					itemId : 'chkMsgOver',
					readOnly : false,
					name : 'overrideMsgFlag',
					inputValue : 'Y',
					uncheckedValue : ' '
				}, {
					xtype : 'textfield',
					fieldLabel : T('Caption.Other.Subject'),
					itemId : 'txtMsgId',
					name : 'alarmSubject',
					height : 50,
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
				defaults : {
					readOnly : true,
					labelWidth : 120
				},
				flex : 1,
				items : [ {
					xtype : 'checkbox',
					boxLabel : T('Caption.Other.Override'),
					itemId : 'chkCmtOver',
					readOnly : false,
					name : 'overrideCommentFlag',
					inputValue : 'Y',
					uncheckedValue : ' '
				}, {
					xtype : 'textareafield',
					fieldLabel : T('Caption.Other.Comment1'),
					itemId : 'txtAreaComment1',
					name : 'alarmComment1',
					flex : 1,
					minHeight : 60,
					maxLength : 1000,
					enforceMaxLength : true
				}, {
					xtype : 'textareafield',
					fieldLabel : T('Caption.Other.Comment2'),
					itemId : 'txtAreaComment2',
					name : 'alarmComment2',
					flex : 1,
					minHeight : 60,
					maxLength : 1000,
					enforceMaxLength : true
				}, {
					xtype : 'textareafield',
					fieldLabel : T('Caption.Other.Comment3'),
					itemId : 'txtAreaComment3',
					name : 'alarmComment3',
					flex : 1,
					minHeight : 60,
					maxLength : 1000,
					enforceMaxLength : true
				}, {
					xtype : 'textareafield',
					fieldLabel : T('Caption.Other.Comment4'),
					itemId : 'txtAreaComment4',
					name : 'alarmComment4',
					flex : 1,
					minHeight : 60,
					maxLength : 1000,
					enforceMaxLength : true
				}, {
					xtype : 'textareafield',
					fieldLabel : T('Caption.Other.Comment5'),
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
			title : T('Caption.Other.Image'),
			items : [ {
				xtype : 'image',
				itemId : 'imgAlarm'
			} ]
		};
	},

	buildTabEvent : function() {
		var eventField = [];

		eventField.push({
			xtype : 'textfield',
			itemId : 'txtEventId',
			readOnly : true,
			anchor : '100%',
			submitValue : false,
			labelWidth : 120,
			labelSeparator : '',
			fieldLabel : T('Caption.Other.Event')
		});

		for ( var i = 1; i <= 10; i++) {
			eventField.push({
				xtype : 'textfield',
				fieldLabel : T('Caption.Other.Change Status') + ' ' + i,
				name : 'chgSts' + i,
				readOnly : true,
				labelWidth : 120,
				submitValue : false,
				anchor : '100%',
				labelSeparator : '',
				itemId : 'txtChgSts' + i
			});
		}

		eventField.push({
			xtype : 'textfield',
			name : 'resComment',
			submitValue : false,
			readOnly : true,
			anchor : '100%',
			labelWidth : 120,
			fieldLabel : T('Caption.Other.Resource Comment'),
			labelSeparator : ''
		});

		return {
			xtype : 'container',
			title : T('Caption.Other.Event'),
			cls : 'paddingAll7',
			layout : {
				type : 'anchor'
			},
			items : [ {
				xtype : 'fieldset',
				title : T('Caption.Other.Event'),
				items : eventField
			} ]
		};
	},

	buildTabClearEvent : function() {
		var clrEventField = [];

		clrEventField.push({
			xtype : 'textfield',
			itemId : 'txtClearEventId',
			readOnly : true,
			submitValue : false,
			labelWidth : 120,
			anchor : '100%',
			name : 'clearEventId',
			labelSeparator : '',
			fieldLabel : T('Caption.Other.Clear Event')
		});

		for ( var i = 1; i <= 10; i++) {
			clrEventField.push({
				xtype : 'textfield',
				fieldLabel : T('Caption.Other.Change Status') + ' ' + i,
				name : 'clearChgSts' + i,
				readOnly : true,
				labelWidth : 120,
				submitValue : false,
				anchor : '100%',
				labelSeparator : '',
				itemId : 'txtClearChgSts' + i
			});
		}

		clrEventField.push({
			xtype : 'textfield',
			name : 'clearResComment',
			readOnly : true,
			submitValue : false,
			anchor : '100%',
			fieldLabel : T('Caption.Other.Clear Comment'),
			labelSeparator : ''
		});

		return {
			xtype : 'container',
			title : T('Caption.Other.Clear Event'),
			cls : 'paddingAll7',
			layout : {
				type : 'anchor'
			},
			items : [ {
				xtype : 'fieldset',
				title : T('Caption.Other.Clear Event'),
				items : clrEventField
			} ]
		};
	},

	buildCustomFieldSetupTab : function() {
		return {
			xtype : 'wip_view_groupsetup',
			title : T('Caption.Other.Customized Field'),
			itemId : 'tabCmfsetup',
			submitValue : false,
			readOnly : true,
			itemName : 'nothing',
			fieldNamePrefix : 'nothing',
			cmfMaxCnt : 'nothing'
		};
	},

	buildSupplement : function() {
		return {
			xtype : 'tabssup',
			tabs : [ {
				xtype : 'mfoselector',
				itemId : 'tabMfo',
				visibleConfig : {
					level1Mfo : true,
					level2Fo : true,
					level3O : true,
					level4Mo : true,
					onlySetData : true,
					viewType : true
				}
			}, {
				xtype : 'resselector',
				itemId : 'tabRes',
				visibleConfig : {
					factory : true,
					resTypeResource : true,
					resGroupResource : true,
					onlySetData : true
				}
			} ]
		};
	}

});