Ext.define('MES.view.form.TranSublotInfo', {
	extend : 'Ext.view.View',

	autoScroll : true,

	itemSelector : '.inforMore',

	// TODO : DIV별 class적용 바랍니다.
	initComponent : function() {
		this.store = Ext.create('MES.store.ConvertWipViewSubStore');
		this.addEvents({
			"loadsublotinfo" : true
		// lot Info view에 데이타 로드가 완료되면 이벤트발생
		});

		// showInfoList가 없을 경우 기본 설정값
		var infoList = [ {
			label : T('Caption.Other.Material'),
			value : 'matId'
		}, {
			label : T('Caption.Other.Flow'),
			value : 'flow'
		}, {
			label : T('Caption.Other.Operation'),
			value : 'operInfo'
		}, {
			label : T('Caption.Other.Qty 2/3'),
			value : 'qtyInfo'
		}, {
			label : T('Caption.Other.Sublot Status'),
			value : 'sublotStatus',
			div : '<tpl if="sublotStatus==\'WAIT\'"><div class="textColorGreen"></tpl><tpl if="sublotStatus==\'PROC\'"><div class="textColorBlue"></tpl><tpl if="sublotStatus!=\'WAIT\'&&sublotStatus!=\'PROC\'"><div></tpl>'
		}, {
			label : T('Caption.Other.Tran Code'),
			value : 'lastTranCode'
		} ];

		if (this.showInfoList) {
			infoList = this.showInfoList;
		}
		var title = this.infoTitle||T('Caption.Other.Sublot Information');
		// tpl은 '로만 문자를 묶어야 출력된다.
		var tpl = '<div class="lotInfoTitle">'+ title +'<span>Basic</span><span class="inforMore">more</span></div>';
		tpl += '<tpl for="."><div class="infoItemSet">';
		Ext.Array.each(infoList, function(field) {

			var div = '';
			if (field.div) {
				div = field.div;
			} else {
				div = '<div>';
			}

			tpl += div + '<span>' + field.label + '</span>{' + field.value + '}</div>';
		});
		tpl += '</div></tpl>';

		this.tpl = tpl;

		this.callParent();

		this.on('itemclick', function(me, record, item, index) {
			Ext.create('Ext.window.Window', {
				title : T('Caption.Other.Sublot Information'),
				layout : 'fit',
				minHeight : 400,
				width : 900,
				items : Ext.create('MES.view.form.TranSublotDetailInfo', {
					store : this.store
				})
			}).show();
		});
	},

	// lotInfo 출력
	loadSublotInfo : function(sublotId, txtLotDesc) {
		var self = this;
		var store = this.store;

		store.load({
			params : {
				sublotId : sublotId,
				procstep : '1'
			},
			callback : function(records, operation, success) {
				if (success) {
					self.sublotInfo = records[0];
					self.fireEvent('loadsublotinfo', records[0]);
				}
			}
		});
	},
	setSublotInfo : function(data, append) {
		var store = this.store;
		append = append === true ? true : false;
		store.loadData(data, append);
	},
	getSublotInfo : function() {
		return this.sublotInfo;
	}
});