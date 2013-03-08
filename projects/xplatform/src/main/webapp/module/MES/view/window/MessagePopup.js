Ext.define('MES.view.window.MessagePopup', {
	extend : 'Ext.window.Window',

	requires : [ 'Ext.toolbar.Toolbar', 'Ext.button.Button', 'Ext.layout.container.Anchor', 'Ext.layout.container.HBox', 'Ext.grid.Panel' ],

	alias : 'widget.msgbox',

	/**
	 * Button config that displays a single OK button
	 * 
	 * @type Number
	 */
	OK : 1,
	/**
	 * Button config that displays a single Yes button
	 * 
	 * @type Number
	 */
	YES : 2,
	/**
	 * Button config that displays a single No button
	 * 
	 * @type Number
	 */
	NO : 4,
	/**
	 * Button config that displays a single Abort button
	 * 
	 * @type Number
	 */
	ABORT : 8,
	/**
	 * Button config that displays a single Retry button
	 * 
	 * @type Number
	 */
	RETRY : 16,
	/**
	 * Button config that displays a single Cancel button
	 * 
	 * @type Number
	 */
	CANCEL : 32,
	/**
	 * Button config that displays a single Ignore button
	 * 
	 * @type Number
	 */
	IGNORE : 64,
	/**
	 * Button config that displays OK and Cancel buttons
	 * 
	 * @type Number
	 */
	OKCANCEL : 33, // 1+32
	/**
	 * Button config that displays Yes and No buttons
	 * 
	 * @type Number
	 */
	YESNO : 6, // 2+4
	/**
	 * Button config that displays Yes, No and Cancel buttons
	 * 
	 * @type Number
	 */
	YESNOCANCEL : 38, // 2+4+32
	/**
	 * Button config that displays Retry and Cancel buttons
	 * 
	 * @type Number
	 */
	RETRYCANCEL : 48, // 16+32
	/**
	 * Button config that displays Abort, Retry and Ignore buttons
	 * 
	 * @type Number
	 */
	ABORTRETRYIGNORE : 88,// 8+16+64,
	/**
	 * The CSS class that provides the INFO icon image
	 * 
	 * @type String
	 */
	INFO : 'ext-mb-info',
	/**
	 * The CSS class that provides the WARNING icon image
	 * 
	 * @type String
	 */
	WARNING : 'ext-mb-warning',
	/**
	 * The CSS class that provides the QUESTION icon image
	 * 
	 * @type String
	 */
	QUESTION : 'ext-mb-question',
	/**
	 * The CSS class that provides the ERROR icon image
	 * 
	 * @type String
	 */
	ERROR : 'ext-mb-error',

	// hide it by offsets. Windows are hidden on render by default.
	hideMode : 'offsets',
	closeAction : 'hide',
	resizable : false,
	title : '&#160;',

	width : 400, // 600
	height : 300, // 500
	minWidth : 300,
	maxWidth : 400, // 600
	minHeight : 140,
	maxHeight : 300, // 500
	constrain : true,

	// 80
	// 120

	cls : Ext.baseCSSPrefix + 'message-box',

	layout : {
		type : 'anchor'
	},

	/**
	 * The default height in pixels of the message box's multiline textarea if
	 * displayed.
	 * 
	 * @type Number
	 */
	defaultGridHeight : 150,

	/**
	 * The minimum width in pixels of the message box if it is a prompt dialog.
	 * This is useful for setting a different minimum width than text-only
	 * dialogs may need.
	 * 
	 * @type Number
	 */
	minPromptWidth : 120, // 250
	/**
	 * An object containing the default button text strings that can be
	 * overriden for localized language support. Supported properties are: ok,
	 * cancel, yes and no. Generally you should include a locale-specific
	 * resource file for handling language support across the framework.
	 * Customize the default text like so: Ext.window.MessageBox.buttonText.yes =
	 * "oui"; //french
	 * 
	 * @type Object
	 */
	buttonText : {
		ok : 'OK',
		yes : 'Yes',
		no : 'No',
		abort : 'Abort',
		retry : 'Retry',
		cancel : 'Cancel',
		ignore : 'Ignore'
	},

	buttonIds : [ 'ok', 'yes', 'no', 'abort', 'retry', 'cancel', 'ignore' ],

	titleText : {
		confirm : 'Confirm',
		prompt : 'Prompt',
		wait : 'Loading...',
		alert : 'Attention'
	},

	iconHeight : 35,

	initComponent : function() {
		var self = this;
		self.store = Ext.create('Ext.data.Store', {
			fields : [ {
				name : 'name',
				type : 'string'
			}, {
				name : 'type',
				type : 'string'
			}, {
				name : 'text',
				type : 'string'
			} ]
		});
		self.title = '&#160;';
		self.topContainer = self.ztopContainer();
		self.items = self.topContainer;

		self.bottomTb = self.zbottomTb();
		self.dockedItems = [ self.bottomTb ];
		this.callParent();
	},

	makeButton : function(btnIdx) {
		var btnId = this.buttonIds[btnIdx];
		return Ext.create('Ext.button.Button', {
			handler : this.btnCallback,
			itemId : btnId,
			scope : this,
			text : this.buttonText[btnId],
			minWidth : 75
		});
	},

	btnCallback : function(btn) {
		var self = this, value = '', field;

		if (self.cfg.prompt || self.cfg.multiline) {
			if (self.cfg.multiline) {
				field = self.textArea;
			} else {
				field = self.textField;
			}
			value = field.getValue();
			field.reset();
		}

		// Important not to have focus remain in the hidden Window; Interferes
		// with DnD.
		btn.blur();
		self.hide();
		self.userCallback(btn.itemId, value, self.cfg);
	},

	hide : function() {
		var self = this;
		self.dd.endDrag();
		self.removeCls(self.cfg.cls);
		self.callParent();
	},

	zbottomTb : function() {
		var self = this;
		var button;
		self.msgButtons = [];
		for ( var i = 0; i < 7; i++) {
			button = self.makeButton(i);
			self.msgButtons[button.itemId] = button;
			self.msgButtons.push(button);
		}

		return Ext.create('Ext.toolbar.Toolbar', {
			ui : 'footer',
			dock : 'bottom',
			layout : {
				pack : 'center'
			},
			items : self.msgButtons
		});
	},

	ztopContainer : function() {
		var self = this;
		self.msg = Ext.create('Ext.Component', {
			autoEl : {
				tag : 'span'
			},
			cls : 'ext-mb-text'
		});
		
		self.guidebtn = Ext.create('Ext.toolbar.Toolbar', {
			ui : 'footer',
			dock : 'bottom',
			cls : 'marginT10',
			items : [ '->', {
				enableToggle : true,
				toggleHandler : function(button, state) {
					self.onGuideButtonClick(state);
				},
				itemId : 'btnWDetail',
				scope : this,
				iconCls : 'btnArrowDown',
				minWidth : 24
			}, {
				enableToggle : true,
				toggleHandler : function(button, state) {
					self.onGuideButtonClick(state);
				},
				itemId : 'btnDetail',
				scope : this,
				iconCls : 'btnArrowDown',
				minWidth : 24
			} ]
		});
		self.msgGrid = Ext.create('Ext.grid.Panel', {
			itemId : 'msgGrid',
			height : 150,
			anchor : '100%',
			store : self.store,
			autoScroll : true,
			columnLines : true,
			cls : 'borderT borderB',
			columns : [ {
				header : T('Caption.Other.Name'),
				dataIndex : 'name',
				width : 120
			}, {
				header : 'Value',
				dataIndex : 'text',
				width : 400,
				renderer : function(v){
					v = Ext.String.trim(v);
					var txtLen = v.length;
					var cnt = 0;
					if(txtLen>0){
						cnt = txtLen/50;
					}
					for(var i=0;i<cnt;i++){
						var left = v.substr(0,i*51+50);
						var right = v.substr(i*51+50);
						v = left+'</br>'+right;
					}
					return v;
				}
			} ]
		});
		return Ext.create('Ext.container.Container', {
			layout : 'fit',
			style : {
				padding : '10px',
				overflow : 'hidden'
			},
			items : [ self.iconComponent = Ext.create('Ext.Component', {
				cls : 'ext-mb-icon',
				width : 50,
				height : self.iconHeight,
				style : {
					'float' : 'left'
				}
			}), self.promptContainer = Ext.create('Ext.container.Container', {
				layout : {
					type : 'anchor'
				},
				items : [ self.msg, self.guidebtn, self.msgGrid ]
			}) ]
		});
	},

	onGuideButtonClick : function(state) {
		var self = this;
		self.sub('btnWDetail').pressed = state;
		self.sub('btnDetail').pressed = state;
		if (state) {
			self.setHeight(self.getHeight() + self.defaultGridHeight);
			self.msgGrid = self.msgGrid.show();
			//self.sub('btnExcel').show();
		} else {
			self.setHeight(self.getHeight() - self.defaultGridHeight);
			self.msgGrid = self.msgGrid.hide();
			//self.sub('btnExcel').hide();
		}
	},
	onPromptKey : function(textField, e) {
		var self = this, blur = '';

		if (e.keyCode === Ext.EventObject.RETURN || e.keyCode === 10) {
			if (self.msgButtons.ok.isVisible()) {
				blur = true;
				self.msgButtons.ok.handler.call(self, self.msgButtons.ok);
			} else if (self.msgButtons.yes.isVisible()) {
				self.msgButtons.yes.handler.call(self, self.msgButtons.yes);
				blur = true;
			}

			if (blur) {
				self.textField.blur();
			}
		}
	},

	reconfigure : function(cfg) {
		// Ext.log(cfg);
		var self = this, buttons = cfg.buttons || 1, hideToolbar = true, initialWidth = self.maxWidth, i;

		cfg = cfg || {};
		self.cfg = cfg;
		if (cfg.width) {
			initialWidth = cfg.width;
		}

		// Default to allowing the Window to take focus.
		delete self.defaultFocus;

		// clear any old animateTarget
		self.animateTarget = cfg.animateTarget || undefined;

		// Defaults to modal
		self.modal = cfg.modal !== false;

		// Show the title
		if (cfg.title) {
			self.setTitle(cfg.title || '&#160;');
		}

		if (!self.rendered) {
			self.width = initialWidth;
			self.render(Ext.getBody());
		} else {
			self.setSize(initialWidth, self.maxHeight);
		}
		self.setPosition(-10000, -10000);

		// Hide or show the close tool
		self.closable = cfg.closable && !cfg.wait;
		self.header.child('[type=close]').setVisible(cfg.closable !== false);

		// Hide or show the header
		if (!cfg.title && !self.closable) {
			self.header.hide();
		} else {
			self.header.show();
		}

		// Default to dynamic drag: drag the window, not a ghost
		self.liveDrag = !cfg.proxyDrag;

		// wrap the user callback
		self.userCallback = Ext.Function.bind(cfg.callback || cfg.fn || Ext.emptyFn, cfg.scope || Ext.global);

		// Hide or show the icon Component
		self.setIcon(cfg.icon);

		// Hide or show the message area
		if (cfg.msg) {
			self.msg.update(cfg.msg);
			self.msg.show();
		} else {
			self.msg.hide();
		}

		// Hide or show the input field

		if (cfg.fieldMsg) {
			self.sub('btnDetail').show();
		} else {
			self.sub('btnDetail').hide();
		}

		if (cfg.warningMsg) {
			self.sub('btnWDetail').show();
		} else {
			self.sub('btnWDetail').hide();
		}
		self.sub('btnWDetail').pressed = false;
		self.sub('btnDetail').pressed = false;
		self.msgGrid.hide();
		//self.sub('btnExcel').hide();

		// Hide or show buttons depending on flag value sent.
		for (i = 0; i < 7; i++) {
			if (buttons & Math.pow(2, i)) {

				// Default to focus on the first visible button if focus not
				// already set
				if (!self.defaultFocus) {
					if (cfg.btnFocus == i || !cfg.btnFocus)
						self.defaultFocus = self.msgButtons[i];
				}
				self.msgButtons[i].show();
				hideToolbar = false;
			} else {
				self.msgButtons[i].hide();
			}
		}

		// Hide toolbar if no buttons to show
		if (hideToolbar) {
			self.bottomTb.hide();
		} else {
			self.bottomTb.show();
		}
	},

	/**
	 * Displays a new message box, or reinitializes an existing message box,
	 * based on the config options passed in. All display functions (e.g.
	 * prompt, alert, etc.) on MessageBox call this function internally,
	 * although those calls are basic shortcuts and do not support all of the
	 * config options allowed here.
	 * 
	 * @param {Object}
	 *            config The following config options are supported:
	 *            <ul>
	 *            <li><b>animateTarget</b> : String/Element<div
	 *            class="sub-desc">An id or Element from which the message box
	 *            should animate as it opens and closes (defaults to undefined)</div></li>
	 *            <li><b>buttons</b> : Number<div class="sub-desc">A bitwise
	 *            button specifier consisting of the sum of any of the following
	 *            constants:
	 *            <ul>
	 *            <li>Ext.window.MessageBox.OK</li>
	 *            <li>Ext.window.MessageBox.YES</li>
	 *            <li>Ext.window.MessageBox.NO</li>
	 *            <li>Ext.window.MessageBox.CANCEL</li>
	 *            </ul>
	 *            Or false to not show any buttons (defaults to false)</div></li>
	 *            <li><b>closable</b> : Boolean<div class="sub-desc">False to
	 *            hide the top-right close button (defaults to true). Note that
	 *            progress and wait dialogs will ignore this property and always
	 *            hide the close button as they can only be closed
	 *            programmatically.</div></li>
	 *            <li><b>cls</b> : String<div class="sub-desc">A custom CSS
	 *            class to apply to the message box's container element</div></li>
	 *            <li><b>defaultTextHeight</b> : Number<div
	 *            class="sub-desc">The default height in pixels of the message
	 *            box's multiline textarea if displayed (defaults to 75)</div></li>
	 *            <li><b>fn</b> : Function<div class="sub-desc">A callback
	 *            function which is called when the dialog is dismissed either
	 *            by clicking on the configured buttons, or on the dialog close
	 *            button, or by pressing the return button to enter input.
	 *            <p>
	 *            Progress and wait dialogs will ignore this option since they
	 *            do not respond to user actions and can only be closed
	 *            programmatically, so any required function should be called by
	 *            the same code after it closes the dialog. Parameters passed:
	 *            <ul>
	 *            <li><b>buttonId</b> : String<div class="sub-desc">The ID of
	 *            the button pressed, one of:<div class="sub-desc">
	 *            <ul>
	 *            <li><tt>ok</tt></li>
	 *            <li><tt>yes</tt></li>
	 *            <li><tt>no</tt></li>
	 *            <li><tt>cancel</tt></li>
	 *            </ul>
	 *            </div></div></li>
	 *            <li><b>text</b> : String<div class="sub-desc">Value of the
	 *            input field if either
	 *            <tt><a href="#show-option-prompt" ext:member="show-option-prompt" ext:cls="Ext.window.MessageBox">prompt</a></tt>
	 *            or
	 *            <tt><a href="#show-option-multiline" ext:member="show-option-multiline" ext:cls="Ext.window.MessageBox">multiline</a></tt>
	 *            is true</div></li>
	 *            <li><b>opt</b> : Object<div class="sub-desc">The config
	 *            object passed to show.</div></li>
	 *            </ul>
	 *            </p>
	 *            </div></li>
	 *            <li><b>scope</b> : Object<div class="sub-desc">The scope (<code>this</code>
	 *            reference) in which the function will be executed.</div></li>
	 *            <li><b>icon</b> : String<div class="sub-desc">A CSS class
	 *            that provides a background image to be used as the body icon
	 *            for the dialog (e.g. Ext.window.MessageBox.WARNING or
	 *            'custom-class') (defaults to '')</div></li>
	 *            <li><b>iconCls</b> : String<div class="sub-desc">The
	 *            standard {@link Ext.window.Window#iconCls} to add an optional
	 *            header icon (defaults to '')</div></li>
	 *            <li><b>maxWidth</b> : Number<div class="sub-desc">The
	 *            maximum width in pixels of the message box (defaults to 600)</div></li>
	 *            <li><b>minWidth</b> : Number<div class="sub-desc">The
	 *            minimum width in pixels of the message box (defaults to 100)</div></li>
	 *            <li><b>modal</b> : Boolean<div class="sub-desc">False to
	 *            allow user interaction with the page while the message box is
	 *            displayed (defaults to true)</div></li>
	 *            <li><b>msg</b> : String<div class="sub-desc">A string that
	 *            will replace the existing message box body text (defaults to
	 *            the XHTML-compliant non-breaking space character '&amp;#160;')</div></li>
	 *            <li><a id="show-option-multiline"></a><b>multiline</b> :
	 *            Boolean<div class="sub-desc"> True to prompt the user to
	 *            enter multi-line text (defaults to false)</div></li>
	 *            <li><b>progress</b> : Boolean<div class="sub-desc">True to
	 *            display a progress bar (defaults to false)</div></li>
	 *            <li><b>progressText</b> : String<div class="sub-desc">The
	 *            text to display inside the progress bar if progress = true
	 *            (defaults to '')</div></li>
	 *            <li><a id="show-option-prompt"></a><b>prompt</b> : Boolean<div
	 *            class="sub-desc">True to prompt the user to enter single-line
	 *            text (defaults to false)</div></li>
	 *            <li><b>proxyDrag</b> : Boolean<div class="sub-desc">True to
	 *            display a lightweight proxy while dragging (defaults to false)</div></li>
	 *            <li><b>title</b> : String<div class="sub-desc">The title
	 *            text</div></li>
	 *            <li><b>value</b> : String<div class="sub-desc">The string
	 *            value to set into the active textbox element if displayed</div></li>
	 *            <li><b>wait</b> : Boolean<div class="sub-desc">True to
	 *            display a progress bar (defaults to false)</div></li>
	 *            <li><b>waitConfig</b> : Object<div class="sub-desc">A
	 *            {@link Ext.ProgressBar#wait} config object (applies only if
	 *            wait = true)</div></li>
	 *            <li><b>width</b> : Number<div class="sub-desc">The width of
	 *            the dialog in pixels</div></li>
	 *            </ul>
	 *            Example usage:
	 * 
	 * <pre><code>
	 * Ext.Msg.show({
	 * 	title : 'Address',
	 * 	msg : 'Please enter your address:',
	 * 	width : 300,
	 * 	buttons : Ext.Msg.OKCANCEL,
	 * 	multiline : true,
	 * 	fn : saveAddress,
	 * 	animateTarget : 'addAddressBtn',
	 * 	icon : Ext.window.MessageBox.INFO
	 * });
	 * </code></pre>
	 * 
	 * @return {Ext.window.MessageBox} this
	 */
	show : function(cfg) {
		var self = this;
		self.reconfigure(cfg);
		self.addCls(cfg.cls);
		if (cfg.animateTarget) {
			self.doAutoSize(true);
			self.callParent();
		} else {
			self.callParent();
			self.doAutoSize(true);
		}
		return self;
	},

	afterShow : function() {
		if (this.animateTarget) {
			this.center();
		}
		this.callParent(arguments);
	},

	doAutoSize : function(center) {
		var self = this, icon = self.iconComponent, iconHeight = self.iconHeight;
		if (!Ext.isDefined(self.fraselfWidth)) {
			self.fraselfWidth = self.el.getWidth() - self.body.getWidth();
		}

		// reset to the original dimensions
		icon.setHeight(iconHeight);

		// Allow per-invocation override of minWidth
		self.minWidth = self.cfg.minWidth || Ext.getClass(this).prototype.minWidth;

		// Set best possible size based upon allowing the text to wrap in the
		// maximized Window, and
		// then constraining it to within the max with. Then adding up
		// constituent element heights.
		self.topContainer.doLayout();

		var width = self.cfg.width || self.msg.getWidth() + icon.getWidth() + 25; /*
																					 * topContainer's
																					 * layout
																					 * padding
																					 */

		var height = (self.header.rendered ? self.header.getHeight() : 0) + Math.max(self.promptContainer.getHeight(), icon.getHeight())
				+ (self.bottomTb.rendered ? self.bottomTb.getHeight() : 0) + 20;/*
																				 * topContainer's
																				 * layout
																				 * padding
																				 */
		// Update to the size of the content, this way the text won't wrap under
		// the icon.
		icon.setHeight(Math.max(iconHeight, self.msg.getHeight()));

		self.setHeight(height);
		// self.setSize(width + self.frameWidth, height + self.frameWidth);
		if (center) {
			self.center();
		}
		return self;
	},

	updateText : function(text) {
		this.msg.update(text);
		return this.doAutoSize(true);
	},

	/**
	 * Adds the specified icon to the dialog. By default, the class
	 * 'ext-mb-icon' is applied for default styling, and the class passed in is
	 * expected to supply the background image url. Pass in empty string ('') to
	 * clear any existing icon. This method must be called before the MessageBox
	 * is shown. The following built-in icon classes are supported, but you can
	 * also pass in a custom class name:
	 * 
	 * <pre>
	 * Ext.window.MessageBox.INFO
	 * Ext.window.MessageBox.WARNING
	 * Ext.window.MessageBox.QUESTION
	 * Ext.window.MessageBox.ERROR
	 * </pre>
	 * 
	 * @param {String}
	 *            icon A CSS classname specifying the icon's background image
	 *            url, or empty string to clear the icon
	 * @return {Ext.window.MessageBox} this
	 */
	setIcon : function(icon) {
		var self = this;
		self.iconComponent.removeCls(self.iconCls);
		if (icon) {
			self.iconComponent.show();
			self.iconComponent.addCls(Ext.baseCSSPrefix + 'dlg-icon');
			self.iconComponent.addCls(self.iconCls = icon);
		} else {
			self.iconComponent.removeCls(Ext.baseCSSPrefix + 'dlg-icon');
			self.iconComponent.hide();
		}
		return self;
	},

	onEsc : function() {
		if (this.closable !== false) {
			this.callParent(arguments);
		}
	},

	/**
	 * Displays a standard read-only message box with an OK button (comparable
	 * to the basic JavaScript alert prompt). If a callback function is passed
	 * it will be called after the user clicks the button, and the id of the
	 * button that was clicked will be passed as the only parameter to the
	 * callback (could also be the top-right close button).
	 * 
	 * @param {String}
	 *            title The title bar text
	 * @param {String}
	 *            msg The message box body text
	 * @param {Function}
	 *            fn (optional) The callback function invoked after the message
	 *            box is closed
	 * @param {Object}
	 *            scope (optional) The scope (<code>this</code> reference) in
	 *            which the callback is executed. Defaults to the browser
	 *            wnidow.
	 * @return {Ext.window.MessageBox} this
	 */
	alert : function(cfg, msg, fn, scope) {
		if (Ext.isString(cfg)) {
			cfg = {
				title : cfg,
				msg : msg,
				buttons : this.OK,
				fn : fn,
				scope : scope,
				minWidth : this.minWidth
			};
		}
		return this.show(cfg);
	},

	showRtnMessage : function(title, rtnMsg, btnStyle, focus, fn, scope, value) {
		if (!btnStyle)
			btnStyle = 'OK';
		var btnFocus = Ext.Array.indexOf(this.buttonIds, focus || 'ok');
		var msg = rtnMsg;
		var fieldMsg = false;
		var warningMsg = false;
		// Ext.log(rtnMsg);

		if (!rtnMsg) {
			title = T('Caption.Other.No response');
			rtnMsg = T('Message.No response');
		}

		if (rtnMsg.result != undefined && rtnMsg.result.success === true) {
			// title = rtnMsg.result.msgcode;
			msg = rtnMsg.result.msg;
		} else if (rtnMsg.failureType) {
			switch (rtnMsg.failureType) {
			case Ext.form.action.Action.CLIENT_INVALID:
				title = 'Failure';
				msg = T('Message.CLIENT_INVALID');
				break;
			case Ext.form.action.Action.CONNECT_FAILURE:
				title = 'Failure';
				msg = T('Message.CONNECT_FAILURE');
				break;
			case Ext.form.action.Action.SERVER_INVALID:
				title = 'Failure';
				msg = rtnMsg.result.msg;
				break;
			default:
				// title = rtnMsg.result.msgcode;
				msg = rtnMsg.result.msg;
				break;
			}
		} else if (rtnMsg.msgcode) {
			// title = rtnMsg.msgcode;
			msg = rtnMsg.msg;
		}

		if (rtnMsg.dberrmsg || (rtnMsg.result && rtnMsg.result.dberrmsg)) {
			var dberrmsg = rtnMsg.dberrmsg || rtnMsg.result.dberrmsg;
			var code = rtnMsg.msgcode || rtnMsg.result.msgcode;
			msg = code + " : " + dberrmsg;
		}

		if (rtnMsg.fieldmsg || (rtnMsg.result && rtnMsg.result.fieldmsg)) {
			var data = rtnMsg.fieldmsg || rtnMsg.result.fieldmsg;
			if (data.length > 0) {
				this.store.loadData(data);
				fieldMsg = true;
			}
		}
		var txtLen = msg.length;
		var cnt = 0;
		if(txtLen>0){
			cnt = txtLen/50;
		}
		for(var i=0;i<cnt;i++){
			var space = msg.search(/\s/);
			if(space<0){
				var left = msg.substr(0,i*61+60);
				var right = msg.substr(i*61+60);
				msg = left+' '+right;
			}
		}
		
		var cfg = {
			fieldMsg : fieldMsg,
			warningMsg : warningMsg,

			title : title,
			msg : msg,
			buttons : this[btnStyle],
			callback : fn,
			scope : scope,
			value : value
		};
		if (btnFocus >= 0) {
			Ext.apply(cfg, {
				btnFocus : btnFocus
			});
		}
		return this.show(cfg);
	},
	showMessage : function(cfg, msg, btnStyle, focus, fn, scope, value) {
		if (!btnStyle)
			btnStyle = 'OK';
		if (!focus)
			focus = 'ok';
		var btnFocus = Ext.Array.indexOf(this.buttonIds, focus);

		if (Ext.isString(cfg)) {
			cfg = {
				title : cfg,
				msg : msg,
				buttons : this[btnStyle],
				callback : fn,
				scope : scope,
				value : value
			};
			if (btnFocus >= 0) {
				Ext.apply(cfg, {
					btnFocus : btnFocus
				});
			}
		} else if (cfg.fields && cfg.msg) {
			for ( var key in cfg.fields) {
				cfg.msg = cfg.msg.replace('{' + key + '}', cfg.fields[key]);
			}
		}
		return this.show(cfg);
	}
});