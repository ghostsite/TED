/** 
 * @class CMN.plugin.Supplement
 * @extends Ext.Base
 * @author Kyunghyang
 * FormDesign에서 condition view를 오른쪽 supplement영역에 표시한다. content의 view와 연동되어 생성 및 삭제된다.
 */
Ext.define('CMN.plugin.Supplement', {
	extend : 'Ext.Base',

	_supplimentContainer : null,
	
	init : function(client) {
		_supplimentContainer = Ext.getCmp('east');
		
		if(!_supplimentContainer) {
			client.getSupplement = Ext.emptyFn;
			client.setSupplement = Ext.emptyFn;
			
			return;
		}
			
		if (!client.getSupplement) {
			client.getSupplement = function() {
				return this.supplement;
			};
		}

		if (!client.setSupplement) {
			client.setSupplement = this.setSupplement;
		}

		function onAdded() {
			if (this.getSupplement()) {
				this.setSupplement(this.getSupplement());
				this.fireEvent('supready', this, this.getSupplement());
				this.getSupplement().fireEvent('supready', this, this.getSupplement());
			}
		}

		function onActivate() {
			if (this.getSupplement()) {
				_supplimentContainer.getLayout().setActiveItem(this.getSupplement());
				if(this.getSupplement().isPanel && this.getSupplement().title) {
					_supplimentContainer.setTitle(this.getSupplement().title);
				} else if(client.isPanel){
					_supplimentContainer.setTitle(client.title);
				}
			}
		}

		function onDeactivate() {
			_supplimentContainer.getLayout().setActiveItem('base');
			_supplimentContainer.setTitle(_supplimentContainer.getComponent('base').title);
		}

		function onDestroy() {
			var sup = this.getSupplement();
			
			if (sup && Ext.getClassName(sup)){
				_supplimentContainer.remove(this.getSupplement());
			}
			this.setSupplement(null);
		}

		client.on('activate', onActivate, client);
		client.on('deactivate', onDeactivate, client);
		client.on('destroy', onDestroy, client);
		client.on('added', onAdded, client);
	},

	setSupplement : function(supplement) {
		if (Ext.isString(supplement)) {
			this.supplement = Ext.create(supplement);
		} else {
			this.supplement = supplement;
		}
		
		if(this.supplement) {
			var self = this;
			this.supplement.getSupplementClient = function() {
				return self;
			};
		}
		
		if (this.getSupplement()) {
			this.supplement = _supplimentContainer.add(this.getSupplement());
			if (this.supplement.isPanel) {
				this.supplement.preventHeader = true;
				if (this.supplement.rendered) {
					this.supplement.updateHeader();
				}

				if (this.supplement.isPanel) {
					this.supplement.setBorder(false);
				}
			}
			_supplimentContainer.getLayout().setActiveItem(this.supplement);
			this.supplement.doLayout();
		}
	}
});
