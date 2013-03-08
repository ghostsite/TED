/**
 * @class MES.view.form.field.TranTimeField
 * @extends 'Ext.container.Container'
 * @author Kyunghyang
 * 
 * 공통적으로 적용되는 Transaction Time 설정 기능. Global Option 에 의한 화면 표시 및 사용 여부를 설정한다.
 * ** xtype : trantimefield **
 */
Ext.define('MES.view.form.field.TranTimeField', {
	extend : 'Ext.form.FieldContainer',
	alias : 'widget.trantimefield',
	
	layout : 'hbox',
	fieldLabel : T('Caption.Other.Transaction Time'),
	initComponent : function() {
		/* backTime 설정 옵션적용  */
		if(SF.option.get('MP_AllowUseBackDate').value1 != 'Y'){
			this.hidden = true;
			this.disabled = true; // disabled설정시 submitValue는 false로 설정됨(params 설정시 별도 조건처리 필요없음)
		}
		this.items = this.buildItems();
		this.callParent();
		var self = this;
		this.sub('chkTranTime').on('change', function(me, newValue) {
			if (newValue) {
				self.sub('dteTranTime').setDisabled(!newValue);
			} else {
				self.sub('dteTranTime').setDisabled(!newValue);
			}
		});
	},
	
	buildItems : function(){
		/* hidden, disabled(submitValue),  필드셋 속성에서 설정 2012.08.09 KKH (문제가 있을시 개별설정으로 변환함) */
		//var hidden = true;
		//if(SF.option.get('MP_AllowUseBackDate').value1 == 'Y')
		//	hidden = false;
		var name = this.name||'backTime';
		return [{
			xtype : 'checkbox',
			//boxLabel : T('Caption.Other.Transaction Time'),
			itemId : 'chkTranTime',
			inputValue : 'Y',
			uncheckedValue : ' ',
			submitValue : false,
			//hidden : hidden,
			value : ' ' // 초기값 설정
		}, {
			xtype : 'datetimex',
			cls : 'marginL7',
			itemId : 'dteTranTime',
			name : name,
			disabled : true,
			//submitValue : false,
			//hidden :hidden,
			// TODO : Global 시간관련 설정 미확정 차후 수정요청 2012.08.09 KKH
			defaultValue : new Date(), //초기값설정
			timeFormat : 'H:i:s',
			flex : 1
		}];
	}
});