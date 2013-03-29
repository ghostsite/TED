// model에서 flag 가 'Y', ' '으로 표시 될때 사용 

Ext.define('Ext.ux.grid.CheckColumnMES', {
	extend : 'Ext.grid.column.Column',
	alias : 'widget.checkcolumnmes',

	sortable : false,
	align : 'center',
	resizable : false,
	hideable : false,
	menuDisabled : true,
	
	constructor : function(config) {
		var me = this;
		var configs = Ext.apply({}, config);
		configs.inputValue = configs.inputValue || 'Y';
		configs.uncheckedValue = configs.uncheckedValue || ' ';
		configs.checkDisabled = configs.checkDisabled || false;
		configs.checkHidden = configs.checkHidden || false;
		this.addEvents('checkchange');
		this.callParent([ configs ]);
		
		if(!configs.renderer){
			me.renderer = function(value, metaData, record, rowIndex, colIndex, store, view) {
				if(Ext.isFunction(me.checkHidden) && me.checkHidden(record) == true){
					return;
				}
				else if(me.checkHidden == true){
					return;
				}
					
				var checkDisabled = false;
				if(Ext.isFunction(me.checkDisabled) && me.checkDisabled(record) == true){
					checkDisabled = true;
				}
				else if(Ext.isBoolean(me.checkDisabled)){
					checkDisabled = me.checkDisabled;
				}
				var cssPrefix = Ext.baseCSSPrefix,
                cls = [cssPrefix + 'grid-checkheader'];
				
				if (checkDisabled) {
					if (value == me.inputValue) {
						cls.push(cssPrefix + 'grid-checkheader-checked-disabled');
					} else {
						cls.push(cssPrefix + 'grid-checkheader-disabled');
					} 
				} else {
					if (value == me.inputValue) {
						cls.push(cssPrefix + 'grid-checkheader-checked');
					}
				}
				 return '<div class="' + cls.join(' ') + '">&#160;</div>';
			};
		}
	},
    destroy: function() {
        delete this.items;
        delete this.renderer;
        return this.callParent(arguments);
    },
	processEvent : function(type, view, cell, recordIndex, cellIndex, e) {
		var inputValue = this.inputValue;
		var uncheckedValue = this.uncheckedValue;
		var checkDisabled = false;
		var record = view.panel.store.getAt(recordIndex), dataIndex = this.dataIndex;
		
		if(Ext.isFunction(this.checkDisabled) && this.checkDisabled(record) == true){
			checkDisabled = true;
		}
		else if(Ext.isBoolean(this.checkDisabled)){
			checkDisabled = this.checkDisabled;
		}
		if (!checkDisabled) {
			if (type == 'mousedown' || (type == 'keydown' && (e.getKey() == e.ENTER || e.getKey() == e.SPACE))) {
				//var record = view.panel.store.getAt(recordIndex), dataIndex = this.dataIndex;

				if (record.get(dataIndex) == inputValue) {
					checked = false;
					record.set(dataIndex, uncheckedValue);
				} else {
					checked = true;
					record.set(dataIndex, inputValue);
				}
				this.fireEvent('checkchange', this, recordIndex, checked);
				// cancel selection.
				return false;
			}
		} else {
			return this.callParent(arguments);
		}
	}

//	renderer : function(value, metaData, record, rowIndex, colIndex, store, view) {
//		var checkValue = null;
//		var checkDisabled = null;
//		/*
//		 * TODO : cell의 config에서 inputValue와 cehckDisabeled 값을 받아와야함
//		 * this.columns[colIndex].items.items[0].inputValue (헤더 그룹으로 그리드 사용시 col Index에러)
//		 */
//		checkValue = 'Y';
//		checkDisabled = false;
//		
//		var cssPrefix = Ext.baseCSSPrefix, cls = [ cssPrefix + 'grid-checkheader' ];
//		if (checkDisabled) {
//			if (value == checkValue) {
//				cls.push(cssPrefix + 'grid-checkheader-checked-disabled');
//			} else {
//				cls.push(cssPrefix + 'grid-checkheader-disabled');
//			}
//		} else {
//			if (value == checkValue) {
//				cls.push(cssPrefix + 'grid-checkheader-checked');
//			}
//		}
//		return '<div class="' + cls.join(' ') + '">&#160;</div>';
//	}
});
