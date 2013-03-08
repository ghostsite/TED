Ext.define('MES.view.form.TranLotDetailInfo', {
	extend : 'Ext.form.Panel',

	autoScroll : true,

	// cls : 'paddingAll7',

	layout : {
		type : 'vbox',
		align : 'stretch'
	},

	// layout : 'anchor',

	initComponent : function() {

		this.callParent();

		this.add(this.buildLotInfo());

		var self = this;

		this.on('afterrender', function() {
			this.getForm().setValues(this.store.getAt(0).data);

			self.sub('btnClose').on('click', function() {
				self.up().close();
			});
		});

		// lot status 상태에 따른 글자 색상변환
		this.sub('txtlotStatus').on('change', function(me, newValue, oldValue, eOpt) {
			if (newValue == 'WAIT') {
				this.removeCls('textColorBlue');
				this.addCls('textColorGreen');
			} else if (newValue == 'PROC') {
				this.removeCls('textColorGreen');
				this.addCls('textColorBlue');
			} else {
				this.removeCls('textColorGreen');
				this.removeCls('textColorBlue');
			}
		});
	},

	buttons : [ {
		text : 'Close',
		itemId : 'btnClose'
	} ],

	buildLotInfo : function() {

		var fields = [ {
			label1 : T('Caption.Other.Lot ID'),
			name1 : 'lotId',
			label2 : T('Caption.Other.Material'),
			name2 : 'matInfo',
			label3 : T('Caption.Other.Flow'),
			name3 : 'flowInfo'
		}, {
			label1 : T('Caption.Other.Operation'),
			name1 : 'operInfo',
			label2 : T('Caption.Other.Qty 1/2/3'),
			name2 : 'qtyInfo',
			label3 : T('Caption.Other.Lot Type'),
			name3 : 'lotType'
		}, {
			label1 : T('Caption.Other.Create Code'),
			name1 : 'createCode',
			label2 : T('Caption.Other.Owner Code'),
			name2 : 'ownerCode',
			label3 : T('Caption.Other.Due Date'),
			name3 : 'schDueTime'
		}, {
			label1 : T('Caption.Other.Lot Status'),
			name1 : 'lotStatus',
			label2 : T('Caption.Other.Lot Priority'),
			name2 : 'lotPriorityInfo',
			label3 : T('Caption.Other.Hold Flag/Code'),
			name3 : 'holdInfo'
		}, {
			label1 : T('Caption.Other.Start Flag'),
			name1 : 'startFlag',
			label2 : T('Caption.Other.End Flag'),
			name2 : 'endFlag',
			label3 : T('Caption.Other.Rework Flag/Code'),
			name3 : 'rwkInfo'
		}, {
			label1 : T('Caption.Other.Transit Flag'),
			name1 : 'transitFlag',
			label2 : T('Caption.Other.Inventory Flag'),
			name2 : 'invFlag',
			label3 : T('Caption.Other.Non Standard Flag'),
			name3 : 'nstdFlag'
		}, {
			label1 : T('Caption.Other.Last Tran Code'),
			name1 : 'lastTranCode',
			label2 : T('Caption.Other.Last Tran Time'),
			name2 : 'lastTranTime',
			label3 : T('Caption.Other.Last Hist Seq'),
			name3 : 'lastHistSeq'
		}, {
			label1 : T('Caption.Other.Ship Code'),
			name1 : 'shipCode',
			label2 : T('Caption.Other.Ship Time'),
			name2 : 'shipTime',
			label3 : T('Caption.Other.Sample Flag'),
			name3 : 'sampleFlag'
		}, {
			label1 : T('Caption.Other.Oper In Qty 1/2/3'),
			name1 : 'operInQtyInfo',
			label2 : T('Caption.Other.Create Qty 1/2/3'),
			name2 : 'createQtyInfo',
			label3 : T('Caption.Other.Start Time'),
			name3 : 'startTime'
		}, {
			label1 : T('Caption.Other.Start Res ID'),
			name1 : 'startResId',
			label2 : T('Caption.Other.End Time'),
			name2 : 'endTime',
			label3 : T('Caption.Other.End Res ID'),
			name3 : 'endResId'
		}, {
			label1 : T('Caption.Other.Rework Ret Flow'),
			name1 : 'rwkRetFlowInfo',
			label2 : T('Caption.Other.Rework Ret Oper'),
			name2 : 'rwkRetOper',
			label3 : T('Caption.Other.Rework Count'),
			name3 : 'rwkCount'
		}, {
			label1 : T('Caption.Other.Rework End Flow'),
			name1 : 'rwkEndFlowInfo',
			label2 : T('Caption.Other.Rework End Oper'),
			name2 : 'rwkEndOper',
			label3 : T('Caption.Other.Rework Time'),
			name3 : 'rwkTime'
		}, {
			label1 : T('Caption.Other.NSTD Return Flow'),
			name1 : 'nstdRetFlowInfo',
			label2 : T('Caption.Other.NSTD Return Oper'),
			name2 : 'nstdRetOper',
			label3 : T('Caption.Other.NSTD Time'),
			name3 : 'nstdTime'
		}, {
			label1 : T('Caption.Other.Order ID'),
			name1 : 'orderId',
			label2 : T('Caption.Other.Lot Location'),
			name2 : 'lotLocation1',
			label3 : T('Caption.Other.Batch ID'),
			name3 : 'batchId'
		}, {
			label1 : T('Caption.Other.Create Time'),
			name1 : 'create_time',
			label2 : T('Caption.Other.Factory In Time'),
			name2 : 'facInTime',
			label3 : T('Caption.Other.Flow In Time'),
			name3 : 'flowInTime'
		}, {
			label1 : T('Caption.Other.Oper In Time'),
			name1 : 'operInTime',
			label2 : T('Caption.Other.From To Lot ID'),
			name2 : 'fromToLotId',
			label3 : T('Caption.Other.Reserve Res ID'),
			name3 : 'reserveResId'
		}, {
			label1 : T('Caption.Other.BOM Set ID'),
			name1 : 'bomSetId',
			label2 : T('Caption.Other.BOM Set Version'),
			name2 : 'bomSetVersion',
			label3 : T('Caption.Other.BOM Act Hist Seq'),
			name3 : 'bomActiveHistSeq'
		}, {
			label1 : T('Caption.Other.Lot Del Flag'),
			name1 : 'lotDelFlag',
			label2 : T('Caption.Other.Lot Del Time'),
			name2 : 'lotDelTime',
			label3 : T('Caption.Other.Lot Delete Code'),
			name3 : 'lotDelCode'
		}, {
			label1 : T('Caption.Other.Start Qty 1/2/3'),
			name1 : 'startQtyInfo',
			label2 : T('Caption.Other.Carrier ID'),
			name2 : 'crrId',
			label3 : T('Caption.Other.Last Active Hist Seq'),
			name3 : 'lastActiveHistSeq'
		} ];

		var tranLotItems1 = [];
		var tranLotItems2 = [];
		var tranLotItems3 = [];
		for ( var i = 0; i < 19; i++) {
			tranLotItems1.push({
				xtype : 'textfield',
				name : fields[i].name1,
				fieldLabel : fields[i].label1,
				itemId : 'txt' + fields[i].name1,
				labelWidth : 140,
				labelSeparator : '',
				anchor : '100%',
				readOnly : true,
				// cls : 'textColorGreen',
				submitValue : false
			});

			tranLotItems2.push({
				xtype : 'textfield',
				name : fields[i].name2,
				fieldLabel : fields[i].label2,
				itemId : 'txt' + fields[i].name2,
				cls : 'marginL5',
				labelWidth : 140,
				labelSeparator : '',
				anchor : '100%',
				readOnly : true,
				submitValue : false
			});

			tranLotItems3.push({
				xtype : 'textfield',
				name : fields[i].name3,
				fieldLabel : fields[i].label3,
				itemId : 'txt' + fields[i].name3,
				cls : 'marginL5',
				labelWidth : 140,
				labelSeparator : '',
				anchor : '100%',
				readOnly : true,
				submitValue : false,
				cls : 'marginL10'
			});
		}

		// fieldset에 scroll이 짤리는 문제를 해결하기 위해 마지막에 빈공간 추가
		// tranLotItems1.push({
		// xtype : 'container',
		// height : '20'
		// });

		return {
			xtype : 'container',
			cls : 'paddingAll7',
			flex : 1,
			// title : T('Caption.Other.Lot Information'),
			layout : {
				type : 'hbox'
			},
			items : [ {
				xtype : 'container',
				layout : 'anchor',
				flex : 1,
				items : tranLotItems1
			}, {
				xtype : 'container',
				layout : 'anchor',
				flex : 1,
				items : tranLotItems2
			}, {
				xtype : 'container',
				layout : 'anchor',
				flex : 1,
				items : tranLotItems3
			} ]
		};
	}

});
