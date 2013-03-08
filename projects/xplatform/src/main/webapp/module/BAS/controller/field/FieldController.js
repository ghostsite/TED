Ext.define('BAS.controller.field.FieldController', {
	extend : 'Ext.app.Controller',

	requires : [ 'BAS.controller.field.FieldView', 'BAS.controller.field.FieldEdit', 'BAS.controller.field.FieldList' ],

	stores : [ ],
	models : [ ],
	views : [ 'field.FieldView', 'field.FieldEdit', 'field.FieldList' ],

	controlSets : [ 'FieldView', 'FieldEdit', 'FieldList' ],
	               
	init : function() {
		this.control({
			'viewport' : {
				afterrender : this.onViewportRendered
			}
		});
		
		var self = this;
		
		Ext.each(this.controlSets, function(set) {
			var controller = self.getController('BAS.controller.field.' + set);
			controller.init();
		});
	},

	onViewportRendered : function() {
	}
});
