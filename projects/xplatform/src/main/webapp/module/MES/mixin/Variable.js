Ext.define('MES.mixin.Variable', {	
	gv : {
		gsClientVersion : '', // Server Program Version
		gsServerVersion: '', // Client Program Version
		gsUpgradeFile: '', // Upgrade Program Name
		gsDownloadFileList: '',
		gsHelpUrl: '',
		gsDefaultHelpUrl: '',

		giTimeOut: '',
		giLogOutTime: '',
		giVersionCheckTime: '', // Version Check Time Added by ICBAE
		giIdleTime : '', // (if giIdleTime:giLogoutTime :> Logout)
		
		gsDateDelimiter : '/', // DateTime Foramt ("/", "-" , "." )
		
		gsServerName : 'MESServer', // "MESServer"
		gsSiteId : '', // Server Site ID ("MPD1", "MPP1", ...)"
		gbAutoRefresh : false,
		giAutoRefreshTime : 300,
		gbListAutoRefresh : true,
		gsRemoteAddress: '', // Station Remote Addres
		gsRvService: '', // Station Remote Addres
		gsRvNetwork: '', // Station Remote Addres

		gbExitFlag: '',
		gsComputerName: '',
		gsFactory: '',
		gsUserID: '',
		gsPassword: '',
		gsPassport: '',
		gbShowMsgFlag : true,

		gsReturnLotId: '', // Return Lot ID
		gsWorkDate: '', // Return Lot Work Date

		gsCentralFactory : "SYSTEM", // Central Factory

		gbGridFlag : true,
		gbLoginFlag : false,
		gbLogoutFlag : false,

		gcLanguage : '1',

		gcAutoUpgrade : '1',
		gbUseSmallLetter : true,

		gbShowMessagePanel: '',
		gsMessage: '',
		gsUserGroup: '',
		gsDepartment: '',
		gsUserAreaId: '',
		gsUserSubAreaId: '',
		   
		// Language Function
		gsMessageData : [],
		giMaxMessageData : 1000,

		gbProcessCaster : false, // Caster Processing
		giMessageSize : 8, // Caster Processing

		gcChangePassword : '',

		giRequestReplyWaitTime : 10,

		gaMenuLanguage : [],
		gaButtonLanguage : [],
		gaTextLanguage : [],

		gsCurrentLotId: '',
		giCurrentHistSeq: '',
		gsCurrentResId: '',
		gaSelectLotId : [],
		//gaSelectResId : [], //사용안함(ResourceListMain에서만 사용되서 공용화 불필요)

		gbBOMPartList: '',
		gbCharList: '',
		gbCharSetList: '',
		gbMaterialList: '',
		gbResourceList: '',
		gbFlowList: '',
		gbOperList: '',
		gbUserList: '',

		//Factory Shift 정보
		gShiftInfor: {
			bVariableShift : '',
			iShiftCount : '',
			cShift1DayFlag : '',
			sShift1StartTime : '',
			cShift2DayFlag : '',
			sShift2StartTime : '',
			cShift3DayFlag : '',
			sShift3StartTime : '',
			cShift4DayFlag : '',
			sShift4StartTime : ''
		},

		gsAlarmType : "ALM",


		// Carrier Status -> Carrier History
		gsCurrentCrrId: '',

		   // Tool -> Tool History
		gsCurrentToolId: '',
		gsCurrentToolType: '',

		gaWarningMsg : [],

	    // Add by J.S. 2009.02.13
	    // favorites수정시 LotListMain, ResourceListMain시 submenu를 refresh하기위한
		// 변수
		gbFavoriteChangeForLotListMain: '',
		gbFavoriteChangeForResourceListMain: '',

		// Add by IC.Bae 2012.03.08
		gCookieContainer : null,
		
		//SQL Syntax
		sqlSyntax : [ "SELECT", "*", "FROM", "WHERE", "ORDER", "AND", "OR", "IN", "GROUP", "BY", "NOT", "AS", "DISTINCT", "=", "<>", "LIKE" ],
		// field constant
		fieldConstant : [ "MAT_ID", "MAT_VER", "FLOW", "OPER", "RES_TYPE", "RESG_ID", "RES_ID", "LOT_ID" ],

		//Admin 관련
		gsTableName : ''
	}
});

