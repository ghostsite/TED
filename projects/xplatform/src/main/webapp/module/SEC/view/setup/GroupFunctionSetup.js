//TODO 라인은 시퀀스가 변경되지 않는다 수정필요
Ext.define('SEC.view.setup.GroupFunctionSetup', {
	extend : 'MES.view.form.BaseFormTabs',

	title : T('Caption.Other.Assign Function to Security Group'),

	buttonsOpt : [ {
		itemId : 'btnUpdate',
		url : 'service/SecUpdateGrpfuncList.json',
		confirm : {
			fields : {
				field1 : 'secGrpId'
			}
		}
	} ],

	payload : {
		submit : true
	},

	initComponent : function() {

		this.callParent();

		var self = this;

		var baseTabs = this.getTabPanel();
		baseTabs.add(this.buildAttachFunction());
		baseTabs.add(this.buildControls());
		// baseTabs.add(this.buildTabPages());
		// baseTabs.add(this.buildOptions());
		// baseTabs.add(this.buildFields());
		baseTabs.setActiveTab(0);

		baseTabs.on('tabchange', function(tabpanel, newCard) {
			if (newCard.itemId == 'ctnAttachFunc') {
				self.viewFunctionList();
			} else if (newCard.itemId == 'ctnControls') {
				self.viewGrpFunctionList();
			}
		});

		// Supplement로 옮기면서 추가한 부분
		this.on('afterrender', function() {
			var supplement = self.getSupplement();

			var programId = SF.login.programId;
			supplement.sub('cdvPgmId').setValue(programId);

			supplement.sub('cdvSecGrp').on('select', function(me) {
				if (baseTabs.getActiveTab().itemId == 'ctnAttachFunc') {
					self.viewFunctionTree();
				} else if (baseTabs.getActiveTab().itemId == 'ctnControls') {
					self.viewGrpFunctionList();
				}
				var secGrp = supplement.sub('cdvSecGrp').getValue();
				self.sub('txtSecGrp').setValue(secGrp);
			});

			supplement.sub('cdvPgmId').on('change', function(me, newValue, oldValue, eOpts) {
				if (baseTabs.getActiveTab().itemId == 'ctnAttachFunc') {
					self.viewFunctionTree();
				} else if (baseTabs.getActiveTab().itemId == 'ctnControls') {
					self.viewGrpFunctionList();
				}
				var pgmId = supplement.sub('cdvPgmId').getValue();
				self.sub('txtPgmId').setValue(pgmId);
			});
			var pgmId = supplement.sub('cdvPgmId').getValue();
			self.sub('txtPgmId').setValue(pgmId);
		});

		this.sub('ctnAttachFunc').on('afterRender', function() {
			self.viewFunctionList();
		});

		this.sub('cdvFGroup').on('select', function(me) {
			self.viewFunctionList();
		});

		this.getFuncTree().store.on('load', function(store, nodes, records, success) {
			if (!success)
				return;

			// rowCls 모두제거
			var rows = self.getFucnGrid().store.data.items;
			Ext.Array.each(rows, function(row) {
				self.getFucnGrid().getView().removeRowCls(row, 'textColorBlue');
			});

			// tree store 화면에 맞게 편집
			var separatorNodes = [];
			nodes.cascadeBy(function(node) {
				// record text 변경
				var text = node.get('funcName') + " : " +T('Caption.Menu.'+node.get('funcDesc'));
				//TODO : funcDesc 국제화적용 예정 2013.02.01 KKH

				if (!node.isRoot() && node.get('text') != 'Attach New Menu...') {
					node.set('text', text);
				}

				// Attach New Menu... Node 추가
				if (node.isLeaf() == false) {
					node.appendChild({
						text : 'Attach New Menu...',
						leaf : true
					});
				}

				// separator Node 찾아서 저장
				var separator = node.get('separator') || '';
				if (separator == 'Y') {
					separatorNodes.push(node);
				}

				// tree에 있는 메뉴는 그리드에 ROW 색상변환
				var rows = self.searchFuncGrid(node.get('funcName'));
				Ext.Array.each(rows, function(row) {
					self.getFucnGrid().getView().addRowCls(row, 'textColorBlue');
				});
			});

			// separator Node 추가
			Ext.Array.each(separatorNodes, function(node) {
				var parentNode = node.parentNode;
				parentNode.insertChild(node.data.index, {
					text : '--------------------',
					leaf : true
				});
				parentNode.updateInfo();
			});

			// dirty flag 변경
			nodes.cascadeBy(function(node) {
				node.commit();
			});

			self.getFuncTree().expandAll();
		});

		this.sub('pnlTplFuncList').on('afterrender', function() {
			this.sub('btnApply').on('click', function() {
				if (self.getSelectedFuncNodes().selected.length > 0) {
					var node = self.getSelectedFuncNodes().lastSelected;
					var shortCut1 = self.sub('chkCtrl').getSubmitValue();
					shortCut1 += self.sub('chkAlt').getSubmitValue();
					shortCut1 += self.sub('chkShift').getSubmitValue();
					var shortCut2 = self.sub('cbShortCutDisp').getValue();
					var addToolbar = self.sub('chkAddToolBar').getSubmitValue();

					if (node.get('funcTypeFlag') != 'F') {
						// funcTypeFlag가 F가 아니면 shortCut와 addToolbar 불가능
						return;
					}

					if (shortCut2 == ' ' || shortCut2 == '') {
						// shortCut2가 없고 shortCut1이 ---면 shortCut 지움
						if (shortCut1 == '---') {
							node.data.shortCut = '---';
							node.raw.shortCut = '---';
						} else {
							// shortCut2가 없고 Shortcut가 --- 아니면 오류
							Ext.Msg.alert('Error', T('Message.ValidInput', {
								field1 : T('Caption.Other.Shortcut2')
							}));
							return;
						}
					} else {
						// shortCut2가 있으면 shortCut1 + shortCut2
						if (shortCut2.length == 1) {
							if (shortCut1 == '---') {
								// shortCut2가 0-9A-Z인데 ShortCut1이 --- 이면 오류
								Ext.Msg.alert('Error', T('Message.ValidFormat', {
									field1 : T('Caption.Other.Shortcut2')
								}));
								return;
							}
						}
						shortCut1 += shortCut2;
						node.data.shortCut = shortCut1;
						node.raw.shortCut = shortCut1;
					}

					node.data.addToolBar = addToolbar;
					node.raw.addToolBar = addToolbar;
					node.dirty = true;
					node.updateInfo();
				}
			});

			self.sub('btnCollapse').on('click', function() {
				var tpl = self.getFuncTree();
				// tree 전체 접기
				tpl.collapseAll();
				// tree root node 펼치기
				tpl.getRootNode().expand();
			});

			self.sub('btnExpand').on('click', function() {
				// tree 전체 펼치기
				self.getFuncTree().expandAll();
			});
		});

		this.getFuncTree().on('select', function(rowModel, selectedNode, eOpts) {
			var shortCut = selectedNode.get('shortCut') || '';
			var addToolBar = selectedNode.get('addToolBar') || '';
			var chkAddToolBar = self.sub('chkAddToolBar');
			var chkCtrl = self.sub('chkCtrl');
			var chkAlt = self.sub('chkAlt');
			var chkShift = self.sub('chkShift');
			var cbShortCutDisp = self.sub('cbShortCutDisp');

			if (shortCut) {
				chkCtrl.setValue(shortCut.substr(0, 1));
				chkAlt.setValue(shortCut.substr(1, 1));
				chkShift.setValue(shortCut.substr(2, 1));
				cbShortCutDisp.setValue(shortCut.substr(3));
			} else {
				chkCtrl.setValue('-');
				chkAlt.setValue('-');
				chkShift.setValue('-');
				cbShortCutDisp.setValue('');
			}

			if (addToolBar == 'Y') {
				chkAddToolBar.setValue(addToolBar);
			} else {
				chkAddToolBar.setValue('N');
			}
		});

		// 선택된 노드에 자식 노드로 추가
		this.sub('btnAddChild').on('click', function() {
			if (self.getSelectedFuncNodes().selected.length > 0 && self.getSelectedFuncRows().selected.length > 0) {
				var node = self.getSelectedFuncNodes().lastSelected;
				var rows = self.getSelectedFuncRows().selected.items;

				if (node.get('text') != 'Attach New Menu...' && node.get('text') != '--------------------') {
					Ext.Array.each(rows, function(row) {
						var nodes = self.searchFuncTree(row.get('funcName'));
						if (nodes.length == 0) {
							// node option 설정
							//TODO 국제화적용예정
							row.set('text', row.get('funcName') + " : " + T('Catpion.Menu.'+row.get('funcDesc')));
							//TODO 국제화적용예정
							row.set('leaf', true);
							row.set('checked', null);

							// 노드 설정변경
							if (node.isLeaf) {
								node.set('leaf', false);
								node.set('expanded', true);
								node.updateInfo();
							}

							// 자식노드 추가
							var newNode = node.appendChild(row.data);
							newNode.raw = row.raw;
							self.getFucnGrid().getView().addRowCls(row, 'textColorBlue');
						}
					});
				}

				var attachNode = node.findChild('text', 'Attach New Menu...');
				if (attachNode) {
					attachNode.remove();
				}
				node.appendChild({
					text : 'Attach New Menu...',
					leaf : true
				});
			}
		});

		// Separator 노드추가
		this.sub('btnSeparator').on('click', function() {
			if (self.getSelectedFuncNodes().selected.length == 1) {
				var node = self.getSelectedFuncNodes().lastSelected;
				var parentNode = node.parentNode;
				var index = node.get('index');
				//&& node.get('text') != 'Attach New Menu...'
				if (index > 0) {
					parentNode.insertChild(index, {
						text : '--------------------',
						leaf : true
					});
					node.data.separator = 'Y';
					node.raw.separator = 'Y';
					parentNode.updateInfo();
				}
			}
		});

		// 선택된 노드에 부모 노드에 추가
		this.sub('btnAdd').on('click', function() {
			if (self.getSelectedFuncNodes().selected.length > 0 && self.getSelectedFuncRows().selected.length > 0) {
				var node = self.getSelectedFuncNodes().lastSelected;
				var rows = self.getSelectedFuncRows().selected.items;
				Ext.Array.each(rows, function(row) {
					if (!node.isRoot()) {
						var nodes = self.searchFuncTree(row.get('funcName'));
						if (nodes.length == 0) {
							var parentNode = node.parentNode;
							// node option 설정
							//TODO 국제화적용예정
							row.set('text', row.get('funcName') + " : " + T('Caption.Menu.'+row.get('funcDesc')));
							//TODO 국제화적용예정
							row.set('leaf', true);
							row.set('checked', null);

							// node 추가
							var newNode = parentNode.insertChild(node.get('index'), row.data);
							newNode.raw = row.raw;

							parentNode.updateInfo();

							self.getFucnGrid().getView().addRowCls(row, 'textColorBlue');
						}
					}
				});
			}
		});

		// 노드 삭제
		this.sub('btnDel').on('click', function() {
			if (self.getSelectedFuncNodes().selected.length > 0) {
				var nodes = self.getSelectedFuncNodes().selected.items;
				Ext.Array.each(nodes, function(node) {
					if (!node.isRoot() && node.get('text') != 'Attach New Menu...') {
						if (node.data.text == '--------------------') {
							var parentNode = node.parentNode;
							var nextNode = parentNode.getChildAt(node.data.index + 1);
							if (nextNode.get('text') != 'Attach New Menu...') {
								delete nextNode.data.separator;
								delete nextNode.raw.separator;
							}
						}
						// 노드삭제
						node.remove();

						// 삭제노드 그리드 색상변환
						node.cascadeBy(function(cnode) {
							var rows = self.searchFuncGrid(cnode.get('funcName'));
							Ext.Array.each(rows, function(row) {
								self.getFucnGrid().getView().removeRowCls(row, 'textColorBlue');
							});
						});
					}
				});
			}
		});

		// 노드 순서 올리기 (같은레벨)
		this.sub('btnUp').on('click', function() {
			if (self.getSelectedFuncNodes().selected.length > 0) {
				var selectNodes = Ext.clone(self.getSelectedFuncNodes().selected.items);

				// index로 오름차순 정렬
				Ext.Array.sort(selectNodes, function(x, y) {
					if (x.data.index > y.data.index) {
						return 1;
					} else if (x.data.index < y.data.index) {
						return -1;
					} else {
						return 0;
					}
				});

				var bUp = true;
				Ext.Array.each(selectNodes, function(node) {
					if (node.data.index <= 0 || node.get('text') == 'Attach New Menu...') {
						bUp = false;
						return false;
					}
				});

				if (bUp) {
					Ext.Array.each(selectNodes, function(node) {
						var currentNode = Ext.clone(node);
						var parentNode = node.parentNode;
						var prevNode = parentNode.getChildAt(currentNode.data.index - 1);
						var nextNode = parentNode.getChildAt(currentNode.data.index + 1);
						var prevIndex = prevNode.data.index;

						// 노드삭제
						node.remove();
						
						if(currentNode.get('text') == '--------------------'){
							//separator 시퀀스 변경시 추가작업
							nextNode.data.separator = '';
							nextNode.raw.separator = '';
							
							prevNode.data.separator = 'Y';
							prevNode.raw.separator = 'Y';
						}

						// 선택된 노드 index 올려서 추가
						parentNode.insertChild(prevIndex, currentNode);
						currentNode.dirty = true;
						parentNode.updateInfo();
					});
				}
			}
		});

		// 노드 순서 내리기 (같은레벨)
		this.sub('btnDown').on('click', function() {
			if (self.getSelectedFuncNodes().selected.length > 0) {
				var selectNodes = Ext.clone(self.getSelectedFuncNodes().selected.items);

				// index로 내림차순 정렬
				Ext.Array.sort(selectNodes, function(x, y) {
					if (x.data.index > y.data.index) {
						return -1;
					} else if (x.data.index < y.data.index) {
						return 1;
					} else {
						return 0;
					}
				});

				var bDown = true;
				Ext.Array.each(selectNodes, function(node) {
					// Attach New Menu... 노드 때문에 -2하여 비교한다.
					if (node.isRoot() || node.data.index == node.parentNode.childNodes.length - 2 || node.get('text') == 'Attach New Menu...') {
						bDown = false;
						return false;
					}
				});

				if (bDown) {
					Ext.Array.each(selectNodes, function(node) {
						var currentNode = Ext.clone(node);
						var parentNode = node.parentNode;
						var nextNode = parentNode.getChildAt(currentNode.data.index + 1);
						var twoNextNode = parentNode.getChildAt(currentNode.data.index + 2);
						var nextIndex = nextNode.data.index;

						// 선택노드 삭제
						node.remove();
						
						if(currentNode.get('text') == '--------------------'){
							//separator 시퀀스 변경시 추가작업
							nextNode.data.separator = '';
							nextNode.raw.separator = '';
							
							twoNextNode.data.separator = 'Y';
							twoNextNode.raw.separator = 'Y';
						}

						// 선택된 노드 index 내려서 추가
						parentNode.insertChild(nextIndex, currentNode);
						currentNode.dirty = true;
						parentNode.updateInfo();
					});
				}
			}
		});
	},

	viewFunctionTree : function() {
		var self = this.getSupplement();
		var funcListStore = this.getFuncTree().store;

		funcListStore.proxy.extraParams = {
			procstep : '1',
			programId : self.sub('cdvPgmId').getValue(0),
			secGrpId : self.sub('cdvSecGrp').getValue(0)
		};

		// tree 초기화(load 방식이라 초기화 주석)
		funcListStore.setRootNode({
			text : SmartFactory.login.factory,
			expanded : true
		});

		// funcListStore.load({
		// params : {
		// procstep : '1',
		// programId : self.sub('cdvPgmId').getValue(0),
		// secGrpId : self.sub('cdvSecGrp').getValue(0)
		// }
		// });
	},

	viewFunctionList : function() {
		var self = this;
		var funcListStore = this.sub('grdFuncList').store;

		funcListStore.load({
			params : {
				procstep : '1',
				funcGroup : self.sub('cdvFGroup').getValue(0)
			},
			callback : function(records, operation, success) {
				if (success) {
					Ext.Array.each(records, function(record, index, countriesItSelf) {
						var nodes = self.searchFuncTree(record.get('funcName'));
						if (nodes.length > 0) {
							self.getFucnGrid().getView().addRowCls(record, 'textColorBlue');
						}
					});
				}
			}
		});
	},

	viewGrpFunctionList : function() {
		var self = this;
		var grpFuncListStore = this.sub('grdControls').store;

		grpFuncListStore.load({
			params : {
				procstep : '1',
				programId : self.getSupplement().sub('cdvPgmId').getValue(0),
				secGrpId : self.getSupplement().sub('cdvSecGrp').getValue(0)
			},
			callback : function(records, operation, success) {
				if (success) {
					Ext.Array.each(records, function(record) {
						record.commit();
					});
				}
			}
		});
	},

	onBeforeUpdate : function(form, addParams, url) {
		var baseTabs = this.getTabPanel();
		if (baseTabs.getActiveTab().itemId == 'ctnAttachFunc') {
			var rootNode = this.getFuncTree().getRootNode();
			var data = [];

			rootNode.cascadeBy(function(node) {
				var parentNode = node.parentNode;
				var raw = Ext.clone(node.raw);

				if (!node.isRoot() && node.get('funcName')) {
					if (parentNode.isRoot()) {
						raw.dispLevel = node.data.index;
					} else {
						// level 부분수정(index로 하는데 0~9 9넘어가면 특수문자 넘어가면 ABC
						var parentNode = node;
						var arrLevel = [];
						// index을 이용하여 displevel을 생성한다.
						while (!parentNode.isRoot()) {
							var index = 48 + parentNode.get('index');
							arrLevel.push(String.fromCharCode(index));
							parentNode = parentNode.parentNode;
						}

						arrLevel.reverse();
						raw.dispLevel = arrLevel.join('.');
					}

					delete raw.leaf;
					delete raw.text;
					delete raw.funcDesc;
					delete raw.funcTypeFlag;
					delete raw.funcGroup;
					delete raw.assemblyFile;
					delete raw.assemblyName;
					delete raw.iconIndex;
					delete raw.iconUri;
					data.push(raw);
				}
			});

			addParams['procstep'] = 'I';
			addParams['opt'] = 'A';
			addParams['grpFuncList'] = data;

			return true;
		} else if (baseTabs.getActiveTab().itemId == 'ctnControls') {
			var data = [];
			var updateRecords = this.sub('grdControls').store.getUpdatedRecords();
			Ext.Array.each(updateRecords, function(record, index, countriesItSelf) {
				data.push({
					funcName : record.get('funcName'),
					ctlEnFlag1 : record.get('ctlEnFlag1'),
					ctlEnFlag2 : record.get('ctlEnFlag2'),
					ctlEnFlag3 : record.get('ctlEnFlag3'),
					ctlEnFlag4 : record.get('ctlEnFlag4'),
					ctlEnFlag5 : record.get('ctlEnFlag5'),
					ctlEnFlag6 : record.get('ctlEnFlag6'),
					ctlEnFlag7 : record.get('ctlEnFlag7'),
					ctlEnFlag8 : record.get('ctlEnFlag8'),
					ctlEnFlag9 : record.get('ctlEnFlag9'),
					ctlEnFlag10 : record.get('ctlEnFlag10')
				});
			});

			addParams['opt'] = 'C';
			addParams['grpFuncList'] = data;
			return true;
		} else {
			return false;
		}
	},

	onAfterUpdate : function(form, action, success) {
		if (success) {
			var baseTabs = this.getTabPanel();
			if (baseTabs.getActiveTab().itemId == 'ctnControls') {
				this.viewGrpFunctionList();
			}
		}
	},

	checkCondition : function(step, form, addParams) {
		if (addParams) {
			if (addParams.procstep == SF_STEP_UPDATE) {
				var baseTabs = this.getTabPanel();
				// 변경한 노드가 없으면 업데이트 하지않음
				if (baseTabs.getActiveTab().itemId == 'ctnAttachFunc') {
					var store = this.getFuncTree().store;
					if (store.getNewRecords().length == 0 && store.getRemovedRecords().length == 0 && store.getUpdatedRecords().length == 0) {
						Ext.Msg.alert('Error', T('Message.NotChanged', {
							field1 : T('Caption.Other.Attach Function')
						}));
						return false;
					}
				} else if (baseTabs.getActiveTab().itemId == 'ctnControls') {
					var updateRecords = this.sub('grdControls').store.getUpdatedRecords();
					if (updateRecords.length == 0) {
						Ext.Msg.alert('Error', T('Message.NotChanged', {
							field1 : T('Caption.Other.Controls')
						}));
						return false;
					}
				} else {
					return false;
				}
			}
		}
		return true;
	},

	getSelectedFuncNodes : function() {
		return this.getFuncTree().getSelectionModel();
	},

	getSelectedFuncRows : function() {
		return this.getFucnGrid().getSelectionModel();
	},

	getFuncTree : function() {
		return this.sub('tplFuncList');
	},

	getFucnGrid : function() {
		return this.sub('grdFuncList');
	},

	searchFuncTree : function(funcName) {
		var nodes = [];
		if(this.getFuncTree().getRootNode()){
			this.getFuncTree().getRootNode().cascadeBy(function(node) {
				if (node.get('funcName') == funcName) {
					nodes.push(node);
				}
			});
		}
		return nodes;
	},

	searchFuncGrid : function(funcName) {
		var rows = [];

		Ext.Array.each(this.getFucnGrid().store.data.items, function(record, index, countriesItSelf) {
			if (record.get('funcName') == funcName) {
				rows.push(record);
			}
		});

		return rows;
	},

	buildSupplement : function() {
		return {
			xtype : 'formsup',

			fields : [ {
				xtype : 'codeview',
				codeviewName : 'TbSecGroup',
				itemId : 'cdvSecGrp',
				name : 'secGrpId',
				labelAlign : 'top',
				allowBlank : false,
				fieldLabel : T('Caption.Other.Security Group'),
				labelStyle : 'font-weight:bold'
			}, {
				xtype : 'codeview',
				codeviewName : 'ProgramList',
				allowBlank : false,
				labelAlign : 'top',
				itemId : 'cdvPgmId',
				name : 'programId',
				fieldLabel : T('Caption.Other.Program ID'),
				labelSeparator : '',
				labelStyle : 'font-weight:bold'
			} ]
		};
	},

	// Supplement로 자리옮김
	buildTopPart : function() {
		return [ {
			xtype : 'textfield',
			itemId : 'txtSecGrp',
			name : 'secGrpId',
			fieldLabel : T('Caption.Other.Security Group'),
			readOnly : true
		}, {
			xtype : 'textfield',
			itemId : 'txtPgmId',
			name : 'programId',
			fieldLabel : T('Caption.Other.Program ID'),
			readOnly : true
		} ];
	},

	buildAttachFunction : function() {
		return {
			xtype : 'container',
			itemId : 'ctnAttachFunc',
			cls : 'paddingAll7',
			title : T('Caption.Other.Attach Function'),
			layout : {
				type : 'hbox',
				align : 'stretch'
			},
			items : [ {
				xtype : 'container',
				layout : {
					type : 'vbox',
					align : 'stretch'
				},
				flex : 1,
				items : [ {
					xtype : 'container',
					layout : {
						type : 'hbox',
						align : 'stretch'
					},
					items : [ {
						xtype : 'checkbox',
						itemId : 'chkAddToolBar',
						boxLabel : T('Caption.Other.Add in the tool bar'),
						cls : 'marginR5',
						inputValue : 'Y',
						uncheckedValue : 'N',
						submitValue : false
					}, {
						xtype : 'checkbox',
						itemId : 'chkCtrl',
						boxLabel : 'CTRL',
						cls : 'marginR5',
						inputValue : 'C',
						uncheckedValue : '-',
						submitValue : false
					}, {
						xtype : 'checkbox',
						itemId : 'chkAlt',
						cls : 'marginR5',
						boxLabel : 'ALT',
						inputValue : 'A',
						uncheckedValue : '-',
						submitValue : false
					}, {
						xtype : 'checkbox',
						itemId : 'chkShift',
						cls : 'marginR5',
						boxLabel : 'Shift',
						inputValue : 'S',
						uncheckedValue : '-',
						submitValue : false
					}, {
						xtype : 'combo',
						mode : 'local',
						name : 'shortCutDisp',
						itemId : 'cbShortCutDisp',
						displayField : 'key',
						valueField : [ 'key' ],
						flex : 1,
						submitValue : false,
						editable : false,
						store : Ext.create('SEC.store.ShortcutStore')
					} ]
				}, {
					xtype : 'panel',
					itemId : 'pnlTplFuncList',
					layout : 'fit',
					flex : 1,
					cls : 'noPanelTitle',
					tools : [ {
						xtype : 'button',
						cls : 'marginR5',
						itemId : 'btnApply',
						width : 50,
						text : T('Caption.Button.Apply')
					}, {
						xtype : 'button',
						cls : 'marginR5',
						itemId : 'btnCollapse',
						iconCls : 'treeUnfold',
						width : 21
					}, {
						xtype : 'button',
						itemId : 'btnExpand',
						iconCls : 'treeFold',
						width : 21
					} ],
					items : [ {
						xtype : 'treepanel',
						itemId : 'tplFuncList',
						multiSelect : true,
						flex : 1,
						store : Ext.create('SEC.store.SecViewFuncTreeStore')
					} ]
				} ]
			}, {
				xtype : 'container',
				layout : {
					type : 'vbox',
					align : 'stretch'
				},
				width : 40,
				items : [ {
					xtype : 'container',
					flex : 1,
					layout : {
						type : 'vbox',
						pack : 'end',
						align : 'center'
					},
					items : [ {
						xtype : 'button',
						itemId : 'btnAddChild',
						width : 24,
						text : '<'
					}, {
						xtype : 'button',
						itemId : 'btnSeparator',
						cls : 'marginT5',
						width : 24,
						text : 'S'
					}, {
						xtype : 'button',
						itemId : 'btnAdd',
						cls : 'btnArrowLeft marginT5',
						width : 24,
						height : 18
					}, {
						xtype : 'button',
						itemId : 'btnDel',
						cls : 'btnArrowRight marginT5 marginB5',
						width : 24,
						height : 18
					} ]
				}, {
					xtype : 'container',
					flex : 1,
					layout : {
						type : 'vbox',
						pack : 'end',
						align : 'center'
					},
					items : [ {
						xtype : 'button',
						itemId : 'btnUp',
						cls : 'btnArrowUp marginB5',
						width : 24,
						height : 18
					}, {
						xtype : 'button',
						itemId : 'btnDown',
						cls : 'btnArrowDown marginB7',
						width : 24,
						height : 18
					} ]
				} ]
			}, {
				xtype : 'container',
				flex : 1,
				layout : {
					type : 'vbox',
					align : 'stretch'
				},
				items : [ {
					xtype : 'codeview',
					codeviewName : 'FunctionGroup',
					itemId : 'cdvFGroup',
					name : 'facType',
					fieldLabel : T('Caption.Other.Function Group'),
					labelSeparator : '',
					submitValue : false
				}, {
					xtype : 'grid',
					itemId : 'grdFuncList',
					flex : 1,
					cls : 'navyGrid',
					multiSelect : true,
					selModel : Ext.create('Ext.selection.RowModel', {
						mode : 'MULTI'
					}),
					store : Ext.create('WIP.store.SecViewFunctionListOut.list'),
					columns : [ {
						header : T('Caption.Other.Available Function'),
						dataIndex : 'funcName',
						flex : 1
					}, {
						header : T('Caption.Other.Description'),
						dataIndex : 'funcDesc',
						//TODO : 국제화 적용예정
						renderer : function(v){
							if(v)
								v = T('Caption.Menu.'+v);
							return v;
						},
						flex : 2
					} ],
					viewConfig : {
						getRowClass : function(record, rowIndex, rowParams, store) {

						}
					}
				} ]
			} ]
		};
	},

	buildControls : function() {
		var comboStore = Ext.create('Ext.data.Store', {
			fields : [ 'name', 'value' ],
			data : [ {
				"name" : '　',
				"value" : ' '
			}, {
				"name" : "YES",
				"value" : "Y"
			} ]
		});

		return {
			xtype : 'container',
			itemId : 'ctnControls',
			flex : 1,
			cls : 'paddingAll7',
			title : T('Caption.Other.Controls'),
			layout : {
				type : 'hbox',
				align : 'stretch'
			},
			items : [ {
				xtype : 'grid',
				itemId : 'grdControls',
				flex : 1,
				plugins : [ Ext.create('Ext.grid.plugin.CellEditing', {
					clicksToEdit : 1
				}) ],
				columnLines : true,
				cls : 'navyGrid',
				store : Ext.create('SEC.store.SecViewGrpfuncListOut.list'),
				columns : [ {
					dataIndex : 'funcName',
					width : 100,
					header : T('Caption.Other.Function'),
					renderer : function(value, metaData) {
						metaData.tdCls = 'cellGray';
						return value;
					}
				}, {
					dataIndex : 'funcDesc',
					width : 150,
					header : T('Caption.Other.Description'),
					renderer : function(value, metaData) {
						if(value)
							value = T('Caption.Menu.'+value);
						metaData.tdCls = 'cellGray';
						return value;
					}
				}, {
					dataIndex : 'ctlName1',
					width : 100,
					header : T('Caption.Other.Control Name 1'),
					renderer : function(value, metaData) {
						metaData.tdCls = 'cellGray';
						return value;
					}
				}, {
					dataIndex : 'ctlEnFlag1',
					width : 60,
					header : T('Caption.Other.Enable'),
					editor : {
						xtype : 'combo',
						mode : 'local',
						displayField : 'name',
						valueField : 'value',
						editable : false,
						store : comboStore
					}
				}, {
					dataIndex : 'ctlName2',
					width : 100,
					header : T('Caption.Other.Control Name 2'),
					renderer : function(value, metaData) {
						metaData.tdCls = 'cellGray';
						return value;
					}
				}, {
					dataIndex : 'ctlEnFlag2',
					width : 60,
					header : T('Caption.Other.Enable'),
					editor : {
						xtype : 'combo',
						mode : 'local',
						displayField : 'name',
						valueField : 'value',
						editable : false,
						store : comboStore
					}
				}, {
					dataIndex : 'ctlName3',
					width : 100,
					header : T('Caption.Other.Control Name 3'),
					renderer : function(value, metaData) {
						metaData.tdCls = 'cellGray';
						return value;
					}
				}, {
					dataIndex : 'ctlEnFlag3',
					width : 60,
					header : T('Caption.Other.Enable'),
					editor : {
						xtype : 'combo',
						mode : 'local',
						displayField : 'name',
						valueField : 'value',
						editable : false,
						store : comboStore
					}
				}, {
					dataIndex : 'ctlName4',
					width : 100,
					header : T('Caption.Other.Control Name 4'),
					renderer : function(value, metaData) {
						metaData.tdCls = 'cellGray';
						return value;
					}
				}, {
					dataIndex : 'ctlEnFlag4',
					width : 60,
					header : T('Caption.Other.Enable'),
					editor : {
						xtype : 'combo',
						mode : 'local',
						displayField : 'name',
						valueField : 'value',
						editable : false,
						store : comboStore
					}
				}, {
					dataIndex : 'ctlName5',
					width : 100,
					header : T('Caption.Other.Control Name 5'),
					renderer : function(value, metaData) {
						metaData.tdCls = 'cellGray';
						return value;
					}
				}, {
					dataIndex : 'ctlEnFlag5',
					width : 60,
					header : T('Caption.Other.Enable'),
					editor : {
						xtype : 'combo',
						mode : 'local',
						displayField : 'name',
						valueField : 'value',
						editable : false,
						store : comboStore
					}
				}, {
					dataIndex : 'ctlName6',
					width : 100,
					header : T('Caption.Other.Control Name 6'),
					renderer : function(value, metaData) {
						metaData.tdCls = 'cellGray';
						return value;
					}
				}, {
					dataIndex : 'ctlEnFlag6',
					width : 60,
					header : T('Caption.Other.Enable'),
					editor : {
						xtype : 'combo',
						mode : 'local',
						displayField : 'name',
						valueField : 'value',
						editable : false,
						store : comboStore
					}
				}, {
					dataIndex : 'ctlName7',
					width : 100,
					header : T('Caption.Other.Control Name 7'),
					renderer : function(value, metaData) {
						metaData.tdCls = 'cellGray';
						return value;
					}
				}, {
					dataIndex : 'ctlEnFlag7',
					width : 60,
					header : T('Caption.Other.Enable'),
					editor : {
						xtype : 'combo',
						mode : 'local',
						displayField : 'name',
						valueField : 'value',
						editable : false,
						store : comboStore
					}
				}, {
					dataIndex : 'ctlName8',
					width : 100,
					header : T('Caption.Other.Control Name 8'),
					renderer : function(value, metaData) {
						metaData.tdCls = 'cellGray';
						return value;
					}
				}, {
					dataIndex : 'ctlEnFlag8',
					width : 60,
					header : T('Caption.Other.Enable'),
					editor : {
						xtype : 'combo',
						mode : 'local',
						displayField : 'name',
						valueField : 'value',
						editable : false,
						store : comboStore
					}
				}, {
					dataIndex : 'ctlName9',
					width : 100,
					header : T('Caption.Other.Control Name 9'),
					renderer : function(value, metaData) {
						metaData.tdCls = 'cellGray';
						return value;
					}
				}, {
					dataIndex : 'ctlEnFlag9',
					width : 60,
					header : T('Caption.Other.Enable'),
					editor : {
						xtype : 'combo',
						mode : 'local',
						displayField : 'name',
						valueField : 'value',
						editable : false,
						store : comboStore
					}
				}, {
					dataIndex : 'ctlName10',
					width : 100,
					header : T('Caption.Other.Control Name 10'),
					renderer : function(value, metaData) {
						metaData.tdCls = 'cellGray';
						return value;
					}
				}, {
					dataIndex : 'ctlEnFlag10',
					width : 60,
					header : T('Caption.Other.Enable'),
					editor : {
						xtype : 'combo',
						mode : 'local',
						displayField : 'name',
						valueField : 'value',
						editable : false,
						store : comboStore
					}
				} ]
			} ]
		};

	},
	buildTabPages : function() {
		return {
			xtype : 'container',
			cls : 'paddingAll7',
			title : T('Caption.Other.Tab Pages')
		};

	},
	buildOptions : function() {
		return {
			xtype : 'container',
			cls : 'paddingAll7',
			title : T('Caption.Other.Options')
		};

	},
	buildFields : function() {
		return {
			xtype : 'container',
			cls : 'paddingAll7',
			title : T('Caption.Other.Fields')
		};

	}
});