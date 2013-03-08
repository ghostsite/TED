Ext.define('MES.view.window.ConfirmTranAlarm', {
	extend : 'Ext.window.Window',
	requires : [ 'MES.model.AlmCheckConfirmMessageOut.alarmList' ],
	
	title : T('Caption.Menu.Confirm Transaction Alarm Message'),
	width : 800,
	height : 500,
	modal : true,
	layout : 'fit',
	/* config */
	lockAlarm : undefined,
	targetForm : undefined,
	infoData : undefined,
	resultMsg : undefined,
	
	constructor : function(config) {
		var configs = config || {};
		if(!configs.targetForm || !configs.result){
			Ext.log('Theres is no TargetForm');
			return false;
		}
		this.callParent([ configs ]);
	},

	initComponent : function() {
		this.store = Ext.create('Ext.data.Store',{
			model : 'MES.model.AlmCheckConfirmMessageOut.alarmList',
			data : this.result.alarmList||[]
		});
		var viewMsg = this.buildMsg(this.store);
		this.items = [{
				xtype : 'form',
				layout : {
					align : 'stretch',
					type : 'vbox'
				},
				itemId : 'formPortCarrier',
				items : [this.buildMsgCondition(this), viewMsg],
				dockedItems: [{
			        xtype: 'toolbar',
			        ui : 'footer',
			        dock : 'bottom',
			        items: [{
			        	xtype : 'button',
			        	text : 'REFRESH',
			        	itemId : 'btnRefresh'
			        }, '->',{
			        	xtype : 'button',
			            text: T('Caption.Button.Process'),
			            itemId : 'btnPopProcess',
			        	width : 75
			        },{
			        	xtype : 'button',
			            text: T('Caption.Button.Break'),
			            itemId : 'btnPopBreak',
			        	width : 75
			        }]
			    }]
			}];
		this.callParent();
		var self = this;
		
		this.sub('btnPopProcess').on('click', function(){
			if(self.lockAlarm){
				for(var i=0; i<self.lockAlarm.count;i++){
					self.targetForm.isAlarmList = true;
					self.targetForm.checkAlarm = true;
					self.lockAlarm.release();
				}
			}
			self.close();
		});
		
		this.sub('btnPopBreak').on('click', function(){
			if(self.lockAlarm){
				for(var i=0; i<self.lockAlarm.count;i++){
					self.targetForm.checkAlarm = false;
					self.lockAlarm.release();
				}
			}
			self.close();
		});
	},

	buildMsg : function(store){
		var tpl = '';
		this.bufHoldStatus = '';
		this.bufHoldCode = '';
		this.lblHoldStatus = 'Hold Status';
		this.lblHoldCode = 'Hold Code';
		
		for(var i=0;i<store.getCount();i++){
			var data = store.getAt(i).data;
			if(data.needConfirmFlag !== 'Y'){
				return;
			}
			var tplmsg = ['</br>',
			        '<div>{alarmId} ({alarmDesc})</div>',
			        '<div> Subject : {alarmSubject}</div>',
			        '<div>{alarmMsg}</div>'
			        ];
			if(data.holdCode){
				this.lblHoldStatus = 'Hold Status';
				this.lblHoldCode = 'Hold Code';
				this.bufHoldStatus = 'Done';
				this.bufHoldCode = data.holdCode;
				if(data.processedHoldFlag == 'R'){
					tplmsg.push('<div>Release Code : {releaseCode}</div>');
				}
				else{
					tplmsg.push('<div>Hold Code : {releaseCode}</div>');
					if(data.processedHoldFlag == 'C')
						this.bufHoldStatus = 'Will be Hold';
					else if(data.processedHoldFlag == 'Y')
						this.bufHoldStatus = 'Holding';
				}
			}
			
			if(data.rwkcode){
				this.lblHoldStatus = 'Rwk Status';
				this.lblHoldCode = 'Rwk Code';
				this.bufHoldStatus = 'Done';
				this.bufHoldCode = data.rwkcode;
				tplmsg.push('<div>Rework Code : {rwkCode}</div>');

				if(data.processedReworkFlag == 'C')
					this.bufHoldStatus = 'Will be Rework';
				else if(data.processedReworkFlag == 'R')
					this.bufHoldStatus = 'Reworking';
			}
			
			if(data.afterEventId){
				if(data.processedEventFlag == 'C')
					tplmsg.push('<div>Event ID : {afterEventId} (Will be Happen)</div>');
				else if(data.processedEventFlag == 'Y')
					tplmsg.push('<div>Event ID : {afterEventId} (Done)</div>');
				else
					tplmsg.push('<div>Event ID : {afterEventId}</div>');
			}
			if(data.fileinfo && data.fileinfo[0]){
				tplmsg.push('<img src= "service/bas_download_file/'+ data.fileinfo[0].fileId + '.do"'+'/>');
			}
			
			tpl+=tplmsg.join('');
		}
		
		return {
			xtype : 'dataview',
			autoScroll : true,
			flex : 1,
			itemId : 'viewMsg',
			store : store,
			itemSelector : '.inforMore',
			tpl : [ '<tpl for="."><div class="infoItemSet">',
			        	tpl,
					'</div></tpl>'
					]
		};
	},
	
	buildMsgCondition : function(main){
		var data = main.infoData || {};
		return {
			xtype : 'fieldset',
			cls : 'marginAll3',
			title : T('Caption.Other.Message Condition'),
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			items : [{
				xtype : 'fieldcontainer',
				layout : 'hbox',
				items : [{
					xtype : 'fieldcontainer',
					layout : 'hbox',
					flex : 1,
					fieldLabel : T('Caption.Other.Material'),
					labelWidth : 70,
					items : [{
						xtype : 'textfield',
						name : 'matId',
						itemId : 'txtMatId',
						readOnly : true,
						value : data.matId||'',
						flex : 8
					},{
						cls : 'marginL3',
						xtype : 'textfield',
						name : 'matVer',
						itemId : 'txtMatVer',
						readOnly : true,
						value : data.matVer||'',
						flex : 2
					}]
				},{
					xtype : 'textfield',
					fieldLabel : T('Caption.Other.Flow'),
					labelWidth : 70,
					itemId : 'txtFlow',
					readOnly : true,
					value : data.flow||'',
					flex : 1
				}, {
					xtype : 'textfield',
					fieldLabel : T('Caption.Other.Operation'),
					labelWidth : 70,
					readOnly : true,
					itemId : 'txtOper',
					value : data.oper||'',
					flex : 1
				},{
					xtype : 'textfield',
					fieldLabel : T('Caption.Other.Lot ID'),
					labelWidth : 70,
					readOnly : true,
					itemId : 'txtLotId',
					value : data.lotId||'',
					flex : 1
				}]
			}, {
				xtype : 'fieldcontainer',
				layout : 'hbox',
				items : [{
					xtype : 'textfield',
					fieldLabel : T('Caption.Other.'+this.lblHoldStatus),
					labelWidth : 70,
					itemId : 'txtHoldStatus',
					readOnly : true,
					value : this.bufHoldStatus||'',
					flex : 1
				}, {
					xtype : 'textfield',
					fieldLabel : T('Caption.Other.'+this.lblHoldCode),
					labelWidth : 70,
					itemId : 'txtHoldCode',
					readOnly : true,
					value : data.holdCode||data.rwkCode||'',
					flex : 1
				}, {
					xtype : 'textfield',
					fieldLabel : T('Caption.Other.Event ID'),
					labelWidth : 70,
					readOnly : true,
					itemId : 'txtEventId',
					value : data.eventId||'',
					flex : 1
				},{
					xtype : 'textfield',
					fieldLabel : T('Caption.Other.Resource'),
					labelWidth : 70,
					readOnly : true,
					itemId : 'txtResource',
					value : data.resId||'',
					flex : 1
				}]
			}]
		};
	}
});