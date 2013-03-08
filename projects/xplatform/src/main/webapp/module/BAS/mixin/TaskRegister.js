/*
 * [SAMPLE - Register]
 * SF.task.register('MWipMatDef', {
 *  taskConfig : { // request type 별 화면 및 최종 서비스 정보를 설정한다.
 *  	table : '',
 *  	step : [ {
 *  		index : 0,
 *  		privilege : '000'
 *  	}, {
 *  		index : 1,
 *  		type : '',
 *  		privilege : 'XXXX',
 *  		user : {
 *  			min : 1,
 *  			max : 2,
 *  		}
 *  	}, {
 *  		index : 2,
 *  		privilege : 'YYYY',
 *  		user : {
 *  			min : 2,
 *  			max : 2,
 *  		}
 *  	} ], 
 *  	request : {
 *  		'create' : {
 *  			view : 'HWIP.view.material_com.MaterialComView',
 *  			edit : 'HWIP.view.material_com.MaterialComEdit'
 *  		},
 *  		'update' : {
 *  			view : 'HWIP.view.material_com.MaterialComView',
 *  			edit : 'HWIP.view.material_com.MaterialComEdit'
 *  		},
 *  		'delete' : {
 *  			view : 'HWIP.view.material_com.MaterialComView',
 *  			edit : 'HWIP.view.material_com.MaterialComEdit'
 *  		},
 *  		'import' : {
 *  			view : 'HWIP.view.material_com.MaterialComView',
 *  			edit : 'HWIP.view.material_com.MaterialComEdit'
 *  		},
 *			'process' : {
 * 				view : 'HWIP.view.material_com.MaterialComView',
 * 				edit : 'HWIP.view.material_com.MaterialComEdit'
 * 			}
 *  	},
 *  },
 *  entityConfig : {
 *  	'view' : {
 *  		view : 'HWIP.view.material_com.MaterialComView',
 *  		service : {
 *  			name : '', // View 를 위한 서비스
 *  			procstep : 1
 *  		}
 *  	},
 *  	'list' : {
 *  		view : 'HWIP.view.material_com.MaterialComList',
 *  		store : {
 *  			name : '',
 *  			procstep : 1
 *  		}
 *  	},
 *  	'export' : {
 *  		service : {
 *  			name : 'BasViewDataList',
 *  			procstep : 1
 *  		}
 *  	}
 * 	}
 * });
 * 
 * [SAMPLE - Retrieve]
 * SF.task.get('MWipMatDef');
 * SF.task.viewModel('MWipMatDef');
 * SF.task.editModel('MWipMatDef');
 * SF.task.listModel('MWipMatDef');
 */
Ext.define('BAS.mixin.TaskRegister', function(){
	var registry = {};
	
	function register(taskType, config) {
		registry[taskType] = config;
	}
	
	function types() {
		return Ext.Object.getKeys(registry);
	}
	
	function attr(obj, key) {
		if(!obj)
			return;
		
		if(typeof(key) === 'string')
			return attr(obj, key.split('.'));
		
		var val = obj[key.shift()];
		
		if(key.length == 0)
			return val;
		
		return attr(val, key);
	}
	
	function get(taskType, key) {
		var type = registry[taskType];
		if(!key)
			return type;
		return attr(type, key);
	}
	
	return {
		task : {
			register : register,
			types : types,
			get : get
		}
	};
}());
