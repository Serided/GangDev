<?php
require_once '/var/www/gangdev/shared/php/init_candor.php';

if (!isset($_SESSION['candor_user_id'])) {
	header('Location: https://account.candor.you/login/signin.php');
	exit;
}

$name  = $_SESSION['candor_name'] ?? '';
$email = $_SESSION['candor_email'] ?? '';
$org   = $_SESSION['candor_org'] ?? '';
?>
<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Candor - Account</title>
        <link rel="icon" href="https://candor.you/files/img/favicon/favicon.ico">

        <link rel="stylesheet" href="style.css">
    </head>
    <body>

        <div class="page">

            <div class="top">
            <div class="brand">
                <div class="brandMark"><span class="logoGlyph">C</span></div>
                <div class="brandText">
                    <div class="brandTitle"><span class="brandName">Candor</span></div>
                    <div class="meta">account</div>
                </div>
            </div>

                <div class="topActions">
                    <a class="homeBtn" href="https://candor.you/">Home</a>

                    <form method="post" action="/login/signout.php">
                        <button type="submit" class="signOutBtn">Sign out</button>
                    </form>
                </div>
            </div>

            <div class="card">
                <div class="row">
                    <span class="label">Name</span>
                    <span class="value"><?= htmlspecialchars($name) ?></span>
                </div>

                <div class="row">
                    <span class="label">Email</span>
                    <span class="value"><?= htmlspecialchars($email) ?></span>
                </div>

                <div class="row">
                    <span class="label">Organization</span>
                    <span class="value"><?= htmlspecialchars($org ?: '-') ?></span>
                </div>
            </div>

        </div>

    </body>
</html>
