/**
 * @class CMN.mixin.Vtypes modified at 2013-04-22 add gips vtype
 *        Ext.util.JFrame.js
 */
Ext.define('CMN.mixin.Vtypes', {
	constructor : function(config) {
		Ext.apply(Ext.form.VTypes, {
			nospace : function(val, field) {
				var rTypes = /^[a-zA-Z0-9_-]+$/;
				return rTypes.test(val);
			},
			// The error text to display
			nospaceText : T('Validator.nospace'),
			numbers : function(val, field) {
				var rTypes = /^[0-9]+$/;
				return rTypes.test(val);
			},
			numbersText : T('Validator.numbers'),
			numbersMask : /^[0-9]+$/,

			// float type
			floats : function(val, field) {
				var rTypes = /^([0-9]*||[0-9]*\.[0-9]*)$/;
				return rTypes.test(val);
			},
			floatsText : T('Validator.floats'),

			// excel
			xls : function(val, field) {
				var fileName = /^.*\.(xlsx|xls)$/i;
				return fileName.test(val);
			},
			xlsText : "File must be Microsoft Excel",

			// ip
			iPAddress : function(v) {
				return /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(v);
			},
			iPAddressText : 'Must be a numeric IP address',
			iPAddressMask : /[\d\.]/i, // zhang added below all

			// age
			"age" : function(_v) {
				if (/^\d+$/.test(_v)) {
					var _age = parseInt(_v);
					if (_age < 200)
						return true;
				} else
					return false;
			},
			'ageText' : '年龄格式出错！！格式例如：20',
			'ageMask' : /[0-9]/i,
			// 密码验证
			"repassword" : function(_v, field) {
				if (field.confirmTO) {
					var psw = Ext.get(field.confirmTO);
					return (_v == psw.getValue());
				}
				return true;
			},
			"repasswordText" : "密码输入不一致！！",
			"repasswordMask" : /[a-z0-9]/i,
			// 邮政编码
			"postcode" : function(_v) {
				return /^[1-9]\d{5}$/.test(_v);
			},
			"postcodeText" : "该输入项目必须是邮政编码格式，例如：226001",
			"postcodeMask" : /[0-9]/i,

			// 固定电话及小灵通
			"telephone" : function(_v) {
				return /(^\d{3}\-\d{7,8}$)|(^\d{4}\-\d{7,8}$)|(^\d{3}\d{7,8}$)|(^\d{4}\d{7,8}$)|(^\d{7,8}$)/.test(_v);
			},
			"telephoneText" : "该输入项目必须是电话号码格式，例如：0513-89500414,051389500414,89500414",
			"telephoneMask" : /[0-9\-]/i,
			// 手机
			"mobile" : function(_v) {
				return /^1[35][0-9]\d{8}$/.test(_v);
			},
			"mobileText" : "该输入项目必须是手机号码格式，例如：13485135075",
			"mobileMask" : /[0-9]/i,
			// 身份证
			"IDCard" : function(_v) {
				var area = {
					11 : "北京",
					12 : "天津",
					13 : "河北",
					14 : "山西",
					15 : "内蒙古",
					21 : "辽宁",
					22 : "吉林",
					23 : "黑龙江",
					31 : "上海",
					32 : "江苏",
					33 : "浙江",
					34 : "安徽",
					35 : "福建",
					36 : "江西",
					37 : "山东",
					41 : "河南",
					42 : "湖北",
					43 : "湖南",
					44 : "广东",
					45 : "广西",
					46 : "海南",
					50 : "重庆",
					51 : "四川",
					52 : "贵州",
					53 : "云南",
					54 : "西藏",
					61 : "陕西",
					62 : "甘肃",
					63 : "青海",
					64 : "宁夏",
					65 : "新疆",
					71 : "台湾",
					81 : "香港",
					82 : "澳门",
					91 : "国外"
				}
				var Y, JYM;
				var S, M;
				var idcard_array = new Array();
				idcard_array = _v.split("");
				// 地区检验
				if (area[parseInt(_v.substr(0, 2))] == null) {
					this.IDCardText = "身份证号码地区不正确，格式例如：51";
					return false;
				}
				// 身份号码位数及格式检验
				switch (_v.length) {
					case 15 :
						var year = _v.substr(6, 2);
						var month = _v.substr(8, 2);
						var day = _v.substr(10, 2);
						var D = new Date("19" + year + "/" + month + "/" + day);
						var B = D.getFullYear() == parseInt('19' + year, 10) && (D.getMonth() + 1) == parseInt(month, 10) && D.getDate() == parseInt(day, 10);
						if (B)
							return true;
						else {
							this.IDCardText = "身份证号码出生日期不正确，格式例如：860817";
							return false;
						}
						break;
					case 18 :
						// 18位身份号码检测
						// 出生日期的合法性检查
						var year = _v.substr(6, 4);
						var month = _v.substr(10, 2);
						var day = _v.substr(12, 2);
						var D = new Date(year + "/" + month + "/" + day);
						var B = D.getFullYear() == parseInt(year, 10) && (D.getMonth() + 1) == parseInt(month, 10) && D.getDate() == parseInt(day, 10);
						if (B) {// 测试出生日期的合法性
							// 计算校验位
							S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7 + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9 + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10 + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5 + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8 + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4 + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2 + parseInt(idcard_array[7]) * 1 + parseInt(idcard_array[8]) * 6 + parseInt(idcard_array[9]) * 3;
							Y = S % 11;
							M = "F";
							JYM = "10X98765432";
							M = JYM.substr(Y, 1);// 判断校验位
							// alert(idcard_array[17]);
							if (M == idcard_array[17]) {
								return true; // 检测ID的校验位
							} else {
								this.IDCardText = "身份证号码不正确，号码末位校验位校验出错。<br>如末位校验位为X，请大写，格式例如：201X";
								return false;
							}
						} else {
							this.IDCardText = "身份证号码出生日期不正确，格式例如：19860817";
							return false;
						}
						break;
					default :
						this.IDCardText = "身份证号码位数不对，应该为15位或是18位";
						return false;
						break;
				}
			},
			"IDCardText" : "该输入项目必须是身份证号码格式，例如：51082919860817201X",
			"IDCardMask" : /[0-9xX]/i
		});

		return;
	}
});
