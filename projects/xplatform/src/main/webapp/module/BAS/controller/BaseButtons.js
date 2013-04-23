Ext.define('BAS.controller.BaseButtons', {
	extend : 'Ext.app.Controller',

	views : [ 'BAS.view.common.BaseButtons' ],

	refs : [ {
		selector : 'bas_base_buttons',
		ref : 'baseButtons'
	} ] ,
	
	init : function() {
		this.control({
			'bas_base_buttons' : {
				added : this.onAdded
			},
			'bas_base_buttons button' : {
				click : this.onButtonClicked
			}
		});
	},

	onAdded : function(toolbar, owner, pos){
	},
	
	onButtonClicked : function(button) {		
		var owner = button.up('bas_base_buttons').getOwner();
		if(button.itemId) {
			owner.fireEvent(button.itemId, owner);
		}
	}
	
});