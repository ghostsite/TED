<%@page import="com.mesplus.util.Home"%>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>

<!-- Auto Generated with Sencha Architect -->
<!-- Modifications to this file will be overwritten. -->
<html>
<head>
	<meta http-equiv="X-UA-Compatible" content="chrome=1">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Operation Center</title>
    <link rel="stylesheet" href="js/extjs-4.1.1/resources/css/ext-opc.css"></link>
	<link rel="shortcut icon" href="image/faviconMESplus.ico">
	
    <script type="text/javascript" src="js/locale/locale.js"></script>
    <script type="text/javascript" src="js/stacktrace/stacktrace.js"></script>
    <script type="text/javascript" src="js/swfobject/swfobject.js"></script>
    <script type="text/javascript" src="js/modernizr/modernizr-custom-2.0.min.js"></script>
    <script type="text/javascript" src="js/web-socket/web_socket.js"></script>
    
	<!-- JavaScripts For Comet --> 
	<script type="text/javascript" src="js/comet/dojo.js"></script>
	<script type="text/javascript" src="js/dojox/cometd.js"></script>
		
    <script src="js/extjs-4.1.1/bootstrap.js"></script>
	<script src="js/extjs-4.1.1/locale/ext-lang-<sec:authentication property="principal.language"/>.js" charset="UTF-8"></script>
    <script type="text/javascript" src="opc/app.js"></script>
    
    <script type="text/javascript">
		var login = {
			username : '<sec:authentication property="principal.userId"/>',
			factory : '<sec:authentication property="principal.factory"/>',
			locale : '<sec:authentication property="principal.language"/>',
			group : '<sec:authentication property="principal.secGrpId"/>',
			programId : 'OPCClient'
		};
		
		var sessionInfo = <%= Home.getSessionInfo() %>;
		var factoryInfo = <%= Home.getFactory() %>;
		var globalOptionList = <%= Home.getGlobalOptionList() %>;
		var assemblyNameList = <%= Home.getAssemblyNameList() %>;
		var myAssemblyNameList = <%= Home.getMyAssemblyNameList() %>;

		initLocalization(this);
		
		// Set URL of your WebSocketMain.swf here, for web-socket
		WEB_SOCKET_SWF_LOCATION = 'js/web-socket/WebSocketMain.swf';
		WEB_SOCKET_DEBUG = true;

		// Set Auto Expiration TTL seconds. TTL should be greater than 60.
		LOGOUT_URL = 'logout?targetUrl=/opc';

	</script>
	<script type="text/javascript" src="opc/locale_base/<sec:authentication property="principal.language"/>.js"></script>
	<script type="text/javascript" src="opc/locale/<sec:authentication property="principal.language"/>.js"></script>
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
	<div id="_loadprogress" style="margin:25% 35%;width:300px;text-align:center;font-size:14px;color:#333;position:relative\9;top:45%\9">
		loading..
		<div style="width:300px;height:15px;border:1px solid #ccc;margin-top:5px;padding:2px;background-color:#efefef;text-align:left">
			<span id="_progressbar" style="width:0%;height:100%;background-color:#7491d1;display:block;"></span>
		</div>
	</div>
</body>
</html>