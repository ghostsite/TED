Ext.define('Ext.ux.UnCheckColumnMES', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.uncheckcolumnmes',

	constructor : function(config) {
		var configs = Ext.apply({}, config);

		this.addEvents('checkchange');
		this.callParent([ configs ]);
	},
	
	processEvent : function(type, view, cell, recordIndex, cellIndex, e) {
//		var inputValue = this.inputValue;
//		var uncheckedValue = this.uncheckedValue;
//		var checkDisabled = this.checkDisabled;

		var inputValue = 'Y';
		var uncheckedValue = '';
		var checkDisabled = true;

		if (!checkDisabled) {
			if (type == 'mousedown' || (type == 'keydown' && (e.getKey() == e.ENTER || e.getKey() == e.SPACE))) {
				var record = view.panel.store.getAt(recordIndex), dataIndex = this.dataIndex;

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
	},

	renderer : function(value, metaData, record, rowIndex, colIndex, store, view) {
		var checkValue = null;
		var checkDisabled = null;
		/*
		 * TODO : cell의 config에서 inputValue와 cehckDisabeled 값을 받아와야함
		 * this.columns[colIndex].items.items[0].inputValue (헤더 그룹으로 그리드 사용시 col Index에러)
		 */
		checkValue = 'Y';
		checkDisabled = true;

		var cssPrefix = Ext.baseCSSPrefix, cls = [ cssPrefix + 'grid-checkheader' ];
		if (checkDisabled) {
			if (value == checkValue) {
				cls.push(cssPrefix + 'grid-checkheader-checked-disabled');
			} else {
				cls.push(cssPrefix + 'grid-checkheader-disabled');
			}
		} else {
			if (value == checkValue) {
				cls.push(cssPrefix + 'grid-checkheader-checked');
			}
		}
		return '<div class="' + cls.join(' ') + '">&#160;</div>';
	}
});
