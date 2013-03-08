Ext.define('Opc.view.wip.LotInfo', {
    extend: 'Opc.view.BaseForm',

    xtype: 'lotinfo',
    
    title: 'Lot Information',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
	        items : [ {
				xtype : 'container',
				layout : {
					align : 'stretch',
					type : 'hbox'
				},
				items : [ {
					xtype : 'textfield',
					fieldLabel : 'Default Operator',
					labelWidth : 150,
					name : 'dedaultOperator',
					itemId : 'txtOperator',
					width : 550
				}, {
					xtype : 'checkboxfield',
					fieldLabel : '',
					boxLabel : 'Keep Last Operator',
					inputValue : 'Y',
					unCheckedValue : ' ',
					name : 'keepLastOperator',
					itemId : 'chkOperator',
					cls : 'keepChkbox'
				} ]
			}, {
				xtype: 'menuseparator',
				cls : 'marginTB10' 
			}, {
				xtype : 'panel',
				title: 'Work Order Information',
		        layout : 'column',
		        cls : 'infoTable1Column',
		        defaultType: 'textfield',
		        items : [{
		        	fieldLabel: 'label a',
			        name: 'field1'
			    }, {
			    	fieldLabel: 'label b',
			    	name: 'field2',
			    	disabled : 'true'
			    }, {
			    	fieldLabel: 'label c',
			    	name: 'field3'
			    }, {
			    	fieldLabel: 'label d',
			    	name: 'field4'
			    }, {
			    	fieldLabel: 'label e',
			    	name: 'field5'
		        }]
			}]		
        });

        me.callParent(arguments);
    }

});