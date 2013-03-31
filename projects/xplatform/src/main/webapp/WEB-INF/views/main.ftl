<html lang='en'>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<base href="${basePath}">
	<head>
	    <meta http-equiv="X-UA-Compatible" content="chrome=1">
		<title>Smart Factory</title>
		<link rel="stylesheet" href="css/app.css"></link>
		<link rel="stylesheet" href="js/uux/statusbar/css/statusbar.css"></link>
		<link rel="stylesheet" href="js/uux/tab/css/TabScrollerMenu.css"></link>
		<link rel="stylesheet" type="text/css" href="js/uux/grid/css/CheckHeader.css">
		<link rel="stylesheet" type="text/css" href="js/uux/grid/css/GridFilters.css">
		<link rel="stylesheet" type="text/css" href="js/uux/grid/css/RangeMenu.css">
		<link rel="stylesheet" type="text/css" href="js/uux/grid/css/print.css">
		
		<link rel="stylesheet" type="text/css" href="js/uux/portal/css/portal.css">
		<link rel="shortcut icon" href="image/faviconMESplus.ico">
		<link rel="icon" href="image/faviconMESplus.ico"> 
		
		<!-- Google Chrome Frame -->
		<meta http-equiv="X-UA-Compatible" content="chrome=1">
		
		<!-- JavaScripts For StackTracing -->
		<script src="js/stacktrace/stacktrace.js"></script>

		<!-- JavaScripts For Flash Object Interface -->
		<script src="js/swfobject/swfobject.js"></script>
		
		<!-- Modernizr  -->
		<script type="text/javascript" src="js/modernizr/modernizr-custom-2.0.min.js"></script>

		<!-- JavaScripts For Comet --> 
 	    <script type="text/javascript" src="js/comet/dojo.js"></script>
	    <script type="text/javascript" src="js/dojox/cometd.js"></script>
		
		<!-- JavaScripts For Locale -->
	    <script type="text/javascript" src="js/locale/locale.js"></script>

		<script type="text/javascript">
	    var login = {
			username : '曹操',
			factory : '',
			locale : '${user.language}',
			group : 'groupId123',
			programId : 'WEBClient'
		};

		var sessionInfo = "";
		var roleList = undefined;
		var factoryInfo = "";
		var globalOptionList = "";
		var taskTypeConfig = "";
		var assemblyNameList = "";
		var myAssemblyNameList = "";
		
		initLocalization(this);
		
		// Set Auto Expiration TTL seconds. TTL should be greater than 60.
		LOGOUT_URL = 'logout?targetUrl=/home';
		
		// Set URL of your WebSocketMain.swf here, for web-socket
		WEB_SOCKET_SWF_LOCATION = 'js/web-socket/WebSocketMain.swf';
		WEB_SOCKET_DEBUG = true;
		</script>
		<script type="text/javascript" src="product/locale/${user.language}.js"></script>

		<!-ExtJS extjs-4.1.1, if you want to use extjs4.2.0 then only need to change here,4 lines-->
		<link rel="stylesheet" href="js/extjs-4.1.1/resources/css/ext-smartfactory.css"></link>
		<link rel="stylesheet" href="css/smartfactory.css"></link>
		<script src="js/extjs-4.1.1/bootstrap.js"></script>
		<script src="js/extjs-4.1.1/locale/ext-lang-${user.language}.js" charset="UTF-8"></script>

		<!--TES,这个最好在extjs4.2.0下演示，因为smartfactory的css干扰了效果-->
		<link rel="stylesheet" href="js/uux/window/css/Notification.css"></link>
		<link rel="stylesheet" href="js/uux/SecondTitle.css"></link>
		

		<script src="app/application.js"></script>
		<script type="text/javascript">
		Ext.module.register('BAS', [ 'BAS.controller.BASController' ], false);
		Ext.module.register('CMN', [ 'CMN.controller.CMNController' ], false);
		Ext.module.register('MES', [ 'MES.controller.MESController' ], false);
		Ext.module.register('SEC', [ 'SEC.controller.SECController' ], false);
		Ext.module.register('SYS', [  ], false);
		Ext.module.register('TES', [  ], false);
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
		<div class="siteBrand"><span class="logo"></span></div>
		<div id="_loadprogress" style="margin:25% 35%;width:300px;text-align:center;font-size:14px;color:#333;position:relative\9;top:45%\9">
			loading..
			<div style="width:300px;height:15px;border:1px solid #ccc;margin-top:5px;padding:2px;background-color:#efefef;text-align:left">
				<span id="_progressbar" style="width:0%;height:100%;background-color:#7491d1;display:block;"></span>
			</div>
		</div>
	</body>
</html>
