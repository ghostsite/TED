/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
/**
 * @class Ext.ux.CheckColumn
 * @extends Ext.grid.column.Column
 * <p>A Header subclass which renders a checkbox in each column cell which toggles the truthiness of the associated data field on click.</p>
 * <p><b>Note. As of ExtJS 3.3 this no longer has to be configured as a plugin of the GridPanel.</b></p>
 * <p>Example usage:</p>
 * <pre><code>
// create the grid
var grid = Ext.create('Ext.grid.Panel', {
    ...
    columns: [{
           text: 'Foo',
           ...
        },{
           xtype: 'checkcolumn',
           text: 'Indoor?',
           dataIndex: 'indoor',
           width: 55
        }
    ]
    ...
});
 * </code></pre>
 * In addition to toggling a Boolean value within the record data, this
 * class adds or removes a css class <tt>'x-grid-checked'</tt> on the td
 * based on whether or not it is checked to alter the background image used
 * for a column.
 */
Ext.define('Ext.ux.grid.CheckColumn', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.checkcolumn',
    
    constructor: function(config) {
    	var me = this;
    	var configs = Ext.apply({}, config);
		configs.checkHidden = configs.checkHidden || false;
		configs.checkDisabled = configs.checkDisabled || false;
        this.addEvents(
            /**
             * @event checkchange
             * Fires when the checked state of a row changes
             * @param {Ext.ux.CheckColumn} this
             * @param {Number} rowIndex The row index
             * @param {Boolean} checked True if the box is checked
             */
            'checkchange'
        );
        this.callParent([ configs ]);
        if(!configs.renderer){
        	me.renderer = function(value, metaData, record, rowIndex, colIndex, store, view){
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
					if (value) {
						cls.push(cssPrefix + 'grid-checkheader-checked-disabled');
					} else {
						cls.push(cssPrefix + 'grid-checkheader-disabled');
					} 
				} else {
					if (value) {
						cls.push(cssPrefix + 'grid-checkheader-checked');
					}
				}
                return '<div class="' + cls.join(' ') + '">&#160;</div>';
            };
        }
    },

    /**
     * @private
     * Process and refire events routed from the GridView's processEvent method.
     */
    processEvent: function(type, view, cell, recordIndex, cellIndex, e) {
        if (type == 'mousedown' || (type == 'keydown' && (e.getKey() == e.ENTER || e.getKey() == e.SPACE))) {
            var record = view.panel.store.getAt(recordIndex),
                dataIndex = this.dataIndex,
                checked = !record.get(dataIndex);
            
            if(this.checkList){
            	if(!view.checkList){
            		view.checkList = [];
            	}
            	view.checkList.push(recordIndex);
            }
            
            record.checkSelected = checked;
            record.set(dataIndex, checked);
            this.fireEvent('checkchange', this, recordIndex, checked);
            // cancel selection.
            return false;
        } else {
            return this.callParent(arguments);
        }
    }

    // Note: class names are not placed on the prototype bc renderer scope
    // is not in the header.
//    renderer : function(value){
//        var cssPrefix = Ext.baseCSSPrefix,
//            cls = [cssPrefix + 'grid-checkheader'];
//
//        if (value) {
//            cls.push(cssPrefix + 'grid-checkheader-checked');
//        }
//        return '<div class="' + cls.join(' ') + '">&#160;</div>';
//    }
});

