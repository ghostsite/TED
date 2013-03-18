Ext.define('Opc.controller.BaseButtons', {
	extend : 'Ext.app.Controller',

	views : [ 'Opc.view.BaseButtons' ],

	refs : [ {
		selector : 'base_buttons',
		ref : 'baseButtons'
	} ] ,
	
	init : function() {
		this.control({
			'base_buttons' : {
				added : this.onAdded
			},
			'base_buttons button' : {
				click : this.onButtonClicked,
				enable : this.onButtonEnable
			}
		});
	},
	
	onAdded : function(toolbar, owner, pos){
		//버튼 권한 설정
		var option = SF.option.get('MP_ControllBlackList')||{};
		toolbar.useBlackList = option.value1 || ''; //권한 적용 방식
		toolbar.secControlList = owner.secControlList ||{}; //권한설정버튼 목록
		toolbar.secChecked = owner.secChecked;
		
		toolbar.items.each(function(button, index, length){
			if(toolbar.isControlDisabled(button.name)===true){
				button.setDisabled(true);
			}			
		});
	},
	
	onButtonClicked : function(button) {		
		var owner = button.up('base_buttons').getOwner();

		if(button.name) {
			owner.fireEvent(button.name, owner);
		}
	},
	
	onButtonEnable : function(button){
		var toolbar = button.up('base_buttons');
		if(toolbar.isControlDisabled(button.name)===true){
			button.setDisabled(true);
		}
	}
});