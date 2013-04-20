Ext.define('TES.view.StarRating', {
	extend : 'MES.view.form.BaseForm',
	title : 'StarRating',
	xtype : 'tes_starrating',

	requires : [ 'Ext.ux.form.field.StarRating' ],
	
	initComponent : function() {
		this.callParent();
	},

	buildForm : function() {
		return Ext.create('Ext.panel.Panel', {
			width : 400,
			height : 350,
			title : '路漫漫',
			bodyPadding : 10,
			defaultType : 'sliderfield',
			border: false,
			defaults : {
				labelAlign : 'top',
				labelWidth : 200,
				anchor : '100%'
			},
			items : [{
				xtype : 'ratingfield',
				startText : '开始',
				endText : '结束',
				value : 3,
				items : [0, 1, 2, 3, 4, 5, 6, 7, 8],
				fieldLabel : 'Facilidade de utiliza'
			}, {
				xtype : 'ratingfield',
				items : [0, 1, 2, 3, 4, 5],
				fieldLabel : 'Organizao das informaes'
			}, {
				xtype : 'ratingfield',
				items : [{
					value : 1,
					text : 'Difcil'
				}, {
					value : 2,
					text : 'Regular'
				}, {
					value : 3,
					text : 'Bom'
				}, {
					value : 4,
					text : 'Fcil'
				}],
				fieldLabel : 'Layout das telas'
			}, {
				xtype : 'ratingfield',
				value : 1,
				fieldLabel : 'Nomenclatura utilizada nas telas (nome de comandos, ttulos, campos, etc.)'
			}, {
				xtype : 'ratingfield',
				value : 5,
				fieldLabel : 'Mensagens do sistema'
			}, {
				xtype : 'ratingfield',
				value : 2,
				fieldLabel : 'Assimilao das informaes'
			}]
		});
	}
});