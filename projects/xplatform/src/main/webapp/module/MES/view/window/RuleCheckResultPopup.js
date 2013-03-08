Ext.define('MES.view.window.RuleCheckResultPopup', {
	extend : 'Ext.window.Window',

	alias : 'widget.rulecheckresult',

	title : T('Caption.Other.Rule Check Result'),
	layout : 'fit',
	width : 700,
	height : 400,

	initComponent : function() {
		this.callParent();

		this.viewResult();

		var self = this;

		this.sub('btnContiune').on('click', function() {
			self.confirm = 'Y';
			self.lock.release();
			self.close();
		});

		this.sub('btnChange').on('click', function() {
			self.confirm = 'N';
			self.lock.release();
			self.close();
		});
	},

	viewResult : function() {
		var charList = this.charList;
		if (charList) {
			var loadList = [];
			Ext.Array.each(charList, function(data1){
				var charId = data1.charId;
				var unitList = data1.unitList;
				Ext.Array.each(unitList, function(data2){
					var item = {};
					var unitId = data2.unitId;
					var specOutType = data2.specOutType;
					if(Ext.isEmpty(specOutType) === false){
						item.charId = charId || '';
						item.unitId = unitId || '';
						if(specOutType == 'W'){
							item.specOutType = "OOW";
							item.rullDesc = SF.cf.setRuleDescription('W');
						}else if(specOutType == 'S'){
							item.specOutType = "OOS";
							item.rullDesc = SF.cf.setRuleDescription('S');
						}
						loadList.push(item);
					}
				});
			});
			
			this.sub('grdRuleCheck').store.loadData(loadList);
		}
	},

	items : {
		xtype : 'form',
		layout : 'fit',
		buttons : [ {
				itemId : 'btnContiune',
				text : T('Caption.Button.Continue')
			}, {
				itemId : 'btnChange',
				text : T('Caption.Button.Data Change')
			} ],
		items : {
			xtype : 'grid',
			itemId : 'grdRuleCheck',
			layout : 'fit',
			autoScroll : true,
			columnLines : true,
			sortableColumns : false,
			enableColumnHide : false,
			enableColumnMove: false,
			store : {
				fields : [ 'charId', 'unitId', 'specOutType', 'rullDesc' ]
			},
			columns : [ {
				xtype : 'rownumberer',
				width : 50,
				header : T('Caption.Other.Seq')
			}, {
				header : T('Caption.Other.Character'),
				dataIndex : 'charId'
			}, {
				header : T('Caption.Other.Unit ID'),
				dataIndex : 'unitId'
			}, {
				header : T('Caption.Other.Rule Type'),
				dataIndex : 'specOutType'
			}, {
				header : T('Caption.Other.Rule Description'),
				dataIndex : 'rullDesc',
				flex : 1
			} ]
		}
	} 
});