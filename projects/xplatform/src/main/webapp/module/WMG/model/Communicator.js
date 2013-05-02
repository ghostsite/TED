Ext.define('WMG.model.Communicator', {
	extend: 'Ext.data.Model',
	
	fields: [
		{ name: 'loginname', type: 'string'},
		{ name: 'username', type: 'string' },
		{ name: 'status', type: 'string' }
  ]
});