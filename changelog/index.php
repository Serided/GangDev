<?php require_once '/var/www/gangdev/shared/php/init.php'; ?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" name="description" content="Home">
		<title>Change Log</title>
        <link rel="stylesheet" type="text/css" href="style.css"/>
        <?= $head ?>
	</head>
	<body>
        <?= $navbar ?>
        <?= $warn ?>

        <div class="sect cont entry">
            <div class="bgWrapper"></div>
            <h1>GangDev Site Change Log</h1>
        </div>

        <div class="sect cont two" id="overview">
            <h2>Changelog 2025.1.0</h2>

            <hr>

            <p class="desc">
                <b>ACCOUNT MANAGEMENT</b> - Added an account system, with signup, signin, signout, as well as a recovery system and account deletion system.<br>
                <b>ACCOUNT EXTRA</b> - You can customize your account with an icon, and each account session is unique.<br>
                <b></b> - <br>
                <b></b> - <br>
                <b></b> - <br>
                <b></b> - <br>
            </p>
        </div>

        <?= $footer ?>
	</body>
</html>