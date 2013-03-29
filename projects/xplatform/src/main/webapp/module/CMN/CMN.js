/*
 * Copyright(c) 2012 Miracom, Inc.
 */
Ext.define("CMN.data.proxy.PayloadProxy", {
	extend : "Ext.data.proxy.Ajax",
	alias : "proxy.payload",
	doRequest : function(d, g, i) {
		var h = "";
		var f = "";
		var a = "";
		if (d.params) {
			if (d.params.filter) {
				h = Ext.clone(d.params.filter)
			}
			if (d.params.sort) {
				h = Ext.clone(d.params.sort)
			}
			if (d.params.group) {
				h = Ext.clone(d.params.group)
			}
		}
		var b = this.getWriter(), e = this.buildRequest(d, g, i);
		if (d.allowWrite()) {
			e = b.write(e)
		}
		if (d.remoteFilter === false) {
			if (!h) {
				Ext.destroyMembers(e.params, "filter")
			}
		}
		if (d.remoteSort === false) {
			if (!f) {
				Ext.destroyMembers(e.params, "sort")
			}
		}
		if (d.remoteGroup === false) {
			if (!a) {
				Ext.destroyMembers(e.params, "group")
			}
		}
		Ext.destroyMembers(e.params, "node");
		var c = e.params;
		Ext.destroyMembers(e, "params");
		Ext.apply(e, {
			headers : this.headers,
			timeout : this.timeout,
			scope : this,
			callback : this.createRequestCallback(e, d, g, i),
			method : this.getMethod(e),
			disableCaching : false,
			jsonData : c
		});
		Ext.Ajax.request(e);
		return e
	},
	listeners : {
		exception : function(e, b, a, d) {
			var c = true;
			if (e.showException && Ext.isFunction(e.showException)) {
				var f = Ext.decode(b.responseText);
				c = e.showException(f)
			}
			if (c) {
				SmartFactory.msgRtn("exception", Ext.decode(b.responseText));
				Ext.log("exception");
				Ext.log(Ext.decode(b.responseText))
			}
		}
	}
});
Ext.define("CMN.layout.NColumnTableLayout", {
	extend : "Ext.layout.container.Table",
	alias : "layout.ncolumn",
	type : "ncolumn",
	columns : 2,
	itemCls : "ncolumn",
	renderItems : function(d) {
		var b = this.getLayoutTargetSize().width, a = d.length, e, f, c;
		for (e = 0; e < a; e++) {
			f = d[e];
			c = this.columns;
			if ((c > 1) && Ext.isNumber(f.colspan)) {
				c = c - f.colspan + 1
			}
			f.width = Math.floor(b / c)
		}
		this.callParent(arguments)
	}
});
Ext.define("CMN.mixin.Search", {
	constructor : function(b) {
		var a = null;
		return {
			search : {
				store : function() {
					if (a == null) {
						a = Ext.getStore("cmn.appsearch_store")
					}
					return a
				},
				remove : function(d) {
					var c = this.store();
					c.queryBy(function(e) {
						return (e.get("kind") === d)
					}).each(function(e) {
						c.remove(e)
					})
				},
				register : function(c) {
					if (c) {
						this.store().add(c)
					}
				}
			}
		}
	}
});
Ext.define("CMN.mixin.Status", {
	constructor : function(a) {
		return {
			status : {
				set : function(b) {
					Ext.getCmp("status").setStatus(b)
				},
				busy : function(b) {
					Ext.getCmp("status").showBusy(b)
				},
				clear : function() {
					Ext.getCmp("status").clearStatus({
						useDefaults : true
					})
				},
				tray : function(b) {
					Ext.getCmp("status").add(b)
				}
			}
		}
	}
});
Ext.define("CMN.mixin.Vtypes", {
	constructor : function(a) {
		Ext.apply(Ext.form.field.VTypes, {
			nospace : function(d, c) {
				var b = /^[a-zA-Z0-9_-]+$/;
				return b.test(d)
			},
			nospaceText : T("Validator.nospace"),
			numbers : function(d, c) {
				var b = /^[0-9]+$/;
				return b.test(d)
			},
			numbersText : T("Validator.numbers"),
			numbersMask : /^[0-9]+$/,
			floats : function(d, c) {
				var b = /^([0-9]*||[0-9]*\.[0-9]*)$/;
				return b.test(d)
			},
			floatsText : T("Validator.floats")
		});
		return
	}
});
Ext.define("CMN.plugin.Supplement", {
	extend : "Ext.Base",
	init : function(b) {
		if (!b.getSupplement) {
			b.getSupplement = function() {
				return this.supplement
			}
		}
		if (!b.setSupplement) {
			b.setSupplement = this.setSupplement
		}
		function d() {
			if (this.getSupplement()) {
				this.setSupplement(this.getSupplement())
			}
		}
		function e() {
			if (this.getSupplement()) {
				var f = Ext.getCmp("east");
				f.getLayout().setActiveItem(this.getSupplement());
				if (this.getSupplement().isPanel && this.getSupplement().title) {
					f.setTitle(this.getSupplement().title)
				} else {
					if (b.isPanel) {
						f.setTitle(b.title)
					}
				}
			}
		}
		function a() {
			var f = Ext.getCmp("east");
			f.getLayout().setActiveItem("base");
			f.setTitle(f.getComponent("base").title)
		}
		function c() {
			var f = this.getSupplement();
			if (f && Ext.getClassName(f)) {
				Ext.getCmp("east").remove(this.getSupplement())
			}
			this.setSupplement(null)
		}
		b.on("activate", e, b);
		b.on("deactivate", a, b);
		b.on("destroy", c, b);
		b.on("render", d, b)
	},
	setSupplement : function(b) {
		if (Ext.isString(b)) {
			this.supplement = Ext.create(b)
		} else {
			this.supplement = b
		}
		if (this.supplement) {
			var a = this;
			this.supplement.getSupplementClient = function() {
				return a
			}
		}
		if (this.getSupplement()) {
			this.supplement = Ext.getCmp("east").add(this.getSupplement());
			if (this.supplement.isPanel) {
				this.supplement.preventHeader = true;
				if (this.supplement.rendered) {
					this.supplement.updateHeader()
				}
				if (this.supplement.isPanel) {
					this.supplement.setBorder(false)
				}
			}
			Ext.getCmp("east").getLayout().setActiveItem(this.supplement);
			this.supplement.doLayout()
		}
	}
});
Ext.define("CMN.model.AppSearch", {
	extend : "Ext.data.Model",
	fields : [{
		name : "kind",
		type : "string"
	}, {
		name : "key",
		type : "string"
	}, {
		name : "name",
		type : "string"
	}, {
		name : "desc",
		type : "string"
	}, {
		name : "item",
		type : "auto"
	}, {
		name : "handler",
		type : "function"
	}]
});
Ext.define("CMN.model.Favorite", {
	extend : "Ext.data.Model",
	fields : [{
		name : "seqNum",
		type : "string"
	}, {
		name : "funcName",
		type : "string"
	}, {
		name : "userFuncDesc",
		type : "string"
	}, {
		name : "assemblyFile",
		type : "string"
	}, {
		name : "assemblyName",
		type : "string"
	}, {
		name : "iconIndex",
		type : "int"
	}, {
		name : "iconUri",
		type : "string"
	}]
});
Ext.define("CMN.model.MainMenu", {
	extend : "Ext.data.Model",
	fields : [{
		name : "text",
		type : "string"
	}, {
		name : "leaf",
		type : "boolean"
	}, {
		name : "funcName",
		type : "string"
	}, {
		name : "funcDesc",
		type : "string"
	}, {
		name : "funcTypeFlag",
		type : "string"
	}, {
		name : "funcGroup",
		type : "string"
	}, {
		name : "assemblyFile",
		type : "string"
	}, {
		name : "assemblyName",
		type : "string"
	}, {
		name : "dispLevel",
		type : "string"
	}, {
		name : "separator",
		type : "string"
	}, {
		name : "shortCut",
		type : "string"
	}, {
		name : "iconIndex",
		type : "int"
	}, {
		name : "iconUri",
		type : "string"
	}, {
		name : "addToolBar",
		type : "string"
	}]
});
Ext.define("CMN.store.AppSearchStore", {
	extend : "Ext.data.Store",
	storeId : "cmn.appsearch_store",
	autoLoad : false,
	model : "CMN.model.AppSearch",
	groupers : [{
		property : "kind",
		direction : "ASC"
	}],
	sorters : [{
		property : "key",
		direction : "ASC"
	}]
});
Ext.define("CMN.store.FavoriteStore", {
	extend : "Ext.data.Store",
	storeId : "cmn.favorite_store",
	autoLoad : false,
	model : "CMN.model.Favorite",
	proxy : {
		type : "ajax",
		url : "service/SecViewFavoritesList.json",
		reader : {
			type : "json",
			root : "list"
		},
		actionMethods : {
			read : "GET"
		},
		extraParams : {
			procstep : "1",
			programId : "WEBClient"
		}
	}
});
Ext.define("CMN.store.MainMenuStore", {
	extend : "Ext.data.TreeStore",
	storeId : "cmn.mainmenu_store",
	autoLoad : false,
	model : "CMN.model.MainMenu",
	root : {
		text : "MainMenu",
		expanded : true
	},
	constructor : function(a) {
		a.proxy = {
			type : "ajax",
			url : "service/SecViewFunctionNodeList.json",
			reader : {
				type : "json",
				root : "list"
			},
			actionMethods : {
				read : "GET"
			},
			extraParams : {
				procstep : "1",
				programId : "WEBClient",
				secGrpId : SmartFactory.login.group
			}
		};
		this.callParent([a])
	},
	listeners : {
		load : function(b, c, a, d) {
			if (!d) {
				return
			}
			SmartFactory.search.remove("menu");
			c.cascadeBy(function(e) {
				var f = T("Caption.Menu." + e.get("text"));
				e.set("text", f);
				if (!e.isLeaf()) {
					return
				}
				SmartFactory.search.register({
					kind : "menu",
					key : e.get("funcName"),
					name : f,
					item : {
						viewModel : e.get("assemblyName"),
						itemId : e.get("funcName")
					},
					handler : function(g) {
						SmartFactory.doMenu(g.get("item"))
					}
				})
			});
			c.cascadeBy(function(e) {
				e.commit()
			})
		}
	}
});
Ext.define("CMN.view.common.AppSearchField", {
	extend : "Ext.form.field.ComboBox",
	alias : "widget.cmn.appsearchfield",
	queryMode : "local",
	displayField : "key",
	matchFieldWidth : false,
	typeAhead : true,
	emptyText : "Alt+Q",
	initComponent : function() {
		this.callParent();
		new Ext.util.KeyMap(document, {
			key : "q",
			alt : true,
			fn : this.focus,
			scope : this
		})
	},
	listConfig : {
		loadingText : "Searching...",
		emptyText : "No matching functions found.",
		getInnerTpl : function() {
			return '<div class="appSearchItem"><span class="kind">{kind}</span> <span class="key">{key}</span>: {name}</div>'
		},
		minWidth : 200
	},
	listeners : {
		select : function(d, b, c) {
			var a = b[0];
			a.get("handler").call(this, a);
			d.setValue("")
		}
	}
});
Ext.define("CMN.view.common.AppTool", {
	extend : "Ext.toolbar.Toolbar",
	alias : "widget.cmn.apptool",
	id : "apptool",
	listeners : {
		render : function(b, c) {
			var a = Ext.StoreManager.lookup("CMN.store.FavoriteStore");
			a.on("datachanged", this.store_changed, this);
			a.on("clear", this.store_changed, this);
			a.load()
		}
	},
	default_handler : function(a) {
		SmartFactory.doMenu({
			viewModel : a.data.get("assemblyName"),
			itemId : a.data.get("funcName")
		})
	},
	store_changed : function(d) {
		this.removeAll();
		var c = d.data.items;
		for (var a in c) {
			var b = c[a];
			this.add({
				icon : b.get("iconUri"),
				scale : "large",
				tooltip : T("Caption.Menu." + b.get("userFuncDesc")),
				data : b,
				handler : this.default_handler
			})
		}
		this.show()
	}
});
Ext.define("CMN.view.common.MainMenu", {
	extend : "Ext.toolbar.Toolbar",
	alias : "widget.cmn.mainmenu",
	id : "mainmenu",
	listeners : {
		render : function(b, c) {
			var a = Ext.StoreManager.lookup("CMN.store.MainMenuStore");
			this.reloadToolbarItems(a);
			a.on("load", this.reloadToolbarItems, this)
		}
	},
	reloadToolbarItems : function(a) {
		this.removeAll();
		var b = (this.loadMenu(a.getRootNode()) || []);
		for (var c = 0; c < b.length; c++) {
			this.add(b[c])
		}
	},
	loadMenu : function(d) {
		var c = d.childNodes;
		if (!c || c.length < 1) {
			return undefined
		}
		self_function = arguments.callee;
		var a = [];
		for (var b = 0; b < c.length; b++) {
			var g = c[b];
			var f = self_function(g);
			var e = {
				text : g.get("text"),
				title : g.get("funcDesc")
			};
			if (g.get("separator") === "Y") {
				a.push({
					xtype : "menuseparator"
				})
			}
			if (f) {
				e.menu = {
					ignoreParentClicks : true,
					items : f
				}
			} else {
				e.viewModel = g.get("assemblyName");
				e.itemId = g.get("funcName");
				e.icon = g.get("iconUri");
				e.handler = SmartFactory.doMenu
			}
			a.push(e)
		}
		return a
	}
});
Ext.define("CMN.view.common.NavFavorite", {
	extend : "Ext.grid.Panel",
	alias : "widget.cmn.nav_favorite",
	id : "cmn.view.nav_favorite",
	listeners : {
		render : function(a, b) {
			this.store.on("datachanged", this.store_changed, this);
			this.store.on("clear", this.store_changed, this)
		},
		itemclick : function(b, a, f, c, g, d) {
			SmartFactory.doMenu({
				viewModel : a.get("assemblyName"),
				itemId : a.get("funcName")
			})
		}
	},
	tbar : [{
		cls : "navRefreshBtn",
		listeners : {
			click : function(b) {
				var a = Ext.StoreManager.lookup("CMN.store.FavoriteStore");
				a.load()
			}
		}
	}, {
		cls : "navClearBtn",
		listeners : {
			click : function() {
				var a = Ext.StoreManager.lookup("CMN.store.FavoriteStore");
				a.removeAll(false)
			}
		}
	}],
	columns : [{
		header : "Function",
		dataIndex : "funcName"
	}, {
		header : T("Caption.Other.Description"),
		dataIndex : "userFuncDesc"
	}],
	store : "CMN.store.FavoriteStore",
	store_changed : function() {
		this.getView().refresh()
	}
});
Ext.define("CMN.view.common.NavMainMenu", {
	extend : "Ext.tree.Panel",
	alias : "widget.cmn.nav_mainmenu",
	id : "cmn.view.nav_mainmenu",
	rootVisible : false,
	listeners : {
		beforerender : function(a, b) {
			this.store.on("datachanged", this.store_changed, this);
			this.store.on("clear", this.store_changed, this)
		},
		itemclick : function(b, a, f, c, g, d) {
			if (a.get("leaf")) {
				SmartFactory.doMenu({
					viewModel : a.get("assemblyName"),
					itemId : a.get("funcName")
				})
			}
		}
	},
	tbar : [{
		cls : "navRefreshBtn",
		listeners : {
			click : function(b) {
				var a = Ext.StoreManager.lookup("CMN.store.MainMenuStore");
				a.load()
			}
		}
	}],
	store : "CMN.store.MainMenuStore",
	store_changed : function(a) {
		this.getView().refresh()
	}
});
Ext.define("CMN.view.common.RowStatic", {
	extend : "Ext.grid.column.Column",
	alias : "widget.rowstatic",
	width : 23,
	sortable : false,
	align : "left",
	constructor : function(a) {
		this.callParent(arguments)
	},
	resizable : false,
	hideable : false,
	menuDisabled : true,
	cls : Ext.baseCSSPrefix + "row-numberer",
	renderer : function(e, b, a, d, f, c) {
		b.tdCls = Ext.baseCSSPrefix + "grid-cell-special";
		return e
	}
});
Ext.define("CMN.view.common.SideMenu", {
	extend : "Ext.toolbar.Toolbar",
	alias : "widget.cmn.sidemenu",
	id : "sidemenu",
	align : "right"
});
Ext.define("CMN.view.common.StatusBar", {
	extend : "Ext.toolbar.Toolbar",
	alias : "widget.status",
	cls : "x-statusbar",
	busyIconCls : "x-status-busy",
	busyText : "Loading...",
	autoClear : 5000,
	emptyText : "&nbsp;",
	activeThreadId : 0,
	initComponent : function() {
		if (this.statusAlign === "right") {
			this.cls += " x-status-right"
		}
		this.callParent(arguments)
	},
	afterRender : function() {
		this.callParent(arguments);
		var a = this.statusAlign === "right";
		this.currIconCls = this.iconCls || this.defaultIconCls;
		this.statusEl = Ext.create("Ext.toolbar.TextItem", {
			cls : "x-status-text " + (this.currIconCls || ""),
			text : this.text || this.defaultText || ""
		});
		this.progress = {
			xtype : "progressbar",
			id : "main-progressbar",
			width : 150
		};
		if (a) {
			this.add("->");
			this.add(this.statusEl);
			this.add(this.progress)
		} else {
			this.insert(0, this.statusEl);
			this.insert(1, "->");
			this.insert(0, this.progress)
		}
		this.height = 27;
		this.doLayout()
	},
	setStatus : function(d) {
		d = d || {};
		if (Ext.isString(d)) {
			d = {
				text : d
			}
		}
		if (d.text !== undefined) {
			this.setText(d.text)
		}
		if (d.iconCls !== undefined) {
			this.setIcon(d.iconCls)
		}
		if (d.clear) {
			var e = d.clear, b = this.autoClear, a = {
				useDefaults : true,
				anim : true
			};
			if (Ext.isObject(e)) {
				e = Ext.applyIf(e, a);
				if (e.wait) {
					b = e.wait
				}
			} else {
				if (Ext.isNumber(e)) {
					b = e;
					e = a
				} else {
					if (Ext.isBoolean(e)) {
						e = a
					}
				}
			}
			e.threadId = this.activeThreadId;
			Ext.defer(this.clearStatus, b, this, [e])
		}
		this.doLayout();
		return this
	},
	clearStatus : function(c) {
		c = c || {};
		if (c.threadId && c.threadId !== this.activeThreadId) {
			return this
		}
		var b = c.useDefaults ? this.defaultText : this.emptyText, a = c.useDefaults ? (this.defaultIconCls ? this.defaultIconCls : "") : "";
		if (c.anim) {
			this.statusEl.el.fadeOut({
				opacity : 0,
				easing : "easeOut",
				duration : 500,
				remove : false,
				useDisplay : true,
				scope : this,
				callback : function() {
					this.setStatus({
						text : b,
						iconCls : a
					});
					Ext.defer(function() {
						this.statusEl.el.fadeIn({
							opacity : 1,
							easing : "easeOut",
							duration : 500
						})
					}, 1000, this)
				}
			})
		} else {
			this.statusEl.hide();
			this.setStatus({
				text : b,
				iconCls : a
			});
			this.statusEl.show()
		}
		this.doLayout();
		return this
	},
	setText : function(a) {
		this.activeThreadId++;
		this.text = a || "";
		if (this.rendered) {
			this.statusEl.setText(this.text)
		}
		return this
	},
	getText : function() {
		return this.text
	},
	setIcon : function(a) {
		this.activeThreadId++;
		a = a || "";
		if (this.rendered) {
			if (this.currIconCls) {
				this.statusEl.removeCls(this.currIconCls);
				this.currIconCls = null
			}
			if (a.length > 0) {
				this.statusEl.addCls(a);
				this.currIconCls = a
			}
		} else {
			this.currIconCls = a
		}
		return this
	},
	showBusy : function(a) {
		if (Ext.isString(a)) {
			a = {
				text : a
			}
		}
		a = Ext.applyIf(a || {}, {
			text : this.busyText,
			iconCls : this.busyIconCls
		});
		return this.setStatus(a)
	}
});
Ext.define("CMN.view.form.DatePeriodField", {
	extend : "Ext.form.FieldContainer",
	alias : "widget.dateperiod",
	defaults : {
		anchor : "100%"
	},
	labelWidth : 150,
	fieldWidth : 150,
	constructor : function(b) {
		var d = b || {};
		var c = "anchor";
		if (d.vertical || d.layout == "hbox") {
			c = "hbox";
			this.fieldWidth = this.fieldWidth * 2 + 10
		}
		if (d.defaultValue) {
			var a = "d", e = 0;
			if (Ext.typeOf(d.period) == "string") {
				a = d.period.match(/[Y|M|D]/gi)[0] || "d";
				e = d.period.match(/\-+[0-9]*|[0-9]*/i) || 0
			} else {
				e = d.period || 0
			}
			e = Number(e) * (-1);
			switch (a.toLowerCase()) {
				case "y" :
					d.fromValue = Ext.Date.add(d.defaultValue, Ext.Date.YEAR, e);
					break;
				case "m" :
					d.fromValue = Ext.Date.add(d.defaultValue, Ext.Date.MONTH, e);
					break;
				default :
					d.fromValue = Ext.Date.add(d.defaultValue, Ext.Date.DAY, e);
					break
			}
			d.toValue = d.defaultValue
		}
		Ext.applyIf(d, {
			layout : c
		});
		this.callParent([d])
	},
	initComponent : function() {
		this.width = this.width || (this.labelWidth + this.fieldWidth + 5);
		this.fieldLabel = this.fieldLabel + "  (FROM ~ TO)";
		this.items = this.buildItems();
		this.callParent();
		var a = this;
		this.down("#valueFieldfrom").on("change", function(b, c) {
			a.setValue(c, 0)
		});
		this.down("#valueFieldto").on("change", function(b, c) {
			a.setValue(c, 1)
		})
	},
	buildItems : function() {
		var c = "valueField";
		var b = [];
		var d = this.formName || this.name;
		b.push({
			cls : "hboxLine",
			layout : {
				type : "hbox",
				align : "top"
			},
			xtype : "fieldcontainer",
			items : this.buildField(c, "from", d),
			flex : 1
		});
		if (this.vertical || this.layout == "hbox") {
			b.push({
				xtype : "component",
				width : 10,
				html : "~"
			})
		}
		var a = this.toName || this.name;
		b.push({
			cls : "hboxLine",
			layout : {
				type : "hbox",
				align : "top"
			},
			xtype : "fieldcontainer",
			items : this.buildField(c, "to", a),
			flex : 1
		});
		return b
	},
	buildField : function(c, h, e) {
		var b = this;
		var g = this.getValueFormat();
		var f = this.submitValue == false ? false : true;
		var d = this.submitValueDate == true ? true : false;
		var a = this.allowBlank == false ? false : true;
		value = this.defaultValue || "";
		if (h == "from") {
			value = this.fromValue || ""
		}
		if (h == "to") {
			value = this.toValue || ""
		}
		return [{
			xtype : "textfield",
			hidden : true,
			name : e,
			submitValue : f,
			allowBlank : a,
			itemId : c + h,
			value : this.getDefaultValue(h)
		}, {
			listeners : {
				change : function(o, k, j) {
					var p = b.down("#" + c + h);
					var l = "";
					var q = b.down("#date" + c + "from");
					var m = b.down("#date" + c + "to");
					var i = q.getValue();
					var n = m.getValue();
					if ((n - i >= 0 || !i || !n) && k) {
						l = Ext.Date.format(k, g)
					}
					p.setRawValue(l);
					p.lastValue = l
				}
			},
			xtype : "datefield",
			submitValue : d,
			allowBlank : a,
			format : this.getFormat(),
			name : e + "_date",
			value : value,
			itemId : "date" + c + h,
			emptyText : h + " date",
			flex : 1
		}]
	},
	getValue : function(a, b) {
		if (a == 0 || a == "from") {
			a = "valueFieldfrom"
		} else {
			if (a == 1 || a == "to") {
				a = "valueFieldto"
			} else {
				return ""
			}
		}
		if (b === true) {
			a = "date" + a
		}
		var c = this.down("#" + a).getValue();
		return c
	},
	getValues : function() {
		var a = [];
		a.push(this.down("#valueFieldfrom").getValue());
		a.push(this.down("#valueFieldto").getValue());
		return a
	},
	getDefaultValue : function(b) {
		var a = this.defaultValue || "";
		if (this.defaultValue) {
			if (b == "from") {
				a = this.fromValue
			} else {
				if (b == "to") {
					a = this.toValue
				}
			}
			return Ext.Date.format(a, this.getValueFormat())
		}
		return a
	},
	getValueFormat : function() {
		if (this.valueFormat) {
			return this.valueFormat
		}
		return "Ymd"
	},
	getFormat : function() {
		if (this.format) {
			return this.format
		}
		return "Y-m-d"
	},
	setValue : function(c, a) {
		var e = "from";
		if (a == 1) {
			e = "to"
		}
		var d = c || "";
		if (Ext.typeOf(d) == "string" && d != "") {
			d = new Date(Number(c.substr(0, 4)), Number(c.substr(4, 2)) - 1, Number(c.substr(6, 2)))
		}
		var b = this.down("#datevalueField" + e);
		if (b) {
			b.setValue(d)
		}
	},
	setValues : function(a) {
		if (Ext.typeOf(a) != "array" && a != "") {
			return
		} else {
			if (Ext.typeOf(a) == "array" && a.length == 0) {
				return
			}
		}
		for (var b = 0; b < 2; b++) {
			var c = a[b] || "";
			this.setValue(c, b)
		}
	}
});
Ext.define("CMN.view.form.DateTimeField", {
	extend : "Ext.form.FieldContainer",
	alias : "widget.datetimex",
	cls : "hboxLine",
	layout : {
		type : "hbox",
		align : "top"
	},
	labelWidth : 100,
	fieldWidth : 250,
	constructor : function(a) {
		var b = a || {};
		this.callParent([b])
	},
	initComponent : function() {
		this.width = this.width || (this.labelWidth + this.fieldWidth + 8);
		if (this.timeFormat && !this.valueTimeFormat) {
			var b = new RegExp(":|-|\\s|,.\\/", "gi");
			this.valueTimeFormat = this.timeFormat.replace(b, "")
		}
		this.items = this.buildItems();
		this.callParent();
		var a = this;
		this.down("#valueField").on("change", function(c, d) {
			a.setValue(d)
		})
	},
	buildItems : function() {
		var d = "valueField";
		var c = this.getValueDateFormat();
		var a = this.getValueTimeFormat();
		var e = this.submitValueDate == true ? true : false;
		var f = this.submitValue == false ? false : true;
		var b = this.allowBlank == false ? false : true;
		return [{
			xtype : "textfield",
			hidden : true,
			name : this.name,
			itemId : d,
			submitValue : f,
			allowBlank : b,
			value : this.getDefaultValue()
		}, {
			listeners : {
				change : function(m, l, j) {
					var g = this.up("fieldcontainer");
					var i = g.getComponent(d);
					var k = g.getComponent("time" + d);
					var n = "";
					var h = "";
					if (l && m.validate()) {
						h = Ext.Date.format(l, c)
					}
					n = k.getValue();
					if (!n || h == "") {
						n = ""
					} else {
						n = Ext.Date.format(n, a)
					}
					i.setRawValue(h + n);
					i.lastValue = h + n
				}
			},
			xtype : "datefield",
			format : this.getDateFormat(),
			name : this.name + "_date",
			value : this.defaultValue,
			itemId : "date" + d,
			submitValue : e,
			allowBlank : b,
			flex : 3
		}, {
			listeners : {
				change : function(n, m, k) {
					var g = this.up("fieldcontainer");
					var j = g.getComponent(d);
					var l = g.getComponent("date" + d);
					var h = "";
					var i = "";
					if (m && n.validate()) {
						i = Ext.Date.format(m, a)
					}
					if (l) {
						h = l.getValue();
						if (!h) {
							return
						}
						h = Ext.Date.format(h, c);
						j.setRawValue(h + i);
						j.lastValue = h + i
					} else {
						j.setRawValue(i);
						j.lastValue = i
					}
				}
			},
			xtype : "timefield",
			cls : "marginL3",
			format : this.getTimeFormat(),
			name : this.name + "_time",
			value : this.defaultValue,
			itemId : "time" + d,
			submitValue : e,
			allowBlank : b,
			flex : 2
		}]
	},
	setValue : function(c) {
		var d = c || "";
		if (Ext.typeOf(d) == "string" && d != "") {
			d = new Date(Number(c.substr(0, 4)), Number(c.substr(4, 2)) - 1, Number(c.substr(6, 2)), Number(c.substr(8, 2)), Number(c.substr(10, 2)), Number(c.substr(12, 2)))
		}
		var a = this.down("#datevalueField");
		var b = this.down("#timevalueField");
		if (a) {
			a.setValue(d)
		}
		if (b) {
			b.setValue(d)
		}
	},
	getValue : function() {
		var a = this.down("#valueField").getValue();
		return a
	},
	getDefaultValue : function() {
		var a = this.getValueDateFormat() + this.getValueTimeFormat();
		if (this.defaultValue) {
			if (this.type == "date") {
				a = this.getValueDateFormat()
			} else {
				if (this.type == "time") {
					a = this.getValueTimeFormat()
				}
			}
			return Ext.Date.format(this.defaultValue, a)
		}
		return ""
	},
	getValueDateFormat : function() {
		if (this.valueDateFormat) {
			return this.valueDateFormat
		}
		return "Ymd"
	},
	getValueTimeFormat : function() {
		if (this.valueTimeFormat) {
			return this.valueTimeFormat
		}
		return "Hi"
	},
	getDateFormat : function() {
		if (this.dateFormat) {
			return this.dateFormat
		}
		return "Y-m-d"
	},
	getTimeFormat : function() {
		if (this.timeFormat) {
			return this.timeFormat
		}
		return "H:i"
	}
});
Ext.define("CMN.view.form.DateTimePeriodField", {
	extend : "Ext.form.FieldContainer",
	alias : "widget.datetimeperiod",
	defaults : {
		anchor : "100%"
	},
	labelWidth : 150,
	fieldWidth : 250,
	constructor : function(b) {
		var d = b || {};
		var c = "anchor";
		if (d.vertical || d.layout == "hbox") {
			c = "hbox";
			this.fieldWidth = this.fieldWidth * 2 + 10
		}
		if (d.defaultValue) {
			var a = "d", e = 0;
			if (Ext.typeOf(d.period) == "string") {
				a = d.period.match(/[Y|M|D|H|I|S]/gi)[0] || "d";
				e = d.period.match(/\-+[0-9]*|[0-9]*/i) || 0
			} else {
				e = d.period || 0
			}
			e = Number(e) * (-1);
			switch (a.toLowerCase()) {
				case "y" :
					d.fromValue = Ext.Date.add(d.defaultValue, Ext.Date.YEAR, e);
					break;
				case "m" :
					d.fromValue = Ext.Date.add(d.defaultValue, Ext.Date.MONTH, e);
					break;
				case "h" :
					d.fromValue = Ext.Date.add(d.defaultValue, Ext.Date.HOUR, e);
					break;
				case "i" :
					d.fromValue = Ext.Date.add(d.defaultValue, Ext.Date.MINUTE, e);
					break;
				case "s" :
					d.fromValue = Ext.Date.add(d.defaultValue, Ext.Date.SECOND, e);
					break;
				default :
					d.fromValue = Ext.Date.add(d.defaultValue, Ext.Date.DAY, e);
					break
			}
			d.toValue = d.defaultValue
		}
		Ext.applyIf(d, {
			layout : c
		});
		this.callParent([d])
	},
	initComponent : function() {
		this.width = this.width || (this.labelWidth + this.fieldWidth + 8);
		this.fieldLabel = this.fieldLabel + "  (FROM ~ TO)";
		if (this.timeFormat && !this.valueTimeFormat) {
			var b = new RegExp(":|-|\\s|,.\\/", "gi");
			this.valueTimeFormat = this.timeFormat.replace(b, "")
		}
		this.items = this.buildItems();
		this.callParent();
		var a = this;
		this.down("#valueFieldfrom").on("change", function(c, d) {
			a.setValue(d, 0)
		});
		this.down("#valueFieldto").on("change", function(c, d) {
			a.setValue(d, 1)
		})
	},
	buildItems : function() {
		var c = "valueField";
		var b = [];
		var d = this.formName || this.name;
		b.push({
			cls : "hboxLine",
			layout : {
				type : "hbox",
				align : "top"
			},
			xtype : "fieldcontainer",
			items : this.buildField(c, "from", d),
			flex : 1
		});
		if (this.vertical || this.layout == "hbox") {
			b.push({
				xtype : "component",
				width : 10,
				html : "~"
			})
		}
		var a = this.toName || this.name;
		b.push({
			cls : "hboxLine",
			layout : {
				type : "hbox",
				align : "top"
			},
			xtype : "fieldcontainer",
			items : this.buildField(c, "to", a),
			flex : 1
		});
		return b
	},
	buildField : function(d, h, f) {
		var c = this.getValueDateFormat();
		var a = this.getValueTimeFormat();
		var e = this.submitValueDate == true ? true : false;
		var g = this.submitValue == false ? false : true;
		var b = this.allowBlank == false ? false : true;
		value = this.defaultValue || "";
		if (h == "from") {
			value = this.fromValue || ""
		}
		if (h == "to") {
			value = this.toValue || ""
		}
		return [{
			xtype : "textfield",
			hidden : true,
			name : f,
			itemId : d + h,
			submitValue : g,
			allowBlank : b,
			value : this.getDefaultValue(h)
		}, {
			listeners : {
				change : function(o, n, l) {
					var i = this.up("fieldcontainer");
					var k = i.getComponent(d + h);
					var m = i.getComponent("time" + d + h);
					var p = "";
					var j = "";
					if (n && o.validate()) {
						j = Ext.Date.format(n, c)
					}
					p = m.getValue();
					if (!p || j == "") {
						p = ""
					} else {
						p = Ext.Date.format(p, a)
					}
					k.setRawValue(j + p);
					k.lastValue = j + p
				}
			},
			xtype : "datefield",
			format : this.getDateFormat(),
			name : f + "_date",
			value : value,
			itemId : "date" + d + h,
			submitValue : e,
			allowBlank : b,
			emptyText : h + " date",
			flex : 3
		}, {
			listeners : {
				change : function(p, o, m) {
					var i = this.up("fieldcontainer");
					var l = i.getComponent(d + h);
					var n = i.getComponent("date" + d + h);
					var j = "";
					var k = "";
					if (o && p.validate()) {
						k = Ext.Date.format(o, a)
					}
					if (n) {
						j = n.getValue();
						if (!j) {
							return
						}
						j = Ext.Date.format(j, c);
						l.setRawValue(j + k);
						l.lastValue = j + k
					} else {
						l.setRawValue(k);
						l.lastValue = k
					}
				}
			},
			xtype : "timefield",
			cls : "marginL3",
			format : this.getTimeFormat(),
			name : f + "_time",
			value : value,
			itemId : "time" + d + h,
			submitValue : e,
			allowBlank : b,
			flex : 2
		}]
	},
	getDefaultValue : function(b) {
		var a = this.getValueDateFormat() + this.getValueTimeFormat();
		if (this.defaultValue) {
			if (b == "from") {
				return Ext.Date.format(this.fromValue, a)
			} else {
				if (b == "to") {
					return Ext.Date.format(this.toValue, a)
				} else {
					return Ext.Date.format(this.defaultValue, a)
				}
			}
		}
		return ""
	},
	getValueDateFormat : function() {
		if (this.valueDateFormat) {
			return this.valueDateFormat
		}
		return "Ymd"
	},
	getValueTimeFormat : function() {
		if (this.valueTimeFormat) {
			return this.valueTimeFormat
		}
		return "Hi"
	},
	getDateFormat : function() {
		if (this.dateFormat) {
			return this.dateFormat
		}
		return "Y-m-d"
	},
	getTimeFormat : function() {
		if (this.timeFormat) {
			return this.timeFormat
		}
		return "H:i"
	},
	getValue : function(b, c) {
		if (b == 0 || b == "from") {
			b = "valueFieldfrom"
		} else {
			if (b == 1 || b == "to") {
				b = "valueFieldto"
			} else {
				return ""
			}
		}
		if (c === true) {
			var a = [];
			b = "date" + b;
			a.push(this.getComponent("date" + b).getValue());
			a.push(this.getComponent("time" + b).getValue());
			return a
		}
		var d = this.getComponent(b).getValue();
		return d
	},
	getValues : function() {
		var b = [];
		var e = this.formName || this.name;
		var a = this.toName || this.name;
		for (var d = 0; d < 6; d++) {
			var f = this.getComponent(d).getValue();
			var c = this.getComponent(d).getName();
			if (c == e || c == a) {
				b.push(f)
			}
		}
		return b
	},
	setValue : function(d, a) {
		var f = "from";
		if (a == 1) {
			f = "to"
		}
		var e = d || "";
		if (Ext.typeOf(e) == "string" && e != "") {
			e = new Date(Number(d.substr(0, 4)), Number(d.substr(4, 2)) - 1, Number(d.substr(6, 2)), Number(d.substr(8, 2)), Number(d.substr(10, 2)), Number(d.substr(12, 2)))
		}
		var b = this.down("#datevalueField" + f);
		var c = this.down("#timevalueField" + f);
		if (b) {
			b.setValue(e)
		}
		if (c) {
			c.setValue(e)
		}
	},
	setValues : function(a) {
		if (Ext.typeOf(a) != "array" && a != "") {
			return
		} else {
			if (Ext.typeOf(a) == "array" && a.length == 0) {
				return
			}
		}
		for (var b = 0; b < 2; b++) {
			var c = a[b] || "";
			this.setValue(c, b)
		}
	}
});
Ext.define("CMN.view.form.TimePeriodField", {
	extend : "Ext.form.FieldContainer",
	alias : "widget.timeperiod",
	defaults : {
		anchor : "100%"
	},
	labelWidth : 150,
	fieldWidth : 150,
	constructor : function(b) {
		var d = b || {};
		var c = "anchor";
		if (d.vertical || d.layout == "hbox") {
			c = "hbox";
			this.fieldWidth = this.fieldWidth * 2 + 10
		}
		if (d.defaultValue) {
			var a = "d", e = 0;
			if (Ext.typeOf(d.period) == "string") {
				a = d.period.match(/[H|I|S]/gi)[0] || "d";
				e = d.period.match(/\-+[0-9]*|[0-9]*/i) || 0
			} else {
				e = d.period || 0
			}
			e = Number(e) * (-1);
			switch (a.toLowerCase()) {
				case "h" :
					d.fromValue = Ext.Date.add(d.defaultValue, Ext.Date.HOUR, e);
					break;
				case "i" :
					d.fromValue = Ext.Date.add(d.defaultValue, Ext.Date.MINUTE, e);
					break;
				case "s" :
					d.fromValue = Ext.Date.add(d.defaultValue, Ext.Date.SECOND, e);
					break;
				default :
					d.fromValue = Ext.Date.add(d.defaultValue, Ext.Date.DAY, e);
					break
			}
			d.toValue = d.defaultValue
		}
		Ext.applyIf(d, {
			layout : c
		});
		this.callParent([d])
	},
	initComponent : function() {
		this.width = this.width || (this.labelWidth + this.fieldWidth + 5);
		this.fieldLabel = this.fieldLabel + "  (FROM ~ TO)";
		if (this.format && !this.valueFormat) {
			var b = new RegExp(":|-|\\s|,.\\/", "gi");
			this.valueFormat = this.format.replace(b, "")
		}
		this.items = this.buildItems();
		this.callParent();
		var a = this;
		this.down("#valueFieldfrom").on("change", function(c, d) {
			a.setValue(d, 0)
		});
		this.down("#valueFieldto").on("change", function(c, d) {
			a.setValue(d, 1)
		})
	},
	buildItems : function() {
		var c = "valueField";
		var b = [];
		var d = this.formName || this.name;
		b.push({
			cls : "hboxLine",
			layout : {
				type : "hbox",
				align : "top"
			},
			xtype : "fieldcontainer",
			items : this.buildField(c, "from", d),
			flex : 1
		});
		if (this.vertical || this.layout == "hbox") {
			b.push({
				xtype : "component",
				width : 10,
				html : "~"
			})
		}
		var a = this.toName || this.name;
		b.push({
			cls : "hboxLine",
			layout : {
				type : "hbox",
				align : "top"
			},
			xtype : "fieldcontainer",
			items : this.buildField(c, "to", a),
			flex : 1
		});
		return b
	},
	buildField : function(c, h, e) {
		var b = this;
		var g = this.getValueFormat();
		var f = this.submitValue == false ? false : true;
		var d = this.submitValueDate == true ? true : false;
		var a = this.allowBlank == false ? false : true;
		value = this.defaultValue || "";
		if (h == "from") {
			value = this.fromValue || ""
		}
		if (h == "to") {
			value = this.toValue || ""
		}
		return [{
			xtype : "textfield",
			hidden : true,
			name : e,
			submitValue : f,
			allowBlank : a,
			itemId : c + h,
			value : this.getDefaultValue(h)
		}, {
			listeners : {
				change : function(o, k, j) {
					var p = b.down("#" + c + h);
					var l = "";
					var q = b.down("#time" + c + "from");
					var m = b.down("#time" + c + "to");
					var i = q.getValue();
					var n = m.getValue();
					if ((n - i >= 0 || !i || !n) && k) {
						l = Ext.Date.format(k, g)
					}
					p.setRawValue(l);
					p.lastValue = l
				}
			},
			xtype : "timefield",
			submitValue : d,
			allowBlank : a,
			format : this.getFormat(),
			name : e + "_time",
			value : value,
			itemId : "time" + c + h,
			emptyText : h + " time",
			flex : 1
		}]
	},
	getDefaultValue : function(b) {
		var a = this.defaultValue || "";
		if (this.defaultValue) {
			if (b == "from") {
				a = this.fromValue
			} else {
				if (b == "to") {
					a = this.toValue
				}
			}
			return Ext.Date.format(a, this.getValueFormat())
		}
		return a
	},
	getValueFormat : function() {
		if (this.valueFormat) {
			return this.valueFormat
		}
		return "Hi"
	},
	getFormat : function() {
		if (this.format) {
			return this.format
		}
		return "H:i"
	},
	getValue : function(a, b) {
		if (a == 0 || a == "from") {
			a = "valueFieldfrom"
		} else {
			if (a == 1 || a == "to") {
				a = "valueFieldto"
			} else {
				return ""
			}
		}
		if (b === true) {
			a = "time" + a
		}
		var c = this.down("#" + a).getValue();
		return c
	},
	getValues : function() {
		var a = [];
		a.push(this.down("#valueFieldfrom").getValue());
		a.push(this.down("#valueFieldto").getValue());
		return a
	},
	setValue : function(d, b) {
		var f = "from";
		if (b == 1) {
			f = "to"
		}
		var e = d || "";
		if (Ext.typeOf(e) == "string" && e != "") {
			var a = new Date();
			e = new Date(a.getFullYear(), a.getMonth(), a.getDay(), Number(d.substr(0, 2)), Number(d.substr(2, 2)), Number(d.substr(4, 2)))
		}
		var c = this.down("#timevalueField" + f);
		if (c) {
			c.setValue(e)
		}
	},
	setValues : function(a) {
		if (Ext.typeOf(a) != "array" && a != "") {
			return
		} else {
			if (Ext.typeOf(a) == "array" && a.length == 0) {
				return
			}
		}
		for (var b = 0; b < 2; b++) {
			var c = a[b] || "";
			this.setValue(c, b)
		}
	}
});
Ext.define("CMN.view.form.ValueRangeField", {
	extend : "Ext.form.FieldContainer",
	alias : "widget.valuerange",
	defaults : {
		anchor : "100%"
	},
	labelWidth : 150,
	fieldWidth : 150,
	constructor : function(a) {
		var c = a || {};
		var b = "anchor";
		if (c.vertical || c.layout == "hbox") {
			b = "hbox";
			this.fieldWidth = this.fieldWidth * 2
		}
		Ext.applyIf(c, {
			layout : b
		});
		this.callParent([c])
	},
	initComponent : function() {
		this.width = this.width || (this.labelWidth + this.fieldWidth + 5);
		this.fieldLabel = this.fieldLabel + "  (FROM ~ TO)";
		this.items = this.buildItems();
		this.callParent()
	},
	buildItems : function() {
		var c = "valueField";
		var b = [];
		var d = this.formName || this.name + "_date";
		b.push(this.buildField(c, "from", d));
		if (this.vertical) {
			b.push({
				xtype : "component",
				width : 10,
				html : "~"
			})
		}
		var a = this.toName || this.name + "_date";
		b.push(this.buildField(c, "to", a));
		return b
	},
	buildField : function(a, c, b) {
		return {
			xtype : "numberfield",
			name : b,
			itemId : a + c,
			value : this.defaultValue,
			maxValue : this.maxValue,
			minValue : this.minValue,
			flex : 1
		}
	}
});
Ext.define("CMN.view.viewport.North", {
	extend : "Ext.Container",
	cls : "noBorderPanel",
	alias : "widget.viewport.north",
	layout : {
		type : "vbox",
		align : "stretch"
	},
	items : [{
		layout : "hbox",
		defaults : {
			cls : "appMenu"
		},
		items : [{
			xtype : "cmn.mainmenu",
			height : 27,
			flex : 1
		}, {
			xtype : "cmn.sidemenu",
			minWidth : 100,
			height : 27
		}]
	}, {
		xtype : "cmn.apptool",
		cls : "appTool",
		flex : 1
	}]
});
Ext.define("CMN.view.viewport.South", {
	extend : "CMN.view.common.StatusBar",
	id : "status",
	cls : "appStatusBar noBoardPanel",
	alias : "widget.viewport.south",
	defaultText : "Ready",
	text : "Ready",
	iconCls : "x-status-valid",
	items : [],
	initComponent : function() {
		this.callParent()
	}
});
Ext.define("CMN.view.viewport.East", {
	extend : "Ext.panel.Panel",
	alias : "widget.viewport.east",
	id : "east",
	cls : "nav supplement",
	title : T("Caption.Other.Supplement"),
	layout : "card",
	listeners : {
		expand : function() {
			this.doLayout()
		}
	},
	items : [{
		xtype : "box",
		itemId : "base",
		title : T("Caption.Other.Supplement"),
		preventHeader : true,
		cls : "defaultSupplementImg"
	}]
});
Ext.define("CMN.view.viewport.West", {
	extend : "Ext.tab.Panel",
	alias : "widget.viewport.west",
	id : "nav",
	cls : "nav",
	title : T("Caption.Other.Navigation"),
	tabPosition : "bottom",
	listeners : {
		tabchange : function(b, a) {
			b.setTitle(a.title)
		},
		add : function(b, a) {
			if (b.items.length < 1) {
				b.setTitle(a.title)
			}
		},
		remove : function(b, a) {
			if (b.items.length == 0) {
				b.setTitle(b.initialConfig.title)
			}
		}
	}
});
Ext.require(["Ext.ux.tab.TabScrollerMenu", "Ext.ux.tab.TabCloseMenu"]);
Ext.define("CMN.view.viewport.Center", {
	extend : "Ext.tab.Panel",
	id : "content",
	bodyCls : "introImg",
	alias : "widget.viewport.center",
	enableTabScroll : true,
	initComponent : function() {
		this.callParent();
		var a = this;
		Ext.util.History.init();
		Ext.util.History.on("change", function(b) {
			if (b) {
				var c = b.split(":");
				SmartFactory.doMenu({
					itemId : c[0],
					viewModel : c[1]
				})
			}
		});
		this.on("tabchange", function(b, c, e) {
			var d = Ext.util.History.getToken();
			var f = c.itemId + ":" + c.self.getName();
			if (d === null || d.search(f) === -1) {
				Ext.History.add(f, true, true)
			}
		});
		this.on("added", function(c, b) {
			b.on("afterrender", function() {
				try {
					Ext.util.History.fireEvent("change", Ext.util.History.getToken())
				} catch (d) {
				}
			})
		});
		this.on("afterrender", function() {
		})
	},
	onAdd : function(c, a) {
		this.callParent(arguments);
		if (this.items.length == 1) {
			var b = Ext.util.History.getToken();
			var d = c.itemId + ":" + c.self.getName();
			if (b === null || b.search(d) === -1) {
				Ext.History.add(d, true, true)
			}
		}
	},
	onRemove : function(b, a) {
		this.callParent(arguments);
		if (this.items.length == 0) {
			Ext.History.add("", true, true)
		}
	},
	plugins : [{
		ptype : "tabscrollermenu",
		maxText : 10,
		pageSize : 5
	}, {
		ptype : "tabclosemenu"
	}]
});
Ext.require(["CMN.mixin.Status", "CMN.mixin.Search", "CMN.mixin.Vtypes"]);
Ext.define("CMN.controller.CMNController", {
	extend : "Ext.app.Controller",
	requires : ["CMN.data.proxy.PayloadProxy", "CMN.plugin.Supplement", "CMN.layout.NColumnTableLayout"],
	stores : ["CMN.store.MainMenuStore", "CMN.store.FavoriteStore", "CMN.store.AppSearchStore"],
	models : ["CMN.model.MainMenu", "CMN.model.Favorite", "CMN.model.AppSearch"],
	views : ["CMN.view.viewport.Center", "CMN.view.viewport.South", "CMN.view.viewport.East", "CMN.view.viewport.North", "CMN.view.viewport.West", "CMN.view.common.MainMenu", "CMN.view.common.SideMenu", "CMN.view.common.AppTool", "CMN.view.common.NavMainMenu", "CMN.view.common.NavFavorite", "CMN.view.common.AppSearchField", "CMN.view.form.DateTimeField", "CMN.view.form.TimePeriodField", "CMN.view.form.DatePeriodField", "CMN.view.form.DateTimePeriodField", "CMN.view.form.ValueRangeField", "CMN.view.common.RowStatic"],
	init : function() {
		this.control({
			viewport : {
				afterrender : this.onViewportRendered
			}
		});
		SmartFactory.mixin("CMN.mixin.Status");
		SmartFactory.mixin("CMN.mixin.Search");
		SmartFactory.mixin("CMN.mixin.Vtypes")
	},
	onViewportRendered : function() {
		SmartFactory.addSideMenu("CMN.view.common.AppSearchField", {
			store : Ext.create("CMN.store.AppSearchStore")
		});
		SmartFactory.addNav({
			xtype : "cmn.nav_mainmenu",
			iconCls : "iconsetDockMenu",
			itemId : "navMainMenu",
			title : T("Caption.Other.Menu")
		});
		SmartFactory.addNav({
			xtype : "cmn.nav_favorite",
			iconCls : "iconsetDockFavor",
			itemId : "navFavor",
			title : T("Caption.Other.Favorites")
		})
	}
});
