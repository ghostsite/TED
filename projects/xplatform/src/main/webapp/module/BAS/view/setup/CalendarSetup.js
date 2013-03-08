/**
 * @class BAS.view.setup.CalendarSetup 공장에 적용할 달력을 정의한다.(Process만 할 수 있음)
 * @extends MES.view.form.BaseForm
 * @author Kyunghyang
 */

/*
 * 2012-07-19 수정 - 김진호
 * baseButtons 수정(btnProcess -> btnCreate)
 * format check 추가
 */

Ext.define('BAS.view.setup.CalendarSetup', {
	extend : 'MES.view.form.BaseForm',

	title : T('Caption.Other.Calendar Setup'),

	requires : [ 'BAS.model.BasViewCalendarOut' ],

	// layout : {
	// type : 'vbox',
	// align : 'stretch'
	// },

	formReader : {
		url : 'service/basViewCalendar.json',
		model : 'BAS.model.BasViewCalendarOut'
	},

	buttonsOpt : [ {
		itemId : 'btnCreate',
		url : 'service/basUpdateCalendarList.json',
		params : {
			procstep : '1'
		}
	} ],

	initComponent : function() {
		this.callParent();

		var self = this;
		this.setDefaultWorkHours();

		this.sub('chkSun').on('change', function(box, checked) {
			self.setWorkHours('txtSun', checked);
		});
		this.sub('chkMon').on('change', function(box, checked) {
			self.setWorkHours('txtMon', checked);
		});
		this.sub('chkTue').on('change', function(box, checked) {
			self.setWorkHours('txtTue', checked);
		});
		this.sub('chkWed').on('change', function(box, checked) {
			self.setWorkHours('txtWed', checked);
		});
		this.sub('chkThu').on('change', function(box, checked) {
			self.setWorkHours('txtThu', checked);
		});
		this.sub('chkFri').on('change', function(box, checked) {
			self.setWorkHours('txtFri', checked);
		});
		this.sub('chkSat').on('change', function(box, checked) {
			self.setWorkHours('txtSat', checked);
		});

		this.sub('cmbCalType').on('change', function(me, value) {
			var calId = self.sub('cdvCalId');
			if (value == 'F') {
				calId.setValue(SmartFactory.login.factory);
				calId.setDisabled(true, 'icon');
				calId.getField().setReadOnly(true);
			} else {
				calId.setValue('');
				calId.setDisabled(false, 'icon');
				calId.getField().setReadOnly(false);
			}
			self.sub('cmbWeek').setValue(self.initWeekData[0]);
			self.setDefaultWorkHours();
		});

		this.sub('cdvCalId').on('change', function(me, newVal, oldVal, opt) {
			if (opt == 'selected') {
				self.reloadForm();
			} else {
				self.sub('txtStart').setValue('');
				self.sub('txtEnd').setValue('');
				self.sub('txtCount').setValue('');
			}
			self.sub('cmbWeek').setValue(self.initWeekData[0]);
			self.setDefaultWorkHours();
		});

		this.sub('cdvCalId').on('changetext', function(me, newVal, oldVal, opt) {
			self.sub('txtStart').setValue('');
			self.sub('txtEnd').setValue('');
			self.sub('txtCount').setValue('');
			self.sub('cmbWeek').setValue(self.initWeekData[0]);
			self.setDefaultWorkHours();
		});

		this.sub('cmbYear').on('change', function() {
			self.sub('cmbWeek').setValue(self.initWeekData[0]);
			self.setDefaultWorkHours();
		});

		this.reloadForm();
	},

	setDefaultWorkHours : function() {
		var values = this.getForm().getFieldValues();

		this.sub('txtSun').setValue(values.isHolydaySunday ? 0 : 24);
		this.sub('txtMon').setValue(values.isHolydayMonday ? 0 : 24);
		this.sub('txtTue').setValue(values.isHolydayTuesday ? 0 : 24);
		this.sub('txtWed').setValue(values.isHolydayWednesday ? 0 : 24);
		this.sub('txtThu').setValue(values.isHolydayThursday ? 0 : 24);
		this.sub('txtFri').setValue(values.isHolydayFriday ? 0 : 24);
		this.sub('txtSat').setValue(values.isHolydaySaturday ? 0 : 24);
	},

	setWorkHours : function(txtItem, checked) {
		if (checked)
			this.sub(txtItem).setValue(0);
	},

	onBeforeCreate : function(form, addParams, url) {
		return true;
	},
	checkCondition : function(step, form, addParams) {
		return true;
	},
	reloadForm : function(record) {
		this.formLoad({
			procstep : '1',
			calendarType : this.sub('cmbCalType').getValue(),
			calendarId : this.sub('cdvCalId').getValue(0),
			year : this.sub('cmbYear').getValue()
		});
	},

	buildForm : function() {
		this.initTypeData = [ [ 'F', 'F : Factory' ], [ 'W', 'W : Work' ] ];
		this.initWeekData = [ T('Caption.Other.Sunday'), T('Caption.Other.Monday'), T('Caption.Other.Tuesday'), T('Caption.Other.Wednesday'),
				T('Caption.Other.Thursday'), T('Caption.Other.Friday'), T('Caption.Other.Saturday') ];
		this.initYearData = [];
		var nowYear = Number(Ext.Date.format(new Date(), 'Y'));
		for ( var i = nowYear - 5; i <= nowYear + 5; i++) {
			this.initYearData.push(i);
		}
		return [ {
			xtype : 'fieldcontainer',
			layout : 'hbox',
			defaults : {
				flex : 1,
				labelWidth : 130
			},
			items : [ {
				xtype : 'combo',
				fieldLabel : T('Caption.Other.Calendar Type'),
				labelStyle : 'font-weight:bold',
				allowBlank : false,
				editable : false,
				store : this.initTypeData,
				displayField : 'type',
				valueField : 'value',
				itemId : 'cmbCalType',
				name : 'calendarType',
				value : 'F'
			}, {
				xtype : 'codeview',
				cls : 'marginL5',
				codeviewName : 'SvCalendar',
				fieldLabel : T('Caption.Other.Calendar ID'),
				labelStyle : 'font-weight:bold',
				allowBlank : false,
				params : function(me) {
					var params = {
						procstep : '1',// 1 : Calendar List, 2 : Work Calendar
						// ID List
						year : me.sub('cmbYear').getValue(),
						calendarType : me.sub('cmbCalType').getValue()
					};
					return params;
				},
				paramsScope : this,
				disabledIcon : true,
				disabledEnter : true,
				name : 'calendarId',
				itemId : 'cdvCalId'
			} ]
		}, {
			xtype : 'fieldcontainer',
			layout : 'hbox',
			defaults : {
				flex : 1,
				labelWidth : 130
			},
			items : [ {
				xtype : 'combo',
				fieldLabel : T('Caption.Other.Year'),
				store : this.initYearData,
				itemId : 'cmbYear',
				name : 'year',
				editable : false,
				value : this.initYearData[5]
			}, {
				xtype : 'combo',
				cls : 'marginL5',
				fieldLabel : T('Caption.Other.First Day of Week'),
				store : this.initWeekData,
				itemId : 'cmbWeek',
				name : 'firstDayOfWeek',
				editable : false,
				value : this.initWeekData[0]
			} ]
		}, {
			type : 'separator',
			cls : 'marginB10'
		}, {
			xtype : 'fieldcontainer',
			layout : 'hbox',
			items : [ {
				xtype : 'container',
				layout : 'anchor',
				cls : 'marginR10',
				defaults : {
					anchor : '100%',
					labelWidth : 130
				},
				flex : 1,
				items : [ {
					xtype : 'numberfield',
					minValue : 0,
					maxValue : 24,
					fieldLabel : T('Caption.Other.Sunday'),
					itemId : 'txtSun',
					name : 'workHoursSunday'
				}, {
					xtype : 'numberfield',
					minValue : 0,
					maxValue : 24,
					fieldLabel : T('Caption.Other.Monday'),
					itemId : 'txtMon',
					name : 'workHoursMonday'
				}, {
					xtype : 'numberfield',
					minValue : 0,
					maxValue : 24,
					fieldLabel : T('Caption.Other.Tuesday'),
					itemId : 'txtTue',
					name : 'workHoursTuesday'
				}, {
					xtype : 'numberfield',
					minValue : 0,
					maxValue : 24,
					fieldLabel : T('Caption.Other.Wednesday'),
					itemId : 'txtWed',
					name : 'workHoursWednesday'
				}, {
					xtype : 'numberfield',
					minValue : 0,
					maxValue : 24,
					fieldLabel : T('Caption.Other.Thursday'),
					itemId : 'txtThu',
					name : 'workHoursThursday'
				}, {
					xtype : 'numberfield',
					minValue : 0,
					maxValue : 24,
					fieldLabel : T('Caption.Other.Friday'),
					itemId : 'txtFri',
					name : 'workHoursFriday'
				}, {
					xtype : 'numberfield',
					minValue : 0,
					maxValue : 24,
					fieldLabel : T('Caption.Other.Saturday'),
					itemId : 'txtSat',
					name : 'workHoursSaturday'
				} ]
			}, {
				xtype : 'container',
				layout : 'anchor',
				defaults : {
					anchor : '100%',
					labelWidth : 130
				},
				flex : 1,
				items : [ {
					xtype : 'checkbox',
					boxLabel : T('Caption.Other.Holyday Flag'),
					itemId : 'chkSun',
					name : 'isHolydaySunday',
					inputValue : 'Y',
					uncheckedValue : 'N'
				}, {
					xtype : 'checkbox',
					cls : 'marginT5',
					boxLabel : T('Caption.Other.Holyday Flag'),
					itemId : 'chkMon',
					name : 'isHolydayMonday',
					inputValue : 'Y',
					uncheckedValue : 'N'
				}, {
					xtype : 'checkbox',
					cls : 'marginT5',
					boxLabel : T('Caption.Other.Holyday Flag'),
					itemId : 'chkTue',
					name : 'isHolydayTuesday',
					inputValue : 'Y',
					uncheckedValue : 'N'
				}, {
					xtype : 'checkbox',
					cls : 'marginT5',
					boxLabel : T('Caption.Other.Holyday Flag'),
					itemId : 'chkWed',
					name : 'isHolydayWednesday',
					inputValue : 'Y',
					uncheckedValue : 'N'
				}, {
					xtype : 'checkbox',
					cls : 'marginT5',
					boxLabel : T('Caption.Other.Holyday Flag'),
					itemId : 'chkThu',
					name : 'isHolydayThursday',
					inputValue : 'Y',
					uncheckedValue : 'N'
				}, {
					xtype : 'checkbox',
					cls : 'marginT5',
					boxLabel : T('Caption.Other.Holyday Flag'),
					itemId : 'chkFri',
					name : 'isHolydayFriday',
					inputValue : 'Y',
					uncheckedValue : 'N'
				}, {
					xtype : 'checkbox',
					cls : 'marginT5',
					boxLabel : T('Caption.Other.Holyday Flag'),
					itemId : 'chkSat',
					name : 'isHolydaySaturday',
					inputValue : 'Y',
					uncheckedValue : 'N'
				} ]
			} ]
		}, {
			type : 'separator',
			cls : 'marginB10'
		}, {
			xtype : 'fieldcontainer',
			layout : 'hbox',
			defaults : {
				flex : 1,
				labelWidth : 130
			},
			items : [ {
				xtype : 'textfield',
				fieldLabel : T('Caption.Other.Start Day'),
				readOnly : true,
				submitValue : false,
				itemId : 'txtStart',
				name : 'startDay'
			}, {
				xtype : 'textfield',
				cls : 'marginL10',
				fieldLabel : T('Caption.Other.Day Count'),
				itemId : 'txtCount',
				readOnly : true,
				submitValue : false,
				name : 'dayCount'
			} ]
		}, {
			xtype : 'textfield',
			cls : 'marginR5',
			fieldLabel : T('Caption.Other.End Day'),
			itemId : 'txtEnd',
			labelWidth : 130,
			readOnly : true,
			submitValue : false,
			name : 'endDay',
			anchor : '50%'
		} ];
	}
});
