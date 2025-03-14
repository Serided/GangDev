<?php
if (session_status() == PHP_SESSION_NONE) session_start();

ob_start();
include '/var/www/gangdev/shared/php/navBar.php';
$navbar = ob_get_clean();

ob_start();
include '/var/www/gangdev/shared/php/footer.php';
$footer = ob_get_clean();

ob_start();
include '/var/www/gangdev/shared/php/repetitive.php';
$head = ob_get_clean();