Ext.define('MES.view.form.TranResStatus', {
	extend : 'Ext.view.View',

	autoScroll : true,

	itemSelector : '.inforMore',

	// TODO : DIV별 class적용 바랍니다.
	initComponent : function() {
		this.store = Ext.create('RAS.store.RasViewResourceOut');
		this.addEvents({
			"loadresstatus" : true
		// lot Info view에 데이타 로드가 완료되면 이벤트발생
		});

		// showStatusList가 없을 경우 기본 설정값
		var statusList = [ {
			label : T('Caption.Other.Up/Down Flag'),
			value : 'resUpDownFlag'
		}, {
			label : T('Caption.Other.Primary Status'),
			value : 'resPriSts'
		} ];

		if (this.showResStatus) {
			statusList = this.showResStatus;
		}
		var title = this.infoTitle || T('Caption.Other.Resource Status');
		// tpl은 '로만 문자를 묶어야 출력된다.
		var tpl = '<div class="lotInfoTitle">' + title + '<span>Basic</span><span class="inforMore">more</span></div>';
		tpl += '<tpl for="."><div class="infoItemSet">';
		Ext.Array.each(statusList, function(field) {

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
				title : T('Caption.Other.Resource Status'),
				layout : 'fit',
				height : 600,
				width : 600,
				items : Ext.create('MES.view.form.TranResDetailStatus', {
					store : this.store
				})
			}).show();
		});
	},

	// Res status 출력
	loadResStatus : function(resId) {
		var self = this;
		var store = this.store;

		if (!resId) {
			store.removeAll();
			return;
		}
		store.load({
			params : {
				resId : resId,
				procstep : '1'
			},
			callback : function(records, operation, success) {
				if (success) {
					self.resStatus = records[0];
					self.fireEvent('loadresstatus', records[0]);
				}
			}
		});
	},
	setResStatus : function(data, append) {
		var store = this.store;
		append = append === true ? true : false;
		store.loadData(data, append);
	},
	getResStatus : function() {
		return this.resStatus;
	}
});