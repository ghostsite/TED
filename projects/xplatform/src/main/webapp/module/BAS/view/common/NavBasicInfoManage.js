/*
 * File: BAS/view/common/NavBasicInfoManage.js
 */

Ext.define('BAS.view.common.NavBasicInfoManage', {
	extend : 'Ext.panel.Panel',

	xtype : 'bas_nav_basicinfo',

	layout : 'fit',

	title : T('Caption.Other.Basic Informations'),

	//TODO : cls 수정 문의중... 스크롤 생김
	//autoScroll : true,

	initComponent : function() {
		var me = this;
		Ext.applyIf(me, {
			items : [ {
				xtype : 'dataview',
				itemId : 'dvMenu',
				store : Ext.create('Ext.data.JsonStore', {
					fields : [ 'title', 'desc', 'view', 'itemId', 'entityType' ],
					//TODO : entity type 확인해야함.
					// setup 처럼 특정 테이블이 지정되어있는 경우 entityType은 테이블명으로...
					// process 기능처럼 특정 이벤트를 발생하는 경우 entityType 고유의 서비스 구분명으로...
					data : [ {
						cls : 'requested',
						title : T('Caption.Other.Flow'),
						desc : T('Caption.Other.Flow List'),
						view : 'BAS.view.setup.FlowList',
						itemId : 'BasFlowList',
						inprogressSize : 10
					}, {
						cls : 'requested',
						title : T('Caption.Other.Field'),
						desc : T('Caption.Other.Field List'),
						view : 'BAS.view.setup.FieldList',
						itemId : 'BasFieldList',
						inprogressSize : 10
					}, {
						cls : 'requested',
						title : T('Caption.Other.Vendor'),
						desc : T('Caption.Other.Vendor List'),
						view : 'BAS.view.setup.VendorList',
						itemId : 'BasVendorList',
						inprogressSize : 10
					}, {
						cls : 'requested',
						title : T('Caption.Other.Province'),
						desc : T('Caption.Other.Province List'),
						view : 'BAS.view.setup.ProvinceList',
						itemId : 'BasProvinceList',
						inprogressSize : 10
					}, {
						cls : 'requested',
						title : T('Caption.Other.Telecom'),
						desc : T('Caption.Other.Telecom List'),
						view : 'BAS.view.setup.TelecomList',
						itemId : 'BasTelecomList',
						inprogressSize : 10
					}, {
						cls : 'requested',
						title : T('Caption.Other.Country'),
						desc : T('Caption.Other.Country List'),
						view : 'BAS.view.setup.CountryList',
						itemId : 'BASCountryList',
						inprogressSize : 10
					}, {
						cls : 'requested',
						title : T('Caption.Other.City'),
						desc : T('Caption.Other.City List'),
						view : 'BAS.view.setup.CityList',
						itemId : 'BasCityList',
						inprogressSize : 10
					}, {
						cls : 'requested',
						title : T('Caption.Other.MatType'),
						desc : T('Caption.Other.MatType List'),
						view : 'BAS.view.setup.MatTypeList',
						itemId : 'BasMatTypeList',
						inprogressSize : 10
					} ]
				}),
				cls : 'requestRegiList',
				itemSelector : 'div',
				overItemCls : 'chgreq-menu-hover',
				tpl : [ '<tpl for="."><div class={cls}>{title}<span>{inprogressSize}</span></div></tpl>' ]
			} ]
		});

		me.callParent(arguments);
	}

});