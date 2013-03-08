/**
 * @class BAS.controller.BASController
 * @extends Ext.app.Controller
 * @author Kyunghyang
 */

Ext.define('BAS.controller.BASController', {
	extend : 'Ext.app.Controller',

	requires : [ 'BAS.controller.BaseButtons', 'BAS.mixin.GlobalOption', 'BAS.view.common.AttributeStatusGrid' ],

	stores : [],
	models : [],
	views : [ 'BAS.view.common.AttributeStatusGrid', 'BAS.view.common.BaseSupplement' ],

	controlSets : [ 'BaseButtons' ],

	init : function() {
		this.control({
			'viewport' : {
				afterrender : this.onViewportRendered
			}
		});

		SF.mixin('BAS.mixin.GlobalOption');

		var self = this;

		Ext.each(this.controlSets, function(set) {
			var controller = self.getController('BAS.controller.' + set);
			controller.init();
		});
	},

	onViewportRendered : function() {
	}
});
