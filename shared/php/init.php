<?php
session_set_cookie_params([
	'lifetime' => 7 * 24 * 60 * 60, // 7 days
	'path'     => '/',
	'domain'   => '.gangdev.co',
	'secure'   => false,
	'httponly' => true,
	'samesite' => 'Lax'
]);
if (session_status() == PHP_SESSION_NONE) session_start();

$displayname = isset($_SESSION['displayname']) ? $_SESSION['displayname'] : 'Account';
$userIconUrl = '';
if (isset($_SESSION['user_id'])) {
	$userIconUrl = "https://gangdev.co/user/" . $_SESSION['user_id'] . "/icon/user-icon.jpg";
}

ob_start();
include '/var/www/gangdev/shared/php/navBar.php';
$navbar = ob_get_clean();

ob_start();
include '/var/www/gangdev/shared/php/footer.php';
$footer = ob_get_clean();

ob_start();
include '/var/www/gangdev/shared/php/repetitive.php';
$head = ob_get_clean();

error_log('Session content: ' . print_r($_SESSION, true)); // Check your Apache error log for this output.