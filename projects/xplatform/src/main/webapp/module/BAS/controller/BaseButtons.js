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
			if(toolbar.isControlDisabled(button.itemId)===true){
				button.setDisabled(true);
			}			
		});
	},
	
	onButtonClicked : function(button) {		
		var owner = button.up('bas_base_buttons').getOwner();
		if(button.itemId) {
			owner.fireEvent(button.itemId, owner);
		}
	},
	
	onButtonEnable : function(button){
		var toolbar = button.up('bas_base_buttons');
		if(toolbar.isControlDisabled(button.itemId)===true){
			button.setDisabled(true);
		}
	}
});