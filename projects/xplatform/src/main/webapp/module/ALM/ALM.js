/*
Copyright(c) 2012 Miracom, Inc.
*/
Ext.define("ALM.model.AlarmModel",{extend:"Ext.data.Model",fields:[{name:"alarmLevel",type:"string"},{name:"alarmType",type:"string"},{name:"alarmId",type:"string"},{name:"alarmSubject",type:"string"},{name:"alarmMsg",type:"string"},{name:"alarmComment1",type:"string"},{name:"alarmComment2",type:"string"},{name:"alarmComment3",type:"string"},{name:"alarmComment4",type:"string"},{name:"alarmComment5",type:"string"},{name:"lotId",type:"string"},{name:"resId",type:"string"},{name:"createTime",type:"string"},{name:"sourceId1",type:"string"},{name:"sourceDesc1",type:"string"},{name:"sourceId2",type:"string"},{name:"sourceDesc2",type:"string"},{name:"sourceId3",type:"string"},{name:"sourceDesc3",type:"string"},{name:"fileId",type:"string"},{name:"confirmFlag",type:"string"}]});Ext.define("ALM.store.AlarmStore",{extend:"Ext.data.Store",storeId:"alarm_store",model:"ALM.model.AlarmModel"});Ext.define("ALM.view.component.TextCarousel",{extend:"Ext.Component",alias:"widget.textcarousel",interval:5000,initComponent:function(){this.callParent(arguments)},afterRender:function(){var a=this;this.callParent(arguments);this.running=false;this.setData(this.initialConfig.data);this.addEvents("click");this.getEl().on("click",function(){var b=Math.min(a.current,a._data.length)%a._data.length;a.fireEvent("click",a,a.getData()[b])})},stop:function(){if(this._interval){clearInterval(this._interval);this._interval=null}},start:function(){var a=this;this.stop();if(!this._interval){this._interval=setInterval(function(){a.scroll()},this.interval)}},getData:function(){return Ext.clone(this._data||[])},setData:function(f){this.stop();if(!f||!(f instanceof Array)){f=[]}this._data=Ext.clone(f);var b=Ext.clone(f);if(b.length>0){b.push(f[0])}this.update(b);if(b.length<2){return}this.current=0;var d=this.getEl();this.div=d.down("div");this.ul=this.div.down("ul");var c=this.ul.query("li");Ext.Array.each(c,function(i){i.style.overflow="hidden";i.style["float"]="none"});this.ul.setStyle({margin:"0",padding:"0",position:"relative","list_style-type":"none","z-index":"1"});this.div.setStyle({visibility:"visible",overflow:"hidden",position:"relative","z-index":"2",left:"0px"});var a=c[0];var h=a.offsetHeight+(parseInt(a.style.marginTop)||0)+(parseInt(a.style.marginBottom)||0);var e=h*c.length;var g=h;Ext.Array.each(c,function(i){i.style.width=i.offsetWidth;i.style.height=i.offsetHeight});this.ul.setStyle({height:e+"px",top:0});this.div.setStyle({height:g+"px"});this.liHeight=h;d.hover(this.stop,this.start,this);this.start()},scroll:function(){if(this.data.length<1){return}if(!this.running){if(this.current>=this.data.length-1){this.current=0;this.ul.setStyle("top",0+"px")}this.current++;this.running=true;this.ul.setY(this.div.getY()-(this.current*this.liHeight),{duration:500,easing:"bounceOut",callback:function(){this.running=false},scope:this})}},tpl:['<div class="trayAlarm">',"<ul>",'<tpl for=".">',"<li><span>{time}</span>{text}</li>","</tpl>","</ul>","</div>"]});Ext.define("ALM.view.transaction.RaiseAlarm",{requires:["ALM.model.AlmViewAlarmMsgOut"],extend:"MES.view.form.BaseForm",title:T("Caption.Menu.Raise Alarm"),alias:"widget.alm_tran",formReader:{url:"service/AlmViewAlarmMsg.json",model:"ALM.model.AlmViewAlarmMsgOut"},buttonsOpt:[{itemId:"btnProcess",url:"service/AlmRaiseAlarm.json",params:{procstep:"1"}}],initComponent:function(){this.callParent();var a=this;this.on("afterrender",function(){a.sub("cdvAlarm").on("select",function(b){a.reloadForm(a)})})},reloadForm:function(a){this.formLoad({procstep:"1",alarmId:a.sub("cdvAlarm").getValue()})},buildForm:function(){return[{xtype:"container",height:24,layout:{type:"hbox",align:"stretch"},items:[{xtype:"codeview",codeviewName:"SERVICE",itemId:"cdvAlarm",labelStyle:"font-weight:bold",fieldLabel:T("Caption.Other.Alarm ID"),labelSepaator:"",labelWidth:130,value:"TST001",popupConfig:{title:T("Caption.Other.Alarm ID"),columns:[{header:T("Caption.Other.Alarm"),dataIndex:"alarmId",flex:2},{header:T("Caption.Other.Description"),dataIndex:"alarmDesc",flex:2}]},paramsScope:this,store:"SEC.store.AlmViewAlarmMsgListOut.alarmList",params:{procstep:"1"},name:"alarmId",fields:[{column:"alarmId",flex:2}]},{xtype:"checkbox",boxLabel:T("Caption.Other.Set Clear Flag"),itemId:"chkClearFlag",name:"setClearFlag",cls:"marginL7"}]},{xtype:"textfield",fieldLabel:T("Caption.Other.Lot ID"),itemId:"txtLotId",cls:"marginT5",name:"lotId",labelWidth:130},{xtype:"codeview",fieldLabel:T("Caption.Other.Resource ID"),labelWidth:130,codeviewName:"TbResource",labelStyle:"font-weight:bold",value:"BTEST",name:"resId"},{xtype:"textfield",fieldLabel:T("Caption.Other.Source ID 1"),labelWidth:130,name:"sourceId1",value:"11"},{xtype:"textfield",fieldLabel:T("Caption.Other.Source Desc 1"),labelWidth:130,name:"sourceDesc1",value:"11"},{xtype:"textfield",fieldLabel:T("Caption.Other.Source ID 2"),labelWidth:130,value:"22",name:"sourceId2"},{xtype:"textfield",fieldLabel:T("Caption.Other.Source Desc 2"),labelWidth:130,value:"22",name:"sourceDesc2"},{xtype:"textfield",fieldLabel:T("Caption.Other.Source ID 3"),labelWidth:130,value:"33",name:"sourceId3"},{xtype:"textfield",fieldLabel:T("Caption.Other.Source Desc 3"),labelWidth:130,value:"33",name:"sourceDesc3"},{xtype:"textfield",fieldLabel:T("Caption.Other.Alarm Subject"),labelWidth:130,value:"subject",name:"alarmSubject"},{xtype:"textareafield",fieldLabel:T("Caption.Other.Alarm Message"),labelWidth:130,name:"alarmMsg",value:"msg",height:80},{xtype:"textfield",fieldLabel:T("Caption.Other.Comment 1"),labelWidth:130,value:"cmt",name:"alarmComment1"},{xtype:"textfield",fieldLabel:T("Caption.Other.Comment 2"),labelWidth:130,value:"cmt",name:"alarmComment2"},{xtype:"textfield",fieldLabel:T("Caption.Other.Comment 3"),labelWidth:130,value:"cmt",name:"alarmComment3"},{xtype:"textfield",fieldLabel:T("Caption.Other.Comment 4"),labelWidth:130,value:"cmt",name:"alarmComment4"},{xtype:"textfield",fieldLabel:T("Caption.Other.Comment 5"),labelWidth:130,value:"cmt",name:"alarmComment5"}]}});Ext.define("ALM.view.inquiry.ViewPublishMessage",{extend:"MES.view.form.BaseForm",alias:"widget.alm_publish_msg",title:T("Caption.Other.Alarm"),bodyCls:"",requires:["ALM.model.AlarmModel"],layout:{type:"vbox",align:"stretch"},initComponent:function(){var a=this;this.callParent();this.add(this.buildGeneral());this.add(this.buildDetailView());var b=Ext.getStore("ALM.store.AlarmStore");this.sub("grdAlarmList").on("itemclick",function(d,c){a.sub("ctnMain").removeAll(true);a.sub("ctnMain").add(a.addField(c));c.data.confirmFlag="Y";a.sub("grdAlarmList").getView().removeRowCls(c,"unconfirmed");SF.cf.checkAlarmCount()});this.sub("btnDel").on("click",function(){var d=a.sub("grdAlarmList").selModel.getSelection();for(var c=0;c<d.length;c++){a.alarmAcknowledge(d[c],b)}});this.sub("btnUnRead").on("click",function(){var d=a.sub("grdAlarmList").selModel.getSelection();for(var c=0;c<d.length;c++){d[c].data.confirmFlag="";a.sub("grdAlarmList").getView().addRowCls(d[c],"unconfirmed")}SF.cf.checkAlarmCount()})},alarmAcknowledge:function(b,a){Ext.Ajax.request({url:"service/AlmAckAlarm.json",method:"GET",params:{procstep:"1",alarmId:b.data.alarmId,sourceId1:b.data.sourceId1,tranTime:b.data.createTime,ackUserId:"ADMIN"},success:function(d,e){var c=Ext.JSON.decode(d.responseText);if(c.msgcode==="CMN-0000"){a.remove(b);this.sub("ctnMain").removeAll(true);SF.cf.checkAlarmCount()}else{Ext.log(c.msgcode)}},failure:function(c,d){Ext.log("failure Ack Alarm")},scope:this})},addField:function(f){var t=f.get("alarmId");var h=f.get("alarmSubject");var m=f.get("alarmMsg");var s=f.get("alarmComment1");var r=f.get("alarmComment2");var q=f.get("alarmComment3");var p=f.get("alarmComment4");var o=f.get("alarmComment5");var l=f.get("sourceId1");var k=f.get("sourceId2");var i=f.get("sourceId3");var a=f.get("sourceDesc1");var v=f.get("sourceDesc2");var u=f.get("sourceDesc3");var b=f.get("alarmLevel");var g=f.get("alarmType");var c=f.get("lotId");var d=f.get("resId");var j=f.get("fileId");var n=Ext.Date.parse(f.get("createTime"),"YmdHis");var e="";if(j!=undefined&&j!=""){e='<img src= "/mesplus/service/bas_download_file/'+j+'.do"/>'}return{xtype:"container",autoScroll:true,layout:{type:"anchor"},cls:"noticeContent",html:['<div class="alarmHeader">','<div class="subject alarmLevel '+b+'">'+h+" <span>"+n+" </span></div>",'<div class="alarmInfo">',"<span>alarm ID : "+t+" </span>","<span>Resource ID : "+d+" </span>","</div>","</div>",'<div class="alarmContent">'+e+m+" </div>",'<div class="alarmTable">',"<table>","<tr>",'<td class="label">source ID 1</td>',"<td>"+l+"</td>",'<td class="label">description 1</td>',"<td>"+a+"</td>","</tr>","<tr>",'<td class="label">source ID 2</td>',"<td>"+k+"</td>",'<td class="label">description 2</td>',"<td>"+v+"</td>","</tr>","<tr>",'<td class="label">source ID 3</td>',"<td>"+i+" </td>",'<td class="label">description 3</td>',"<td>"+u+"</td>","</tr>","<tr>",'<td class="label">type</td>',"<td>"+g+"</td>",'<td class="label">lot id</td>',"<td>"+c+"</td>","</tr>","<tr>",'<td class="label">comment 1</td>',"<td colspan=3>"+s+"</td>","</tr>","<tr>",'<td class="label">comment 2</td>',"<td colspan=3>"+r+"</td>","</tr>","<tr>",'<td class="label">comment 3</td>',"<td colspan=3>"+q+"</td>","</tr>","<tr>",'<td class="label">comment 4</td>',"<td colspan=3>"+p+"</td>","</tr>","<tr>",'<td class="label">comment 5</td>',"<td colspan=3>"+o+"</td>","</tr>","</table>","</div>"]}},buildGeneral:function(a){return{xtype:"container",flex:1,layout:{type:"vbox",align:"stretch"},items:[{xtype:"grid",flex:1,store:Ext.getStore("ALM.store.AlarmStore"),autoScroll:true,itemId:"grdAlarmList",selModel:Ext.create("Ext.selection.CheckboxModel"),multiSelect:true,viewConfig:{getRowClass:function(b,e,d,c){if(b.get("confirmFlag")!="Y"){return"unconfirmed"}}},columns:[{xtype:"rownumberer",cls:"confirmTd",align:"center",width:45},{header:T("Caption.Other.Alarm ID"),dataIndex:"alarmId",flex:1},{header:T("Caption.Other.Message"),renderer:function(b,c,d){var e=d.get("alarmLevel")||"";c.tdCls="alarmLevel level"+e;return b},dataIndex:"alarmMsg",flex:2},{header:T("Caption.Other.Issue Date"),dataIndex:"createTime",align:"center",width:200}]},{bbar:{layout:{pack:"end"},cls:"cellLightGray",items:[{xytpe:"button",width:75,height:20,text:"Delete",itemId:"btnDel"},{xytpe:"button",width:75,height:20,text:"UnRead",itemId:"btnUnRead"}]}}]}},buildDetailView:function(a){return[{xtype:"splitter",height:5},{xtype:"container",itemId:"ctnMain",autoScroll:true,flex:1,layout:{type:"vbox",align:"stretch"},items:[]}]}});Ext.require(["mixin.Communicator"]);Ext.define("ALM.controller.ALMController",{extend:"Ext.app.Controller",stores:["ALM.store.AlarmStore"],models:["ALM.model.AlarmModel"],views:["ALM.view.inquiry.ViewPublishMessage","ALM.view.transaction.RaiseAlarm","ALM.view.component.TextCarousel"],init:function(){this.control({viewport:{afterrender:this.onViewportRendered}})},onViewportRendered:function(){var a=this;setTimeout(function(){var b=Ext.getStore("ALM.store.AlarmStore");Ext.Ajax.request({url:"service/SecViewSessionInfo.json",method:"GET",params:{procstep:"1"},success:function(c,d){result=Ext.JSON.decode(c.responseText);if(result.messagingLocation!=""&&result.messagingLocation!=undefined){Ext.Array.each(result.almChannels,function(e){SmartFactory.communicator.subscribe(e,function(f){var g=JSON.parse(f.data.toString());if(g.fileinfo!=undefined){g.fileId=g.fileinfo[0].fileId}b.add(g);SmartFactory.msg("Alarm",g.alarmMsg);SF.cf.checkAlarmCount()})})}},failure:function(c,d){Ext.log("SecViewSessionInfo.")},scope:this});if(SmartFactory.setting.get("alarm")!=null){Ext.Array.each(SmartFactory.setting.get("alarm"),function(c){b.add(c)});SF.cf.checkAlarmCount()}},3000);SmartFactory.status.tray({xtype:"textcarousel",id:"alm_tray_carousel",cls:"trayNotice",iconCls:"trayNoticeIcon",data:[],width:22,listeners:{click:function(b,c){if(c){SmartFactory.msg("Alarm Clicked",c.text)}SmartFactory.addContentView({xtype:"alm_publish_msg",itemId:"alm_publish_msg"})}}});SmartFactory.status.tray({xtype:"button",id:"alm_tray_count",cls:"trayNotice",hidden:true,handler:function(){SmartFactory.addContentView({xtype:"alm_publish_msg",itemId:"alm_publish_msg"})}})}});