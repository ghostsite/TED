Ext.define('MES.view.form.field.GCMComboBox', {
	extend : 'Ext.form.field.ComboBox',

	alias: ['widget.gcmcombobox','widget.gcmcombo'],
	queryMode: 'local',
	enableKeyEvents : true,
	
	constructor : function(config) {
		var configs = config || {};
		configs = SmartFactory.codeview.show(configs,'combo');
		
		if (!configs.table)
			throw new Error('[table] should be configured.');

		var select = [configs.displayField];
		if(configs.valueField != configs.displayField)
			select.push(configs.valueField);
		
		if (configs.listTpl){
			var regexp = /(\{\w+\})/g;
			while (true) {
				var $var = regexp.exec(configs.listTpl);
				if (!$var)
					break;
				var value = $var[1].replace(/\{|\}/g,'');
				select.push(value);
			}
		}
		select = Ext.Array.unique(select);
		this.params = {
				type : configs.type,
				select : select,
				table : configs.table
			};
		
		if (configs.factory)
			this.params.factory = configs.factory;
		
		if(configs.order)
			this.params.order = configs.order;
		
		if(configs.condition && configs.condition.length>0){
			this.params.condition = configs.condition;
		}
		var storeConfigs = {
				listTpl : configs.listTpl,
				autoLoad : true,
				remoteFilter : false,
				filterOnLoad : false,
				fields : this.params.select,
				proxy : {
					type : 'payload',
					api : {
						read : 'service/basViewCodeList.json'	
					},
					actionMethods : {
						read : 'POST'
					},			
					extraParams : this.params,
					reader : {
						type : 'json',
						root : 'list',
						totalProperty : 'total'
					}
				}
		};
		if(configs.pageSize !=undefined && configs.pageSize > 1){
			storeConfigs.pageSize = configs.pageSize;
//			storeConfigs.remotePaging = true;
		}
		
		configs.store = Ext.create('Ext.data.Store', storeConfigs);
		

		this.callParent([ configs ]);
	},

	initComponent : function() {
		this.callParent();
//		this.on('specialkey',function(me,e){
//			if (e.getKey() == e.ENTER)
//				me.onTriggerClick();
//		});
	},
	
	listConfig : {
		getInnerTpl : function() {
			var listTpl = this.store.listTpl || '{key1}';
			return '<div><span class="key">'+listTpl+'</span></div>'; 
		}, 
		minWidth : 200
	},
	// 클릭시 검색
	 onTriggerClick2: function() {
        var me = this;
        if (!me.readOnly && !me.disabled) {
    		var value = me.getRawValue();
            me.onFocus({});
            if (me.triggerAction === 'all' || me.isExpanded != true) {
            	value = '';
            }
            me.expand();
        	if(me.getRawValue() != me.getDisplayValue() || value == '' || me.selectValue == ''){
        		me.selectValue = value;
        		if(me.condition && me.condition.length>0){
        			me.params.condition = me.condition;
        		}
            	else
            		me.params.condition = [];
            	
            	me.params.condition.push({
            		name : me.displayField,
            		value : value+'%',
            		operator : 'like'
            	});
            	var qe = {
                        query: '',
                        forceAll: true,
                        combo: me,
                        cancel: false
                    };
            	if (me.fireEvent('beforequery', qe) === false || qe.cancel) {
                    return false;
                }
            	
            	me.store.load({
            		params : me.params
            	});
            	
            	if (me.getRawValue() !== me.getDisplayValue()) {
                    me.ignoreSelection++;
                    me.picker.getSelectionModel().deselectAll();
                    me.ignoreSelection--;
                }
        	}
            me.inputEl.focus();
        }
    }

	// 필드검색
	/*   
	onTriggerClick22: function() {
        var me = this;
        if (!me.readOnly && !me.disabled) {
            if (me.isExpanded) {
                me.collapse();
            } else {
                me.onFocus({});
                if (me.triggerAction === 'all' || me.getRawValue() == '') {
                    me.doQuery(me.allQuery, true);
                    me.expand();
                } else {
                	if(me.getRawValue() != me.getDisplayValue() || !me.selectValue){
                		me.selectValue = me.getRawValue();
                		if(me.condition && me.condition.length>0){
                			me.params.condition = me.condition;
                		}
                    	else
                    		me.params.condition = [];
                    	
                    	me.params.condition.push({
                    		name : me.displayField,
                    		value : me.getRawValue()+'%',
                    		operator : 'like'
                    	});
                    	var qe = {
                                query: '',
                                forceAll: true,
                                combo: me,
                                cancel: false
                            };
                    	if (me.fireEvent('beforequery', qe) === false || qe.cancel) {
                            return false;
                        }
                    	me.expand();
                    	
                    	me.store.load({
                    		params : me.params
                    	});
                    	
                    	if (me.getRawValue() !== me.getDisplayValue()) {
                            me.ignoreSelection++;
                            me.picker.getSelectionModel().deselectAll();
                            me.ignoreSelection--;
                        }
                	}
                	else{
                		me.expand();	
                	}
                }
            }
            me.inputEl.focus();
        }
    }
    */
});