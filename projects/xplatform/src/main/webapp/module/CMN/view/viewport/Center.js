Ext.require([ 'Ext.ux.tab.TabScrollerMenu', 'Ext.ux.tab.TabCloseMenu' ]);

Ext.define('CMN.view.viewport.Center', {

	extend : 'Ext.tab.Panel',

	id : 'content',
	
	bodyCls : 'introImg',

	alias : 'widget.viewport.center',

	enableTabScroll : true,
	
	tabBar: {
	  xtype:'tabbar',
	  cls:'centertabbarbg'
	},

	plugins : [ {
		ptype : 'tabscrollermenu',
		maxText : 10,
		pageSize : 5
	}, {
		ptype : 'tabclosemenu'
	} ],

	listeners : {
		tabchange : function(panel, newcard, oldcard) {
			SF.history.add(newcard);
		},
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
	},
	
	/*
	 * TabPanel에 아무것도 없는 상태가 되면, 토큰이 없는 브라우저 History가 추가된다.
	 * 이 부분은 listener의 'remove' 로 대체하면 안된다.
	 * listener의 'remove' 이벤트는 버블링되는 이벤트를 다 받기 때문이다.
	 */
	onRemove: function(item, autoDestroy) {
		this.callParent(arguments);
		
		if(this.items.length == 0) {
			SF.history.add();
		}
	}
});