<%@page import="com.mesplus.util.Home"%>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<html lang='en'>
	<head>
		<meta http-equiv="X-UA-Compatible" content="chrome=1">
		<title>Smart Factory</title>
		<link rel="stylesheet" href="js/extjs-4.1.1/resources/css/ext-smartfactory.css"></link>
		<link rel="stylesheet" href="css/smartfactory.css"></link>
		<link rel="stylesheet" href="js/ux/statusbar/css/statusbar.css"></link>
		<link rel="stylesheet" type="text/css" href="js/ux/grid/css/CheckHeader.css">
		<link rel="shortcut icon" href="image/faviconMESplus.ico">
		<link rel="icon" href="image/faviconMESplus.ico"> 
		
		<!-- JavaScripts For StackTracing -->
		<script src="js/stacktrace/stacktrace.js"></script>

		<!-- JavaScripts For Locale -->
	    <script type="text/javascript" src="js/locale/locale.js"></script>

		<script type="text/javascript">
		var login = {
			username : '<sec:authentication property="principal.userId"/>',
			factory : '<sec:authentication property="principal.factory"/>',
			locale : '<sec:authentication property="principal.language"/>',
			group : '<sec:authentication property="principal.secGrpId"/>',
			programId : 'WEBClient'
		};

		var sessionInfo = <%= Home.getSessionInfo() %>;
		var factoryInfo = <%= Home.getFactory() %>;
		var globalOptionList = <%= Home.getGlobalOptionList() %>;

		initLocalization(this);
		
		// Set Auto Expiration TTL seconds. TTL should be greater than 60.
		AUTOEXPIRE_TTL = 60 * 60;
		LOGOUT_URL = 'logout?targetUrl=/home';
		</script>
		<script type="text/javascript" src="product/locale/<sec:authentication property="principal.language"/>.js"></script>

		<!-- JavaScripts For ExtJS extjs-4.1.0-->
		<script src="js/extjs-4.1.1/bootstrap.js"></script>
		
		<!-- Extjs locale -->
		<script src="js/extjs-4.1.1/locale/ext-lang-<sec:authentication property="principal.language"/>.js" charset="UTF-8"></script>

		<script src="unity/APP.js"></script>
		
		<script type="text/javascript">
		Ext.module.register('CMN', [ 'CMN.controller.CMNController' ], false);
		Ext.module.register('MES', [ 'MES.controller.MESController' ], false);
		Ext.module.register('BAS', [ 'BAS.controller.BASController' ], false);
		Ext.module.register('SEC', [ 'SEC.controller.SECController' ], false);
		Ext.module.register('WIP', [ 'WIP.controller.WIPController' ], false);
		Ext.module.register('RAS', [ 'RAS.controller.RASController' ], false);
		
		Ext.module.register('EDC', [ 'EDC.controller.EDCController' ], false);
 		Ext.module.register('BOM', [ 'BOM.controller.BOMController' ], false);
 		
 		/* Agent를 사용하는 모듈들은 일단 제외함 *
		Ext.module.register('ALM', [ 'ALM.controller.ALMController' ], false);
		Ext.module.register('LBL', [ 'LBL.controller.LBLController' ], false);
		*/

		/* 개발시는 참조하고 배포시 참조하지 않는 모듈 */
		Ext.module.register('RPT', [ 'RPT.controller.RPTController' ], false);
		
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
		<div class="siteBrand"><span class="logo"></span>leading technology group</div>
		<div id="_loadprogress" style="margin:25% 35%;width:300px;text-align:center;font-size:14px;color:#333;position:relative\9;top:45%\9">
			loading..
			<div style="width:300px;height:15px;border:1px solid #ccc;margin-top:5px;padding:2px;background-color:#efefef;text-align:left">
				<span id="_progressbar" style="width:0%;height:100%;background-color:#7491d1;display:block;"></span>
			</div>
		</div>
	</body>
</html>
