//Ext.require([ 'MES.store.ConvertWipViewLotStore', 'MES.view.form.TranLotDetailInfo' ]);
Ext.define('MES.view.form.TranLotInfo', {
	extend : 'Ext.view.View',

	autoScroll : true,

	itemSelector : '.inforMore',

	// TODO : DIV별 class적용 바랍니다.
	initComponent : function() {
		this.store = Ext.create('MES.store.ConvertWipViewLotStore');
		this.addEvents({
			"loadlotinfo" : true
		// lot Info view에 데이타 로드가 완료되면 이벤트발생
		});

		// showInfoList가 없을 경우 기본 설정값
		var infoList = [ {
			label : T('Caption.Other.Material'),
			value : 'matInfo'
		}, {
			label : T('Caption.Other.Flow'),
			value : 'flowInfo'
		}, {
			label : T('Caption.Other.Operation'),
			value : 'operInfo'
		}, {
			label : T('Caption.Other.Qty 1/2/3'),
			value : 'qtyInfo'
		}, {
			label : T('Caption.Other.Lot Status'),
			value : 'lotStatus',
			div : '<tpl if="lotStatus==\'WAIT\'"><div class="textColorGreen"></tpl><tpl if="lotStatus==\'PROC\'"><div class="textColorBlue"></tpl><tpl if="lotStatus!=\'WAIT\'&&lotStatus!=\'PROC\'"><div></tpl>'
		}, {
			label : T('Caption.Other.Tran Code'),
			value : 'lastTranCode'
		}, {
			label : T('Caption.Other.Lot Type'),
			value : 'lotType'
		}, {
			label : T('Caption.Other.Resource'),
			value : 'resId'
		}, {
			label : T('Caption.Other.Attr Name'),
			value : 'attrName'
		}, {
			label : T('Caption.Other.Attr Value'),
			value : 'attrValue'
		}, {
			label : T('Caption.Other.Lot Priority'),
			value : 'lotPriorityInfo'
		} ];

		if (this.showInfoList) {
			infoList = this.showInfoList;
		}
		var title = this.infoTitle||T('Caption.Other.Lot Information');
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
				title : T('Caption.Other.Lot Information'),
				layout : 'fit',
				minHeight : 400,
				width : 900,
				items : Ext.create('MES.view.form.TranLotDetailInfo', {
					store : this.store
				})
			}).show();
		});
	},

	// lotInfo 출력
	loadLotInfo : function(lotId, txtLotDesc) {
		var self = this;
		var store = this.store;

		store.load({
			params : {
				lotId : lotId,
				procstep : '1'
			},
			callback : function(records, operation, success) {
				if (success) {
					self.lotInfo = records[0];
					self.fireEvent('loadlotinfo', records[0]);
				}
			}
		});
	},
	setLotInfo : function(data, append) {
		var store = this.store;
		append = append === true ? true : false;
		store.loadData(data, append);
	},
	getLotInfo : function() {
		return this.lotInfo;
	}
});