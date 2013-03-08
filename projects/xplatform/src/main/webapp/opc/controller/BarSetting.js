Ext.define('Opc.controller.BarSetting', {
	extend : 'Opc.controller.BaseController',

	views : [ 'BarSetting' ],

	refs : [ {
		selector : 'barsetting',
		ref : 'barSetting'
	}, {
		selector : 'navigator #txbar',
		ref : 'txBar'
	} ],

	init : function() {
		this.control({
			'barsetting' : {
				afterrender : this.onRender
			},
			'barsetting dataview' : {
				afterrender : this.onRenderDataview
			}
		});
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
		},
		// Called when element is dropped not anything other than a dropzone
		// with the same ddgroup
		onInvalidDrop : function() {
			// Set a flag to invoke the animated repair
			this.invalidDrop = true;
		},
		// Called when the drag operation completes
		endDrag : function() {
			// Invoke the animation if the invalidDrop flag is set to true
			if (this.invalidDrop === true) {
				// Remove the drop invitation
				this.el.removeCls('dropOK');

				// Create the animation configuration object
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
				delete this.invalidDrop;
			}
		},

		// Called upon successful drop of an element on a DDTarget with the same
		onDragDrop : function(evtObj, targetElId) {
			// Wrap the drop target element with Ext.Element
			var dropEl = Ext.get(targetElId);

			// Perform the node move only if the drag element's
			// parent is not the same as the drop target
			if (this.el.dom.parentNode.id != targetElId) {

				// Move the element
				dropEl.appendChild(this.el);

				// Remove the drag invitation
				this.onDragOut(evtObj, targetElId);

				// Clear the styles
				this.el.dom.style.position = '';
				this.el.dom.style.top = '';
				this.el.dom.style.left = '';
			} else {
				// This was an invalid drop, initiate a repair
				this.onInvalidDrop();
			}
		},
		// Only called when the drag element is dragged over the a drop target
		// with the same ddgroup
		onDragEnter : function(evtObj, targetElId) {
			// Colorize the drag target if the drag node's parent is not the
			// same as the drop target
			if (targetElId != this.el.dom.parentNode.id) {
				this.el.addClass('dropOK');
			} else {
				// Remove the invitation
				this.onDragOut();
			}
		},
		// Only called when element is dragged out of a dropzone with the same
		// ddgroup
		onDragOut : function(evtObj, targetElId) {
			this.el.removeCls('dropOK');
		}
	},

	onRender : function() {
	},

	onRenderDataview : function(view) {
		var self = this;

		/*
		 * TODO DD를 설정할 적절한 시점을 잡아야..
		 */
		setTimeout(function() {
			var txs = view.getEl().select('div.tx');

			Ext.each(txs.elements, function(el) {
				var dd = new Ext.dd.DD(el, 'txDDGroup', {
					isTarget : false
				});
				Ext.apply(dd, self.overrides);
			});

			var txSettingId = self.getBarSetting().getEl().id;
			var txBarId = self.getTxBar().getEl().id;

			new Ext.dd.DDTarget(txSettingId, 'txDDGroup');
			new Ext.dd.DDTarget(txBarId, 'txDDGroup');
		}, 1000);
	}

});