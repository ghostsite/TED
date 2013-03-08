Ext.define('MES.view.form.field.TextActionColumn', {
	extend: 'Ext.grid.column.Column',
	alias : 'widget.textactioncolumn',
	
	sortable : false,
	hideable : false,
	menuDisabled : true,

	constructor : function(config) {
		var me = this,
        cfg = Ext.apply({}, config);
		
		 me.origRenderer = cfg.renderer || me.renderer;
	     me.origScope = cfg.scope || me.scope;
	        
        delete me.renderer;
        delete me.scope;
        delete cfg.renderer;
        delete cfg.scope;
       
        delete cfg.items;
        me.callParent([cfg]);

        // Also need to check for getClass, since it changes how the cell renders
        if (me.origRenderer) {
            me.hasCustomRenderer = true;
        }
	},
	
   defaultRenderer: function(v, meta, record, rowIdx, colIdx, store, view){
       var me = this,
       prefix = Ext.baseCSSPrefix,
       scope = me.origScope || me,
       tooltip;
       var linkStyle = ' linkStyle';
       if(me.underbarText === false){
    	   linkStyle= '';
       }
       // Allow a configured renderer to create initial value (And set the other values in the "metadata" argument!)
       v = Ext.isFunction(me.origRenderer) ? me.origRenderer.apply(scope, arguments) || '' : v;

       tooltip = me.tooltip || (me.getTip ? me.getTip.apply(scope, arguments) : null);

            // Only process the item action setup once.
        if (!me.hasActionConfiguration) {
            // Apply our documented default to all items
            me.stopSelection;
            me.hasActionConfiguration = true;
        }
	    return '<span class="' + prefix + 'action-col-icon '+ (Ext.isFunction(me.getClass) ? me.getClass.apply(scope, arguments) : (me.iconCls || '')) + linkStyle+'"' +
	        (tooltip ? ' data-qtip="' + tooltip + '"' : '') + ' >'+v+'</span>';
    
    },

    destroy: function() {
        delete this.items;
        delete this.renderer;
        return this.callParent(arguments);
    },

    processEvent : function(type, view, cell, recordIndex, cellIndex, e, record, row){
        var me = this,
            target = e.getTarget(),
            match,
            fn,
            key = type == 'keydown' && e.getKey();

        // If the target was not within a cell (ie it's a keydown event from the View), then
        // rely on the selection data injected by View.processUIEvent to grab the
        // first action icon from the selected cell.
        if (key && !Ext.fly(target).findParent(view.cellSelector)) {
            target = Ext.fly(cell).down('.' + Ext.baseCSSPrefix + 'action-col-icon', true);
        }
        if (target) {
            if (type == 'click' || (key == e.ENTER || key == e.SPACE)) {
                fn = me.handler;
                if (fn) {
                    fn.call(me.origScope || me, view, recordIndex, cellIndex, me, e, record, row);
                }
            } else if (type == 'mousedown' && me.stopSelection !== false) {
                return false;
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
    }
});

