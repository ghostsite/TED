/**
 * @class BAS.view.setup.GlobalOptionSetup 시스템 변수에 대한 옵션을 정의하고, 수정, 삭제하는 역활을 한다.
 * @extends WIP.view.common.AbstractEntitySetup
 * @author MyeungKyu You
 * 
 */

/*
 * 2012-07-16 수정 - 김진호
 * tabchange에서 supplement에 refreshGrid시 select 조건을 공유하는 오류수정
 */

Ext.require(['BAS.view.setup.GlobalOptionSetup.OptionPrompt', 'BAS.view.setup.GlobalOptionSetup.OptionSetup']);

Ext.define('BAS.view.setup.GlobalOptionSetup', {
	extend : 'MES.view.form.BaseFormComposite',

	title : T('Caption.Menu.Global Option Setup'),
	
	initComponent : function() {
		this.callParent();
		
		var self = this;
		
		this.on('afterrender', function() {
			
			self.setActiveTab('setup');

			this.on('tabchange',function(tabPanel,newCard, oldCard){
				

				var newSup = newCard.getSupplement();
				var supplementGrid = newSup.sub('grdSupplement');
				var focusRecord = supplementGrid.getSelectionModel().lastFocused;

				var select = {
					column : 'optionName',
					value : focusRecord ? focusRecord.get('optionName') : ''
				};
				newSup.refreshGrid(true, select);
				
				
//				var oldRecord = oldCard.bufRecord;
//				var newSup = newCard.getSupplement();
//				var newRecord =newSup.store.findRecord('optionName',oldRecord.get('optionName'));
//				this.sub('tplMfo').getSelectionModel().lastFocused;
//				newSup.fireEvent('supplementSelected', newRecord);
//				var selModel = newSup.sub('grdSupplement').getSelectionModel();
//				selModel.select(newRecord.index);
			});
		});
			

	},
	buildForms : function(self) {
		self.add(Ext.create('BAS.view.setup.GlobalOptionSetup.OptionPrompt', {
			itemId : 'prompt'
		}));
		self.add(Ext.create('BAS.view.setup.GlobalOptionSetup.OptionSetup', {
			itemId : 'setup'
		}));
	}
});