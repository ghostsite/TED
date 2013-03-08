Ext.define('BAS.controller.task.EntityList', {
	extend : 'Ext.app.Controller',

	/* public methods */

	onKeyChange : function(view, keys) {
		this.reload(view);
		
		this.controlButtons(view);
		
		view.getSupplement().getForm().reset();

		if(!keys)
			return;
		
		/* Set Supplement Form */
		var temp = {};

		Ext.Object.each(keys.task || {}, function(key, val) {
			var name = 'task[' + key + ']';
			if (temp[name]) {
				if (temp[name] instanceof Array)
					temp[name].push(val);
				else
					temp[name] = [ temp[name], val ];
			} else {
				temp[name] = val;
			}
		});

		view.getSupplement().getForm().setValues(keys);
		view.getSupplement().getForm().setValues(temp);
	},
	
	onActivate : function(view) {
		this.reload(view);
	},

	/* Task View Event Handler */
	
	onTaskView : function(view, task) {
		switch(task.status) {
		case 'created' :
			SF.doMenu({
				viewModel : SF.task.get(task.taskType, 'task.request.' + task.reqType + '.edit'),
				keys : {
					taskType : task.taskType,
					taskId : task.taskId,
					reqType : task.reqType
				}
			});
			return;
		default :
			SF.doMenu({
				viewModel : SF.task.get(task.taskType, 'task.request.' + task.reqType + '.view'),
				keys : {
					taskType : task.taskType,
					taskId : task.taskId,
					reqType : task.reqType
				}
			});
		}
	},

	/* Button Event Default Handlers */
	
	onBtnClose : function(view) {
		view.close();
	},

	onBtnExport : function(view) {
		/* 파일 Export는 Entity List를 가져오는 조건 로직과 동일해야 한다. */
		var service = SF.task.get(view.taskType, 'entity.export.service');
		if (!service) {
			SF.warn('Export Not Defined', {
				taskType : view.taskType
			});
			return;
		}

		var params = Ext.clone(view.getKeys()) || {};
		delete params.task;
		
		/* 
		 * Remove Empty Value Parameter 
		 */
		Ext.Object.each(params, function(key, val) {
			if(!val)
				delete params[key];
		});

		/*
		 * complementLoadParams는 리스트 검색 조건에 무조건 추가되어야 하는 파라미터들을 추가하는 역할을 한다.
		 * 참고) supplement 에 검색 조건으로 (Hidden)으로 추가하는 식으로 보완하는 방법은 좋지 않다. 리스트 조회는 여러 route로 실행될 수 있기 때문이다.
		 */
		this.complementLoadParams(view, params);

		params.procstep = service.procstep || '1';

		SF.exporter.doExport('service/' + service.name + '.xls', view.title, view.down('grid'), params);
	},

	onBtnAddNew : function(view) {
		SF.doMenu({
			viewModel : SF.task.get(view.taskType, 'task.request.create.edit'),
			keys : {
				reqType : 'create',
				taskType : view.taskType
			}
		});
	},

	onBtnImport : function(view) {
		SF.doMenu({
			viewModel : SF.task.get(view.taskType, 'task.request.import.edit'),
			keys : {
				reqType : 'import',
				taskType : view.taskType
			}
		});
	},
	
	onBtnRefresh : function(view) {
		this.reload(view);
	},

	/* Supplement Event Default Handlers */
	
	onSupBtnView : function(sup) {
		var queryString = sup.getValues(true);
		
		/* FIXME fromQueryString cannot handle Array type Parameters */
		sup.getSupplementClient().setKeys(Ext.Object.fromQueryString(queryString, true));
	},
	
	onSupBtnReset : function(sup) {
		sup.getForm().reset();
	},

	/* Entity Events (View, Edit, Delete) Default Handlers */
	
	onEntityEdit : function(view, item) {
		var keys = {
			reqType : 'update',
			taskType : view.taskType
		};

		var params = SF.task.get(view.taskType, 'entity.view.service.params');
		/*
		 * 의미적인 키를 만들기 위해서, 매핑된 데이타 아이템에서 값을 가져온다.
		 */
		Ext.Object.each(params, function(key, value) {
			keys[key] = item[value];
		});

		SF.doMenu({
			viewModel : SF.task.get(view.taskType, 'task.request.update.edit'),
			keys : keys
		});
	},

	onEntityView : function(view, item) {
		var keys = {};

		var params = SF.task.get(view.taskType, 'entity.view.service.params');
		/*
		 * 의미적인 키를 만들기 위해서, 매핑된 데이타 아이템에서 값을 가져온다.
		 */
		Ext.Object.each(params, function(key, value) {
			keys[key] = item[value];
		});

		SF.doMenu({
			viewModel : SF.task.get(view.taskType, 'entity.view.view'),
			keys : keys
		});
	},

	onEntityDelete : function(view, item) {
		var keys = {
			reqType : 'delete',
			taskType : view.taskType
		};

		var params = SF.task.get(view.taskType, 'entity.view.service.params');
		/*
		 * 의미적인 키를 만들기 위해서, 매핑된 데이타 아이템에서 값을 가져온다.
		 */
		Ext.Object.each(params, function(key, value) {
			keys[key] = item[value];
		});

		SF.doMenu({
			viewModel : SF.task.get(view.taskType, 'task.request.delete.edit'),
			keys : keys
		});
	},
	
	/* private methods */

	reloadEntity : function(view) {
		var params = Ext.clone(view.getKeys()) || {};
		delete params.task;
		
		params.procstep = SF.task.get(view.taskType, 'entity.list.store.procstep') || '1';

		/* 
		 * Remove Empty Value Parameter 
		 */
		Ext.Object.each(params, function(key, val) {
			if(!val)
				delete params[key];
		});

		/*
		 * complementLoadParams는 리스트 검색 조건에 무조건 추가되어야 하는 파라미터들을 추가하는 역할을 한다.
		 * 참고) supplement 에 검색 조건으로 (Hidden)으로 추가하는 식으로 보완하는 방법은 좋지 않다. 리스트 조회는 여러 route로 실행될 수 있기 때문이다.
		 */
		this.complementLoadParams(view, params);

		view.getEntityStore().proxy.extraParams = params;
		view.getEntityStore().load();
	},
	
	reloadTask : function(view) {
		var params = Ext.clone(view.getKeys()) || {};

		params.procstep = '1';
		if(!params.task)
			params.task = {};
		
		/* 
		 * 리스트 view의 configuration에 processId 가 설정된 경우에는,
		 * 서버에서 Task List를 ProcessId로 조회하도록 하기 위해서 prcId 파라미터로 전달한다.
		 */
		if(view.processId)
			params.task.prcId = view.processId;
		
		params.task.taskType = view.taskType;
		
		/* 
		 * Remove Empty Value Parameter 
		 */
		Ext.Object.each(params.task, function(key, val) {
			if(!val)
				delete params.task[key];
		});

		this.complementLoadParams(view, params);

		view.getTaskStore().proxy.extraParams = params;
		view.getTaskStore().load();
	},

	reload : function(view) {
		this.reloadEntity(view);
		this.reloadTask(view);
	},
	
	controlButtons : function(view) {
		/* Hide Import Button if this entity type doesn't support import */
		var btnImport = view.down('button#btnImport');
		if (btnImport)
			btnImport.setVisible(!!SF.task.get(view.taskType, 'task.request.import'));
	},
	
	complementLoadParams : Ext.emptyFn
});
