/**
 * @class CMN.view.form.TimePeriodField
 * **xtype : timeperiod **
 * 시간별 기간 조회시 사용되는 필드이다.
 * 값을 변경시 숨겨져 있는 value 필드에 사용자 정의 포멧으로 변환되어 값이 적용됮다. 이벤트 및 호출자는 숨겨진 필드의 name을 호출하여 사용한다.
 * 기본적인 속성은 Time field와 동일하다.(fieldLabel, name등) 
 * **Note :** 입력된 값을 읽어올때 설정한 name으로 배열이 형태로 반환되며 name[0]은 시작시각, name[1]은 종료시각를 가진다. 
 *  
 *   @example
 *	 Ext.define('ConditionTest',{
 *	 	extend : 'Ext.panel.Panel',
 *	 	title : 'Condition Test',
 *	 	initComponent : function() {
 *			this.callParent();
 *		},
 *	 	items : [ {
 *			xtype : 'timeperiod',
 *			fieldLabel : '생성일자',
 *			name : 'create_time',
 *		} ],
 *	 	renderTo : Ext.getBody()
 *	 });
 *  
 * @extends Ext.form.FieldContainer
 * @author Kyunghyang
 * 
 * @cfg {String} xtype 'timeperiod' items 속성 값으로 xtype : 'timeperiod'를 선언하여 사용한다.
 * @cfg {String} format 화면에 표시되는 time 포멧을 설정한다.
 * default : 'H-i' (01:01)
 * @cfg {String} valueFormat value 필드의 time 포멧을 설정한다.
 * defalut : 'Hi' (0101)
 * @cfg {String} value 화면에 표시될때 기본 표시 일자를 설정한다.
 */
Ext.define('CMN.view.form.TimePeriodField', {
	extend : 'Ext.form.FieldContainer',
	alias: 'widget.timeperiod',

	defaults : {
		anchor : '100%'
	},
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	labelWidth : 150,
	fieldWidth : 150,
    constructor : function(config) {
       	var configs = config||{};
    	if (configs.vertical || configs.layout == 'hbox'){
    		configs.layout = 'hbox';
    		this.fieldWidth = this.fieldWidth*2 + 10;
    	}
    	if(configs.defaultValue){
    		var interval = 'd', period = 0;
	    	if (Ext.typeOf(configs.period) == 'string'){
	    		interval = configs.period.match(/[H|I|S]/gi)[0]||'d';
	    		period = configs.period.match(/\-+[0-9]*|[0-9]*/i)||0;
	    	}else
	    		period = configs.period||0;
	    	period = Number(period)*(-1);
	    	switch (interval.toLowerCase()){
	    	case 'h' :
	    		configs.fromValue = Ext.Date.add(configs.defaultValue, Ext.Date.HOUR, period);
	    		break;
	    	case 'i' : 
	    		configs.fromValue = Ext.Date.add(configs.defaultValue, Ext.Date.MINUTE, period);
	    		break;
	    	case 's' : 
	    		configs.fromValue = Ext.Date.add(configs.defaultValue, Ext.Date.SECOND, period);
	    		break;
	    	default :
	    		configs.fromValue = Ext.Date.add(configs.defaultValue, Ext.Date.DAY, period);
	    		break;
	    	}
	    	
	    	configs.toValue = configs.defaultValue;	
    	}
    	
    	this.callParent([configs]);
	},
	initComponent:function() {
		this.width = this.width||(this.labelWidth + this.fieldWidth + 5);
		if(this.fieldLabel)
			this.fieldLabel = this.fieldLabel + '  (FROM ~ TO)';
		if(this.format && !this.valueFormat){
			var re = new RegExp("\:|\-|\\s|\,\.\\/","gi");
			this.valueFormat = this.format.replace(re, "");
		}
		this.items = this.buildItems();
		this.callParent();
		var self = this;
		this.down('#valueFieldfrom').on('change',function(me,value){
			self.setValue(value,0);
		});
		this.down('#valueFieldto').on('change',function(me,value){
			self.setValue(value,1);
		});
	},

	buildItems : function(){
		var fieldId = 'valueField';
		var items=[];
		var fromName = this.fromName || this.name;
		items.push({
			cls :'hboxLine',
			layout: {
		        type: 'hbox',
		        align:'top'
		    },
		    xtype : 'fieldcontainer',
		    items : this.buildField(fieldId,'from',fromName),
		    flex : 1
		});
		if(this.vertical || this.layout == 'hbox')
			items.push({xtype: 'component',width : 10, html : '~'});
		var toName = this.toName || this.name;
		items.push({
			cls :'hboxLine',
			layout: {
		        type: 'hbox',
		        align:'top'
		    },
		    
		    xtype : 'fieldcontainer',
		    items : this.buildField(fieldId,'to',toName),
		    flex : 1
		});
		return items;
	},
	buildField : function(fieldId,pos,name){
		var self = this;
		var valueFormat = this.getValueFormat();
		var submitValue = this.submitValue == false?false:true;
		var submitValueDate = this.submitValueDate == true?true:false;
		var allowBlank = this.allowBlank == false?false:true;
		var value = this.defaultValue||'';
		if(pos == 'from'){
			value = this.fromValue||'';
		}
		if(pos == 'to'){
			value = this.toValue||'';
		}
		return [{
			xtype : 'textfield',
			hidden : true,
			name : name,
			submitValue : submitValue,
			allowBlank : allowBlank, //default : true
			itemId : fieldId+pos,
			value : this.getDefaultValue(pos)
		}, {
			listeners : {
				select : function(field, value, eOpts) {
					self.fireEvent('select', self, value, pos);
				},
				specialkey : function(field, e) {
					/* 필드에 키입력시 이벤트 발생 */
					self.fireEvent('specialkey', self, e);
				},
				change : function(field, newValue, oldValue){ 
					var valueField = self.down('#'+fieldId+pos);
					var valueString = Ext.Date.format(newValue,valueFormat);
					valueField.setRawValue(valueString);
					valueField.lastValue = valueString;
				}
			},
			validator : function(value){
				var fromField = self.down('#time'+fieldId+'from');
				var toField = self.down('#time'+fieldId+'to');
				
				var fromValue = Ext.Date.format(fromField.getValue(),self.getFormat());
				var toValue = Ext.Date.format(toField.getValue(),self.getFormat());
				if(!value || fromValue > toValue){
					return T('Message.ValidError');
				}
				fromField.clearInvalid();
				toField.clearInvalid();
				return true;
			},
			xtype: 'timefield',
			submitValue : submitValueDate, //default : false
			allowBlank : allowBlank, //default : true
			format : this.getFormat(),
			name : name+'_time',
			value : value,
			itemId : 'time'+fieldId+pos,
			emptyText : pos+' time',
			flex: 1
		}];
	},
	
	
	getDefaultValue : function(pos){
		var value = this.defaultValue||'';
		if(this.defaultValue){	
			if(pos == 'from')
				value = this.fromValue;
			else if(pos == 'to')
				value = this.toValue;
			return Ext.Date.format(value,this.getValueFormat());
		}
		return value;
	},
	getValueFormat : function(){
		if (this.valueFormat)
			return this.valueFormat;
		return 'Hi'; //2301
	},
	getFormat : function(){
		if (this.format)
			return this.format;
		return 'H:i'; //23:01
	},
	getValue : function(comp,dateType){
		if(comp == 0 || comp == 'from')
			comp = 'valueFieldfrom';
		else if(comp == 1 || comp == 'to')
			comp = 'valueFieldto';
		else
			return '';
		
		if(dateType === true){
			comp = 'time'+comp;
		}
		var value = this.down('#'+comp).getValue();
		return value;
	},
	getValues : function(){
		var values = [];
		values.push(this.down('#valueFieldfrom').getValue());
		values.push(this.down('#valueFieldto').getValue());
		return values;
	},
	setValue : function(value,index){
		var pos = 'from';
		if (index == 1 || index == 'to')
			pos = 'to';
			
		var datetime = value||'';
		
		if(Ext.typeOf(datetime)=='string' && datetime != ''){
			var date = new Date();
			datetime = new Date(
					date.getFullYear(),
					date.getMonth(), 
					date.getDay(),
					Number(value.substr(0,2)),
					Number(value.substr(2,2)),
					Number(value.substr(4,2))
			);
		}
		var dateField = this.down('#timevalueField'+pos);
		if(dateField) {
			dateField.setValue(datetime);
		}
	},
	
	setValues : function(values){
		if(Ext.typeOf(values) != 'array' && values != '')
			return;
		else if(Ext.typeOf(values) == 'array' && values.length == 0)
			return;
		
		for(var i=0; i<2;i++){
			var value = values[i]||'';
			this.setValue(value,i);
		}
	}
});