/**
 * @class CMN.view.form.ValueRangeField
 * **xtype : valuerange **
 * 값의 범위를 설정하는 필드이다.
 * 기본적인 속성은 numberfield 동일하다.(fieldLabel, name등) 
 * **Note :** 입력된 값을 읽어올때 설정한 name으로 배열이 형태로 반환되며 name[0]은 최소값, name[1]은 최대값을 가진다. 
 *  
 *   @example
 *	 Ext.define('ConditionTest',{
 *	 	extend : 'Ext.panel.Panel',
 *	 	title : 'Condition Test',
 *	 	initComponent : function() {
 *			this.callParent();
 *		},
 *	 	items : [ {
 *			xtype : 'valuerange',
 *			fieldLabel : 'HIGHT',
 *			name : 'HIGHT',
 *		} ],
 *	 	renderTo : Ext.getBody()
 *	 });
 *  
 * @extends Ext.form.FieldContainer
 * @author Kyunghyang
 * 
 * @cfg {String} xtype 'valuerange' items 속성 값으로 xtype : 'valuerange' 를 선언하여 사용한다.
 */
Ext.define('CMN.view.form.ValueRangeField', {
	extend : 'Ext.form.FieldContainer',
	alias: 'widget.valuerange',
	
	defaults : {
		anchor : '100%'
	},
	labelWidth : 150,
	fieldWidth : 150,
    constructor : function(config) {
    	var configs = config||{};
    	var layout = 'anchor';
    	if (configs.vertical || configs.layout == 'hbox'){
    		layout = 'hbox';
    		this.fieldWidth = this.fieldWidth*2;
    	}

    	Ext.applyIf(configs,{
    		layout : layout
    	});
    	this.callParent([configs]);
	},
	initComponent:function() {
		this.width = this.width||(this.labelWidth + this.fieldWidth +5);
		
		this.fieldLabel = this.fieldLabel + '  (FROM ~ TO)';
		this.items = this.buildItems();
		this.callParent();
	},
	
	buildItems : function(){
		var fieldId = 'valueField'; // + 1
		var items= [];
		var fromName = this.fromName || this.name+'_date';
		items.push(this.buildField(fieldId,'from',fromName));
		if(this.vertical)
			items.push({xtype: 'component',width : 10, html : '~'});
		var toName = this.toName || this.name+'_date';
		items.push(this.buildField(fieldId,'to',toName));
		
		return items;
	},
	buildField : function(fieldId,pos,name){
		return {
			xtype : 'numberfield',
			name : name,
			itemId : fieldId+pos,
			value : this.defaultValue,
			maxValue : this.maxValue,
			minValue : this.minValue,
			flex: 1
		};
	}
});