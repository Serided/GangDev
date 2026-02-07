<?php
require_once '/var/www/gangdev/shared/php/init_candor.php';

if (!isset($_SESSION['candor_user_id'])) {
	header('Location: https://account.candor.you/login/signin.php');
	exit;
}

$name  = $_SESSION['candor_name'] ?? '';
$email = $_SESSION['candor_email'] ?? '';
?>
<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Candor - Account</title>
        <link rel="icon" href="/favicon.ico?v=2" type="image/x-icon">
        <link rel="shortcut icon" href="/favicon.ico?v=2" type="image/x-icon">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png?v=2">
        <link rel="icon" type="image/png" sizes="64x64" href="/favicon-64.png?v=2">
        <link rel="icon" type="image/png" sizes="128x128" href="/favicon-128.png?v=2">

        <link rel="stylesheet" href="style.css">
    </head>
    <body>

        <div class="page">

            <div class="top">
            <a class="brand brandLink" href="https://candor.you/">
                <div class="brandMark"><span class="logoGlyph">C</span></div>
                <div class="brandText">
                    <div class="brandTitle"><span class="brandName">Candor</span></div>
                    <div class="meta">account</div>
                </div>
            </a>

                <div class="topActions">
                    <span class="welcome">Welcome, <a class="accountLink" href="https://account.candor.you/"><?= htmlspecialchars($name !== '' ? $name : $email) ?></a></span>
                    <a class="btn primary" href="https://do.candor.you/">My OS</a>
                    <form method="post" action="/login/signout.php">
                        <button type="submit" class="btn accent">Sign out</button>
                    </form>
                </div>
            </div>

            <section class="accountLayout">
                <div class="card heroCard">
                    <div class="tag">Account</div>
                    <h1>Keep your access clean.</h1>
                    <p>Manage your account details and sign-in settings for your personal OS.</p>
                </div>

                <div class="card detailsCard">
                    <div class="row">
                        <span class="label">Name</span>
                        <span class="value"><?= htmlspecialchars($name) ?></span>
                    </div>

                    <div class="row">
                        <span class="label">Email</span>
                        <span class="value"><?= htmlspecialchars($email) ?></span>
                    </div>
                </div>
            </section>

        </div>

    </body>
</html>
