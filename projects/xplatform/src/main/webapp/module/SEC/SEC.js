/*
Copyright(c) 2012 Miracom, Inc.
*/
Ext.define("SEC.controller.SECController",{extend:"Ext.app.Controller",stores:[],models:[],views:[],init:function(){this.control({viewport:{afterrender:this.onViewportRendered}})},onViewportRendered:function(){SmartFactory.addSideMenu("Ext.button.Button",{text:SmartFactory.login.name,menu:[{text:T("Caption.Other.Profile"),handler:function(){SmartFactory.doMenu({viewModel:"SEC.view.setup.UserProfile",itemId:"WSECPROF"})}},{text:T("Caption.Other.Logout"),handler:function(){Ext.MessageBox.confirm("Confirm","Are you sure you want to do that?",function(a){if(a==="yes"){document.location.href="logout"}})}}]})}});
