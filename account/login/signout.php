<?php
session_start();
session_unset();
session_destroy();
header("Location: https://account.gangdev.co/php/login/signin.php");
exit();
?>