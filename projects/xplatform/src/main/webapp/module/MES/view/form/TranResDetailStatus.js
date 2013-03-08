Ext.define('MES.view.form.TranResDetailStatus', {
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
		
		this.add(this.buildResStatus());

		var self = this;

		this.on('afterrender',function(){
			self.sub('btnClose').on('click', function() {
				self.up().close();
			});
		});
	},

	buttons : [ {
		text : 'Close',
		itemId : 'btnClose'
	} ],

	buildResStatus : function() {

		var fields = [ {
			defLabel : T('Caption.Other.Up/Down Flag'),
			valName : 'resUpDownFlag'			
		}, {
			defLabel : T('Caption.Other.Primary Status'),
			valName : 'resPriSts'
		}, {
			lblName : 'resStsPrt1',
			valName : 'resSts1'
		}, {
			lblName : 'resStsPrt2',
			valName : 'resSts2'
		}, {
			lblName : 'resStsPrt3',
			valName : 'resSts3'
		}, {
			lblName : 'resStsPrt4',
			valName : 'resSts4'
		}, {
			lblName : 'resStsPrt5',
			valName : 'resSts5'
		}, {
			lblName : 'resStsPrt6',
			valName : 'resSts6'
		}, {
			lblName : 'resStsPrt7',
			valName : 'resSts7'
		}, {
			lblName : 'resStsPrt8',
			valName : 'resSts8'
		}, {
			lblName : 'resStsPrt9',
			valName : 'resSts9'
		}, {
			lblName : 'resStsPrt10',
			valName : 'resSts10'
		} ];

		var tranResItems1 = [];
		var record = this.store.getAt(0);
		for ( var i = 0; i < 12; i++) {
			var lbl = '';
			var val = record.get(fields[i].valName);
			if(fields[i].defLabel){
				lbl = fields[i].defLabel;
			}else{
				lbl = record.get(fields[i].lblName) || ' ';
			}
			
			tranResItems1.push({
				xtype : 'textfield',
				fieldLabel : lbl,
				value : val,
				labelWidth : 140,
				labelSeparator : '',
				anchor : '100%',
				readOnly : true,
				submitValue : false
			});
		}
		
		return {
			xtype : 'container',
			cls : 'paddingAll7',
			flex : 1,
			layout : {
				type : 'hbox'
			},
			items : [ {
				xtype : 'container',
				layout : 'anchor',
				flex : 1,
				items : tranResItems1
			}]
		};
	}
});