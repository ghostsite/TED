Ext.define('BAS.view.setup.FieldView',{
	extend : 'Ext.form.Panel',
	
	requires : [ 'mixin.DeepLink', 'BAS.model.BasViewDataOut', 'BAS.model.BasViewDataListOut.dataList' ],

	mixins : {
		deeplink : 'mixin.DeepLink'
	},
	
	layout : 'fit',
	flex : 1,
	title : 'Field Table Data',
	
	constructor : function(config) {
		var configs = config || {};
		this.callParent([ configs ]);
	},
	
	initComponent : function(){
		this.callParent();
		var self = this;
		
		this.formLoadLock = SF.createLock();
		
		this.store = Ext.create('Ext.data.Store',{
			model : 'BAS.model.BasViewDataListOut.dataList'
		});
		
		if(this.import == 'Y'){
			/** export 관련 */
			var body = Ext.getBody();
			// create the downloadframe at the init of your app
			this.downloadFrame = body.getById('iframe');
			if(!this.downloadFrame){
				this.downloadFrame = body.createChild({
					tag : 'iframe',
					cls : 'x-hidden',
					id : 'iframe',
					name : 'iframe'
				});
			}
			// create the downloadform at the init of your app
			this.downloadForm = body.getById('form');
			if(!this.downloadForm){
				this.downloadForm = body.createChild({
					tag : 'form',
					cls : 'x-hidden',
					id : 'form',
					target : 'iframe'
				});
			}
			/** export 관련 */
			// import 데이터 표시
			this.add(this.buildImportList(self));	
		}
		else if(this.import == 'N'){
			// 승인 진행중인 데이터 표시
			this.add(this.buildReqView(self));
		}else{
			// 원본데이터 조회 표시
			this.add(this.buildDataForm(self));
			this.addDocked({
				xtype : 'toolbar',
				dock : 'bottom',
				ui : 'footer',
				items : [ '->', {
					minWidth : 75,
					xtype : 'button',
					text : 'Close',
					handler : function(){
						self.close();
					}
				} ]
			} );
		}
			
		
		this.on('keychange',function(view, keys){
			if(!keys)
				return;
			
			// keychange는 DataForm일경우만 적용됨.
			SF.cf.callService({
				url : 'service/BasViewDataList.json',
				scope : this,
				params : {
					procstep : '1',
					tableName : keys.tableName,
					key1 : keys.key1
				},
				callback : function(response, success){
					if(success){
						self.formLoad(response.result,success);
					}
				}
			});
		});
	},
	formLoad : function(data, success){
		this.formLoadLock.ready(this._formLoad, this, [data, success]);
	},
	_formLoad : function(data, success){
		this.reqData = data;
		if(success){
			if(this.import == 'Y'){
				this.store.loadData(data.document.dataList);
				this.fileGroupId = data.fileGroupId;
			}
			else if(this.import == 'N'){
				var document = data.document||data.dataList[0];
				this.store.loadData([document]);	
			}
			else {
				var document = data.document||data.dataList[0];
				this.getForm().setValues(document);
			}
		}
		else{
			this.fileGroupId = '';
			this.store.removeAll();
			SF.cf.clearFormFields(this);
		}
	},

	buildImportList : function(me){
		return [{
			xtype : 'gridpanel',
			itemId : 'grdGcm',
			cls : 'navyGrid',
			flex : 1,
			store : this.store,
			columns : [ {
				xtype : 'rownumberer',
				width : 25,
				text : ''
			}, {
				dataIndex : 'key1',
				minWidth : 100,
				text : 'Field Name'
			}, {
				dataIndex : 'data1',
				minWidth : 100,
				text : T('Caption.Other.Description'),
				flex : 1
			}, {
				dataIndex : 'data2',
				minWidth : 100,
				text : 'Field Type'
			} ], 
			dockedItems : [ {
                xtype: 'toolbar',
                dock : 'bottom',
                items: ['->',{
                	xtype : 'button',
                	text : '파일 내려받기',
                	handler : function(){
                		//TODO : url 서버 수정후 정의 2012.09.13
                		var url = 'service/bas_download_file/'+me.fileGroupId+'-0000.do';//me.reqData.taskReqId
                		Ext.Ajax.request({
                			url : url,
                			form : me.downloadForm,
                			isUpload : true,
                			scope : me
                		});
                	}
                }]
            } ]
		}];
	},
	buildDataForm : function(){
		return {
			xtype : 'container',
			layout : 'anchor',
			cls : 'marginTB10 marginRL10',
			defaults : {
				anchor : '100%',
				labelWidth : 120,
				submitValue : false,
				readOnly : true
			},
			items : [{
				xtype : 'textfield',
				fieldLabel : 'Field Name',
				labelStyle : 'font-weight:bold',
				itemId : 'txtFieldName',
				name : 'key1'
			},{
				xtype : 'textfield',
				fieldLabel : 'Description',
				itemId : 'txtDesc',
				name : 'data1'
			},{
				xtype : 'textfield',
				fieldLabel : 'Field Type',
				itemId : 'txtFieldType',
				name : 'data2'
			},{
				xtype : 'userstamp'
			}]
		};
	},
	buildReqView : function(){
		var infoList = [ {
			label : 'Field Name',
			value : 'key1'
		}, {
			label : 'Description',
			value : 'data1'
		}, {
			label : 'Field Type',
			value : 'data2'
		} ];
		var tpl = '<tpl for="."><div class="infoItemSet">';
		Ext.Array.each(infoList, function(field) {
			var div = '';
			if (field.div) {
				div = field.div;
			} else {
				div = '<div>';
			}

			tpl += '<tpl if="'+field.value+'!=null">' +div + '<span>' + field.label + '</span>{' + field.value + '}</div></tpl>';
		});
		tpl += '</div></tpl>';
		return {
			xtype : 'dataview',
			itemId : 'dvDocument',
			store : this.store,
			itemSelector : '.infoItemSet',
			tpl : tpl
		};
	}
});
