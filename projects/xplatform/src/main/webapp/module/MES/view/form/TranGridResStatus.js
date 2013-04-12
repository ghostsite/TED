Ext.define('MES.view.form.TranGridResStatus', {
	extend : 'Ext.grid.Panel',

	alias : 'widget.grdresstatus',

	itemId : 'grdResStatus',

	bodyCls : 'borderL borderR borderT borderB',

	hideHeaders : true,
	disableSelection : true,
	columnLines : true,

	title : T('Caption.Other.Resource Information'),

	initComponent : function() {
		// store 설정
		this.store = Ext.create('Ext.data.Store', {
			fields : this.getDefFields(),
			data : this.getDefData()
		});
		// 컬럼 설정
		this.columns = this.getDefColumns();

		this.callParent();
	},

	// resource status 정보를 조회
	loadResStatus : function(resId) {
		this.store.removeAll();
		SF.cf.callService({
			url : 'service/RasViewResource.json',
			params : {
				resId : resId,
				procstep : '1'
			},
			scope : this,
			callback : function(response, success) {
				var result = response.responseObj;
				this.loadResStsData(result);
			}
		});
	},

	// resource status 정보를 그리드 형태에 맞게 출력
	loadResStsData : function(result) {
		var dataList = this.getDefData();
		if (result.success) {
			dataList[0].value1 = result.resUpDownFlag;
			dataList[0].value2 = result.resPriSts;

			var j = 1;
			for ( var i = 1; i <= 5; i++) {
				dataList[i].name1 = result['resStsPrt' + j];
				dataList[i].name2 = result['resStsPrt' + (j + 1)];
				dataList[i].value1 = result['resSts' + j];
				dataList[i].value2 = result['resSts' + (j + 1)];
				j += 2;
			}

			// useFacPrtFlag == 'Y' 상태면 name 정보 변경
			if (result.useFacPrtFlag == 'Y') {
				this.viewFactoryResStatus(dataList);
			} else {
				this.store.loadData(dataList);
			}
		}
	},

	viewFactoryResStatus : function(dataList) {
		Ext.Ajax.request({
			url : 'service/WipViewFactory.json',
			params : {
				procstep : '1'
			},
			scope : this,
			success : function(response) {
				var result = response.responseObj;
				if (result.success) {
					var j = 1;
					for ( var i = 1; i <= 5; i++) {
						dataList[i].name1 = result['resSts' + j];
						dataList[i].name2 = result['resSts' + (j + 1)];
						j += 2;
					}
					this.store.loadData(dataList);
				}
			}
		});
	},

	//기본 필드 정보
	getDefFields : function() {
		return [ 'name1', 'value1', 'name2', 'value2' ];
	},

	//기본 데이타 정보
	getDefData : function() {
		return [ {
			name1 : T('Caption.Other.Up/Down Flag'),
			name2 : T('Caption.Other.Primary Status'),
		}, {
			name1 : '',
			name2 : '',
		}, {
			name1 : '',
			name2 : '',
		}, {
			name1 : '',
			name2 : '',
		}, {
			name1 : '',
			name2 : '',
		}, {
			name1 : '',
			name2 : '',
		} ];
	},

	//기본 컬럼 정보
	getDefColumns : function() {
		return [ {
			xtype : 'rowstatic',
			dataIndex : 'name1',
			align : 'center',
			flex : 1
		}, {
			dataIndex : 'value1',
			flex : 1
		}, {
			xtype : 'rowstatic',
			dataIndex : 'name2',
			align : 'center',
			flex : 1
		}, {
			dataIndex : 'value2',
			flex : 1
		} ];
	}
});