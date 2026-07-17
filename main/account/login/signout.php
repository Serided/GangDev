<?php
session_start();
session_unset();
session_destroy();
header("Location: https://account.gangdev.co/login/signin.php");
exit();
?>