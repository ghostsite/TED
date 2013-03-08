Ext.define('SmartFactory.view.Viewport', {
	extend : 'Ext.container.Viewport',

	alias : 'xviewport',

	layout : 'fit',
	
	cls : 'unity',
	
	items : [{
		xtype : 'panel',
		id : 'content',
		layout : 'card',
		dockedItems : [{
			xtype : 'component',
			dock : 'top',
			id : 'title',
			tpl : '<h1>{title}</h1>',
			height : 68
		}, {
			/*
			 * Supplement를 사용하는 View의 트러블을 최소화하기 위한 장치로만 사용됨.
			 */
			layout : 'card',
			xtype : 'panel',
			id : 'east',
			cls : 'nav supplement',
			dock : 'right',
			width : 0,
			hidden : true,
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
		}]
	}],

	listeners : {
		afterrender : function() {
			setTimeout(function() {
				try {
					/* 
					 * 초기 UI가 완전히 렌더링되면, 강제로 History 변경 이벤트를 발생시킨다. 
					 */
					SF.history.force();
				} catch(e) {
				}
			}, 1);
		}
	}
});
