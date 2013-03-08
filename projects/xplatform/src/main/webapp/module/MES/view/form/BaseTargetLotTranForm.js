Ext.define('MES.view.form.BaseTargetLotTranForm', {
	extend : 'MES.view.form.BaseForm',

	alternateClassName : 'BaseTargetLotTranForm',
	bodyCls : 'paddingAll10',
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

		this.on('afterrender', function() {
			// lot info 정보 로드가 완료되면 description 로드
			self.sub('viewLotInfo').on('loadlotinfo', function(record) {
				self.sub('txtLotDesc').setValue(record.get('lotDesc'));
				var tabTranCmf = self.sub('tabTranCmf');
				if (tabTranCmf) {
					SF.cf.clearFormFields(tabTranCmf);
				}
				var tabGeneral = self.sub(self.generalItemId);
				if (tabGeneral && self.autoTabGeneralClear !== false) {
					SF.cf.clearFormFields(tabGeneral);
				}
				if (self.afterLoadLotInfo != Ext.emptyFn) {
					self.afterLoadLotInfo(record);
				}
			});
			// lot info 정보 로드가 완료되면 description 로드
			self.sub('targetLotInfo').on('loadlotinfo', function(record) {
				if (self.afterTargetLoadLotInfo != Ext.emptyFn) {
					self.afterTargetLoadLotInfo(record);
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

		this.sub('chkTranTime').on('change', function(me, newValue) {
			if (newValue) {
				self.sub('dteTranTime').setDisabled(!newValue);
			} else {
				self.sub('dteTranTime').setDisabled(!newValue);
			}
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

		var supplement = this.getSupplement();
		if (supplement) {
			var workStation = supplement.sub('viewWorkStation');
			if (workStation) {
				workStation.setWorkStation(keys.lotId);
			}
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
			var type = Ext.typeOf(genInfo);
			if (type == 'array') {
				genItem.push({
					xtype : 'container',
					itemId : self.generalItemId,
					flex : 5,
					layout : 'anchor',
					defaults : {
						anchor : '100%'
					},
					autoScroll : true,
					cls : 'mainInputField paddingAll5',
					items : genInfo
				});
			} else if (type == 'object') {
				if (genInfo.items) {
					if (!genInfo.itemId)
						genInfo.itemId = self.generalItemId;
					genInfo.cls = genInfo.cls + ' mainInputField';
					genInfo.autoScroll = genInfo.autoScroll === false ? false : true;
					genInfo.flex = 5;
				}
				genItem.push(genInfo);
			}
			// target lot info
			genItem.push(self.buildLotInfo(T('Caption.Other.Target Lot Infomation'), 'targetLotInfo'));
			// main lot info
			genItem.push(self.buildLotInfo(T('Caption.Other.Main Lot Infomation')));
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
		if (this.buildGeneralTab != Ext.emptyFn) {
			var generalTab = this.buildGeneralTab(this);
			var tabItem = [ makeGeneral(generalTab) ];
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

	// lot 조회된 상세정보
	buildLotInfo : function(title, itemId) {
		itemId = itemId || 'viewLotInfo';
		var lotInfo = {
			infoTitle : title || 'Lot Information',
			itemId : itemId,
			flex : 3,
			cls : 'subColumn paddingAll5'
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
	buildGeneralTab : Ext.emptyFn,
	// 이벤트들...
	loadLotInfo : function(lotId) {
		lotId = lotId || this.sub('txtTranLotId').getValue();
		if (lotId) {
			this.selectedLotId = lotId;
			this.sub('viewLotInfo').loadLotInfo(lotId);
		}
	},

	loadTargetLotInfo : function(lotId) {
		if (!lotId) {
			Ext.Msg.alert('Error', T('Message.ValidInput', {
				field1 : T('Caption.Other.Target Lot ID')
			}));
			return false;
		}
		this.sub('targetLotInfo').loadLotInfo(lotId);
	},

	getLotId : function() {
		return this.sub('txtTranLotId').getValue();
	},

	setLotInfo : function(data) {
		if (data) {
			this.sub('viewLotInfo').setLotInfo(data);
		}
	},
	setTargetLotInfo : function(data) {
		if (data) {
			this.sub('targetLotInfo').setLotInfo(data);
		}
	},

	getLotInfo : function() {
		return this.sub('viewLotInfo').getLotInfo();
	},
	getTargetLotInfo : function() {
		return this.sub('targetLotInfo').getLotInfo();
	},

	getTranTabPanel : function() {
		return this.sub('tranTabPanel');
	},
	// lot 정보 호출후 처린
	afterLoadLotInfo : Ext.emptyFn,
	afterTargetLoadLotInfo : Ext.emptyFn
});