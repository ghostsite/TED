<html lang='en'>
<head>
<base href="${basePath}">
	<title>Smart Factory1</title>
	<link rel="stylesheet" href="css/login.css"></link>
	<link rel="shortcut icon" href="image/faviconMESplus.ico">
	<link rel="icon" href="image/faviconMESplus.ico"> 
	
    <script type="text/javascript" src="js/jquery/jquery.min.js"></script>
    <script type="text/javascript" src="js/jquery/cookie/jquery.cookie.js"></script>
	<script>
	$(function() {
		var remember = $.cookie('remember');

        if(remember) {
			var factory = $.cookie('factory');
			var username = $.cookie('username');
			var language = $.cookie('language') || 'en';
			var program = $.cookie('program') || 'WEBClient';

            $('#j_factory').val(factory);
            $('#j_username').val(username);
            $('#j_language').val(language);
            var radio = $('input[name=j_program][value=' + program + ']');
            if(radio) {
            	radio[0].checked = true;
            }
            $('#remember').attr('checked', 'checked');
        }

        $('.auto-focus:first').focus().select();
		
		$("form").submit(function() {
			if ($('#remember').is(':checked')) {
				var factory = $('#j_factory').val();
				var username = $('#j_username').val();
				var language = $('#j_language').val();
				var program = $('input[name=j_program]:checked').val();

				// set cookies to expire in 14 days
				$.cookie('factory', factory, {
					expires : 14
				});
				$.cookie('username', username, {
					expires : 14
				});
				$.cookie('language', language, {
					expires : 14
				});
				$.cookie('program', program, {
					expires : 14
				});
				$.cookie('remember', true, {
					expires : 14
				});
			} else {
				$.cookie('factory', null);
				$.cookie('username', null);
				$.cookie('remember', null);
				$.cookie('language', null);
				$.cookie('program', null);
			}
		});
		
		if(true || document.referrer) {
			$('#program_part').hide();
		}
	});
	</script>
</head>
<body class="welcome">
	<div class="welcomeMent">
		<span class="productName">MESplus 6  Enterprise Edition</span> <span>Welcome,</span>
		Please Log In to Your Account ...
	</div>

	<form action="login" method="post" class="loginForm">
		<label for="j_factory">Factory</label>
		<input id="j_factory" name="j_factory" maxlength="50" type="text" class="loginInput auto-focus" />
		<label for="j_username">user name</label>
		<input id="j_username" name="username" maxlength="50" type="text" class="loginInput" />
		<label for="password">Password</label>
		<input id="j_password" name="password" maxlength="50" type="password" class="loginInput" />
		<label for="language">Language</label>
		<select id="language" name="language">
			<option value="cn" selected="selected">中文</option>
			<option value="en">English</option>
			<option value="ko">한국어</option>
		</select>
		<div id="program_part">
			<div>
				<input type="radio" name="j_program" value="WEBClient" checked="checked">Standard WEB
				<br/>
				<input type="radio" name="j_program" value="OPCClient">Operation Center
			</div>
		</div>
	
		<div class="btnline">
			<!--
			<input id="_spring_security_remember_me" name="_spring_security_remember_me" type="checkbox" value="true" />
			<label for="_spring_security_remember_me">remember me?</label>
			-->
			<input id="remember" type="checkbox" />
			<span>remember?</span>
			<div>
				<input type="reset" value="Reset" class="btnWelcomeReset" />
				<input type="submit" value="Login" class="btnWelcomeLogin" />
			</div>
		</div>
	</form>
</body>
</html>



