Ext.define('TES.view.GIS', {//more examples: file:///E:/Project/Ext/downloaded/geoext2-master/examples/
	extend : 'MES.view.form.BaseForm',
	title : T('Caption.Menu.TES.view.GIS'),
	xtype : 'tes_gis',

	requires : ['GeoExt.panel.Map',
	'GeoExt.data.FeatureStore', 
	'GeoExt.grid.column.Symbolizer', 
	'GeoExt.selection.FeatureModel', 
	'Ext.grid.GridPanel', 
	'Ext.layout.container.Border'],

	initComponent : function() {
		this.callParent();
		
		//test
		//SF.sound.notice();
		//SF.communicator.subscribe('/service/chat',function(msg){
			//console.log(msg);
		//});
		//SF.communicator.publish('/service/chat',{"name":"hello , i am zwz"});
	},

	buildForm : function() {
		var map = new OpenLayers.Map();
		var wmsLayer = new OpenLayers.Layer.WMS("vmap0", "http://vmap0.tiles.osgeo.org/wms/vmap0", {
			layers : 'basic'
		});

		// create vector layer
		var context = {
			getColor : function(feature) {
				if (feature.attributes.elevation < 2000) {
					return 'green';
				}
				if (feature.attributes.elevation < 2300) {
					return 'orange';
				}
				return 'red';
			}
		};
		var template = {
			cursor : "pointer",
			fillOpacity : 0.5,
			fillColor : "${getColor}",
			pointRadius : 5,
			strokeWidth : 1,
			strokeOpacity : 1,
			strokeColor : "${getColor}",
			graphicName : "triangle"
		};
		var style = new OpenLayers.Style(template, {
			context : context
		});
		var vecLayer = new OpenLayers.Layer.Vector("vector", {
			styleMap : new OpenLayers.StyleMap({
				'default' : style
			}),
			protocol : new OpenLayers.Protocol.HTTP({
				url : "resources/data/tes/summits.json",
				format : new OpenLayers.Format.GeoJSON()
			}),
			strategies : [new OpenLayers.Strategy.Fixed()]
		});
		map.addLayers([wmsLayer, vecLayer]);

		// create map panel
		var mapPanel = Ext.create('GeoExt.panel.Map', {
			title : "Map",
			region : "center",
			height : 400,
			width : 600,
			map : map,
			center : new OpenLayers.LonLat(5, 45),
			zoom : 6
		});

		// create feature store, binding it to the vector layer
		var store = Ext.create('GeoExt.data.FeatureStore', {
			layer : vecLayer,
			fields : [{
				name : 'symbolizer',
				convert : function(v, r) {
					return r.raw.layer.styleMap.createSymbolizer(r.raw, 'default');
				}
			}, {
				name : 'name',
				type : 'string'
			}, {
				name : 'elevation',
				type : 'float'
			}],
			autoLoad : true
		});

		// create grid panel configured with feature store
		var gridPanel = Ext.create('Ext.grid.GridPanel', {
			title : "Feature Grid",
			region : "east",
			store : store,
			width : 340,
			columns : [{
				menuDisabled : true,
				sortable : false,
				width : 30,
				xtype : 'gx_symbolizercolumn',
				dataIndex : "symbolizer"
			}, {
				header : "Name",
				width : 200,
				dataIndex : "name"
			}, {
				header : "Elevation",
				width : 100,
				dataIndex : "elevation"
			}],
			selType : 'featuremodel'
		});

		// create a panel and add the map panel and grid panel
		// inside it
		return Ext.create('Ext.Panel', {
			layout : "border",
			height : 400,
			width : 920,
			items : [mapPanel, gridPanel]
		});
	}
});