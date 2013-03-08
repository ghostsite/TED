Ext.define('CMN.view.viewport.East', {
	extend : 'Ext.panel.Panel',

	alias : 'widget.viewport.east',
	id : 'east',
	cls : 'nav supplement',
	title : T('Caption.Other.Supplement'),
	
	layout : 'card',
	
	listeners : {
		expand : function() {
			this.doLayout();
		}
	},
		
	/* 
	 * 'east' 영역은 'base'라는 아이템의 View를 items에 가져야 한다.
	 * 보조 패널을 갖지 않는 컨텐트 뷰가 Activate될 때, 이 'base'뷰가 activate된다.
	 * 'base' 아이템은 'title' 속성을 가져야 하며, 'base'의 title이 Supplement Area의 기본 타이틀로 사용된다. 
	 */
	
	items : [{
		xtype : 'box',
		itemId : 'base',
		title : T('Caption.Other.Supplement'),
		preventHeader : true,
		cls : 'defaultSupplementImg'
	}]
});
