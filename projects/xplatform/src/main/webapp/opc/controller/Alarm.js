Ext.define('Opc.controller.Alarm', {
	extend : 'Opc.controller.BaseController',
	
	views : ['Alarm'],
	
	refs : [ {
		selector : 'alarm',
		ref : 'alarm'
	}, {
		selector : 'alarm #ctnMain',
		ref : 'ctnMain'
	}, {
		selector : 'alarm grid#grdAlarmList',
		ref : 'gridAlarmList'
	} ],
	
	init : function() {
		this.control({
			'alarm' : {
				btnClose : this.onBtnClose
			},
			'alarm grid#grdAlarmList' : {
				itemclick : this.onAlarmItemClick
			},
			'alarm button#btnDel' : {
				click : this.onBtnDeleteClick
			},
			'alarm button#btnUnRead' : {
				click : this.onBtnUnreadClick
			}
		});
	},
	
	onAlarmItemClick : function(grid, record) {
		this.getCtnMain().removeAll(true);
		this.getCtnMain().add(this.addField(record));
		record.data.confirmFlag = 'Y';
		this.getGridAlarmList().getView().removeRowCls(record, 'unconfirmed');
		SF.alarm.checkAlarmCount();
	},
	
	onBtnDeleteClick : function() {
		var selectedRow = this.getGridAlarmList().selModel.getSelection();
		for(var i=0; i< selectedRow.length; i++){
			this.alarmAcknowledge(selectedRow[i], alarmStore);
		}
	},

	onBtnUnreadClick : function() {
		var selectedRow = this.getGridAlarmList().selModel.getSelection();
		for(var i=0; i<selectedRow.length; i++){
			selectedRow[i].data.confirmFlag = '';
			this.getGridAlarmList().getView().addRowCls(selectedRow[i], 'unconfirmed');
		}
		SF.alarm.checkAlarmCount();
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
					this.getCtnMain().removeAll(true);
					SF.alarm.checkAlarmCount();
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
			imageControl ='<img src= "service/bas_download_file/'+ imageSource + '.do"'+'/>';
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
	}
});