Ext.define('MEStouch.controller.EventList', {
    extend: 'Ext.app.Controller',

    config: {

        refs: {
            eventlist: 'eventlist'
        },

        control: {
            'eventlist': {
                itemtap: 'selectEvent'
            }
        }
    },

    selectEvent: function(field, index, target, record) {
        this.getEventlist().config.target.setValue(record.get('eventId'));
        this.getEventlist().config.navigationView.pop();
    }
});