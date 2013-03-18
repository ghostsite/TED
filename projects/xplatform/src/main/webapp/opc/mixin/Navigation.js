Ext.define('Opc.mixin.Navigation', {
	constructor : function(config) {
		function createView(view, config){
			var comp = null;
			if (typeof (view) === 'string') {
				var secChecked = SF.isAssemblyName(view);
				config.secChecked = secChecked;
				var secControlList = {};
				var result = '';
				if(secChecked === true){
					var params = {
							procstep : '1',
							programId : SF.login.programId,
							funcName : view
					};
					Ext.Ajax.request({
						showFailureMsg : false,
						url : 'service/secViewFunctionDetail.json',
						method : 'POST',
						jsonData : params,
						async : false,
						success : function(response, opts) {
							result = Ext.JSON.decode(response.responseText) || {};
							if (result.success) {
								for ( var i = 1; i <= 10; i++) {
									var ctlName = result['ctlName' + i];
									if (ctlName)
										secControlList[ctlName] = result['ctlEnFlag' + i] || ''; // 'Y' or other
								}
							}
							else{
								errMsg = result.msg;
							}
						}
					});
				}
				else if(secChecked === false){
					SF.error('SEC-0008');
					return false;
				}
				
				config.secControlList = secControlList;
				comp = Ext.create(view, config);
				return comp;
			}
			else{
				return view;
			}
		}
		function go(viewModel, keys) {
			if (!Opc.controller.Navigator.uniqview) {
				SF.error('SYS-E000');
				return;
			}
			if(!viewModel) {
				SF.error('SYS-E002');
				return;
			}
			
			var screen = null;
			
			if (Ext.isString(viewModel)) {
				if(!Ext.ClassManager.get(viewModel)) {
					var controller = viewModel.replace('.view.', '.controller.');
					Opc.controller.Navigator.unique.getController(controller).init();
				}
				
				try{
					screen = Opc.controller.Navigator.uniqview.getComponent(viewModel);
					if(!screen){
						var newView = createView(viewModel, {
							itemId : viewModel,
							header : false
						});
						 if(newView === false){
							 return false;
						 }
						SF.normal('Ready');
						screen = Opc.controller.Navigator.uniqview.add(newView);
					}
					Opc.controller.Navigator.unique.getPageTitle().setText(screen.title);
				} catch(e) {
					SF.error('SYS-E001', {
						view : viewModel
					}, e);
					return;
				}
			}
			
			if(screen.setKeys) {
				screen.setKeys(keys);
			} else {
				SF.history.add(viewModel, keys);
			}
			
			Opc.controller.Navigator.uniqview.getLayout().setActiveItem(screen);

			SF.setting.set('opc-lastscreen', viewModel);
			
			Opc.controller.Navigator.uniqview.fireEvent('checkfavor');
		}
		
		function popup(viewModel, keys) {
			if (!Opc.controller.Navigator.uniqview) {
				SF.error('SYS-E000');
				return;
			}
			if(!viewModel) {
				SF.error('SYS-E002');
				return;
			}
			
			var screen = null;
			
			if (Ext.isString(viewModel)) {
				
				if(!Ext.ClassManager.get(viewModel)) {
					var controller = viewModel.replace('.view.', '.controller.');
					Opc.controller.Navigator.unique.getController(controller).init();
				}
				
				try{
					screen = Ext.create(viewModel);
					screen.show();
				} catch(e) {
					SF.error('SYS-E001', {
						view : viewModel
					}, e);
					return;
				}
			}
			
			if(screen.setKeys) {
				screen.setKeys(keys);
			}
		}
		
		return {
			go : go,
			popup : popup
		};
	}
});