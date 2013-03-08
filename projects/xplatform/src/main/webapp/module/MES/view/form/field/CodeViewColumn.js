Ext.define('MES.view.form.field.CodeViewColumn', {
	extend: 'Ext.grid.column.Column',
	alias : 'widget.codeviewcolumn',
	
	sortable : false,
	align : 'center',
	resizable : false,
	hideable : false,
	menuDisabled : true,
	header: '&#160;',
	sortable: false,
	actionIdRe: new RegExp(Ext.baseCSSPrefix + 'action-col-(\\d+)'),
	altText: '',
	    
	constructor : function(config) {
        var me = this;
        var configs = Ext.apply({}, config);

		if(configs.targetColumn == undefined || configs.targetColumn.length == 0){
			throw new Error('[targetColumn] should be configured.');
			return;
		}
		
		var codeviewOpts = SF.codeview.get(configs.codeviewName);		
		var name = [];
		var fields = [];
		
		if(Ext.typeOf(configs.targetColumn) == 'string'){
			name = [configs.targetColumn];
		}
		else if(Ext.typeOf(configs.targetColumn) == 'array'){
			name = Ext.clone(configs.targetColumn);
		}
		else{
			throw new Error('[name] is unknow type.');
		}

		if(configs.fields == undefined && codeviewOpts.fields == undefined){
			for(var i = 0 ; i < name.length ; i++){
				configs.popupConfig = configs.popupConfig||{};
				Ext.applyIf(configs.popupConfig,codeviewOpts.popupConfig);
				var dataIndex = configs.popupConfig.columns[i].dataIndex;
				fields = [{
					column : dataIndex
				}];
			}
		}else
			fields = Ext.clone(configs.fields||codeviewOpts.fields);
		
		for(var i in fields){
			if(name[i])
				fields[i].name = name[i];
		}
		
		configs.fields = fields;
//		if(!configs.dataIndex){
//			me.dataIndex = name[0];
//		}
		me.table = configs.table||codeviewOpts.table||'';
		var items = [{
			iconCls : 'btnCodeViewBorder',
            //tooltip: 'Edit',
            handler: function(grid, rowIndex, colIndex) {
            	var info = me;
            	var record = grid.getStore().getAt(rowIndex);
            	
            	if(configs.dataIndex)
            		info.table = record.get(configs.dataIndex);
            	info.record = record;
            	Ext.applyIf(info,configs);
            	//console.log(this, me);
            	SF.codeview.show(info);
            }
		}];
		
		configs.width = 28;
		
        delete configs.items;
    	me.callParent([configs]);
    	
    	me.items = items;
    	var l = items.length,i,item;
 
        me.renderer = function(v, meta, record, rowIdx, colIdx, store, view) {

        	if(Ext.typeOf(v) == 'string' && Ext.String.trim(v) == '' && !me.table)
	       		return '';
        	if(Ext.isFunction(me.disabledIcon) && me.disabledIcon(record) == true)
        		return '';
        	if(me.disabledIcon == true)
        		return '';
            v = Ext.isFunction(configs.renderer) ? configs.renderer.apply(this, arguments)||'' : '';

            meta.tdCls += ' ' + Ext.baseCSSPrefix + 'action-col-cell';
            for (i = 0; i < l; i++) {
                item = items[i];
                item.disable = Ext.Function.bind(me.disableAction, me, [i]);
                item.enable = Ext.Function.bind(me.enableAction, me, [i]);
                v += '<img alt="' + (item.altText || me.altText) + '" src="' + (item.icon || Ext.BLANK_IMAGE_URL) +
                    '" class="' + Ext.baseCSSPrefix + 'action-col-icon ' + Ext.baseCSSPrefix + 'action-col-' + String(i) + ' ' + (item.disabled ? Ext.baseCSSPrefix + 'item-disabled' : ' ') + (item.iconCls || '') +
                    ' ' + (Ext.isFunction(item.getClass) ? item.getClass.apply(item.scope||me.scope||me, arguments) : (me.iconCls || '')) + '"' +
                    ((item.tooltip) ? ' data-qtip="' + item.tooltip + '"' : '') + ' />';
            }
            return v;
        };
    	
	},
    enableAction: function(index) {
        var me = this;

        if (!index) {
            index = 0;
        } else if (!Ext.isNumber(index)) {
            index = Ext.Array.indexOf(me.items, index);
        }
        me.items[index].disabled = false;
        me.up('tablepanel').el.select('.' + Ext.baseCSSPrefix + 'action-col-' + index).removeCls(me.disabledCls);
    },

    /**
     * Disables this ActionColumn's action at the specified index.
     */
    disableAction: function(index) {
        var me = this;

        if (!index) {
            index = 0;
        } else if (!Ext.isNumber(index)) {
            index = Ext.Array.indexOf(me.items, index);
        }
        me.items[index].disabled = true;
        me.up('tablepanel').el.select('.' + Ext.baseCSSPrefix + 'action-col-' + index).addCls(me.disabledCls);
    },

    destroy: function() {
        delete this.items;
        delete this.renderer;
        return this.callParent(arguments);
    },
    
    processEvent : function(type, view, cell, recordIndex, cellIndex, e){
        var me = this,
            match = e.getTarget().className.match(me.actionIdRe),
            item, fn;
        if (match) {
            item = me.items[parseInt(match[1], 10)];
            if (item) {
                if (type == 'click') {
                    fn = item.handler || me.handler;
                    if (fn && !item.disabled) {
                        fn.call(item.scope || me.scope || me, view, recordIndex, cellIndex, item, e);
                    }
                } else if (type == 'mousedown' && item.stopSelection !== false) {
                    return false;
                }
            }
        }
        return me.callParent(arguments);
    },

    cascade: function(fn, scope) {
        fn.call(scope||this, this);
    },

    // Private override because this cannot function as a Container, and it has an items property which is an Array, NOT a MixedCollection.
    getRefItems: function() {
        return [];
    },
    
	selectedCallback : function(fieldset, record) {
		if(fieldset.fields == undefined || fieldset.fields.length == 0)
			throw new Error('[fields] should be configured.');
		
		for(var i in fieldset.fields){
			var field = fieldset.fields[i];
			if(field.name){
				fieldset.record.set(field.name,record.get(field.column));
			}
		}
	} 
});


