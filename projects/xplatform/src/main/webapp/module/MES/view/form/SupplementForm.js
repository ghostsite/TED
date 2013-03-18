Ext.define('MES.view.form.SupplementForm', {
	extend : 'Ext.form.Panel',

	alias : [ 'widget.formsup', 'widget.mes_view_supplementform' ],

	cls : 'nav supplement',
	bodyCls : 'paddingAll7',

	layout : 'anchor',
	
	autoScroll : true,

	defaults : {
		labelAlign : 'left',
		anchor : '100%'
	},
	buttonAlign : 'center',
	
	constructor : function(config) {
		var configs = config||{};
		/* defaults 서정시 기본 설정값 추가 */
		if(configs.defaults)
			Ext.applyIf(configs.defaults,this.defaults);
        this.callParent([configs]);
	},
	
	initComponent : function() {
		this.buttons = [ this.zbtnview, this.btnreset ];
		this.callParent();

		if (this.fields)
			this.add(this.fields);
		if (this.hiddenFields)
			this.add(this.hiddenFields);
		
		this.addEvents({
			/**
			 * 조건 입력 후 이벤트 발생시
			 * 인자값 : data
			 */
			"supplementSelected" : true,
			/**
			 * 조건 초기화
			 * 인자값 : data
			 */
			"supplementReset" : true
		});

		var self = this;
		
		this.sub('btnView').on('click', function() {
			self.onBtnView();
		});

		this.sub('btnReset').on('click', function() {
			self.onBtnReset();
		});
	},

	onBtnView : function() {
		var params = this.getForm().getValues();
		Ext.applyIf(params, {
			procstep : this.procstep||'1'
		});
		if(this.getForm().isValid() !== false)
			this.fireEvent('supplementSelected', params);
		
		this.selectData = params;
	},

	onBtnReset : function() {
		var params = this.getForm().getValues();
		Ext.applyIf(params, {
			procstep : this.procstep||'1'
		});
		
		this.fireEvent('supplementReset', params );
		this.getForm().reset();
	},

	zbtnview : {
		text : T('Caption.Button.View'),
		itemId : 'btnView'
	},

	btnreset : {
		text : T('Caption.Button.Reset'),
		itemId : 'btnReset'
	}
});