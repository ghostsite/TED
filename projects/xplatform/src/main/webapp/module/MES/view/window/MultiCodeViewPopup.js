Ext.require(['Ext.selection.CheckboxModel']);
Ext.define('MES.view.window.MultiCodeViewPopup', {
	extend : 'Ext.window.Window',
	width : 450,
	height : 327,
	modal : true,
	layout : {
		type : 'vbox',
		align : 'stretch'
	},

	/*
	 * 컨포넌트가 생성될때 필요한 설정값을 정의한다.
	 */
	constructor : function(config) {
		var configs = config || {};

		if (!configs.codeviewOpts)
			throw new Error('codeviewOpts should be configured.');
		if (configs.codeviewOpts.popupConfig == undefined)
			throw new Error('codeviewOpts[popupConfig] should be configured.');
		if (configs.codeviewOpts.type !== 'gcm' && configs.codeviewOpts.type !== 'table'){
			Ext.Msg.alert('Compnent Error','Codeview type should be "gcm" or "table"');
			throw new Error('codeview type should be "gcm" or "table"');
		}
		if (!configs.codeviewOpts.table)
			throw new Error('codeviewOpts[table] should be configured.');
		if (configs.codeviewOpts.popupConfig.columns.length <= 0)
			throw new Error('codeviewOpts[columns] should be configured.');
		else {
			var columns = configs.codeviewOpts.popupConfig.columns;
			var conditions = Ext.clone(configs.codeviewOpts.condition);
			var select = [];
			for ( var i in columns) {
				var col = columns[i];
				if (col.dataIndex)
					select.push(col.dataIndex);
				if (!col.flex)
					col.flex = 1;
			}
			var selectCondition = [];
			if (conditions && conditions.length) {
				for ( var j in conditions) {
					if (conditions[j].column)
						selectCondition.push(conditions[j].column);
				}
			}

			configs.codeviewOpts.select = Ext.Array.merge(select, selectCondition);
		}
		// ie일경우 레코드 사이즈 변경으로 인한 선택표시 어긋남 수정함...
		if (Ext.ieVersion >= 7) {
			configs.height = 327 + 10;
		}
		this.callParent([ configs ]);
	},

	/*
	 * 컨포넌트가 실행될때 초기 설정 값을 정의한다. - title : 팝업에 표시할 제목 - store : 조회조건을 설정 후
	 * store를 생성. - grid : 팝업에 표시될 gird 컨포넌트를 설정. - search : 특정 컬럼의 값을 조회 조건으로
	 * 추가하여 설정 - loadStore : 조회 결과를 읽어와 화면 grid를 갱신한다.
	 */
	initComponent : function() {
		this.callParent();
		var self = this;

		this.title = this.codeviewOpts.popupConfig.title || T('Caption.Other.CodeView');
		this.store = this.buildStore();
		

		this.grid = this.add(this.buildGrid(this.store));
		this.pagebar = this.add(this.buildPagebar(this.store));
		this.pagebar.down('#refresh').hide();
		this.add(this.buildToolbar());
		
		this.store.on('load', function(store, records, success) {
			if (!success)
				return;
			// afterLoad 함수는 store의 데이터를 변경을 원할 경우사용된다.
			if (Ext.typeOf(self.codeviewOpts.afterLoad) == 'function') {
				if (self.codeviewOpts.scope)
					self.codeviewOpts.afterLoad.call(self.codeviewOpts.scope, store, self, self.codeviewOpts.afterLoadOpt);
				else
					self.codeviewOpts.afterLoad(store, self, self.codeviewOpts.afterLoadOpt);
			}

			if (store.getCount() < 1) {
				// TODO popup 강제 종료여부
			}
			var totCount = store.totalCount||0;
			var pageData = self.pagebar.getPageData();
			var pageCount = pageData.pageCount;
			if(isNaN(pageCount) || pageCount < 2){
				self.pagebar.setVisible(false);
			}
			else if(totCount>0){
				self.pagebar.setVisible(true);
			}
			self.selectSearchRecord(self);	
		});
		this.on('destroy',function(me){
			self.store.clearListeners();
		});
		self.loadStore(true);
	},

	
	/* 화면 갱신 및 조회시 해당 레코드 표시 */
	selectSearchRecord : function(self) {
		self = self||this;
		var fieldSearch = self.codeviewOpts.fieldSearch;
		var fieldset = self.codeviewOpts.fieldset;
		var separator = fieldset.separator;
		var valueList = [];
		var column = '';
		if (fieldSearch === true) {
			var field = fieldset.getComponent( fieldset.itemId+'_0' );
			var txtValue = field.getValue();
			column = field.column;
			valueList = txtValue.split(separator);
		}
		if(!column || valueList.length < 1)
			return false;
		
		var grid = self.grid;
		var selectRecord = [];
		var selModel = grid.getSelectionModel();

		for(var i in valueList){
			var value =  Ext.String.trim(valueList[i]);
			var findRecord = grid.store.findRecord(column,value);
			
			if(findRecord){
				selectRecord.push(findRecord);
			}
		}
		
		if (selectRecord.length > 0) {
			selModel.select(selectRecord);
		}
	},
	/*
	 * CodeViewField의 값을 팝업 실행시 초기 검색조건으로 추가한 후 컨포넌트의 store를 읽어 온다. @param
	 * {Boolean} fieldSearch 검색조건 추가 여부
	 */
	//TODO store.load 후에 callback로 서비스 실패가 떨어지면 window를 close한다.
	loadStore : function(reload) {
		if (reload) {
			this.store.currentPage = 1;
			
			var proxy = this.store.getProxy();

			var conditions = Ext.clone(this.codeviewOpts.condition);
			
			if (conditions.length > 0)
				proxy.extraParams.condition = conditions;
			else
				delete proxy.extraParams.condition;
			this.store.load({
				callback : function(records, oper, success){
					if(success == false){
						this.close();
					}
				},
				scope : this
			});
		} else {
			this.selectSearchRecord(this);
		}
	},

	/*
	 * 조회 조건에 맞게 설정 후 store를 생성한다.
	 */
	buildStore : function() {
		var url = this.codeviewOpts.url || 'service/basViewCodeList.json';
		var params = this.codeviewOpts.params || {
			procstep : '1',
			select : this.codeviewOpts.select,
			table : this.codeviewOpts.table,
			type : this.codeviewOpts.type
		};

		if (this.codeviewOpts.url == undefined) {
			if (this.codeviewOpts.factory)
				params.factory = this.codeviewOpts.factory;

			if (this.codeviewOpts.order)
				params.order = this.codeviewOpts.order;

			if (this.codeviewOpts.condition)
				params.condition = this.codeviewOpts.condition;

			if (this.codeviewOpts.factoryConditionEnabled === false)
				params.factoryConditionEnabled = this.codeviewOpts.factoryConditionEnabled;
		}

		return Ext.create('Ext.data.Store', {
			autoLoad : false,
			remoteFilter : true,
			// remotePaging : true,
			filterOnLoad : false,
			fields : this.codeviewOpts.select,
			pageSize : 1000, // 기본 1000개
			proxy : {
				type : 'payload',
				api : {
					read : url
				},
				actionMethods : {
					read : 'POST'
				},
				extraParams : params,
				reader : {
					type : 'json',
					root : 'list',
					totalProperty : 'total'
				}
			}
		});
	},

	/*
	 * 팝업 화면에 표시될 gird를 생성한다. 해당 코드를 선택시 팝업은 사라지고 해당 코드값은 CodeViewField에 표시된다.
	 */
	buildGrid : function(store) {
		var self = this;
		var grid = {
			xtype : 'grid',
			itemId : 'grdCodeview',
			selModel : Ext.create('Ext.selection.CheckboxModel'),
			store : store,
			flex : 1,
			sortableColumns : false,
			enableColumnHide : false,
			enableColumnMove : false,
			columnLines : true,
			columns : self.codeviewOpts.popupConfig.columns,
			tbar : [ {
				xtype : 'button',
				itemId : 'btnEmptyField',
				text : T('Caption.Other.Fields Reset'),
				handler : function() {
					self.codeviewOpts.callback.call(self, self.codeviewOpts.fieldset, '');
					Ext.defer(function() {
						self.destroy();
					}, 1);
					return false;
				}
			} ]
		};
		if (self.codeviewOpts.popupConfig.viewConfig) {
			grid.viewConfig = self.codeviewOpts.popupConfig.viewConfig;
		}
		return grid;
	},
	buildPagebar : function(store){
		return {
	        xtype: 'pagingtoolbar',
	        itemId : 'pagebar',
	        store: store,   // same store GridPanel is using
	        displayInfo: true,
	        dock: 'bottom',
	        hidden : true,
	        afterPageText : '/ {0}'
	    };
	},

	buildToolbar : function() {
		var self = this;
		return {
	        xtype: 'toolbar',
	        ui : 'footer',
	        items : [ {
				xtype : 'button',
				width : 70,
				itemId : 'btnInputField',
				text : T('Caption.Other.Input'),
				handler : function(){
					var selModel = self.grid.getSelectionModel();
					var records = selModel.getSelection();
					self.codeviewOpts.callback.call(self, self.codeviewOpts.fieldset, records);
					Ext.defer(function() {
						self.destroy();
					}, 100);
					return false;
				}
			}]
	    };
	},

	/* refresh버튼을 클릭시 화면정보가 갱신된다. */
	tools : [ {
		type : 'refresh',
		tooltip : 'Refresh form Data',
		handler : function(event, toolEl, panel) {
			var codeview = panel.up('window');
			codeview.loadStore(true);
		}
	} ]
});
