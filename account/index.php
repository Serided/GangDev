<?php require_once '/var/www/gangdev/shared/php/init.php'; ?>
<!DOCTYPE html>
<html lang="en" class="fullw">
    <head>
        <meta charset="UTF-8" name="description" content="Home">
        <title>Account</title>
        <link rel="stylesheet" href="style.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.css" crossorigin="anonymous" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.js"></script>
        <?= $head ?>
    </head>
    <body class="main-p fullw">
    <?= $navbar ?>

    <div id="cropModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.7); z-index:1000; align-items:center; justify-content:center;">
        <div id="cropContent" style="background:#fff; padding:20px; border-radius:5px; text-align:center;"></div>
    </div>

    <h1>
        Account
    </h1>

    <div class="fullw sect aSect">
        <section class="fullw">
            <?php if (isset($_SESSION["user_id"])): ?>
                <div class="icon">
                    <div id="iDisplay"></div>
                </div>
                <input type="file" id="iconFile" accept="image/*" style="display: none;">

                <div class="info">
                    <h2>Display Name: <b><?php echo htmlspecialchars($_SESSION['displayname']) ?></b></h2>
                    <h2>Username: <b><?php echo htmlspecialchars($_SESSION['username']) ?></b></h2>
                    <h2>Email: <b><?php echo htmlspecialchars($_SESSION['email']) ?></b></h2>
                    <h2>AND MORE TO COME...</h2>
                </div>

                <a href="php/login/signout.php" class="sign">Sign Out</a>
            <?php else: ?>
                <a href="php/login/signin.php" class="sign">Sign In</a>
            <?php endif; ?>
            <p style="color: red" class="account"><b>Note: </b>In development</p>
        </section>
    </div>

    <script src="script.js"></script>

    <?= $footer ?>
    </body>
</html>
