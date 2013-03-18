Ext.define('SEC.view.setup.FlexibleHeaderSetup', {
	extend : 'MES.view.form.BaseForm',

	layout : {
		type : 'vbox',
		align : 'stretch'
	},

	title : T('Caption.Menu.Flexible Header Setup'),

	buttonsOpt : [ {
		itemId : 'btnUpdate',
		url : 'service/SecUpdateFlexibleHeader.json',
		params : {
			procstep : 'I'
		}
	} ],

	payload : {
		submit : true
	},
	
	buildSupplement : function() {
		return {
			xtype : 'formsup',
			defaults : {
				labelAlign : 'top'
			},
			fields : [ {
				xtype : 'codeview',
				itemId : 'cdvUserId',
				codeviewName : 'SERVICE',
				store : Ext.create('SEC.store.SecViewUserListOut.list'),
				fieldLabel : T('Caption.Other.User ID'),
				popupConfig : {
					columns : [ {
						dataIndex : 'userId',
						flex : 1
					}, {
						dataIndex : 'userDesc',
						flex : 2
					} ]
				},
				fields : [ {
					column : 'userId',
					name : 'userId'
				} ],
				params : {
					procstep : '1',
					userGroup : SmartFactory.login.group
				}
			}, {
				xtype : 'codeview',
				codeviewName : 'SERVICE',
				itemId : 'cdvModule',
				store : Ext.create('MES.store.SvmViewModuleListOut.moduleList'),
				fieldLabel : T('Caption.Other.Module Name'),
				popupConfig : {
					columns : [ {
						dataIndex : 'moduleName',
						flex : 1
					} ]
				},
				fields : [ {
					column : 'moduleName',
					submitValue : false
				} ],
				params : {
					procstep : '1'
				}
			}, {
				xtype : 'codeview',
				codeviewName : 'SERVICE',
				itemId : 'cdvService',
				store : Ext.create('MES.store.SvmViewServiceListOut.serviceList'),
				fieldLabel : T('Caption.Other.Service Name'),
				labelStyle : 'font-weight:bold',
				popupConfig : {
					columns : [ {
						dataIndex : 'serviceName',
						flex : 1
					} ]
				},
				fields : [ {
					column : 'serviceName',
					name : 'serviceName',
					allowBlank : false,
					//value : 'EDC_Change_Lot_Data',
					labelStyle : 'font-weight:bold'
				} ],
				paramsScope : this,
				params : function(me) {
					var supplement = me.getSupplement();
					var moduleName = supplement.sub('cdvModule').getValue(0);
					var params = {
						procstep : '1'
					};
					if (moduleName) {
						params['moduleName'] = moduleName;
					}

					return params;
				}
			}, {
				xtype : 'codeview',
				codeviewName : 'SERVICE',
				itemId : 'cdvDspId',
				store : Ext.create('MES.store.RtdViewDispatcherListOut.dspList'),
				fieldLabel : T('Caption.Other.Dispatcher ID'),
				popupConfig : {
					columns : [ {
						dataIndex : 'dspId',
						flex : 1
					}, {
						dataIndex : 'dspDesc',
						flex : 2
					} ]
				},
				fields : [ {
					column : 'dspId',
					name : 'dspId',
					disabled : true
				} ],
				params : {
					procstep : '1'
				}
			} ]
		};
	},

	initComponent : function() {

		this.callParent();

		var self = this;
		
		var tplServiceMember = this.sub('tplServiceMember').store.model.prototype.fields;
		var tplAttachHeader = this.sub('tplAttachHeader').store.model.prototype.fields;
		
		var headerList = Ext.create('MES.store.SecViewFlexibleHeaderListOut.headerList').model.prototype.fields;
		var serviceMemberList = Ext.create('MES.store.SvmViewServiceMemberListOut.serviceMemberList').model.prototype.fields;

		tplServiceMember.addAll(headerList.items);
		tplAttachHeader.addAll(serviceMemberList.items);
		
		this.on('afterrender', function() {
			var supplement = this.getSupplement();
			supplement.sub('cdvUserId').on('select', function(me) {
				self.viewFlexibleHeaderList();
			});
			
			supplement.sub('cdvModule').on('select', function(me) {
				supplement.sub('cdvService').setValue('');
				
				var tpl = self.sub('tplServiceMember');
				tpl.store.getRootNode().removeAll();
			});

			supplement.sub('cdvService').on('select', function(me) {
				self.viewServiceMemberList();
			});

			supplement.sub('cdvDspId').on('select', function(me) {
				self.viewFlexibleHeaderList();
			});
			
			supplement.on('supplementSelected', function(formValue) {
				self.viewServiceMemberList();
			});

		});

		this.sub('pnlAttachHeader').on('afterrender', function() {
			var tpl = self.sub('tplAttachHeader');

			self.sub('btnLeftCollapse').on('click', function() {
				// tree 전체 접기
				tpl.collapseAll();
			});

			self.sub('btnLeftExpand').on('click', function() {
				tpl.expandAll();
			});
		});

		this.sub('pnlServiceMember').on('afterrender', function() {
			var tpl = self.sub('tplServiceMember');

			self.sub('btnRightCollapse').on('click', function() {
				// tree 전체 접기
				tpl.collapseAll();
			});

			self.sub('btnRightExpand').on('click', function() {
				tpl.expandAll();
			});
		});

		this.sub('btnAdd').on(
				'click',
				function() {
					// tplAttachHeader add
					var selectionModel = self.sub('tplServiceMember').getSelectionModel();
					var tplAttachHeader = self.sub('tplAttachHeader');
					var rootNode = tplAttachHeader.store.getRootNode();

					if (selectionModel.selected.length > 0) {
						var selectNodes = Ext.clone(selectionModel.selected.items);
						for ( var key in selectNodes) {

							var node = Ext.clone(selectNodes[key]);
							var memberPath = node.get('memberPath');

							if (!memberPath) {
								continue;
							}

							if (memberPath == 'STATUSVALUE' || memberPath == 'MSG' || memberPath == 'MSGCODE' || memberPath == 'MSGCATE'
									|| memberPath == 'FIELDMSG' || memberPath == 'DBERRMSG' || memberPath == 'FIELDMSG') {
								continue;
							}

							if (node.parentNode.isRoot()) {
								// 중복노드 체크
								if (self.findNode(rootNode, memberPath).length > 0) {
									continue;
								}

								rootNode.insertChild(node.data.index, node.data);
							} else {
								// 부모노드 찾기
								var parentNodes = self.findNode(rootNode, node.parentNode.get('memberPath'));
								// 부모 노드가 있으면 추가함
								if (parentNodes.length == 1) {
									var parentNode = parentNodes[0];
									// 부모노드를 기준으로 중복체크
									if (self.findNode(parentNode, memberPath).length > 0) {
										continue;
									}
									parentNode.insertChild(node.data.index, node.data);
									parentNode.updateInfo();
								}
							}
						}
					}
				});

		this.sub('btnDel').on('click', function() {
			// tplAttachHeader del
			var selectionModel = self.sub('tplAttachHeader').getSelectionModel();

			if (selectionModel.selected.length > 0) {
				var selectNodes = selectionModel.selected.items;
				Ext.Array.each(selectNodes, function(node) {

					if (node.isRoot()) {
						return false;
					}

					// 노드삭제
					node.remove();
				});
			}
		});

		// 노드 순서 올리기 (같은레벨)
		this.sub('btnUp').on('click', function() {
			// tplAttachHeader up
			var selectionModel = self.sub('tplAttachHeader').getSelectionModel();

			if (selectionModel.selected.length > 0) {
				var selectNodes = Ext.clone(selectionModel.selected.items);

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

				Ext.Array.each(selectNodes, function(node) {
					if (node.data.index <= 0) {
						return false;
					}
					var currentNode = Ext.clone(node);
					var parentNode = node.parentNode;
					var prevNode = parentNode.getChildAt(currentNode.data.index - 1);
					var prevIndex = prevNode.data.index;

					// 노드삭제
					node.remove();

					// 선택된 노드 index 올려서 추가
					parentNode.insertChild(prevIndex, currentNode);
					parentNode.updateInfo();
				});
			}
		});

		// 노드 순서 내리기 (같은레벨)
		this.sub('btnDown').on('click', function() {
			// tplAttachHeader down
			var selectionModel = self.sub('tplAttachHeader').getSelectionModel();

			if (selectionModel.selected.length > 0) {
				var selectNodes = Ext.clone(selectionModel.selected.items);

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

				Ext.Array.each(selectNodes, function(node) {
					if (node.isRoot() || node.data.index == node.parentNode.childNodes.length - 1) {
						return false;
					}

					var currentNode = Ext.clone(node);
					var parentNode = node.parentNode;
					var nextNode = parentNode.getChildAt(currentNode.data.index + 1);
					var nextIndex = nextNode.data.index;

					// 선택노드 삭제
					node.remove();

					// 선택된 노드 index 내려서 추가
					parentNode.insertChild(nextIndex, currentNode);
					parentNode.updateInfo();
				});
			}
		});
	},

	onBeforeUpdate : function(form, addParmas, url) {
		var supplement = this.getSupplement();
		var formValue = supplement.getValues();
		Ext.apply(addParmas, formValue);
		
		var headerList = this.getHeaderMemberToInNode(formValue);
		if(headerList.length > 0){
			addParmas['headerList'] = headerList;
		}
		
	},

	findNode : function(rootNode, memberPath) {
		var nodes = [];
		rootNode.cascadeBy(function(node) {
			if (node.get('memberPath') == memberPath) {
				nodes.push(node);
			}
		});

		return nodes;
	},

	viewFlexibleHeaderList : function() {
		var self = this;
		var supplement = this.getSupplement();
		var store = Ext.create('SEC.store.SecViewFlexibleHeaderListOut.headerList',{
			pageSize : 1000
		});

		var userId = supplement.sub('cdvUserId').getValue(0);
		var dspId = supplement.sub('cdvDspId').getValue(0);
		var serviceName = supplement.sub('cdvService').getValue(0);
		
		if(Ext.isEmpty(serviceName)){
			return;
		}

		store.load({
			params : {
				procstep : '1',
				serviceName : serviceName,
				userId : userId,
				dspId : dspId

			},
			callback : function(records, operation, success) {
				if (success) {

					self.sub('tplAttachHeader').store.getRootNode().removeAll();
					
					self.setMemberToTree('tplAttachHeader', records);
				}
			}
		});
	},

	viewServiceMemberList : function() {
		var self = this;
		var supplement = this.getSupplement();
		var store = Ext.create('MES.store.SvmViewServiceMemberListOut.serviceMemberList');
		var moduleName = supplement.sub('cdvModule').getValue(0);
		var serviceName = supplement.sub('cdvService').getValue(0);
		
		if(Ext.isEmpty(moduleName)){
			moduleName = serviceName.substring(0,3);
		}

		store.load({
			params : {
				procstep : '2',
				moduleName : moduleName,
				serviceName : serviceName,
				direction : 'O'
			},
			callback : function(records, operation, success) {
				if (success) {

					self.sub('tplServiceMember').store.getRootNode().removeAll();

					self.setMemberToTree('tplServiceMember', records);

					// FlexibleHeaderList 호출
					self.viewFlexibleHeaderList();

					// dispatcher 코드뷰 innode에 MEMBER_NAME이 DSP_ID 가 있는지 검색
					// DSP_ID member가 있으면 disabled = false
					// DSP_ID member가 없으면 disabled = true
					store.load({
						params : {
							procstep : '4',
							moduleName : moduleName,
							serviceName : serviceName,
							direction : 'I'
						},
						callback : function(records, operation, success) {
							if (success) {
								var bDisp = true;
								Ext.Array.each(records, function(record) {
									if (record.get('memberName') == 'DSP_ID') {
										bDisp = false;
										return false;
									}
								});

								if (bDisp) {
									supplement.sub('cdvDspId').setValue('');
								}

								supplement.sub('cdvDspId').setDisabled(bDisp);
							}
						}
					});
				}
			}
		});
	},

	setMemberToTree : function(tplName, records) {
		var tpl = this.sub(tplName);
		var rootNode = tpl.store.getRootNode();
		var parentNode = rootNode;
		var currentParentMemberPath = '';
		

		for ( var i = 0; i < records.length; i++) {

			var raw = Ext.clone(records[i]);
			var parentMemberPath = raw.get('parentMemberPath');

			// 현재 저장한 parentMemberPath와 추가할 parentMemberPath가 같으면 기존 appendNode가
			// 그대로 appendNode 된다.
			if (currentParentMemberPath != parentMemberPath) {
				if (parentMemberPath == '') {
					// parentMemberPath가 없으면 parntNode는 rootNode가 된다.
					parentNode = rootNode;
				} else {
					// parentMemberPath가 있으면 path에 맞는 노드를찾아 parent node로 설정한다.
					parentNode = this.findNode(rootNode, parentMemberPath)[0];
				}
			}

			// 현재 parentMemberPath에 작업한 parentMemberPath를 저장해준다.
			currentParentMemberPath = parentMemberPath;

			if (!raw.get('memberPrt')) {
				raw.set('memberPrt', raw.get('memberName'));
			}

			var icon = 'image/menuIcon/0100_16.png';
			if (raw.get('memberType') == 'List') {
				icon = 'image/menuIcon/0081_16.png';
			} else if (raw.get('memberType') == 'Array') {
				icon = 'image/menuIcon/0013_16.png';
			}

			var memberPath = raw.get('memberPath');
			if (memberPath == 'STATUSVALUE' || memberPath == 'MSG' || memberPath == 'MSGCODE' || memberPath == 'MSGCATE' || memberPath == 'FIELDMSG'
					|| memberPath == 'DBERRMSG' || memberPath == 'FIELDMSG') {
				icon = 'image/menuIcon/0068_16.png';
			}

			raw.set('text', raw.get('memberName') + " : " + raw.get('memberPrt'));
			raw.set('leaf', true);
			raw.set('checked', null);
			raw.set('expandable', true);
			raw.set('icon', icon);
			// raw.set('iconCls', 'iconMaterial');

			if (parentNode) {
				if (parentNode.data.leaf == true) {
					parentNode.data.leaf = false;
					parentNode.data.expanded = true;
					parentNode.updateInfo();
				}
				parentNode.appendChild(raw.data);
			}

		}
	},

	getHeaderMemberToInNode : function(formValue) {
		var tplAttachHeader = this.sub('tplAttachHeader');
		var rootNode = tplAttachHeader.store.getRootNode();

		var headerList = [];
		var seq = 0;
		rootNode.cascadeBy(function(node) {
			if(!node.isRoot()){
				headerList.push({
					memberSeq : seq,
					memberName : node.get('memberName'),
					memberPath : node.get('memberPath')
				});
				
				seq++;
			}
		});
		
		return headerList;
	},

	buildForm : function() {
		return {
			xtype : 'container',
			flex : 1,
			layout : {
				type : 'hbox',
				align : 'stretch'
			},
			items : [ {
				xtype : 'panel',
				itemId : 'pnlAttachHeader',
				layout : 'fit',
				flex : 1,
				title : T('Caption.Other.Attached Header Member List'),
				tools : [ {
					xtype : 'button',
					itemId : 'btnLeftCollapse',
					width : 21,
					cls : 'marginR5',
					iconCls : 'treeUnfold'
				}, {
					xtype : 'button',
					itemId : 'btnLeftExpand',
					width : 21,
					iconCls : 'treeFold'
				} ],
				items : [ {
					xtype : 'treepanel',
					itemId : 'tplAttachHeader',
					root : {
						text : "[Attached Members]",
						expanded : true
					},
					multiSelect : true
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
						itemId : 'btnAdd',
						cls : 'btnArrowLeft marginT5',
						width : 24
					}, {
						xtype : 'button',
						itemId : 'btnDel',
						cls : 'btnArrowRight marginT5',
						width : 24
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
						width : 24
					}, {
						xtype : 'button',
						itemId : 'btnDown',
						cls : 'btnArrowDown marginB7',
						width : 24
					} ]
				} ]
			}, {
				xtype : 'panel',
				itemId : 'pnlServiceMember',
				layout : 'fit',
				flex : 1,
				title : T('Caption.Other.Service Member List'),
				tools : [ {
					xtype : 'button',
					itemId : 'btnRightCollapse',
					width : 21,
					cls : 'marginR5',
					iconCls : 'treeUnfold'
				}, {
					xtype : 'button',
					itemId : 'btnRightExpand',
					width : 21,
					iconCls : 'treeFold'
				} ],
				items : [ {
					xtype : 'treepanel',
					itemId : 'tplServiceMember',
					root : {
						text : "[Output Members]",
						expanded : true
					},
					multiSelect : true
				} ]
			} ]
		};
	},

	buildView : function() {
		return {
			xtype : 'button',
			itemId : 'btnView',
			text : T('Caption.Button.View')
		};
	}
});