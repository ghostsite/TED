Ext.define('mixin.Exporter', function() {
	
	function text(col, arr) {
		var length = col.length || 0;
		var maxCnt = 0;
		if (col && length > 0) {
			for ( var i = 0, length = col.length; i < length; i++) {
				if (col[i].hidden != true && col[i].exported != false) {
					if(col[i].xtype == 'rownumberer' || col[i].dataIndex || (col[i].items.getCount && col[i].items.getCount() > 0)){
						var item = [];
						var e = {};
						if (col[i].header || col[i].text){
							var header = col[i].header || col[i].text;
							if(header == '&#160'){
								//&nbsp는 '  '로 header 표시
								e['header'] = '  ';
							}else{
								e['header'] = header;
							}
						}
						if (col[i].dataIndex)
							e['dataIndex'] = col[i].dataIndex;
						if (col[i].width)
							e['width'] = col[i].width;
						if (col[i].xtype && col[i].xtype == 'rownumberer')
							e['xtype'] = col[i].xtype;
						if (col[i].items.getCount() > 0) {
							text(col[i].items.items, item);
							e['columns'] = item;
						}
						arr.push(e);
					}
				}
			}
		}
		return maxCnt;
	}

	function getExportColumns(grid) {
		var t = [];
		if (!grid)
			return [];
		if (grid.lockedGrid) {
			text(grid.lockedGrid.columns, t);
		}
		if (grid.normalGrid) {
			text(grid.normalGrid.columns, t);
		}

		if (t.length == 0) {
			text(grid.columns, t);
		}
		return t;
	};

	function getExportParams(title, grid, params) {
		params = params || {};
		if(grid){
			params['export'] = {
					title : title || '',
					columns : getExportColumns(grid)
				};
		}
		
		for ( var key in params) {
			if (Ext.typeOf(params[key]) === 'object' || Ext.typeOf(params[key]) === 'array') {
				params[key] = Ext.JSON.encode(params[key]);
			}
		}
		return params;
	}
	
	var form = null;
	
	function exportForm() {
		if(form)
			return form;
		
		var body = Ext.getBody();
		
		if(!body.getById('_exportFrame')){
			body.createChild({
				tag : 'iframe',
				cls : 'x-hidden',
				id : '_exportFrame',
				name : '_exportFrame'
			});
		}
		
		if(!body.getById('_exportForm')){
			form = body.createChild({
				tag : 'form',
				cls : 'x-hidden',
				id : '_exportForm',
				target : '_exportFrame'
			});
		}
		else{
			form = body.getById('_exportForm');
		}
				
		return form;
	}

	function doExport(url, title, grid, params) {
		if (!params) {
			Ext.Msg.alert('Error', 'Parameter is undefined');
			return false;
		}
		Ext.Ajax.request({
			url : url,
			params : getExportParams(title, grid, params) || {},
			form : exportForm(),
			isUpload : true
		});
	}
	
	function doDownload(url) {
		var downloader = Ext.getCmp('filedownloader');
		downloader.load({
		    url: url
		});
	}
	
	return {
		exporter : {
			doExport : doExport,
			doDownload : doDownload
		}
	};
}());
