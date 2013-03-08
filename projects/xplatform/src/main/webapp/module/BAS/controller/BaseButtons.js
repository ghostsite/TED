Ext.define('BAS.controller.BaseButtons', {
	extend : 'Ext.app.Controller',

	views : [ 'BAS.view.common.BaseButtons' ],

	init : function() {
		this.control({
			'bas_base_buttons button' : {
				click : this.onButtonClicked
			}
		});
	},
	
	onButtonClicked : function(button) {		
		var owner = button.up('bas_base_buttons').getOwner();
		if(button.itemId) {
			owner.fireEvent(button.itemId, owner);
		}
	}
});