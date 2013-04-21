Ext.require(['Ext.selection.CheckboxModel']);
Ext.define('MES.view.window.MultiCodeViewPopup', {
	extend : 'Ext.window.Window',
	width : 500,
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
		
		var view = this.add({
			xtype : 'container',
			flex : 1,
			layout : {
				type : 'hbox',
				align : 'stretch'
			},
			items : [this.buildGrid(this.store),  this.buildList() ]
		})

		this.grid = view.sub('grdCodeview');
		this.pagebar = view.sub('pagebar');
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
			if(searchfield.xtype != 'textfield')
				return;
			var value = searchfield.getValue();
			if(value){
				filter.push({
					property : searchfield.getName(),
					value : value
					//value : new RegExp(value)
				});				
			}
		}, this);
		return filter;
	},
	getSearchConditions : function(conditions) {
		this.search.items.each(function(searchfield) {
			if(searchfield.xtype != 'textfield')
				return;
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
		var fieldset = self.codeviewOpts.fieldset;
		var field = fieldset.getComponent( fieldset.itemId+'_0' );
		var column = field.column;
		var listStore = self.sub('grdSelect').store;
		if(!column || listStore.getCount() < 1)
			return false;
		
		var grid = self.grid;
		var selectRecord = [];
		var selModel = grid.getSelectionModel();

		listStore.each(function(rec){
			var value =  Ext.String.trim(rec.data[column]);
			
			var findRecord = null;
			grid.store.findBy(function(r){
				if(r.isEqual(r.get(column), value)){
					findRecord = r;
					return true;
				}
				return false;
			});
			
			if(findRecord){
				selectRecord.push(findRecord);
			}
		});
		if (selectRecord.length > 0) {
			selModel.select(selectRecord);
		}
	},
	/*
	 * CodeViewField의 값을 팝업 실행시 초기 검색조건으로 추가한 후 컨포넌트의 store를 읽어 온다. @param
	 * {Boolean} fieldSearch 검색조건 추가 여부
	 */
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
	},

	buildService : function() {
		var store = '';
		if (Ext.typeOf(this.codeviewOpts.store) == 'string')
			store = Ext.create(this.codeviewOpts.store, {
				remoteFilter : true,
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
		var dataIndex = self.codeviewOpts.popupConfig.columns[0].dataIndex;
		var grid = {
			xtype : 'grid',
			itemId : 'grdCodeview',
			selModel : Ext.create('Ext.selection.CheckboxModel', {
				mode : 'SIMPLE'
			}),
			store : store,
			flex : 1,
			sortableColumns : false,
			enableColumnHide : false,
			enableColumnMove : false,
			columnLines : true,
			columns : self.codeviewOpts.popupConfig.columns,
			listeners : {
				itemclick : function(grid, recrod, item, index, e){
					var value = recrod.get(dataIndex);
					var listStore = self.sub('grdSelect').store;
					var findRecord = null;
					listStore.findBy(function(r){
						if(r.isEqual(r.get(dataIndex), value)){
							findRecord = r;
							return true;
						}
						return false;
					});
					
					if(findRecord){
						listStore.remove([findRecord]);
					}
					else{
						var obj = {};
						obj[dataIndex] = value;
						listStore.add(obj);
					}
				}
			},
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
			}],
			bbar : self.buildPagebar(store)
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
	        displayInfo: false,
	        dock: 'bottom',
	        hidden : true,
	        afterPageText : '/ {0}'
	    };
	},
	buildList : function(){
		var self = this;
		var dataIndex = self.codeviewOpts.popupConfig.columns[0].dataIndex;
		var data = [];
		if(self.inputValue){
			var list = self.inputValue.split(self.codeviewOpts.fieldset.separator);
			for(var i in list){
				var obj = {};
				obj[dataIndex] = list[i];
				data.push(obj);
			}
		}
		var store = Ext.create('Ext.data.Store',{
			fields : [dataIndex],
			data : data
		});
		return {
			xtype : 'panel',
			tbar : ['->', {
				/*
				//iconDelete 에 드레그 했을경우 삭제
				xtype : 'button',
				iconCls : 'iconDelete'
				 */
			}],
			items : {
				xtype : 'dataview',
				itemId : 'grdSelect',
				autoScroll : true,
				width : 150,
				cls : 'codeSelect-list',
				store : store,
				itemSelector : '.codeviewSelected',
				overItemCls : 'codeSelect-item-hover',
				dragItemClass : 'btnDnD',
				tpl : '<tpl for="."><div class="codeviewSelected">'
					+ '<span>{'+dataIndex+'}</span>' + '<button class = "btnDnD"></button>' + '</div></tpl>',
				listeners : {
					itemclick : function(view, rec, item, index, e) {
						store.remove([rec]);
						var grid = self.sub('grdCodeview');
						var value = rec.get(dataIndex);
						
						var findRecord = null;
						grid.store.findBy(function(r){
							if(r.isEqual(r.get(dataIndex), value)){
								findRecord = r;
								return true;
							}
							return false;
						});
						
						var selModel = grid.getSelectionModel();
						selModel.deselect([findRecord]);
						view.refresh();
					},
					render : function(v) {
						self.setDragZone(v, dataIndex);
					}
				}
			}
		};
	},
	setDragZone : function(v, dataIndex) {
		var me = this;
		v.dragZone = Ext.create('Ext.dd.DragZone', v.getEl(), {
			onInitDrag : function(x, y) {
				var clone = '<div>Draging....</div>';
				this.proxy.update(clone);
				this.proxy.setStatus(' ');
				this.onStartDrag(x, y);
				return true;
			},
			onDrag : function(e) {
				var sourceEl = e.getTarget(v.itemSelector);
				if (sourceEl) {
					var tIndex = v.indexOf(sourceEl);
					var tdata = v.getRecord(sourceEl).data || {};
					var data = v.dragData.dragData;
					if (tdata[dataIndex] && data[dataIndex] != tdata[dataIndex]) {
						v.store.removeAt(v.dragData.lastIndex);
						v.store.insert(tIndex, [ data ]);
						v.dragData.lastIndex = tIndex;
						v.refresh();
					}
				}
			},
			onMouseUp : function(e) {
				var sourceEl = e.getTarget(v.itemSelector);
				var target = e.target;
				/*
				 //iconDelete 에 드레그 했을경우 삭제
				if(target.className.match('iconDelete')){
					var value = v.dragData.dragData[dataIndex];
					
					var grid = me.sub('grdCodeview');
					var findRecord = null;					
					grid.store.findBy(function(r){
						if(r.isEqual(r.get(dataIndex), value)){
							findRecord = r;
							return true;
						}
						return false;
					});
					
					var selModel = grid.getSelectionModel();
					selModel.deselect([findRecord]);
					
					var rec = null;
					v.store.findBy(function(r){
						if(r.isEqual(r.get(dataIndex), value)){
							rec = r;
							return true;
						}
						return false;
					});
					v.store.remove([rec]);
					v.refresh();
					return;
				}
				*/
				
				if (sourceEl) {
					var tIndex = v.indexOf(sourceEl);
					var tdata = v.getRecord(sourceEl).data || {};
					var data = v.dragData.dragData;

					if (data[dataIndex] == tdata[dataIndex]) {
						v.store.removeAt(tIndex);
						data.dragItem = '';
						v.store.insert(tIndex, [ data ]);
						v.refresh();
					}
				} else {
					var data = v.dragData.dragData;
					var tIndex = v.dragData.lastIndex;
					var rec = v.store.getAt(tIndex);
					if (rec && rec.data[dataIndex] == data[dataIndex]) {
						v.store.removeAt(tIndex);
						data.dragItem = '';
						v.store.insert(tIndex, [ data ]);
						v.refresh();
					}
				}
			},
			getDragData : function(e) {
				if (v.readOnly)
					return;
				var target = e.target;
				if (target.className == v.dragItemClass) {
					var sourceEl = e.getTarget(v.itemSelector, 10);
					if (sourceEl) {
						var index = v.indexOf(sourceEl);
						var data = v.getRecord(sourceEl).data || {};
						var d = sourceEl.cloneNode(true);
						d.id = Ext.id();
						data.dragItem = true;
						v.refresh();
						return v.dragData = {
							sourceEl : sourceEl,
							lastIndex : index,
							ddel : d,
							dragData : data
						};
					}
				}
			},
			getRepairXY : function() {
				return this.dragData.repairXY;
			}
		});
	},
	
	buildSearch : function() {
		var self = this;
		var fieldSearch = this.codeviewOpts.fieldSearch;
		var columns = this.codeviewOpts.popupConfig.columns;
		var fieldset = this.codeviewOpts.fieldset;
		var items = [];
		for ( var i in columns) {
			var column = columns[i];
			var txtValue = "";
			// column.dataIndex 컬럼명
			items.push({
				listeners : {
					specialkey : function(textfield, e) {
						if (e.getKey() == e.ENTER) {
							self.loadStore();
						}
					},
					change : function(textfield, val){
					//	self.grid.getSelectionModel().deselectAll();
					}
				},
				xtype : 'textfield',
				name : column.dataIndex,
				value : txtValue,
				hideLabel : true,
				emptyText : column.header,
				flex : column.flex
			});
		}
		items.push({
			xtype : 'component',
			width : 65
		},{
			xtype : 'button',
			width : 80,
			height : 15,
			cls : 'marginB3 marginR5',
			itemId : 'btnInputField',
			text : T('Caption.Other.Input'),
			handler : function(){
				var records = self.sub('grdSelect').store.getRange();
				self.codeviewOpts.callback.call(self, self.codeviewOpts.fieldset, records);
				Ext.defer(function() {
					self.destroy();
				}, 100);
				return false;
			}
		});
		return {
			xtype : 'panel',
			height : 39,
			dock : 'bottom',
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