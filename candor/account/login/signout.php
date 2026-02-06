<?php
require_once '/var/www/gangdev/shared/php/init_candor.php';

candor_logout();

if (ini_get('session.use_cookies')) {
	$p = session_get_cookie_params();
	setcookie(
		session_name(),
		'',
		time() - 42000,
		$p['path'],
		$p['domain'],
		$p['secure'],
		$p['httponly']
	);
}

header('Location: https://candor.you/');
exit;
