Ext.define('BAS.view.setup.JobTriggerSetup', {
	extend : 'MES.view.form.BaseForm',
	title : T('Caption.Menu.Job Trigger Setup'),

	buttonsOpt : [ {
		itemId : 'btnCreate',
		url : 'service/basUpdateJobTrigger.json'
	}, {
		itemId : 'btnUpdate',
		url : 'service/basUpdateJobTrigger.json'
	}, {
		itemId : 'btnDelete',
		url : 'service/basUpdateJobTrigger.json',
		confirm : {
			fields : {
				field1 : 'name'
			}
		}
	} ],

	initComponent : function() {
		this.callParent();

		var self = this;

		var baseButtons = this.getButtons();
		baseButtons.addItem(0, this.zstart());
		baseButtons.addItem(1, this.zstop());

		this.on('afterrender', function() {
			var supplement = self.getSupplement();
			supplement.on('supplementSelected', function(record) {
				var keys = {
					name : record.get('name')
				};
				self.setKeys(keys);
			});
		});

		this.on('keychange', function(view, keys) {
			if (!keys)
				return;

			// 폼 초기화
			SF.cf.clearFormFields(self);

			// 폼 로드
			self.viewJobTrigger(keys);
		});

		this.sub('rdoType').on('change', function(me, newValue, oldValue, eOpt) {
			if (me.getChecked().length == 1) {
				var ctnCard = self.sub('ctnCard');
				var type = newValue.type;
				if (type == 'simple') {
					// Simple
					ctnCard.getLayout().setActiveItem('ctnSimple');
				} else if (type == 'cron') {
					// Cron
					ctnCard.getLayout().setActiveItem('ctnCron');
				}
			}
		});

		this.sub('cmbExpression').on('change', function(me, newValue) {
			self.setCronExpression(newValue);
		});

		this.sub('txtTriggerId').on('dirtychange', function(me, dirty) {
			if (dirty) {
				self.clearData(self, {
					txtTriggerId : 'txtTriggerId'
				});
				baseButtons.sub('btnDelete').setDisabled(true);
			} else {
				baseButtons.sub('btnDelete').setDisabled(false);
			}
		});

		this.sub('btnStart').on('click', function() {
			self.playJobTrigger('start');
		});

		this.sub('btnStop').on('click', function() {
			self.playJobTrigger('stop');
		});

		this.getForm().on('dirtychange', function(me, dirty) {

			if (dirty) {
				// form 수정상태
				self.sub('btnStart').setDisabled(true);
				self.sub('btnStop').setDisabled(true);
			} else {
				// form 원본상태
				self.sub('btnStart').setDisabled(false);
				self.sub('btnStop').setDisabled(false);
			}
		});
	},

	playJobTrigger : function(type) {
		if (this.checkCondition('btnPlay') == false) {
			return;
		}

		var procstep = '';
		if (type == 'start') {
			procstep = 'R';
		} else if (type == 'stop') {
			procstep = 'P';
		}

		var name = this.sub('txtTriggerId').getValue();
		Ext.Ajax.request({
			url : 'service/basUpdateJobTrigger.json',
			params : {
				procstep : procstep,
				name : name
			},
			success : function(response) {
				var result = Ext.JSON.decode(response.responseText);
				if (result.success) {
					var select = {
						column : 'name',
						value : name
					};
					this.supplement.refreshGrid(true, select);
				} else {
					this.supplement.refreshGrid(true);
				}
			},
			scope : this
		});
	},

	viewJobTrigger : function(keys) {
		var self = this;
		Ext.Ajax.request({
			url : 'service/basViewJobTrigger.json',
			params : {
				procstep : '1',
				name : keys.name
			},
			success : function(response) {
				var result = Ext.JSON.decode(response.responseText);
				if (result.success) {
					var data = Ext.clone(result);
					// type 데이타 설정
					if (result.type == 'simple') {
						var repeatInterval = Number(result.repeatInterval);
						if (isNaN(repeatInterval) == false) {
							var interval = repeatInterval / 1000;
							data.repeatInterval = interval;
						}
					} else if (result.type == 'cron') {
						var cron = self.parseCronExpression(result.cronExpression);
						Ext.apply(data, cron);
					}

					self.getForm().setValues(data);
				}
			}
		});
	},

	getTypeValue : function(formValues) {
		var params = {};
		if (formValues.type == 'simple') {
			// Simple Value
			params = {
				repeatCount : formValues.repeatCount,
				repeatInterval : formValues.repeatInterval * 1000
			};

		} else if (formValues.type == 'cron') {
			// Cron Value
			params = {
				cronExpression : this.getCronExpression()
			};
		}

		return params;
	},

	getCronExpression : function() {
		var itemIds = [ 'txtSeconds', 'txtMinutes', 'txtHours', 'txtDayOfMonth', 'txtMonth', 'txtDayOfWeek' ];
		var result = '';
		Ext.Array.each(itemIds, function(itemId, index) {
			var crontrol = this.sub(itemId);
			result += crontrol.getValue() + ' ';
		}, this);

		return result ? result.substring(0, result.length - 1) : '';
	},

	setCronExpression : function(type) {
		var itemIds = [ 'txtSeconds', 'txtMinutes', 'txtHours', 'txtDayOfMonth', 'txtMonth', 'txtDayOfWeek' ];
		var cronExamples = [];
		if (type == 'D') {
			// Fire at 10:15am every day(0 15 10 ? * *)
			cronExamples = [ '0', '15', '10', '?', '*', '*', '' ];
		} else if (type == 'M') {
			cronExamples = [ '0', '15', '10', '15', '*', '?', '' ];
		}

		if (cronExamples.length > 0) {
			// 데이타 로드
			Ext.Array.each(itemIds, function(itemId, index) {
				var crontrol = this.sub(itemId);
				crontrol.setValue(cronExamples[index]);
			}, this);
		}
	},

	parseCronExpression : function(str) {
		var result = {};
		if (!str) {
			return result;
		}
		var arrCron = str.split(' ');

		Ext.Array.each(arrCron, function(str, index) {
			switch (index) {
			case 0:
				result.seconds = str;
				break;
			case 1:
				result.minutes = str;
				break;
			case 2:
				result.hours = str;
				break;
			case 3:
				result.dayOfMonth = str;
				break;
			case 4:
				result.month = str;
				break;
			case 5:
				result.dayOfWeek = str;
				break;
			}
		});

		return result;
	},

	checkCronExpression : function() {
		var self = this;
		var itemIds = [ 'txtSeconds', 'txtMinutes', 'txtHours', 'txtDayOfMonth', 'txtMonth', 'txtDayOfWeek' ];
		var bCheck = true;

		Ext.Array.each(itemIds, function(itemId, index) {
			var field = self.sub(itemId);
			var strValue = field.getValue();
			var numValue = Number(strValue);

			if (Ext.isEmpty(strValue)) {
				Ext.Msg.alert('Error', T('Message.108'), function() {
					field.focus();
				});
				bCheck = false;
				return false;
			}

			// 두자일경우 숫자타입인지 체크
			if (index <= 4) {
				if (strValue.length == 2 && isNaN(numValue)) {
					Ext.Msg.alert('Error', T('Message.110'), function() {
						field.focus();
					});
					bCheck = false;
					return false;
				}
			}

			// 값이 숫자 변환이 되면 범위체크
			if (Ext.typeOf(numValue) == 'number' && isNaN(numValue) == false) {
				var bSize = true;
				var msg = '';
				if (itemId == 'txtHours') {
					if (numValue < 0 || numValue > 23) {
						bSize = false;
						msg = T('Message.SizeCheck', {
							size1 : '0',
							size2 : '23'
						});
					}
				}
				if (itemId == 'txtSeconds' || itemId == 'txtMinutes') {
					if (numValue < 0 || numValue > 59) {
						bSize = false;
						msg = T('Message.SizeCheck', {
							size1 : '0',
							size2 : '59'
						});
					}
				} else if (itemId == 'txtDayOfMonth') {
					if (numValue < 1 || numValue > 31) {
						bSize = false;
						msg = T('Message.SizeCheck', {
							size1 : '1',
							size2 : '31'
						});
					}
				} else if (itemId == 'txtMonth') {
					if (numValue < 1 || numValue > 12) {
						bSize = false;
						msg = T('Message.SizeCheck', {
							size1 : '1',
							size2 : '12'
						});
					}
				} else if (itemId == 'txtDayOfWeek') {
					if (numValue < 1 || numValue > 7) {
						bSize = false;
						msg = T('Message.SizeCheck', {
							size1 : '1',
							size2 : '7'
						});
					}
				}

				if (bSize == false) {
					Ext.Msg.alert('Error', msg, function() {
						field.focus();
					});
					bCheck = false;
					return false;
				}
			}
		});

		return bCheck;
	},

	clearData : function(target, except) {
		SF.cf.clearFormFields(target, except, true);

		// this.sub('dteStartTime').setValue(new Date());
		// this.sub('dteEndTime').setValue(new Date());
	},

	checkCondition : function(step, form, addParams) {
		if (step == 'btnCreate' || step == 'btnUpdate') {
			var formValues = form.getFieldValues();
			if (formValues.type == 'cron') {
				return this.checkCronExpression();
			}
		} else if (step == 'btnPlay') {
			var txtTriggerId = this.sub('txtTriggerId');
			if (Ext.isEmpty(txtTriggerId.getValue())) {
				Ext.Msg.alert('Error', T('Message.108'), function() {
					txtTriggerId.focus();
				});
				return false;
			}
		}
	},

	onBeforeCreate : function(form, addParams, url) {
		var formValues = form.getFieldValues();
		var typeValue = this.getTypeValue(formValues);
		Ext.apply(addParams, typeValue);
	},

	onBeforeUpdate : function(form, addParams, url) {
		var formValues = form.getFieldValues();
		var typeValue = this.getTypeValue(formValues);
		Ext.apply(addParams, typeValue);
	},

	onBeforeDelete : function(form, addParams, url) {
		return true;
	},

	onAfterCreate : function(form, action, success) {
		if (success) {
			var select = {
				column : 'name',
				value : form.getFieldValues().name
			};

			this.supplement.refreshGrid(true, select);
		}
	},

	onAfterUpdate : function(form, action, success) {
		if (success) {
			var select = {
				column : 'name',
				value : form.getFieldValues().name
			};

			this.supplement.refreshGrid(true, select);
		}
	},

	onAfterDelete : function(form, action, success) {
		if (success) {
			this.supplement.refreshGrid(true);
			// TriggerId의 dirty 변경되면 clearData 발생
			this.sub('txtTriggerId').setValue('');
		}
	},

	buildSupplement : function() {
		return {
			xtype : 'gridsup',
			grid : {
				searchField : 'name',
				columnLines : true,
				// autoRefresh : false,
				// autoFormLoad : false,
				store : Ext.create('BAS.store.basViewJobTriggerListOut.list'),
				columns : [ {
					//xtype : 'actioncolumn',
					width : 90,
					align : 'center',
					dataIndex : 'state',
					header : T('Caption.Other.Status'),
					renderer : function(value, metaData) {
						// var src = '';
						// if (value == 'PAUSED') {
						// src = 'image/statusOff.png';
						// }
						// else {
						// src = 'image/statusOn.png';
						// }
						// return Ext.DomHelper.markup({
						// tag : 'img',
						// src : src
						// });

						var cls = '';
						if (value == 'NONE' || value == 'PAUSED') {
							//회색
							cls = 'textColorGray';
						} else if (value == 'COMPLETE') {
							//연두
							cls = 'textColorGreen';
						} else if (value == 'ERROR') {
							//빨강
							cls = 'textColorRed';
						} else if (value == 'BLOCKED') {
							//노랑
							cls = 'textColorOrange';
						}
						metaData.tdCls = cls;
						
						return value;

					}
				}, {
					header : T('Caption.Other.Trigger Id'),
					width : 100,
					dataIndex : 'name'
				}, {
					header : T('Caption.Other.Job Name'),
					width : 100,
					dataIndex : 'jobName'
				}, {
					header : T('Caption.Other.Description'),
					width : 100,
					dataIndex : 'description'
				} ]
			}
		};
	},

	buildForm : function() {
		var jobNameStore = Ext.create('BAS.store.basViewJobDetailListOut.list');
		jobNameStore.load({
			params : {
				procstep : '1'
			}
		});

		return {
			xtype : 'container',
			layout : 'anchor',
			items : [ {
				xtype : 'textfield',
				anchor : '50%',
				name : 'name',
				itemId : 'txtTriggerId',
				enableKeyEvents : true,
				allowBlank : false,
				fieldLabel : T('Caption.Other.Trigger Id'),
				labelStyle : 'font-weight:bold'
			}, {
				xtype : 'textfield',
				name : 'description',
				anchor : '100%',
				fieldLabel : T('Caption.Other.Description')
			}, {
				xtype : 'separator'
			}, {
				xtype : 'displayfield',
				submitValue : false,
				name : 'state',
				fieldLabel : T('Caption.Other.Status'),
				cls : 'marginB3',
				renderer : function(value, me) {
					me.removeCls('textColorGray');
					me.removeCls('textColorOrange');
					me.removeCls('textColorGreen');
					
					var cls = '';
					if (value == 'NONE' || value == 'PAUSED') {
						//회색
						cls = 'textColorGray';
					} else if (value == 'COMPLETE') {
						//연두
						cls = 'textColorGreen';
					} else if (value == 'ERROR') {
						//빨강
						cls = 'textColorRed';
					} else if (value == 'BLOCKED') {
						//노랑
						cls = 'textColorOrange';
					}
					
					me.addCls(cls);
					return value;
				}
			}, {
				xtype : 'combobox',
				name : 'jobName',
				anchor : '50%',
				allowBlank : false,
				fieldLabel : T('Caption.Other.Job Name'),
				labelStyle : 'font-weight:bold',
				store : jobNameStore,
				queryMode : 'local',
				displayField : 'name',
				valueField : 'name',
				editable : false
			}, {
				xtype : 'datetimex',
				itemId : 'dteStartTime',
				anchor : '50%',
				name : 'startTime',
				fieldLabel : T('Caption.Other.Start Time'),
				// defaultValue : new Date(),
				timeFormat : 'H:i:s'
			}, {
				xtype : 'datetimex',
				itemId : 'dteEndTime',
				anchor : '50%',
				name : 'endTime',
				fieldLabel : T('Caption.Other.End Time'),
				// defaultValue : new Date(),
				timeFormat : 'H:i:s'
			}, {
				xtype : 'radiogroup',
				anchor : '50%',
				itemId : 'rdoType',
				fieldLabel : T('Caption.Other.Type'),
				labelStyle : 'font-weight:bold',
				items : [ {
					boxLabel : T('Caption.Other.Simple'),
					name : 'type',
					inputValue : 'simple',
					checked : true
				}, {
					boxLabel : T('Caption.Other.Cron'),
					name : 'type',
					inputValue : 'cron'
				} ]
			}, {
				xtype : 'container',
				layout : 'card',
				itemId : 'ctnCard',
				items : [ {
					xtype : 'container',
					layout : 'anchor',
					itemId : 'ctnSimple',
					items : [ {
						xtype : 'numberfield',
						name : 'repeatCount',
						anchor : '50%',
						value : 0,
						minValue : -1,
						submitValue : false,
						fieldLabel : T('Caption.Other.Repeat Count')
					}, {
						xtype : 'container',
						layout : 'hbox',
						items : [ {
							xtype : 'numberfield',
							name : 'repeatInterval',
							value : 1,
							minValue : 1,
							submitValue : false,
							fieldLabel : T('Caption.Other.Repeat Interval'),
							flex : 1
						}, {
							xtype : 'label',
							cls : 'marginL5 marginT5',
							text : T('Caption.Other.Seconds'),
							flex : 1
						} ]
					} ]
				}, {
					xtype : 'container',
					layout : 'anchor',
					itemId : 'ctnCron',
					items : [ {
						xtype : 'combobox',
						itemId : 'cmbExpression',
						submitValue : false,
						anchor : '50%',
						fieldLabel : T('Caption.Other.Cron Expression'),
						store : Ext.create('Ext.data.Store', {
							fields : [ 'abbr', 'name' ],
							data : [ {
								"abbr" : "D",
								"name" : "Fire at 10:15am every day"
							}, {
								"abbr" : "M",
								"name" : "Fire at 10:15am on the 15th day of every month"
							} ]
						}),
						displayField : 'name',
						valueField : 'abbr',
						editable : false
					}, {
						xtype : 'container',
						layout : 'hbox',
						items : [ {
							// Seconds(0-59 , - * /)
							xtype : 'textfield',
							itemId : 'txtSeconds',
							anchor : '50%',
							margin : '0 15 0 0',
							name : 'seconds',
							regex : /^[0-9-\*\/]+$/,
							submitValue : false,
							fieldLabel : T('Caption.Other.Seconds'),
							flex : 1
						}, {
							xtype : 'label',
							margin : '0 -17 0 0',
							cls : 'textColorBlue',
							text : '0-59 , - * /',
							flex : 1
						} ]

					}, {
						xtype : 'container',
						layout : 'hbox',
						items : [ {
							// Minutes(0-59 , - * /)
							xtype : 'textfield',
							itemId : 'txtMinutes',
							anchor : '50%',
							margin : '0 15 0 0',
							name : 'minutes',
							regex : /^[0-9-\*\/]+$/,
							submitValue : false,
							fieldLabel : T('Caption.Other.Minutes'),
							flex : 1
						}, {
							xtype : 'label',
							margin : '0 -17 0 0',
							cls : 'textColorBlue',
							text : '0-59 , - * /',
							flex : 1
						} ]

					}, {
						xtype : 'container',
						layout : 'hbox',
						items : [ {
							// Hours(0-23 , - * /)
							xtype : 'textfield',
							itemId : 'txtHours',
							anchor : '50%',
							margin : '0 15 0 0',
							name : 'hours',
							regex : /^[0-9-\*\/]+$/,
							submitValue : false,
							fieldLabel : T('Caption.Other.Hours'),
							flex : 1
						}, {
							xtype : 'label',
							margin : '0 -17 0 0',
							cls : 'textColorBlue',
							text : '0-23 , - * /',
							flex : 1
						} ]

					}, {
						xtype : 'container',
						layout : 'hbox',
						items : [ {
							// Day of month(1-31 , - * / L W ?)
							xtype : 'textfield',
							itemId : 'txtDayOfMonth',
							anchor : '50%',
							margin : '0 15 0 0',
							name : 'dayOfMonth',
							regex : /^[0-9-\*\/LW\?]+$/,
							submitValue : false,
							fieldLabel : T('Caption.Other.Day of month'),
							flex : 1
						}, {
							xtype : 'label',
							margin : '0 -17 0 0',
							cls : 'textColorBlue',
							text : '1-31 , - * ? / L W',
							flex : 1
						} ]

					}, {
						xtype : 'container',
						layout : 'hbox',
						items : [ {
							// Month(1-12 or JAN-DEC , - * /)
							xtype : 'textfield',
							itemId : 'txtMonth',
							anchor : '50%',
							margin : '0 15 0 0',
							name : 'month',
							regex : /^[0-9-\*\/]+$/,
							submitValue : false,
							fieldLabel : T('Caption.Other.Month'),
							flex : 1
						}, {
							xtype : 'label',
							margin : '0 -17 0 0',
							cls : 'textColorBlue',
							text : '1-12 , - * /',
							flex : 1
						} ]

					}, {
						xtype : 'container',
						layout : 'hbox',
						items : [ {
							// Day of week(1-7 or SUN-SAT , - * ? / L #)
							xtype : 'textfield',
							itemId : 'txtDayOfWeek',
							anchor : '50%',
							margin : '0 15 0 0',
							name : 'dayOfWeek',
							regex : /^[0-9-\*\/L#\?]+$/,
							submitValue : false,
							fieldLabel : T('Caption.Other.Day of week'),
							flex : 1
						}, {
							xtype : 'label',
							margin : '0 -17 0 0',
							cls : 'textColorBlue',
							text : '1-7 , - * ? / L #',
							flex : 1
						} ]
					}
					// Year은 제외함.(차후 추가 될수도 있으므로 주석처리)
					// , {
					// xtype : 'container',
					// layout : 'hbox',
					// items : [ {
					// // Year(empty, 1970-2099 , - * /)
					// xtype : 'textfield',
					// itemId : 'txtYear',
					// name : 'year',
					// submitValue : false,
					// fieldLabel : T('Caption.Other.Year')
					// }, {
					// xtype : 'label',
					// cls : 'marginL10 marginT3 textColorBlue',
					// text : 'empty, 1970-2099 , - * /'
					// } ]

					// }
					]
				} ]
			} ]
		};
	},

	zstart : function() {
		return {
			xtype : 'button',
			itemId : 'btnStart',
			text : T('Caption.Button.Start')
		};
	},

	zstop : function() {
		return {
			xtype : 'button',
			itemId : 'btnStop',
			text : T('Caption.Button.Stop')
		};
	}

});