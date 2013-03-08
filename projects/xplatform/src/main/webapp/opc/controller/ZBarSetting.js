Ext.define('Opc.controller.ZBarSetting', {
	extend : 'Ext.app.Controller',

	views : [ 'BarSetting' ],

	refs : [ {
		selector : 'barsetting',
		ref : 'barSetting'
	}, {
		selector : 'navigator [itemId=txbar]',
		ref : 'txBar'
	} ],

	init : function() {
		this.control({
			'barsetting' : {
			// afterrender : this.onAfterRender
			},
			'barsetting dataview' : {
				afterrender : this.onRenderDataview
			// onRenderDataview
			}
		});
	},

	// TODO 예전 소스
	onAfterRender : function() {
		var self = this;

		self.getTxBar().on('add', function(me, component) {
			component.on('afterrender', function() {
				var proxy = new Ext.dd.DragSource(component.getEl(), {
					group : 'downGroup'
				});

				proxy.afterDragDrop = function(target, e, id) {
					this.removeFromGroup('downGroup');
					self.getTxBar().remove(Ext.getCmp(this.id));
				};
			});

		});

		setTimeout(function() {
			var items = self.getBarSetting().getEl().select('div.tx');

			Ext.each(items.elements, function(el) {
				var proxy = new Ext.dd.DragSource(el, {
					group : 'upGroup'
				});

				proxy.afterDragDrop = function(target, e, id) {
					var itemId = this.el.getAttribute('itemId');

					// check already added button
					if (!self.getTxBar().child('[itemId=' + itemId + ']')) {
						self.getTxBar().add({
							xtype : 'button',
							text : itemId,
							cls : itemId,
							itemId : itemId
						});
					} else {
						Ext.Msg.alert('Error', 'Already Exist!!!');
					}
				};
			});

			var btns = self.getTxBar().getEl().select('div.x-btn');

			Ext.each(btns.elements, function(el) {
				var proxy = new Ext.dd.DragSource(el, {
					group : 'downGroup'
				});

				proxy.afterDragDrop = function(target, e, id) {
					this.removeFromGroup('downGroup');
					self.getTxBar().remove(Ext.getCmp(this.id));
				};
			});

			new Ext.dd.DDTarget(self.getTxBar().getEl().id, 'upGroup');
			new Ext.dd.DDTarget(self.getBarSetting().getEl().id, 'downGroup');
		}, 1000);
	},

	overrides : {
		// Called the instance the element is dragged.
		b4StartDrag : function() {
			// Cache the drag element
			if (!this.el) {
				this.el = Ext.get(this.getEl());
			}

			// Cache the original XY Coordinates of the element, we'll use this
			// later.
			this.originalXY = this.el.getXY();
			if (this.el.hasCls('refusal')) {
				this.el.removeCls('refusal');
			}
			this.el.addCls('select');
			
//			this.el.appendTo(Ext.getBody());
		},

		// Called when the drag operation completes
		endDrag : function() {
			this.el.removeCls('select');

			var animCfgObj = {
				easing : 'elasticOut',
				duration : 1,
				scope : this,
				callback : function() {
					// Remove the position attribute
					this.el.dom.style.position = '';
				}
			};

			// Apply the repair animation
			this.el.moveTo(this.originalXY[0], this.originalXY[1], animCfgObj);
		}
	},

	// TODO 새로 추가한 소스
	onRenderDataview : function(view) {
		var self = this;

		self.getTxBar().on('add', function(me, component) {
			component.on('afterrender', function() {
				var dd = new Ext.dd.DD(component.getEl(), 'barsetting', {
					isTarget : false
				});

				self.overrides.onDragDrop = function(evtObj, targetElId) {
					dd.removeFromGroup('barsetting');
					self.getTxBar().remove(Ext.getCmp(dd.id));
				};

				Ext.apply(dd, self.overrides);
			});

		});

		/*
		 * TODO DD를 설정할 적절한 시점을 잡아야..
		 */
		setTimeout(function() {
			var txs = view.getEl().select('div.tx');

			Ext.each(txs.elements, function(el) {
				var dd = new Ext.dd.DD(el, 'barsetting', {
					isTarget : false
				});

				self.overrides.onDragDrop = function(evtObj, targetElId) {
					var itemId = this.el.getAttribute('itemId');

					// check already added button
					if (!self.getTxBar().child('[itemId=' + itemId + ']')) {
						self.getTxBar().add({
							xtype : 'button',
							text : itemId,
							cls : itemId,
							itemId : itemId
						});
						self.overrides.endDrag();
					} else {
						Ext.Msg.alert('Error', 'Already Exist!!!');
						this.onInvalidDrop();
					}
				};

				Ext.apply(dd, self.overrides);
			});

//			var btns = self.getTxBar().getEl().select('div.x-btn');
//
//			Ext.each(btns.elements, function(el) {
//				var dd = new Ext.dd.DD(el, 'barsetting', {
//					isTarget : false
//				});
//
//				self.overrides.onDragDrop = function(evtObj, targetElId) {
//					dd.removeFromGroup('barsetting');
//					self.getTxBar().remove(Ext.getCmp(dd.id));
//				};
//
//				Ext.apply(dd, self.overrides);
//			});

			new Ext.dd.DDTarget(self.getTxBar().getEl().id, 'barsetting');
//			new Ext.dd.DDTarget(self.getBarSetting().getEl().id, 'barsetting');
		}, 1000);
	}
});