Ext.define('MES.view.form.SupplementGridForm', {
	extend : 'Ext.panel.Panel',

	alias : [ 'widget.gridsup', 'widget.mes_view_supplementgridform' ],

	cls : 'nav supplement',
	bodyCls : 'paddingAll5',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},

	defaults : {
		labelAlign : 'left'
	},

	initComponent : function() {
		/* grid 갱신시 화면 자동 검색 사용유무 */
		/* 기본값 : false */
		
		if(this.grid.autoFormLoad === false || this.grid.autoFormLoad === true){
			this.autoFormLoad = this.grid.autoFormLoad;
		}else if(!this.autoFormLoad){
			this.autoFormLoad = false;
		}else{
			this.autoFormLoad = true;
		}
	
		/* 화면 갱신시 grid의 데이타 자동 로드 설정 */
		/* 기본값 : true */
		this.autoGridRefresh = this.grid.autoRefresh === false?false:true;
		
		// 기본itemId 설정
		this.grdItemId = 'grdSupplement';
		
		if (this.grid && this.grid.store){
			this.store = this.grid.store;
			this.store.autoLoad = false;
			if(this.grid.itemId){
				this.grdItemId = this.grid.itemId;
			}
			this.store.remoteFilter = this.grid.remoteFilter===false?false:true;
		} 
		this.remoteFilter = this.store.remoteFilter;
		
		this.dockedItems = [ this.zsearchtoolbar(), this.zpagingtoolbar()];
		this.callParent();
		
		if (this.fields || this.hiddenFields) {
			var defaults = Ext.clone(this.defaults);
			defaults.anchor = '100%';
			
			var fieldForm = this.add({
				xtype : 'form',
				layout : 'anchor',
				itemId : 'formFields',
				bodyCls : 'borderRNone borderLNone',
				defaults : defaults,
				items : []
			});
			if (this.fields){
				fieldForm.add(this.fields);
			}
			if (this.hiddenFields) {
				fieldForm.add(this.hiddenFields);
			}
			var formFields = fieldForm.getForm().getFields();
			if (formFields.length > 0) {
				this.formFields = formFields.items;
			}
		}
		this.add(this.zgrid());
		var pagebar = this.sub('pagebar');
		pagebar.insert(0,'->');
		pagebar.remove(10);
		pagebar.insert(10,'->');
		pagebar.sub('refresh').hide();
				
		this.addEvents({
			/**
			 * grid record 선택시 event 밟생
			 * 인자값 : record
			 */
			"supplementSelected" : true 
		});

		var self = this;
		
		this.on('render', function() {
			if(self.autoGridRefresh != false)
				self.refreshGrid(true,false);
		});

		this.sub(this.grdItemId).store.on('datachanged', function(store) {
			self.sub('txtGridCount').setValue(store.totalCount);
		});

//		this.sub('txtSearchField').on('change', function(field, e) {
//			self.refreshGrid(false);
//		});
		this.sub('txtSearchField').on('specialkey', function(field, e) {
			if(e.getKey() == e.ENTER) {
				self.refreshGrid(false);
			}
		});
		this.sub('btnRefresh').on('click', function() {
			var selects = [];
			/**
			 * refresh 버튼 클릭시 최근에 선택된 레코드를 읽어와 표시한다.
			 */
			if(self.selectedRec){
				var grid = self.sub(self.grdItemId);
				for(var i in grid.columns){
					var col = grid.columns[i].dataIndex;
					selects.push({
						column : col,
						value : self.selectedRec.get(col)			
					});
				}
			}
			self.refreshGrid(true,selects);
		});

		this.sub(this.grdItemId).on('itemclick', function(grid, record) {
			self.fireEvent('supplementSelected', record);
			// 선택된 record를 저장
			self.selectedRec = record;
		});
		
		// grid가 갱신시 레코드를 선택하여 화면에 표시 및 이벤트 발생
		this.store.on('load',function(store,records,success){
			if (success && records.length != 0 && self.selectInfo != {} && self.selectInfo.length != 0) {
				var grid = self.sub(self.grdItemId);
				var record = null;
				var select = self.selectInfo;
				
				if (Ext.typeOf(select) == 'number') {
					record = records[select];
				} else if (Ext.typeOf(select) == 'object') {
					// 한개 column의 값을 비교하여 record를 찾기
					var column = select['column'] || '';
					var value = select['value'] || '';
					//params(fieldName , value, startIndex, anyMatch, caseSensitive(대소문자),  exactMatch(완전일치)
					record = grid.store.findRecord(column, value,0,false,true,true);
				} else if (Ext.typeOf(select) == 'array') {
					var findRecord = grid.store.queryBy(function(record, id) {
						var bMatch = false;
						Ext.Array.each(select, function(item) {
							if (record.get(item.column) == item.value) {
								bMatch = true;
							} else {
								bMatch = false;
								return false;
							}
						});
						return bMatch;
					});

					if (findRecord.getAt(0)) {
						record = findRecord.getAt(0);
					}
				}
				
				if (record){
					if(self.autoFormLoad==true){
						/* Supplement Grid 기동시 자동으로 grid store를 load 후 첫 레코드의 정보를 조회 */
						self.fireEvent('supplementSelected', record);
					}
					grid.getSelectionModel().select(record);
				}
				self.selectedRec = record;
				var totCount = store.totalCount||0;
				var pageData = pagebar.getPageData();
				var pageCount = pageData.pageCount;
				if(isNaN(pageCount) || pageCount < 2){
					pagebar.setVisible(false);
				}
				else if(totCount>0){
					pagebar.setVisible(true);
					
					var currPage = pageData.currentPage;
					var afterText = Ext.String.format(pagebar.afterPageText, isNaN(pageCount) ? 1 : pageCount);

					Ext.suspendLayouts();
					pagebar.child('#inputItem').setDisabled(0).setValue(currPage);
					pagebar.child('#afterTextItem').setText(afterText);
					pagebar.child('#first').setDisabled(currPage === 1 || 0);
					pagebar.child('#prev').setDisabled(currPage === 1  || 0);
					pagebar.child('#next').setDisabled(currPage === pageCount  || 0);
					pagebar.child('#last').setDisabled(currPage === pageCount  || 0);
				    Ext.resumeLayouts(true);
				}
			}
		});
	},

	// 리스트내 검색조건 설정
	getGridFilters : function() {
		var filters = [];
		var value = this.sub('txtSearchField').getValue();
		var searchField = '';

		if (this.grid.searchField)
			searchField = this.grid.searchField;
		else
			searchField = this.grid.columns[0].dataIndex;
		
		if(value){
			if(!this.remoteFilter)
				 value = new RegExp(value);
			
			filters.push({
				property : searchField,
				value : value
			});
		}

		if (this.formFields) {
			for ( var i in this.formFields) {
				var field = this.formFields[i];
				if (field.localFilter === true) {
					filters.push({
						property : field.name,
						value : field.getSubmitValue()
					});
				}
			}
		}
		return filters;
	},

	// 리스트 검색 조건 설정
	getGridParams : function() {
		var procstep = this.grid.procstep || '1';

		var params = {
			procstep : procstep
		};

		if (this.formFields) {
			for ( var i in this.formFields) {
				var field = this.formFields[i];
				/*
				 * supplement용이 아닌 main form내에서 사용시 submitValue 충돌방지를 위해 searchValue를 설정하여 사용한다.  
				 */
				if (field.submitValue !== false || field.searchValue === true) {
					params[field.name] = field.getSubmitValue();
				}
			}
		}
		return params;
	},

	//현재 선택된 레코드 반환
	getSelectedRec : function(){
		return this.selectedRec;
	},
	selectRec : function(select){
		var grid = this.sub(this.grdItemId);
		var record = null;
		if(!grid.store.getCount())
			return;
		this.selectInfo = {};
		this.selectedRec = '';
		
		if(Ext.typeOf(select) == 'number' || Ext.typeOf(select) == 'object' || Ext.typeOf(select) == 'array'){
			this.selectInfo = select;
			
			if (Ext.typeOf(select) == 'number') {
				record = grid.store.getAt(select);
			} else if (Ext.typeOf(select) == 'object') {
				var column = select['column'] || '';
				var value = select['value'] || '';
				//params(fieldName , value, startIndex, anyMatch, caseSensitive(대소문자),  exactMatch(완전일치)
				record = grid.store.findRecord(column, value,0,false,true,true);
			} else if (Ext.typeOf(select) == 'array') {
				var findRecord = grid.store.queryBy(function(record, id) {
					var bMatch = false;
					Ext.Array.each(select, function(item) {
						if (record.get(item.column) == item.value) {
							bMatch = true;
						} else {
							bMatch = false;
							return false;
						}
					});
					return bMatch;
				});

				if (findRecord.getAt(0)) {
					record = findRecord.getAt(0);
				}
			}
		}
		if (record){
			grid.getSelectionModel().select(record);
		}
		else{
			grid.getSelectionModel().deselectAll();
		}
		this.selectedRec = record;
	},
	refreshGrid : function(reload,select) {

		var grid = this.sub(this.grdItemId);
		var store = grid.store;
		
		if(Ext.typeOf(select) == 'number' || Ext.typeOf(select) == 'object' || Ext.typeOf(select) == 'array')// || select == 'I' || select == 'U')
			this.selectInfo = select;
		else
			this.selectInfo = {};
		
		store.getProxy().extraParams =  this.getGridParams();
		
		store.filters.clear();
		store.filter(this.getGridFilters());
		
		if (reload && !this.remoteFilter) {
			store.load();
		}
	},
	
	clearGrid : function(){
		var grid = this.sub(this.grdItemId);
		var store = grid.store;
		
		store.removeAll();
	},
	
	// 레코드 자동 검색 설정
	setAutoRecordLoad : function(value){
		this.autoRecordLoad = value;
	},
	// 연결된 폼 자동 갱신 설정
	setAutoFormLoad : function(value){
		this.autoFormLoad = value;
	},
	// 이벤트 추가
	addFieldEventFn : function(itemId, event, fn) {
		this.sub(itemId).on(event, fn);
	},
	// 그리드 설정
	zgrid : function() {
		var grid = {
				xtype : 'grid',
				cls : 'borderB',
				itemId : this.grdItemId,
				flex : 1,
				autoScroll : true,
				columnLines : true,
				store : this.store,
				features : Ext.create('Ext.grid.feature.Grouping', {
					groupHeaderTpl : '{name} ({rows.length} Version{[values.rows.length > 1 ? "s" : ""]})'
				})
			};
		if(this.grid)
			Ext.apply(grid,this.grid);
		//grid.dockedItems = this.zpagingtoolbar();
		return grid;
	},
	zpagingtoolbar : function(){
		return {
	        xtype: 'pagingtoolbar',
	        itemId : 'pagebar',
	        store: this.store,   // same store GridPanel is using
	        dock: 'bottom',
	        beforePageText : '',
	        hidden : true,
	        afterPageText : '/ {0}'
	    };
	},
	zsearchtoolbar : function(){
		return {
			xtype : 'toolbar',
			itemId : 'searchbar',
			dock : 'bottom',
			hidden : this.hiddenSearchbar || false,
			height : 24,
			items : [this.zcount, this.zsearch, this.zrefresh]
		};
	},
	zcount : {
		xtype : 'textfield',
		itemId : 'txtGridCount',
		cls : 'bottomTextField  textAlignCenter',
		disabled : true,
		submitValue : false,
		flex : 1
	},

	zsearch : {
		xtype : 'textfield',
		itemId : 'txtSearchField',
		cls : 'bottomTextField',
		submitValue : false,
		flex : 3
	},

	zrefresh : {
		xtype : 'button',
		cls : 'supplementRefresh',
		itemId : 'btnRefresh',
		width : 24
	}
});