Ext.define('Opc.controller.BaseButtons', {
	extend : 'Ext.app.Controller',

	views : [ 'Opc.view.BaseButtons' ],

	init : function() {
		this.control({
			'base_buttons button' : {
				click : this.onButtonClicked
			}
		});
	},
	
	onButtonClicked : function(button) {		
		var owner = button.up('base_buttons').getOwner();

		if(button.name) {
			owner.fireEvent(button.name, owner);
		}
	}
});