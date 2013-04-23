<html lang='en'>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<base href="${basePath}">
	<head>
	    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<title>智能信息管理系统</title>
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
	    	id: ${user.id}, 
			loginname : '${user.loginName}',
			username : '${user.userName}',
			locale : '${user.language}',
			factory : '',
			group : '',
			programId : 'WEBClient'
		};

		var sessionInfo = "";
		var roleList = undefined;
		var globalOptionList = "";
		
		initLocalization(this);
		
		LANGUAGE_LIST = [{text : 'English', locale : 'en', icon:'image/icon/us.png'}, {text : 'Chinese', locale : 'cn', icon:'image/icon/cn.png'}];
		
		// Set Auto Expiration TTL seconds. TTL should be greater than 60.
		LOGOUT_URL = 'logout?targetUrl=/showLogin';
		
		//codeview default pagesize 설정 기본1000
		CODEVIEW_PAGESIZE = 1000;
		
		// Set URL of your WebSocketMain.swf here, for web-socket
		WEB_SOCKET_SWF_LOCATION = 'js/web-socket/WebSocketMain.swf';
		WEB_SOCKET_DEBUG = true;
		</script>
		<script type="text/javascript" src="product/locale/${user.language}.js"></script>

		<!--native extjs 4.1.1-->
		<link rel="stylesheet" href="js/extjs-4.1.1/resources/css/ext-all.css"></link>
		<link rel="stylesheet" href="css/smartfactory-fix.css"></link>
		<script src="js/extjs-4.1.1/ext-all.js"></script>
		<script src="js/extjs-4.1.1/locale/ext-lang-${user.language}.js" charset="UTF-8"></script>

		<!--TES,这个最好在extjs4.2.0下演示，因为smartfactory的css干扰了效果-->
		<link rel="stylesheet" href="js/uux/window/css/Notification.css"></link>
		<link rel="stylesheet" href="js/uux/SecondTitle.css"></link>
		<link rel="stylesheet" href="js/uux/form/field/BoxSelect.css"></link>
		<link rel="stylesheet" href="js/uux/container/ButtonSegment.css"></link>
		<link rel="stylesheet" href="js/uux/form/field/StarRating/css/style.css"></link>
		<link rel="stylesheet" href="js/uux/form/field/ToggleSlide/css/toggle-slide.css"></link>
		<link rel="stylesheet" href="js/uux/util/PDF/TextLayerBuilder.css"></link>
		<script src="js/uux/form/tinymce/tiny_mce_src.js" charset="UTF-8"></script>
		<script src="js/uux/exporter/downloadify.min.js" charset="UTF-8"></script>
		<script src="js/uux/panel/util/compatibility.js" charset="UTF-8"></script>
		<script src="js/uux/panel/util/pdf.js" charset="UTF-8"></script>
		<script src="js/uux/panel/PDF.js" charset="UTF-8"></script>
		<script src="js/openlayers/OpenLayers.js"></script>

		<script src="app/application.js"></script>
		<script type="text/javascript">
		Ext.module.register('BAS', [ 'BAS.controller.BASController' ], false);
		Ext.module.register('CMN', [ 'CMN.controller.CMNController' ], false);
		Ext.module.register('MES', [ 'MES.controller.MESController' ], false);
		Ext.module.register('SEC', [ 'SEC.controller.SECController' ], false);
		Ext.module.register('SYS', [  ], false);
		Ext.module.register('BUS', [  ], false);
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
		<div class="siteBrand"><span class="logo"></span>智能管理软件有限公司.</div>
		<div id="_loadprogress" style="margin:25% 35%;width:300px;text-align:center;font-size:14px;color:#333;position:relative\9;top:45%\9">
			加载中......
			<div style="width:300px;height:15px;border:1px solid #ccc;margin-top:5px;padding:2px;background-color:#efefef;text-align:left">
				<span id="_progressbar" style="width:0%;height:100%;background-color:#7491d1;display:block;"></span>
			</div>
		</div>
	</body>
</html>
