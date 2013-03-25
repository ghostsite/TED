Ext.define('MES.view.form.field.MultiFileUploader',{//TODO change this file to fit me,add uploadUrl downloadUrl
	extend : 'Ext.form.Panel',
	alias : 'widget.multifileuploader',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	bodyCls : 'borderTNone borderBNone borderRNone borderLNone',
	constructor : function(config){
		var configs = config || {};
		this.fsTmpFileId = [];
		this.fsDelFileId = [];
		//this.uploadUrl = config.uploadUrl;
		//this.downloadUrl = config.downloadUrl;
		if(!configs.store){
			configs.store =  Ext.create('Ext.data.ArrayStore',{
				fields : ['fileId','groupId', 'paramName', 'fileName', 'fileType', 'fileSize','status', 'progress', 'tmpFlag']
			});
		}
		this.callParent([ configs ]);
	},
	initComponent : function() {
		var me = this;
		me.tools=[];
		this.callParent();
		var fileFieldConfig = {
				xtype : 'toolbar',
				cls : 'borderTNone borderBNone borderRNone borderLNone',
				dock : 'top',
				items : ['->',Ext.create('Ext.form.field.File',{
					buttonOnly : true,
					buttonText: me.buttonText || 'Upload File',
					buttonConfig : Ext.apply({
						cls : 'btnUpload'
					},me.buttonConfig||{}),
					listeners : {
						change : function(field,value){
							me.onChangeFile(field,value);
						}
					}
				})	]
			};
		if(me.title){
			me.fileField = this.addTool(fileFieldConfig);
		}
		else{
			me.fileField = this.add(fileFieldConfig);
		}
		
		me.fileGrid = this.add(Ext.create('Ext.grid.Panel',Ext.apply({
			cls : 'borderT',
			autoScroll : true,
			hideHeaders : true,
			store : me.store,
			columns : [ {
				xtype : 'textactioncolumn',
				text : T('Caption.Other.File Name'),
				dataIndex : 'fileName',
				iconCls : 'iconClip',
				renderer : function(v, m, r){
					if(r.get('tmpFlag')){
						return v +'<span class="iconNew"/>';
					}
					return v;
				},
				handler : function(grid, rowIndex, colIndex) {
					var fileId = grid.store.getAt(rowIndex).get('fileId');
					if(fileId){
						Ext.Array.remove(me.fsTmpFileId,fileId);
						Ext.Ajax.request({
							url : me.downloadUrl +'/'+ fileId,//'service/bas_download_file/'+fileId+'.do',
							form : me.exportForm('_download'+rowIndex),
							isUpload : true
						});		
					}
				},
				flex : 1
			}, {
				text : 'Size',
				dataIndex : 'fileSize'
			}, {
				text : 'Status',
				dataIndex : 'status',
				renderer : function(v, m, r){
					v = v || 'Submited';
					return v;
				}
			}, {
				xtype : 'actioncolumn',
				text : 'Del',
				width : 25,
				align : 'center',
				items : [ {
					iconCls : 'iconFileDelete',
					handler : function(grid, rowIndex) {
						var fileId = grid.store.getAt(rowIndex).get('fileId');
						if(fileId){
							Ext.Array.remove(me.fsTmpFileId,fileId);
							me.fsDelFileId.push(fileId);
							grid.store.removeAt(rowIndex);							
						}
					},
					tooltip : T('Caption.Task.ToolTip.delete')
				} ]
			}]
		}, me.gridConfig||{})));
	},
	exportForm : function(id) {
		var body = Ext.getBody();
		var form = null;
		if(!body.getById(id+'Frame')){
			body.createChild({
				tag : 'iframe',
				cls : 'x-hidden',
				id :id+'Frame',
				name : id+'Frame'
			});
		}
		
		if(!body.getById(id+'Form')){
			form = body.createChild({
				tag : 'form',
				cls : 'x-hidden',
				id : id+'Form',
				target : id+'Frame'
			});
		}
		else{
			form = body.getById(id+'Form');
		}
				
		return form;
	},

	onChangeFile : function(field, value){
		var me = this;
		var fileInfo = field.fileInputEl.dom.files[0];
		var size = fileInfo.size;
		var name = fileInfo.name;
		
		/* grid list */
		var store = me.store;
		var recs = store.add({
			fileName : name,
			fileSize : size,
			tmpFlag : 1,
			status : 'Uploading...',
			progress : 0
		});
		
		/* form submit */
		var form = me.getForm();
		form.submit({
			url : me.uploadUrl,//'service/bas_upload_file_tmp.json',
			params : {
				procstep : '1'
			},
            success: function(form, action) {
            	var fileId = action.result.fileId;
            	me.fsTmpFileId.push(fileId);
            	recs[0].set('fileId', fileId);
            	recs[0].set('status', 'Complete');
            },
            failure: function(form, action) {
            	recs[0].set('fileId', '');
            	recs[0].set('status', 'Error');
            }
        });
	},
	getTmpFileIds : function(){
//		var tmpFiles = [];
//		this.store.each(function(rec){
//			if(rec.get('status') > 0){
//				tmpFiles.push(rec.get('fileId'));
//			}
//		});
		return this.fsTmpFileId;
	},
	getDeleteFileIds : function(){
		return this.fsDelFileId;
	},
	
	setDefaultRecords : function(records){
		this.store.removeAll();
		this.fsTmpFileId=[];
		this.fsDelFileId=[];
		if(Ext.isArray(records)){
			this.store.add(records);
		}
	}
});