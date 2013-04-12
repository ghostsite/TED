/**
 * @class MES.view.window.CodeViewPopup 코드뷰 필드의 버튼을 클릭시 GCM 및 특정 테이블로 부터 코드 정보를
 *        받아 화면에 팝업으로 표시한다. 아래의 설정값을 받아 팝업을 구성한다. codeviewOptions : 호출자로 부터 선언된
 *        설정값. - table : 검색할 태이블 명 - selects : 조회할 테이블의 컬럼 명 - columns : 팝업의
 *        grid에 표시할 columns 설정 값 - title : 팝업의 제목
 * 
 * @extends Ext.window.Window
 * @author kyunghyang
 * 
 */
Ext.define('MES.view.window.CodeViewPopup', {
	extend : 'Ext.window.Window',

	width : 450,
	height : 327,
	modal : true,
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	defaultPageSize : 1000,
	/*
	 * 컨포넌트가 생성될때 필요한 설정값을 정의한다.
	 */
	constructor : function(config) {
		var configs = config || {};
		if (!configs.codeviewOpts)
			throw new Error('codeviewOpts should be configured.');
		if (configs.codeviewOpts.popupConfig == undefined)
			throw new Error('codeviewOpts[popupConfig] should be configured.');
		if (!configs.codeviewOpts.table && configs.codeviewOpts.type != 'service' && configs.codeviewOpts.type != 'sqlquery')
			throw new Error('codeviewOpts[table] should be configured.');
		if (!configs.codeviewOpts.store && configs.codeviewOpts.type == 'service')
			throw new Error('codeviewOpts[store] should be configured.');
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
		if(configs.codeviewOpts.pageSize)
			configs.pageSize = configs.codeviewOpts.pageSize;
		
		this.defaultPageSize =  window.CODEVIEW_PAGESIZE||this.defaultPageSize;
			
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
		this.remoteFilter = true;
		if(this.codeviewOpts.remoteFilter === false)
			this.remoteFilter = false;

		if (this.codeviewOpts.store) {
			this.store = this.buildService();
		} else {
			this.store = this.buildStore();
		}

		this.grid = this.add(this.buildGrid(this.store));
		this.pagebar = this.add(this.buildPagebar(this.store));
		this.pagebar.down('#refresh').hide();
				
		this.search = this.add(this.buildSearch());
		
		this.store.on('load', function(store, records, success) {
			if (!success)
				return;
			if (self.codeviewOpts.type == 'sqlquery' && records[0].get('columns').length > 0) {
				self.sqlGridLoadData(records[0].get('columns'), records[0].get('rows'));
			}
			// afterLoad 함수는 store의 데이터를 변경을 원할 경우사용된다.
			if (Ext.typeOf(self.codeviewOpts.afterLoad) == 'function') {
				if (self.codeviewOpts.scope)
					self.codeviewOpts.afterLoad.call(self.codeviewOpts.scope, store, self, self.codeviewOpts.afterLoadOpt);
				else
					self.codeviewOpts.afterLoad(store, self, self.codeviewOpts.afterLoadOpt);
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

	sqlGridLoadData : function(colList, rows) {
		if (!colList || !rows)
			return;

		var grid = this.grid;
		var data = [];
		var columns = [];
		var fields = [];

		for ( var i in colList) {
			columns.push({
				header : colList[i].name,
				dataIndex : colList[i].name,
				flex : 1
			});

			fields.push(colList[i].name);
		}

		var changeStore = Ext.create('Ext.data.Store', {
			fields : fields
		});

		grid.reconfigure(changeStore, columns);
		for ( var i in rows) {
			var record = {};
			for ( var j in colList) {
				if (rows[i].cols[j] && rows[i].cols[j].data)
					record[colList[j].name] = rows[i].cols[j].data;
			}
			data.push(record);
		}

		grid.store.loadData(data);
	},

	getSearchFilters : function() {
		var filter = [];
		this.search.items.each(function(searchfield) {
			var value = searchfield.getValue();
			if(value){
				filter.push({
					property : searchfield.getName(),
					value : value
				});				
			}
		}, this);
		return filter;
	},
	getSearchConditions : function(conditions) {
		this.search.items.each(function(searchfield) {
			var value = searchfield.getValue();
			if (value) {
				conditions.push({
					column : searchfield.getName(),
					value : value + '%',
					operator : 'like'
				});
			}
		}, this);
		return conditions;
	},
	
	/* 화면 갱신 및 조회시 해당 레코드 표시 */
	selectSearchRecord : function(self) {
		self = self||this;
		var grid = self.grid;
		var select = [];
		var selModel = grid.getSelectionModel();
		// 전에 선택된 row에 index 저장
		var beforeIndex = selModel.getLastSelected() ? selModel.getLastSelected().index : -1;
		
		self.search.items.each(function(searchfield) {
			var name = searchfield.getName() || '';
			var value = searchfield.getValue() || '';

			if (Ext.isEmpty(name) == false && Ext.isEmpty(value) == false) {
				select.push({
					column : searchfield.getName(),
					value : searchfield.getValue()
				});
			}
		});

		if(beforeIndex > -1 && !selModel.hasSelection()){
			beforeIndex = -1;
		}
		var pageData = self.pagebar.getPageData();
		var currentPage = pageData.currentPage;
		if(currentPage>1&&beforeIndex>-1){
			beforeIndex = beforeIndex-pageData.fromRecord+1;
		}
		function findBy(record, id) {
			var bMatch = false;

			Ext.Array.each(select, function(item) {
				var value = record.get(item.column);
				var selectValue = item.value;
				
				if (Ext.typeOf(value) == 'string') {
					//대소문자 구분없이 검색
					value = value.toLowerCase();
					selectValue = selectValue.toLowerCase();
					if (value.indexOf(selectValue) > -1) {
						bMatch = true;
					} else {
						bMatch = false;
						return false;
					}
				} else {
					if (value == selectValue) {
						bMatch = true;
					} else {
						bMatch = false;
						return false;
					}
				}
			});
			return bMatch;
		}
		
		var findIndex = grid.store.findBy(findBy, grid.store, beforeIndex+1);
		
		/* 마지막 아이템을 찾지 못하면, 처음부터 한번 더 검색한다. */
		if(findIndex === -1 && beforeIndex !== -1) {
			findIndex = grid.store.findBy(findBy);
		}

		if (findIndex > -1) {
			// 검색 조건에 맞는 row select
			selModel.select(findIndex);
			//var record = selModel.getLastSelected();
		}
	},
	/*
	 * CodeViewField의 값을 팝업 실행시 초기 검색조건으로 추가한 후 컨포넌트의 store를 읽어 온다. @param
	 * {Boolean} fieldSearch 검색조건 추가 여부
	 */
	//TODO store.load 후에 callback로 서비스 실패가 떨어지면 window를 close한다.
	loadStore : function(reload) {
			this.store.filters.clear();
			this.store.currentPage = 1;
			
			if (this.codeviewOpts.type == 'service') {
				var filters = this.getSearchFilters()||[];
				if(reload || filters.length < 1){
					this.store.load({
						callback : function(records, oper, success){
							if(success == false){
								this.close();
							}
						},
						scope : this
					});					
				}
				else{
					this.store.filter(filters);
					if(this.remoteFilter === false){
						this.store.reload();
					}
				}

			} else {
				var proxy = this.store.getProxy();

				var conditions = Ext.clone(this.codeviewOpts.condition);
				conditions = this.getSearchConditions(conditions);

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
			}
		//} else {
		//	this.selectSearchRecord(this);
		//}
	},
	
	buildService : function() {
		var store = '';
		if (Ext.typeOf(this.codeviewOpts.store) == 'string')
			store = Ext.create(this.codeviewOpts.store, {
				remoteFilter : this.remoteFilter,
				filterOnLoad : false
			});
		else{
			store = this.codeviewOpts.store;
		}
		
		store.pageSize =  this.pageSize||this.defaultPageSize;
		store.proxy.extraParams = this.codeviewOpts.params;
		return store;
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
			remoteFilter : this.remoteFilter,
			filterOnLoad : false,
			fields : this.codeviewOpts.select,
			pageSize : this.pageSize||this.defaultPageSize, // 기본 1000개
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
			store : store,
			flex : 1,
			sortableColumns : false,
			enableColumnHide : false,
			enableColumnMove : false,
			columnLines : true,
			columns : self.codeviewOpts.popupConfig.columns,
			listeners : {
				itemclick : function(grid, record, item, index, eOpts) {
					self.codeviewOpts.callback.call(self, self.codeviewOpts.fieldset, record);
					// 처리도중 destroy 하면 오류가 발생하여 wait time 추가
					Ext.defer(function() {
						self.destroy();
					}, 1);
					return false;
				}
			},
			tbar : [ {
				xtype : 'button',
				itemId : 'btnEmptyField',
				text : T('Caption.Other.Fields Reset'),
				handler : function() {
					var record = Ext.ModelManager.create({}, self.store.model);
					if (record) {
						for ( var i in record.data) {
							record.data[i] = '';
						}
						self.codeviewOpts.callback.call(self, self.codeviewOpts.fieldset, record);
					}
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
	/*
	 * 팝업내 특정 컬럼을 조회하는 windowSearchField를 생성한다. 기본 조건에 해당 조회 조건을 추가하여 store를 읽어
	 * 올때 적용된다.
	 */
	buildSearch : function() {
		var self = this;
		var fieldSearch = this.codeviewOpts.fieldSearch;
		var columns = this.codeviewOpts.popupConfig.columns;
		var fieldset = this.codeviewOpts.fieldset;
		var items = [];
		for ( var i in columns) {
			var column = columns[i];
			var txtValue = "";
			if (fieldSearch === true) {
				if (fieldset.xtype == 'codeviewcolumn') {
					var colName = column.dataIndex;
					if(Ext.typeOf(fieldset.targetColumn) === 'string' && colName == 'key1'){
							colName = fieldset.targetColumn||colName;	
					}
					txtValue = fieldset.record.get(colName);
				} else {
					var field = fieldset.down('field[column='+column.dataIndex+']');
					if (field && field.column == column.dataIndex)
						txtValue = field.getValue();
				}
			}
			// column.dataIndex 컬럼명
			items.push({
				listeners : {
					specialkey : function(textfield, e) {
						if (e.getKey() == e.ENTER) {
							self.loadStore();
						}
					},
					change : function(textfield, val){
						self.grid.getSelectionModel().deselectAll();
					}
				},
				xtype : 'textfield',
				name : column.dataIndex,
				value : txtValue,
				hideLabel : true,
				readOnly : column.disabledSearch||false,
				emptyText : column.header,
				flex : column.flex
			});
		}

		return {
			xtype : 'panel',
			height : 39,
			cls : 'windowSearchField',
			layout : {
				align : 'stretch',
				type : 'hbox'
			},
			itemId : 'searchFields',
			items : items
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