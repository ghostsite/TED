Ext.define('TES.view.TinyMce', {
	extend : 'MES.view.form.BaseForm',
	title : T('Caption.Menu.TES.view.TinyMce'),
	
	xtype : 'tes_tinymce',
	requires : [ 'Ext.ux.form.TinyMCETextArea'],

	layout : 'fit',

	initComponent : function() {
		this.callParent();
	},

	buildForm : function() {
		var tinyCfg1 = {
			// General options
			theme : "advanced",
			skin : "extjs",
			inlinepopups_skin : "extjs",

			// Original value is 23, hard coded.
			// with 23 the editor calculates the height wrong.
			// With these settings, you can do the fine tuning of the height
			// by the initialization.
			theme_advanced_row_height : 27,
			delta_height : 1,

			schema : "html5",

			plugins : "autolink,lists,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,wordcount,advlist",

			// Theme options
			theme_advanced_buttons1 : "save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect",
			theme_advanced_buttons2 : "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
			theme_advanced_buttons3 : "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
			theme_advanced_buttons4 : "insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,pagebreak,restoredraft",
			theme_advanced_toolbar_location : "top",
			theme_advanced_toolbar_align : "left",
			theme_advanced_statusbar_location : "bottom"

			// Example content CSS (should be your site CSS)
			//content_css : "contents.css"
		};

		return {
			layout : 'fit',
			plain : true,
			modal : true,
			border : false,
			bodyBorder : true,
			bodyPadding : '5 5 0',
			focusOnToFront : false,
			toFrontOnShow : false,
			preventFocusOnActivate : true,
			buttons : [{
				text : 'Toggle ReadOnly',
				handler : function() {
					var ed = second_form.getForm().findField('message');
					if (ed) {
						if (ed.readOnly)
							ed.setReadOnly(false);
						else
							ed.setReadOnly(true);
					}
				}
			}, {
				text : 'Enable / Disable',
				handler : function() {
					var ed = second_form.getForm().findField('message');
					if (ed) {
						if (ed.isDisabled())
							ed.enable();
						else
							ed.disable();
					}
				}
			}, {
				text : 'WYSIWYG / HTML Text',
				handler : function() {
					var ed = second_form.getForm().findField('message');
					if (ed)
						ed.toggleEditor();
				}
			}, {
				text : 'Submit',
				handler : function() {
					second_form.getForm().submit({
						url : 'process.js',
						method : 'get',
						success : function(form, action) {
							Ext.MessageBox.alert("Information", "Submit done!");
						}
					});
				}
			}, {
				text : 'Close',
				handler : function() {
					win.close();
				}
			}],

			items : second_form = Ext.create('Ext.form.FormPanel', {
				bodyStyle : 'background-color: transparent',
				border : false,
				trackResetOnLoad : true,
				autoScroll : true,

				fieldDefaults : {
					labelWidth : 75,
					anchor : '100%'
				},
				defaultType : 'textfield',

				items : [{
					fieldLabel : 'Sender',
					name : 'sender'
				}, {
					fieldLabel : 'Receiver',
					name : 'receiver'
				}, {
					fieldLabel : 'Subject',
					name : 'subject'
				}, {
					height : 'auto',
					fieldLabel : 'Message',
					anchor : '100% 60%',
					xtype : 'tinymce_textarea',
					// xtype: 'textarea',
					fieldStyle : 'font-family: Courier New; font-size: 12px;',

					noWysiwyg : false,
					tinyMCEConfig : tinyCfg1,
					value : 'Some Text',
					name : 'message'
				}, {
					fieldLabel : 'Others',
					name : 'others'
				}]
			})
		};
	}
});