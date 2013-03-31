Ext.define('TES.view.BoxSelect', {
	extend : 'MES.view.form.BaseForm',
	title : 'BoxSelect',

	xtype : 'tes_boxselect',

	layout : 'column',

	initComponent : function() {

		this.callParent();
	},

	buildForm : function() {
		var me = this;
		
		// Define the model for a State
		Ext.define('State', {
			extend : 'Ext.data.Model',
			fields : [{
				type : 'string',
				name : 'abbr'
			}, {
				type : 'string',
				name : 'name'
			}, {
				type : 'string',
				name : 'slogan'
			}, {
				type : 'string',
				name : 'flagUrl',
				convert : function(v, rec) {
					if (rec.data.flagUrl) {
						return rec.data.flagUrl;
					}

					if (rec.data.abbr == 'DC') {
						return 'http://www.wpclipart.com/flags/Countries/U/united_states/usa_district_of_columbia.png';
					}

					var stateName = rec.data.name.replace(/\s/g, '_');
					if (stateName == 'Delaware') {
						stateName = 'Deleware'; // Yeah, ::sadface::
					}

					return 'http://www.wpclipart.com/flags/US_State_Flags/' + rec.data.name.replace(/\s/g, '_') + '.png';
				}
			}]
		});

		// The data for all states
		var states = [{
			"abbr" : "AL",
			"name" : "Alabama",
			"slogan" : "The Heart of Dixie"
		}, {
			"abbr" : "AK",
			"name" : "Alaska",
			"slogan" : "The Land of the Midnight Sun"
		}, {
			"abbr" : "AZ",
			"name" : "Arizona",
			"slogan" : "The Grand Canyon State"
		}, {
			"abbr" : "AR",
			"name" : "Arkansas",
			"slogan" : "The Natural State"
		}, {
			"abbr" : "CA",
			"name" : "California",
			"slogan" : "The Golden State"
		}, {
			"abbr" : "CO",
			"name" : "Colorado",
			"slogan" : "The Mountain State"
		}, {
			"abbr" : "CT",
			"name" : "Connecticut",
			"slogan" : "The Constitution State"
		}, {
			"abbr" : "DE",
			"name" : "Delaware",
			"slogan" : "The First State"
		}, {
			"abbr" : "DC",
			"name" : "District of Columbia",
			"slogan" : "The Nation's Capital"
		}, {
			"abbr" : "FL",
			"name" : "Florida",
			"slogan" : "The Sunshine State"
		}, {
			"abbr" : "GA",
			"name" : "Georgia",
			"slogan" : "The Peach State"
		}, {
			"abbr" : "HI",
			"name" : "Hawaii",
			"slogan" : "The Aloha State"
		}, {
			"abbr" : "ID",
			"name" : "Idaho",
			"slogan" : "Famous Potatoes"
		}, {
			"abbr" : "IL",
			"name" : "Illinois",
			"slogan" : "The Prairie State"
		}, {
			"abbr" : "IN",
			"name" : "Indiana",
			"slogan" : "The Hospitality State"
		}, {
			"abbr" : "IA",
			"name" : "Iowa",
			"slogan" : "The Corn State"
		}, {
			"abbr" : "KS",
			"name" : "Kansas",
			"slogan" : "The Sunflower State"
		}, {
			"abbr" : "KY",
			"name" : "Kentucky",
			"slogan" : "The Bluegrass State"
		}, {
			"abbr" : "LA",
			"name" : "Louisiana",
			"slogan" : "The Bayou State"
		}, {
			"abbr" : "ME",
			"name" : "Maine",
			"slogan" : "The Pine Tree State"
		}, {
			"abbr" : "MD",
			"name" : "Maryland",
			"slogan" : "Chesapeake State"
		}, {
			"abbr" : "MA",
			"name" : "Massachusetts",
			"slogan" : "The Spirit of America"
		}, {
			"abbr" : "MI",
			"name" : "Michigan",
			"slogan" : "Great Lakes State"
		}, {
			"abbr" : "MN",
			"name" : "Minnesota",
			"slogan" : "North Star State"
		}, {
			"abbr" : "MS",
			"name" : "Mississippi",
			"slogan" : "Magnolia State"
		}, {
			"abbr" : "MO",
			"name" : "Missouri",
			"slogan" : "Show Me State"
		}, {
			"abbr" : "MT",
			"name" : "Montana",
			"slogan" : "Big Sky Country"
		}, {
			"abbr" : "NE",
			"name" : "Nebraska",
			"slogan" : "Beef State"
		}, {
			"abbr" : "NV",
			"name" : "Nevada",
			"slogan" : "Silver State"
		}, {
			"abbr" : "NH",
			"name" : "New Hampshire",
			"slogan" : "Granite State"
		}, {
			"abbr" : "NJ",
			"name" : "New Jersey",
			"slogan" : "Garden State"
		}, {
			"abbr" : "NM",
			"name" : "New Mexico",
			"slogan" : "Land of Enchantment"
		}, {
			"abbr" : "NY",
			"name" : "New York",
			"slogan" : "Empire State"
		}, {
			"abbr" : "NC",
			"name" : "North Carolina",
			"slogan" : "First in Freedom"
		}, {
			"abbr" : "ND",
			"name" : "North Dakota",
			"slogan" : "Peace Garden State"
		}, {
			"abbr" : "OH",
			"name" : "Ohio",
			"slogan" : "The Heart of it All"
		}, {
			"abbr" : "OK",
			"name" : "Oklahoma",
			"slogan" : "Oklahoma is OK"
		}, {
			"abbr" : "OR",
			"name" : "Oregon",
			"slogan" : "Pacific Wonderland"
		}, {
			"abbr" : "PA",
			"name" : "Pennsylvania",
			"slogan" : "Keystone State"
		}, {
			"abbr" : "RI",
			"name" : "Rhode Island",
			"slogan" : "Ocean State"
		}, {
			"abbr" : "SC",
			"name" : "South Carolina",
			"slogan" : "Nothing Could be Finer"
		}, {
			"abbr" : "SD",
			"name" : "South Dakota",
			"slogan" : "Great Faces, Great Places"
		}, {
			"abbr" : "TN",
			"name" : "Tennessee",
			"slogan" : "Volunteer State"
		}, {
			"abbr" : "TX",
			"name" : "Texas",
			"slogan" : "Lone Star State"
		}, {
			"abbr" : "UT",
			"name" : "Utah",
			"slogan" : "Salt Lake State"
		}, {
			"abbr" : "VT",
			"name" : "Vermont",
			"slogan" : "Green Mountain State"
		}, {
			"abbr" : "VA",
			"name" : "Virginia",
			"slogan" : "Mother of States"
		}, {
			"abbr" : "WA",
			"name" : "Washington",
			"slogan" : "Green Tree State"
		}, {
			"abbr" : "WV",
			"name" : "West Virginia",
			"slogan" : "Mountain State"
		}, {
			"abbr" : "WI",
			"name" : "Wisconsin",
			"slogan" : "America's Dairyland"
		}, {
			"abbr" : "WY",
			"name" : "Wyoming",
			"slogan" : "Like No Place on Earth"
		}];

		var statesStore = Ext.create('Ext.data.Store', {
			model : 'State',
			storeId : 'States',
			data : states
		});

		// Example of automatic remote store queries and use of various display
		// templates
		var remoteStatesStore = Ext.create('Ext.data.Store', {
			model : 'State',
			storeId : 'RemoteStates',
			proxy : {
				type : 'ajax',
				url : 'resources/data/tes/boxselectdata.json',
				reader : {
					type : 'json',
					root : 'states',
					totalProperty : 'totalCount'
				}
			}
		});

		Ext.tip.QuickTipManager.init();
		var cfgTip = Ext.create('Ext.tip.ToolTip', {
			autoHide : false,
			maxWidth : 600,
			html : 'Field Configuration:'
		});
		var createShowConfigButton = function(config, fieldCmp) {
			var fieldCfg = Ext.String.htmlEncode(Ext.JSON.encodeValue(config, "\n"));
			me.add(Ext.create('Ext.Button', {
				text : 'Show Config',
				cls : 'btn-examplecfg',
				handler : function() {
					cfgTip.update(cfgTip.initialConfig.html + '<br />' + '<pre>' + fieldCfg + '</pre>');
					cfgTip.showBy(fieldCmp.el, 'tl-tr?');
				}
			}));
		};

		/**
		 * Configuration options that are used throughout these examples, unless
		 * overridden in the specific examples
		 */
		var baseExampleConfig = {
			fieldLabel : 'Select multiple states',
			displayField : 'name',
			valueField : 'abbr',
			width : 500,
			labelWidth : 130,
			emptyText : 'Pick a state, any state',
			store : 'States',
			queryMode : 'local'
		};

		var addExampleSelect = function(config) {
			var fieldCfg = Ext.applyIf(config, baseExampleConfig);
			var fieldCmp = Ext.create('Ext.ux.form.field.BoxSelect', Ext.applyIf({
			}, fieldCfg));
			me.add(fieldCmp);
			createShowConfigButton(fieldCfg, fieldCmp);
		}

		/**
		 * Basic BoxSelect using the data store, initialized with multiple
		 * values
		 */
		addExampleSelect({
			value : ['TX', 'CA']
		}, 'basicBoxselect');

		/**
		 * Basic BoxSelect using the data store, initialized with a single value
		 */
		addExampleSelect({
			fieldLabel : 'More States',
			value : 'WA'
		}, 'basicBoxselect');

		/**
		 * Example of more advanced template configurations
		 */
		addExampleSelect({
			delimiter : ', ', // Default, reiterated for showing use in
			// concat'd value
			value : 'AZ, CA, NC',

			// Customized label display for selected values
			labelTpl : '<img src="{flagUrl}" style="height: 25px; vertical-align: middle; margin: 2px;" /> {name} ({abbr})',

			// This tpl config is part of the native ComboBox and is used to
			// control
			// the display of the BoundList (picker), and is only included here
			// for reference
			listConfig : {
				tpl : ['<ul><tpl for=".">', '<li role="option" class="' + Ext.baseCSSPrefix + 'boundlist-item' + '"' + ' style="background-image:url({flagUrl}); background-repeat: no-repeat; background-size: 25px; padding-left: 30px;">' + '{name}: {slogan}</li>', '</tpl></ul>']
			}
		}, 'templateConfigs');

		/**
		 * Example of multiSelect: false
		 */
		addExampleSelect({
			fieldLabel : 'Select a state',
			multiSelect : false,
			filterPickList : true
		}, 'singleSelect');

		/**
		 * Example of: - Using a remote store and automatically querying for
		 * unknown values. - Changing the default delimiter - Initializing with
		 * multiple values via concat'd string - Modifying click behavior
		 * (triggerOnClick) - Modifying templates used for selected values
		 * (labelTpl) - Modifying templates used for dropdown list (part of the
		 * default ComboBox behavior, listConfig.tpl)
		 */
		addExampleSelect({
			fieldLabel : 'With Remote Store',

			// Remote store things
			store : 'RemoteStates',
			pageSize : 25,
			queryMode : 'remote',

			// Value delimiter examples
			delimiter : '|',
			value : 'NC|VA|ZZ',

			// Click behavior
			triggerOnClick : false,

			// Display template modifications
			labelTpl : '{name} ({abbr})',
			listConfig : {
				tpl : ['<ul><tpl for=".">', '<li role="option" class="' + Ext.baseCSSPrefix + 'boundlist-item' + '">{name}: {slogan}</li>', '</tpl></ul>']
			}
		}, 'autoQuery');

		/**
		 * Example of multi-select email address field using: - forceSelection
		 * false to allow new entries to be added -
		 * createNewOnEnter/createNewOnBlur to allow for new entries to be
		 * created for different user interactions - filterPickList true to hide
		 * existing selections from the dropdown picker
		 * 
		 * Note, does not use the baseExampleConfig from this example page.
		 */
		var emails = ['test@example.com', 'somebody@somewhere.net', 'johnjacob@jingleheimerschmidts.org', 'rumpelstiltskin@guessmyname.com', 'fakeaddresses@arefake.com', 'bob@thejoneses.com'];
		addExampleSelect({
			fieldLabel : 'Enter multiple email addresses',
			width : 500,
			growMin : 75,
			growMax : 120,
			labelWidth : 130,
			store : emails,
			queryMode : 'local',
			forceSelection : false,
			createNewOnEnter : true,
			createNewOnBlur : true,
			filterPickList : true
		}, 'emailSuggest');

		/**
		 * Example of stacked, pinList, triggerOnClick and other configuration
		 * options
		 */
		addExampleSelect({
			fieldLabel : 'Select multiple states',
			displayField : 'name',
			width : 500,
			labelWidth : 130,
			store : 'States',
			queryMode : 'local',
			valueField : 'abbr',
			value : 'WA, TX',
			stacked : true,
			pinList : false,
			triggerOnClick : false,
			filterPickList : true
		}, 'otherConfigs');

		/**
		 * Example of value setting, retrieving and value events, and layout
		 * managed height
		 */
		var valuesSelect;
		var valuesExample = Ext.create('Ext.panel.Panel', {
			width : 500,
			bodyPadding : 5,
			layout : {
				type : 'anchor'
			},
			defaults : {
				anchor : '100%',
				border : false
			},
			items : [{
				xtype : 'container',
				defaultType : 'button',
				items : [{
					text : 'Disable',
					enableToggle : true,
					toggleHandler : function(field, state) {
						valuesSelect.setDisabled(state);
					}
				}, {
					text : 'getValue()',
					handler : function() {
						window.alert(valuesSelect.getValue());
					}
				}, {
					text : 'getValueRecords().length',
					handler : function() {
						window.alert('# of records: ' + valuesSelect.getValueRecords().length);
					}
				}, {
					text : 'getSubmitData() - (default)',
					handler : function() {
						valuesSelect.encodeSubmitValue = false;
						window.alert(Ext.encode(valuesSelect.getSubmitData()));
					}
				}, {
					text : 'getSubmitData() - encodeSubmitValue',
					handler : function() {
						valuesSelect.encodeSubmitValue = true;
						window.alert(Ext.encode(valuesSelect.getSubmitData()));
					}
				}, {
					text : 'setValue("NY, NJ")',
					handler : function() {
						valuesSelect.setValue("NY, NJ");
					}
				}, {
					text : 'addValue("CA")',
					handler : function() {
						valuesSelect.addValue("CA");
					}
				}, {
					text : 'removeValue("NJ")',
					handler : function() {
						valuesSelect.removeValue("NJ");
					}
				}]
			}, {
				xtype : 'container',
				itemId : 'layoutExampleContainer',
				height : 100,
				layout : {
					type : 'fit'
				}
			}, {
				xtype : 'component',
				itemId : 'eventMessages',
				height : 100,
				overflowY : 'scroll',
				cls : 'eventmessagebox',
				autoEl : {
					tag : 'div',
					html : 'Messages:'
				}
			}]
		});
		// Helper functionality to log event messages to a display box
		
		// The BoxSelect with example event listeners
		valuesSelect = valuesExample.down('#layoutExampleContainer').add({
			xtype : 'boxselect',
			itemId : 'valuesSelect',
			fieldLabel : 'Select multiple states',
			displayField : 'name',
			hidden : true,
			labelWidth : 130,
			store : 'States',
			queryMode : 'local',
			valueField : 'abbr',
			value : 'WA, TX',
			listeners : {
				'change' : function(field, newValue, oldValue) {
					addMessage('[<b>change</b> event] ' + 'New value is "' + newValue + '" ' + '(Old was "' + oldValue + '") ' + field.getValueRecords().length + ' records selected.');
				},
				'select' : function(field, records) {
					addMessage('[<b>select</b> event] ' + records.length + ' records selected.');
				},
				'valueselectionchange' : function(field, records) {
					addMessage('[<b>valueselectionchange</b> event] ' + records.length + ' records selected.');
				},
				'valuefocuschange' : function(field, oldFocused, newFocused) {
					var newHighlightValue = newFocused ? newFocused.get(field.valueField) : '', oldHighlightValue = oldFocused ? oldFocused.get(field.valueField) : '';

					addMessage('[<b>valuefocuschange</b> event] ' + 'New highlight is "' + newHighlightValue + '" ' + '(Old was "' + oldHighlightValue + '")');
				}
			}
		});
		valuesSelect.show();

		return valuesExample;
	}
});