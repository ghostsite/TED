<html lang='en'>
<head>
<base href="${basePath}">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<title>智能信息管理系统</title>
	<link rel="stylesheet" href="css/login.css"></link>
	<link rel="shortcut icon" href="image/faviconMESplus.ico">
	<link rel="icon" href="image/faviconMESplus.ico"> 
	
    <script type="text/javascript" src="js/jquery/jquery.min.js"></script>
    <script type="text/javascript" src="js/jquery/cookie/jquery.cookie.js"></script>
	<script>
	$(function() {
		var remember = $.cookie('remember');

        if(remember) {
			var username = $.cookie('username');
			var language = $.cookie('language') || 'cn';

            $('#username').val(username);
            $('#language').val(language);
            $('#remember').attr('checked', 'checked');
        }

        $('.auto-focus:first').focus().select();
		
		$("form").submit(function() {
			if ($('#remember').is(':checked')) {
				var username = $('#username').val();
				var language = $('#language').val();

				// set cookies to expire in 14 days
				$.cookie('username', username, {
					expires : 14
				});
				$.cookie('language', language, {
					expires : 14
				});
				$.cookie('remember', true, {
					expires : 14
				});
			} else {
				$.cookie('username', null);
				$.cookie('remember', null);
				$.cookie('language', null);
			}
		});
		
	});
	</script>
</head>
<body class="welcome">
	<div class="welcomeMent">
		<span class="productName">企业版本</span> <span class="welcomeInfo">欢迎使用智能信息管理系统</span>
	</div>

	<span style="color:red">${error}</span>
	<form action="login" method="post" class="loginForm">
		<label for="username">用户名</label>
		<input name="username" maxlength="50" type="text" class="loginInput auto-focus"/>
		<label for="password">密码</label>
		<input name="password" maxlength="50" type="password" class="loginInput" />
		<label for="language">语言</label>
		<select id="language" name="language">
			<option value="cn" selected="selected">中文</option>
			<option value="en">English</option>
		</select>
		
		<div class="btnline">
			<input id="remember" type="checkbox" />
			<span>记住用户?</span>
			<div>
				<input type="reset" value="Reset" class="btnWelcomeReset" />
				<input type="submit" value="Login" class="btnWelcomeLogin" />
			</div>
		</div>
	</form>
</body>
</html>