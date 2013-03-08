Ext.define('ALM.view.inquiry.ViewPublishMessage', {
	extend : 'MES.view.form.BaseForm',
	
	alias : 'widget.alm_publish_msg',

	title : T('Caption.Other.Alarm'),

	bodyCls : '',
	
	requires : [ 'ALM.model.AlarmModel' ],
	
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	
	initComponent : function() {
		var self = this;

		this.callParent();

		this.add(this.buildGeneral());
		this.add(this.buildDetailView());

		var alarmStore = Ext.getStore('ALM.store.AlarmStore');
		
		//그리드 클릭
		this.sub('grdAlarmList').on('itemclick', function(grid, record) {
			self.sub('ctnMain').removeAll(true);
			self.sub('ctnMain').add(self.addField(record));
			record.data.confirmFlag = 'Y';
			self.sub('grdAlarmList').getView().removeRowCls(record, 'unconfirmed');
			SF.cf.checkAlarmCount();
		});
		//삭제버튼
		this.sub('btnDel').on('click', function(){
			var selectedRow = self.sub('grdAlarmList').selModel.getSelection();
			for(var i=0; i< selectedRow.length; i++){
				self.alarmAcknowledge(selectedRow[i], alarmStore);
			}
		});
		
		//Unread
		this.sub('btnUnRead').on('click', function(){
			var selectedRow = self.sub('grdAlarmList').selModel.getSelection();
			for(var i=0; i<selectedRow.length; i++){
				selectedRow[i].data.confirmFlag = '';
				self.sub('grdAlarmList').getView().addRowCls(selectedRow[i], 'unconfirmed');
			}
			SF.cf.checkAlarmCount();
		});
	},

	alarmAcknowledge : function(selectedRow, alarmStore){
		Ext.Ajax.request({
			url : 'service/AlmAckAlarm.json',
			method : 'GET',
			params : {
				procstep : '1',
				alarmId : selectedRow.data.alarmId,
				sourceId1 : selectedRow.data.sourceId1,
				tranTime : selectedRow.data.createTime,
				ackUserId : 'ADMIN'
			},
			success : function(response, opts) {
				var result = Ext.JSON.decode(response.responseText);
				if (result.msgcode === 'CMN-0000') {
					//성공시 local store에 데이터 삭제
					alarmStore.remove(selectedRow);
					this.sub('ctnMain').removeAll(true);
					SF.cf.checkAlarmCount();
				}else{
					Ext.log(result.msgcode);
				}
			},
			scope : this
		});		
	},
	
	addField : function(record) {
		var alarmId = record.get('alarmId');
		var subject = record.get('alarmSubject');
		var alarmMsg = record.get('alarmMsg');
		var comment1 = record.get('alarmComment1');
		var comment2 = record.get('alarmComment2');
		var comment3 = record.get('alarmComment3');
		var comment4 = record.get('alarmComment4');
		var comment5 = record.get('alarmComment5');
		var source1 = record.get('sourceId1');
		var source2 = record.get('sourceId2');
		var source3 = record.get('sourceId3');
		var desc1 = record.get('sourceDesc1');
		var desc2 = record.get('sourceDesc2');
		var desc3 = record.get('sourceDesc3');
		var level = record.get('alarmLevel');
		var type = record.get('alarmType');
		var lotId = record.get('lotId');
		var resource = record.get('resId');
		var imageSource = record.get('fileId');
		var createTime = Ext.Date.parse(record.get('createTime'), 'YmdHis');
		var imageControl = '';
		if(imageSource != undefined && imageSource != ''){
			imageControl ='<img src= "/mesplus/service/bas_download_file/'+ imageSource + '.do"'+'/>';
		}
		return {
			xtype : 'container',
			autoScroll : true,
			layout : {
				type : 'anchor'
			},
			cls : 'noticeContent',
			html : [
			       '<div class="alarmHeader">',
			       	'<div class="subject alarmLevel '+level+'">'+ subject +' <span>'+ createTime +' </span></div>',
			       	'<div class="alarmInfo">',
			       		'<span>alarm ID : '+ alarmId +' </span>',
			       		'<span>Resource ID : '+ resource +' </span>',
			       	'</div>',
			       '</div>',
			       '<div class="alarmContent">'+imageControl+ alarmMsg +' </div>',
			       '<div class="alarmTable">',
			       	'<table>',
			       		'<tr>',
			       			'<td class="label">source ID 1</td>',
			       			'<td>'+ source1 +'</td>',
			       			'<td class="label">description 1</td>',
			       			'<td>'+ desc1 +'</td>',
			       		'</tr>',
			       		'<tr>',
			       			'<td class="label">source ID 2</td>',
			       			'<td>'+ source2 +'</td>',
			       			'<td class="label">description 2</td>',
			       			'<td>'+ desc2 +'</td>',
			       		'</tr>',
			       		'<tr>',
			       			'<td class="label">source ID 3</td>',
			       			'<td>'+ source3 +' </td>',
			       			'<td class="label">description 3</td>',
			       			'<td>'+ desc3 +'</td>',
		       			'</tr>',
			       		'<tr>',
				       		'<td class="label">type</td>',
		       				'<td>'+ type +'</td>',
		       				'<td class="label">lot id</td>',
		       				'<td>'+ lotId +'</td>',
		       			'</tr>',
			       		'<tr>',
		       				'<td class="label">comment 1</td>',
		       				'<td colspan=3>'+ comment1 +'</td>',	       				
	       				'</tr>',
			       		'<tr>',
		       				'<td class="label">comment 2</td>',
		       				'<td colspan=3>'+ comment2 +'</td>',	
	       				'</tr>',
			       		'<tr>',
				       		'<td class="label">comment 3</td>',
		       				'<td colspan=3>'+ comment3 +'</td>',
	       				'</tr>',
			       		'<tr>',
				       		'<td class="label">comment 4</td>',
		       				'<td colspan=3>'+ comment4 +'</td>',				
	       				'</tr>',
	       				'<tr>',
		       				'<td class="label">comment 5</td>',
	       					'<td colspan=3>'+ comment5 +'</td>',
       					'</tr>',
			       	'</table>',
			       '</div>'
			       ]
		};
	},
	
	buildGeneral : function(self) {
		return {
			xtype : 'container',
			flex : 1,
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			items: [{
				xtype : 'grid',
				flex : 1,
				store : Ext.getStore('ALM.store.AlarmStore'),
				autoScroll : true,
				itemId : 'grdAlarmList',
				selModel : Ext.create('Ext.selection.CheckboxModel'),
				multiSelect : true,
				viewConfig : {
					getRowClass : function(record, rowIndex, rowParams, store) {
						if (record.get('confirmFlag') != 'Y') {
							return 'unconfirmed';
						}
					}
				},
				columns : [ {
					xtype : 'rownumberer',
					cls : 'confirmTd',
					align : 'center',
					width : 45
				},{
					header : T('Caption.Other.Alarm ID'),
					dataIndex : 'alarmId',
					flex : 1,
					hidden : true
				},{
					width : 25,
					align : 'center',
					renderer : function(v,meta,rec){
						var level = rec.get('alarmLevel')||'';
						meta.tdCls = 'alarmLevel level'+level;
						//return "<img src='image/iconSetAlarm.png'></img>";
					}
				},{
					header : T('Caption.Other.Message'),
					dataIndex : 'alarmMsg',
					flex : 2 
				}, {
					header : T('Caption.Other.Issue Date'),
					dataIndex : 'createTime',
					align : 'center',
					width : 140,
					renderer : function(v, meta, rec) {
						return Ext.Date.parse(rec.get('createTime'), 'YmdHis');
					}
				}]
			},{
				bbar : {
					layout : {
						pack : 'end'
					},
					cls : 'cellLightGray',
					items : [ {
						xytpe: 'button',
						width : 75,
						height : 20,
						text : 'Delete',
						itemId : 'btnDel'
					},{
						xytpe: 'button',
						width : 75,
						height : 20,
						text : 'UnRead',
						itemId : 'btnUnRead'
					} ]
				}
			}]
		};
	},
	
	buildDetailView : function(self) {
		return [{
			xtype : 'splitter',
			height : 5
		},{
			xtype : 'container',
			itemId : 'ctnMain',
			autoScroll : true,
			flex : 1,		
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			items : []
		}];
	}
});