Ext.require([ 'CMN.mixin.Status', 'CMN.mixin.Search', 'CMN.mixin.Vtypes' ]);

Ext.define('CMN.controller.CMNController', {
	extend : 'Ext.app.Controller',

	requires : [ 'CMN.data.proxy.PayloadProxy', 'CMN.plugin.Supplement' ],

	views : [ 'CMN.view.form.DateTimeField', 'CMN.view.form.TimePeriodField',
			'CMN.view.form.DatePeriodField', 'CMN.view.form.DateTimePeriodField', 'CMN.view.common.RowStatic' ],
					
	init : function() {

		this.control({
			'viewport' : {
				afterrender : this.onViewportRendered
			}
		});

		SmartFactory.mixin('CMN.mixin.Status');
		SmartFactory.mixin('CMN.mixin.Vtypes');
	},

	onViewportRendered : function() {
		/* Load시에 사용한 로드 프로그레스바를 제거함 */
		var lp = document.getElementById('_loadprogress');
		if (lp)
			document.body.removeChild(lp);

		if(SF.search) {
			SmartFactory.addSideMenu('CMN.view.common.AppSearchField', {
				store : Ext.create('CMN.store.AppSearchStore')
			});
		}
	}

});