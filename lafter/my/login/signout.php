<?php
require_once '/var/www/gangdev/lafter/src/php/init.php';
session_unset();
session_destroy();
header('Location: https://lafter.gg');
exit;
