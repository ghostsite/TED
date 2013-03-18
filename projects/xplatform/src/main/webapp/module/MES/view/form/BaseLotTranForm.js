Ext.define('MES.view.form.BaseLotTranForm', {
	extend : 'MES.view.form.BaseForm',

	alternateClassName : 'BaseLotTranForm',

	layout : {
		type : 'vbox',
		align : 'stretch'
	},

	buildSupplement : function() {
		return {
			xtype : 'container',
			items : Ext.create('MES.view.form.TranWorkstation', {
				itemId : 'viewWorkStation'
			})
		};
	},

	initComponent : function() {
		this.callParent();
		var self = this;

		this.on('keychange', function(me, keys) {
			self.onKeyChange(me, keys);
		});

		// 화면 초기화가 정상적으로 처리되지 않아 변경함.(2013-02-20)
		this.on('afterrender', function() {
			var supplement = self.getSupplement();
			// lot info 정보 로드가 완료되면 description 로드
			self.sub('viewLotInfo').on('loadlotinfo', function(record, sucess) {

				// general tab 초기화
				var tabGeneral = self.sub(self.generalItemId);
				if (tabGeneral && self.autoTabGeneralClear !== false) {
					SF.cf.clearFormFields(tabGeneral);
				}

				// cmf tab 초기화
				var tabTranCmf = self.sub('tabTranCmf');
				if (tabTranCmf) {
					SF.cf.clearFormFields(tabTranCmf);
				}

				// load lot info 되고 record 값이 있으면 처리..
				if (sucess === true && record) {

					self.sub('txtLotDesc').setValue(record.get('lotDesc'));
					self.loadResStatus(record.get('resId'));

					// afterLoadLotInfo가 sucess===true 상태에서만 호출 되도록 개발해서 현재 소스가
					// 맞추어있어 변경 불가
					if (self.afterLoadLotInfo != Ext.emptyFn) {
						self.afterLoadLotInfo(record);
					}
				} else {
					// viewLotInfo 초기화
					self.clearLotInfo();
				}
				if (supplement) {
					var workStation = supplement.sub('viewWorkStation');
					if (workStation) {
						workStation.setWorkStation(record);
					}
				}
			});

			self.sub('viewResStatus').on('loadresstatus', function(record) {
				if (self.afterLoadResStatus != Ext.emptyFn) {
					self.afterLoadResStatus(record);
				}
			});
		});

		this.sub('txtTranLotId').on('keydown', function(t, e) {
			if (e.keyCode == Ext.EventObject.ENTER) {
				self.setKeys({
					lotId : t.getValue() || ''
				});
			}
		});

		this.sub('txtTranLotId').on('change', function(field, newValue) {
			self.fireEvent('changelotid', field, newValue);
		});

	},
	onKeyChange : function(me, keys) {
		if (!keys) {
			if (SF.setting.get('currentLotId')) {
				this.setKeys({
					lotId : SF.setting.get('currentLotId')
				});
				return;
			} else
				return;
		}
		if (keys.lotId !== this.sub('txtTranLotId').getValue()) {
			this.sub('txtTranLotId').setValue(keys.lotId);
		}

		this.loadLotInfo(keys.lotId);
	},

	buildForm : function() {
		this.callParent();

		var tranForm = this.buildTranInfo();
		if (Ext.typeOf(tranForm) == 'object' && tranForm.xtype != 'tabpanel') {
			var separator = {
				xtype : 'separator'
			};
			this.add([ this.buildLot(), separator, tranForm ]);
		} else {
			this.add([ this.buildLot(), tranForm ]);
		}
	},

	// 상단부 lot 조회 정보
	buildLot : function(main) {
		return {
			xtype : 'tranlotfield'
		};
	},
	// 하단부 tran별 정보 표시
	buildTranInfo : function() {
		var self = this;
		self.generalItemId = 'tabGeneral';

		function makeGeneral(genInfo) {
			var genItem = [];
			var lotInfoHidden = false;
			var resStatusHidden = false;
			if (self.showLotInfoList === false) {
				lotInfoHidden = true;
			}
			if (self.showResStatus === false) {
				resStatusHidden = true;
			}
			var type = Ext.typeOf(genInfo);
			if (type == 'array') {
				genItem.push({
					xtype : 'container',
					itemId : 'tabGeneral',
					flex : 5,
					layout : 'anchor',
					defaults : {
						anchor : '100%'
					},
					autoScroll : true,
					cls : 'mainInputField paddingAll7',
					items : genInfo
				});
			} else if (type == 'object') {
				if (genInfo.items) {
					if (!genInfo.itemId)
						genInfo.itemId = self.generalItemId;
					genInfo.cls = genInfo.cls + ' mainInputField';
					genInfo.autoScroll = genInfo.autoScroll === false ? false : true;
					genInfo.flex = 5;
					self.generalItemId = genInfo.itemId;
				}
				genItem.push(genInfo);
			}
			var infoHidden = false;
			if (resStatusHidden && lotInfoHidden)
				infoHidden = true;
			genItem.push({
				xtype : 'container',
				flex : 3,
				hidden : infoHidden || false,
				layout : 'anchor',
				items : [ self.buildResStatus(resStatusHidden), self.buildLotInfo(lotInfoHidden) ]
			});
			return {
				xtype : 'container',
				itemId : self.generalItemId,
				title : T('Caption.Other.General'),
				flex : 1,
				layout : {
					type : 'hbox',
					align : 'stretch'
				},
				items : genItem
			};
		}

		var tranItems = {};
		if (this.buildGeneral != Ext.emptyFn) {
			var general = this.buildGeneral(this);
			tranItems = makeGeneral(general);
		} else if (this.buildGeneralTab != Ext.emptyFn) {
			var generalTab = this.buildGeneralTab(this);
			var tabItem = [ makeGeneral(generalTab, 1) ];
			if (this.buildCustomFieldSetupTab != Ext.emptyFn) {
				tabItem.push(this.buildCustomFieldSetupTab(this));
			}
			tranItems = {
				xtype : 'tabpanel',
				itemId : 'tranTabPanel',
				flex : 1,
				items : tabItem
			};
		} else {
			// general, generalTab이 모두 설정되지 않을경우 기본화면 설정
			general = {
				xtype : 'container',
				itemId : self.generalItemId,
				title : T('Caption.Other.General'),
				flex : 1,
				items : [ {
					xtype : 'container'
				} ]
			};
			tranItems = makeGeneral(general);
		}

		return tranItems;
	},
	buildResStatus : function(hidden, itemId) {
		var resStatus = {
			itemId : itemId || 'viewResStatus',
			cls : 'subColumn paddingAll5',
			hidden : hidden || false
		};
		return Ext.create('MES.view.form.TranResStatus', resStatus);
	},
	// lot 조회된 상세정보
	buildLotInfo : function(hidden, itemId) {
		itemId = itemId || 'viewLotInfo';
		var lotInfo = {
			itemId : itemId,
			cls : 'subColumn paddingAll5',
			hidden : hidden || false
		};
		if (this.showLotInfoList && this.showLotInfoList.length > 0) {
			lotInfo.showInfoList = this.showLotInfoList;
		}
		return Ext.create('MES.view.form.TranLotInfo', lotInfo);
	},
	// 사용자 정의 필드 TAB => 미사용시 Ext.emptyFn으로 재설정하면 화면에 표시되지 않음.
	buildCustomFieldSetupTab : function(main) {
		if (!main.cmfItemName || !main.cmfFieldNamePrefix) {
			return false;
		}
		return {
			xtype : 'wip_view_groupsetup',
			title : T('Caption.Other.Customized Field'),
			itemId : 'tabTranCmf',
			flex : 1,
			useCodeView : true,
			itemName : main.cmfItemName,
			fieldNamePrefix : main.cmfFieldNamePrefix,
			cmfMaxCnt : main.cmfMaxCnt
		};
	},
	// 단일 화면 tran 입력화면 : 단일화면 구성시 설정(우선순위1)
	buildGeneral : Ext.emptyFn,
	// tab별 tran 입력화면 : TAB 화면 구성시 설정(단일화면이 설정되면 tab구조가 생성되지 않는다)
	buildGeneralTab : Ext.emptyFn,

	// 이벤트들...
	loadLotInfo : function(lotId) {
		lotId = lotId || this.sub('txtTranLotId').getValue();
		if (lotId) {
			this.selectedLotId = lotId;
			this.sub('viewLotInfo').loadLotInfo(lotId);
		}
	},
	getLotId : function() {
		return this.sub('txtTranLotId').getValue();
	},
	setLotInfo : function(data) {
		if (data) {
			this.sub('viewLotInfo').setLotInfo(data);
		}
	},
	getLotInfo : function() {
		return this.sub('viewLotInfo').getLotInfo();
	},
	clearLotInfo : function() {
		this.sub('viewLotInfo').store.removeAll();
	},
	loadResStatus : function(resId) {
		resId = resId || '';
		this.selectedResId = resId;
		this.sub('viewResStatus').loadResStatus(resId);
	},
	getResStatus : function() {
		return this.sub('viewResStatus').getResStatus();
	},
	setResStatus : function(data) {
		if (data) {
			this.sub('viewResStatus').setResStatus();
		}
	},

	getTranTabPanel : function() {
		return this.sub('tranTabPanel');
	},
	// lot 정보 호출후 처린
	afterLoadLotInfo : Ext.emptyFn,
	afterLoadResStatus : Ext.emptyFn
});