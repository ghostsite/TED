<html lang='en'>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<base href="${basePath}">
	<head>
		<title>Smart Factory</title>
		<link rel="stylesheet" href="resources/js/extjs-4.1.1/resources/css/ext-smartfactory.css"></link>
		<link rel="stylesheet" href="resources/css/smartfactory.css"></link>
		<link rel="stylesheet" href="resources/js/ux/statusbar/css/statusbar.css"></link>
		<link rel="stylesheet" href="resources/js/ux/tab/css/TabScrollerMenu.css"></link>
		<link rel="stylesheet" type="text/css" href="resources/js/ux/grid/css/CheckHeader.css">
		<link rel="shortcut icon" href="resources/image/faviconMESplus.ico">
		<link rel="icon" href="resources/image/faviconMESplus.ico"> 
		
		<!-- JavaScripts For StackTracing -->
		<script src="resources/js/stacktrace/stacktrace.js"></script>

		<!-- JavaScripts For Flash Object Interface -->
		<script src="resources/js/swfobject/swfobject.js"></script>

		<!-- JavaScripts For Excel Export -->
		<script src="resources/js/downloadify/downloadify.min.js"></script>
		
		<!-- JavaScripts For Vector Graphic -->
		<script src="resources/js/raphael/raphael-min.js"></script>
				
		<!-- JavaScripts For Comet --> 
 	    <script type="text/javascript" src="resources/js/comet/dojo.js"></script>
	    <script type="text/javascript" src="resources/js/dojox/cometd.js"></script>
		
		<!-- JavaScripts For Locale -->
	    <script type="text/javascript" src="resources/js/locale/locale.js"></script>

		<script type="text/javascript">
		var login = {
			username : '登录名123',
			factory : '工厂123',
			locale : 'zh_CN',
			group : 'groupId123'
		};
		initLocalization(this);
		</script>
		<script type="text/javascript" src="resources/product/locale/zh_CN.js"></script>

		<!-- JavaScripts For ExtJS extjs-4.1.0-->
		<script src="resources/js/extjs/bootstrap.js"></script>
		
		<!-- Extjs locale -->
		<script src="resources/js/extjs/locale/ext-lang-zh_CN.js" charset="UTF-8"></script>

		<script src="resources/app/APP.js"></script>
		
		<script type="text/javascript">
		Ext.module.register('CMN', [ 'CMN.controller.CMNController' ], false);
		Ext.module.register('MES', [ 'MES.controller.MESController' ], false);
		Ext.module.register('BAS', [ 'BAS.controller.BASController' ], false);
		Ext.module.register('SEC', [ 'SEC.controller.SECController' ], false);
		Ext.module.register('WIP', [ 'WIP.controller.WIPController' ], false);
		Ext.module.register('RAS', [ 'RAS.controller.RASController' ], false);
		Ext.module.register('ALM', [ 'ALM.controller.ALMController' ], false);
		Ext.module.register('EDC', [ 'EDC.controller.EDCController' ], false);
		Ext.module.register('LBL', [ 'LBL.controller.LBLController' ], false);
		
		/* 개발시는 참조하고 배포시 참조하지 않는 모듈 */
		Ext.module.register('DEV', [ 'DEV.controller.DEVController' ], false);
		Ext.module.register('RPT', [ 'RPT.controller.RPTController' ], false);
		
		/* 참조 제거모듈 */
		/*
		//FlexibleHeaderSetup.js -> RtdViewDispatcherListOut.dspList 서비스는 MES.store로 변경
		Ext.module.register('RTD', [ 'RTD.controller.RTDController' ], false);
		Ext.module.register('SVM', [ 'SVM.controller.SVMController' ], false);
		Ext.module.register('MBI', [ 'MBI.controller.MBIController' ], true);
		*/
		</script>
		<script>
		window.onload = function() {
			var v = 0;
			var inv = setInterval(function() {
				var pbar = document.getElementById('_progressbar');
				if(!pbar) {
					clearInterval(inv);
					return;
				}
				v += 10;
				pbar.style.width = (v % 100) + '%';
			}, 100);
		};
		</script>
	</head>
	<body>
		<div id="_loadprogress" style="margin:25% 35%;width:300px;text-align:center;font-size:14px;color:#333">
			loading..
			<div style="width:300px;height:15px;border:1px solid #ccc;margin-top:5px;padding:2px;background-color:#efefef;text-align:left">
				<span id="_progressbar" style="width:0%;height:100%;background-color:#7491d1;display:block;"></span>
			</div>
		</div>
	</body>
</html>
