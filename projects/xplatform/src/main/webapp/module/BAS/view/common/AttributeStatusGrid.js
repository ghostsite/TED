/**
 * @class BAS.view.common.AttributeStatusGrid
 * @extexds Ext.container.Container
 * @author Kyunghyang
 * 
 * @cfg attrType 'MATERIAL'
 */

Ext.require('Ext.ux.grid.CheckColumnMES');

/*
 * 2012-07-16 수정 - 김진호 longLengthAttrValueFlag == Y인 record 데이타만 detail 보기 가능
 */
Ext.define('BAS.view.common.AttributeStatusGrid', {
	extend : 'Ext.grid.Panel',

	alias : [ 'widget.bas_attrgrid', 'widget.bas_view_attributestatusgrid' ],
	columnLines : true,
	// autoScroll : true,
	// split : true,
	cls : 'navyGrid',

	constructor : function(config) {
		var configs = config || {};
		Ext.applyIf(configs, {
			attrType : '',
			attrKey : '',
			attrName : '',
			attrFrom : 0,
			attrTo : 2147483647
		});
		this.readOnly = false;
		if(config.readOnly===true)
			this.readOnly = true;
		
		this.plugins =  Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 1
		}),
		this.callParent([ configs ]);
	},

	initComponent : function() {

		this.store = Ext.create('BAS.store.BasViewAttributeValueBriefOut.valueList');

		if (!this.readOnly) {
			this.columns = this.getUpdateColumns();
			this.buttons = [ {
				xtype : 'button',
				width : 80,
				text : T('Caption.Button.Update'),
				itemId : 'btnAttrUpdate'
			}, {
				xtype : 'button',
				width : 80,
				text : T('Caption.Button.Detail'),
				disabled : true,
				itemId : 'btnDetail'
			}, {
				xtype : 'button',
				width : 80,
				text : T('Caption.Button.History'),
				itemId : 'btnHistory'
			}];
		} else {
			this.columns = this.getViewColumns();
			this.buttons = [ {
				xtype : 'button',
				width : 80,
				text : T('Caption.Button.Detail'),
				disabled : true,
				itemId : 'btnDetail'
			}, {
				xtype : 'button',
				width : 80,
				text : T('Caption.Button.History'),
				itemId : 'btnHistory'
			} ];
		}
		
		this.callParent();

		var self = this;

		this.on('select', function(sm, record) {
			if (record) {
				if (record.get('longLengthAttrValueFlag') == 'Y') {
					self.sub('btnDetail').enable();
				} else {
					self.sub('btnDetail').disable();
				}
			}
		});

		if (this.readOnly == 'update') {
			this.sub('btnAttrUpdate').on('click', function() {
				var lock = SF.createLock();
				lock.lock();

				// 값 체크후 정상적인 데이타는 lock.release()
				self.checkCondition(lock);

				lock.ready(function() {
					self.updateAttributeValue();
				});
			});
		}

		this.sub('btnDetail').on('click', function() {
			var selModel = self.getSelectionModel();
			var record = selModel.selected.getAt(0);
			self.onBtnDetail(record.data);
		});

		this.sub('btnHistory').on('click', function() {
			self.onBtnHistory();
		});
	},

	attrLoad : function(params) {
		if (params) {
			Ext.applyIf(params, {
				procstep : '1',
				attrType : this.attrType,
				attrKey : this.attrKey,
				attrFrom : this.attrFrom,
				attrTo : this.attrTo,
				procstep : '1'
			});
			this.attrType = params.attrType;
			this.attrKey = params.attrKey;
			this.store.load({
				params : params,
				showFailureMsg : this.showFailureMsg,
				callback : function(records, operation, success) {
					if (!success)
						return;

					Ext.Array.each(records, function(record) {
						var nullFlag = record.get('nullFlag');
						var attrValue = record.get('attrValue');
						if (nullFlag == 'Y' && attrValue == '') {
							record.set('attrValue', '[Null]');
						}
					});

					this.lastParams = params;
				},
				scope : this
			});
		} else {
			this.store.removeAll();
		}
	},

	updateAttributeValue : function() {
		var store = this.store;
		var updateRecords = store.getUpdatedRecords();

		var valueList = [];
		Ext.Array.each(updateRecords, function(record) {
			var attrValues = {};

			// attrName
			attrValues.attrName = record.get('attrName');
			// lastActiveHistSeq
			attrValues.lastActiveHistSeq = record.get('lastActiveHistSeq');
			// nullFlage
			var nullFlag = record.get('nullFlag') || '';
			if (nullFlag == 'Y') {
				attrValues.nullFlag = 'Y';
			}
			// value
			var newValue = record.get('newAttrValue') || '';
			if (Ext.isEmpty(newValue) === true) {
				// newValue가 없으면 '' 저장
				attrValues.attrValue = '';
			} else {
				attrValues.attrValue = newValue;
			}
			valueList.push(attrValues);
		});

		Ext.Ajax.request({
			url : 'service/BasUpdateAttributeValue.json',
			method : 'POST',
			jsonData : {
				procstep : '1',
				attrType : this.attrType,
				attrKey : this.attrKey,
				valueList : valueList
			},
			success : function(response) {
				var data = Ext.JSON.decode(response.responseText);
				if (data.success) {
					store.reload();
				}
			}
		});
	},

	checkCondition : function(lock) {
		var store = this.store;
		var updateRecords = store.getUpdatedRecords();
		if (updateRecords.length < 1) {
			return false;
		}

		var bNull = false;
		Ext.Array.each(updateRecords, function(record) {
			var nullFalge = record.get('newNullFlag');
			if (nullFalge == 'Y') {
				bNull = true;
				// each 반복 종료
				return false;
			}
		});

		if (bNull === true) {
			Ext.Msg.confirm(T('Caption.Other.Confirm'), T('Message.53'), function(btn) {
				if (btn == 'yes') {
					lock.release();
				}
			});
		} else {
			lock.release();
		}
	},

	onBtnDetail : function(data) {
		var win = Ext.create('BAS.view.inquiry.AttributeDetail', {
			params : {
				procstep : '1',
				attrType : this.attrType,
				attrKey : this.attrKey,
				attrName : data.attrName
			}
		});

		win.show();
	},

	onBtnHistory : function() {
		if (this.attrKey && this.attrType) {
			SF.doMenu({
				viewModel : 'BAS.view.inquiry.AttributeHistory',
				itemId : 'AttributeHistory',
				keys : {
					attrKey : this.attrKey,
					attrType : this.attrType
				}
			});
		}
	},

	getUpdateColumns : function() {
		var self = this;
		return [ {
			xtype : 'rownumberer',
			align : 'center',
			width : 50
		}, {
			header : T('Caption.Other.Name'),
			dataIndex : 'attrName',
			width : 150
		}, {
			header : T('Caption.Other.Description'),
			dataIndex : 'attrDesc',
			flex : 1
		}, {
			header : T('Caption.Other.Current Value'),
			dataIndex : 'attrValue',
			width : 150
		}, {
			header : T('Caption.Other.New Value'),
			dataIndex : 'newAttrValue',
			width : 150,
			editor : {
				xtype : 'textfield',
				selectOnFocus : true
			},
			renderer : function(value, mataData, record) {
				if (record.get('nullFlag') == 'Y') {
					return '[Null]';
				}
				return value;
			}
		}, {
			xtype : 'checkcolumnmes',
			header : T('Caption.Other.Null'),
			dataIndex : 'nullFlag',
			width : 80
		}, {
			type : 'hidden',
			hidden : true,
			dataIndex : 'longLengthAttrValueFlag'
		} ];
	},

	getViewColumns : function() {
		return [ {
			xtype : 'rownumberer',
			align : 'center',
			width : 50
		}, {
			header : T('Caption.Other.Name'),
			dataIndex : 'attrName',
			width : 150
		}, {
			header : T('Caption.Other.Description'),
			dataIndex : 'attrDesc',
			flex : 1
		}, {
			header : T('Caption.Other.Current Value'),
			dataIndex : 'attrValue',
			width : 150
		}, {
			type : 'hidden',
			hidden : true,
			dataIndex : 'longLengthAttrValueFlag'
		} ];
	}
});