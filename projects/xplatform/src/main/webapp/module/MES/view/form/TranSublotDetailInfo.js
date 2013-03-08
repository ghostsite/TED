Ext.define('MES.view.form.TranSublotDetailInfo', {
	extend : 'Ext.form.Panel',
	
	autoScroll : true,
	
	//cls : 'paddingAll7',
	
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	
	layout : 'anchor',

	initComponent : function() {

		this.callParent();
		
		this.add(this.buildSublotInfo());

		var self = this;

		this.on('afterrender',function(){
			this.getForm().setValues(this.store.getAt(0).data);

			self.sub('btnClose').on('click', function() {
				self.up().close();
			});
		});
		
		// sublot status 상태에 따른 글자 색상변환
		this.sub('txtsublotStatus').on('change', function(me, newValue, oldValue, eOpt) {
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

	buildSublotInfo : function() {

		var fields = [ {
			label1 : T('Caption.Other.Sublot ID'),
			name1 : 'sublotId',
			label2 : T('Caption.Other.Slot No'),
			name2 : 'slotNo',
			label3 : T('Caption.Other.Carrier ID'),
			name3 : 'carrId'
		}, {
			label1 : T('Caption.Other.Lot ID'),
			name1 : 'lotId',
			label2 : T('Caption.Other.Material'),
			name2 : 'matIdInfo',
			label3 : T('Caption.Other.Flow'),
			name3 : 'flowInfo'
		}, {
			label1 : T('Caption.Other.Operation'),
			name1 : 'operInfo',
			label2 : T('Caption.Other.Qty 2/3'),
			name2 : 'qtyInfo',
			label3 : T('Caption.Other.Sublot Status'),
			name3 : 'sublotStatus'
		}, {
			label1 : T('Caption.Other.Create Code'),
			name1 : 'createCode',
			label2 : T('Caption.Other.Owner Code'),
			name2 : 'ownerCode',
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
			label1 : T('Caption.Other.Grade'),
			name1 : 'grade',
			label2 : T('Caption.Other.Grade Code'),
			name2 : 'gradeCode',
			label3 : T('Caption.Other.Cell Grade'),
			name3 : 'cellGrade'
		}, {
			label1 : T('Caption.Other.Oper In Qty 2/3'),
			name1 : 'operInQtyInfo',
			label2 : T('Caption.Other.Create Qty 2/3'),
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
			label1 : T('Caption.Other.Repair Flag'),
			name1 : 'repFlag',
			label2 : T('Caption.Other.Repair Return Oper'),
			name2 : 'repRetOper',
			label3 : T('Caption.Other.Sublot Location'),
			name3 : 'sublotLocation'
		}, {
			label1 : T('Caption.Other.Sample Flag'),
			name1 : 'sampleFlag',
			label2 : T('Caption.Other.Sample Wait Flag'),
			name2 : 'sampleWaitFlag',
			label3 : T('Caption.Other.Sample Result'),
			name3 : 'sampleResult'
		}, {
			label1 : T('Caption.Other.Lot Base'),
			name1 : 'lotBase',
			label2 : T('Caption.Other.Reserve Res ID'),
			name2 : 'reserveResId',
			label3 : T('Caption.Other.Sublot Del Flag'),
			name3 : 'sublotDelFlag'
		}, {
			label1 : T('Caption.Other.Sublot Del Time'),
			name1 : 'sublotDelTime',
			label2 : T('Caption.Other.Sublot Del Code'),
			name2 : 'sublotDelCode',
			label3 : T('Caption.Other.Last Active Hist Seq'),
			name3 : 'lastActiveHistSeq'
		} ];

		var tranSublotItems1 = [];
		var tranSublotItems2 = [];
		var tranSublotItems3 = [];
		for ( var i = 0; i < fields.length; i++) {
			tranSublotItems1.push({
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

			tranSublotItems2.push({
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

			tranSublotItems3.push({
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
//		tranSublotItems1.push({
//			xtype : 'container',
//			height : '20'
//		});
		
		return {
			xtype : 'container',
			cls : 'paddingAll7',
			flex : 1,
			//title : T('Caption.Other.Sublot Information'),
			layout : {
				type : 'hbox'
			},
			items : [ {
				xtype : 'container',
				layout : 'anchor',
				flex : 1,
				items : tranSublotItems1
			}, {
				xtype : 'container',
				layout : 'anchor',
				flex : 1,
				items : tranSublotItems2
			}, {
				xtype : 'container',
				layout : 'anchor',
				flex : 1,
				items : tranSublotItems3
			} ]
		};
	}

});
