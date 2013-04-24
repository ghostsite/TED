/**
 * Help Action
 * @extends Ext.Action
 */
Ext.define('TES.view.gis.simple.help.Action', {
    extend: 'Ext.Action',
    alias : 'widget.cf_helpaction',
    requires: ['TES.view.gis.simple.help.Window'],

    /**
     * @property {String} windowContentEl
     * Sets the window contentEl property
     */
    /**
     * @cfg {Boolean} activateOnEnable
     *  Sets the window contentEl property
     */
    windowContentEl: null,

    /**
     * @private
     * @cfg {_window}
     *  The instance of the help window created.
     */
    _window: null,

    /**
     * @private
     *
     * @param {Object} config (optional) Config object.
     *
     */
    constructor: function(config) {
        Ext.apply(config, {
            handler: function() {
                if (!this._window) {
                    this._window = Ext.create('TES.view.gis.simple.help.Window', {
                        contentEl: this.windowContentEl
                    });
                }
                this._window.show();
            },
            text: "Help"
        });
        this.callParent(arguments);
    }
});
