<?php
require_once '/var/www/gangdev/shared/php/init.php';
require_once '/var/www/gangdev/account/php/db.php';

$userId = $_SESSION['user_id'];
$stmt = $pdo->prepare("SELECT deletion_requested_at FROM users WHERE id = ?");
$stmt->execute([$userId]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

$remainingSeconds = 0;
if ($user && $user['deletion_requested_at']) {
	$deletionTime = strtotime($user['deletion_requested_at']) + (60); // 30 days later
	$remainingSeconds = $deletionTime - time();
}
?>
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

    <div id="cropModal" style="display:none;"><div id="cropContent"></div></div>

    <h1>
        Account
    </h1>

    <?php if ($remainingSeconds > 0): ?>
        <div class="countdown">
            Your account is scheduled for deletion in
            <span id="timeRemaining"></span>.
        </div>
        <form action="delete/cancel_delete.php" method="post">
            <button type="submit" class="cancel-button">Cancel Deletion</button>
        </form>
        <script>
            // Set up countdown timer (in seconds)
            var remaining = <?php echo $remainingSeconds; ?>;
            var display = document.getElementById('timeRemaining');

            function updateCountdown() {
                if (remaining < 0) {
                    display.textContent = "0 seconds";
                    return;
                }
                var days = Math.floor(remaining / (24 * 3600));
                var hours = Math.floor((remaining % (24 * 3600)) / 3600);
                var minutes = Math.floor((remaining % 3600) / 60);
                var seconds = remaining % 60;
                display.textContent = days + "d " + hours + "h " + minutes + "m " + seconds + "s";
                remaining--;
            }
            updateCountdown();
            setInterval(updateCountdown, 1000);
        </script>
    <?php endif; ?>

    <div class="fullw sect spacing aSect">
        <section class="fullw">
            <?php if (isset($_SESSION["user_id"])): ?>
                <div class="icon">
                    <div id="iDisplay" style="background-image: url('<?= htmlspecialchars($userIconUrl) ?>');"></div>
                </div>
                <input type="file" id="iconFile" accept="image/*" style="display: none;">

                <div class="info">
                    <h2>Display Name: <b><?php echo htmlspecialchars($_SESSION['displayname']) ?></b></h2>
                    <h2>Username: <b><?php echo htmlspecialchars($_SESSION['username']) ?></b></h2>
                    <h2>Email: <b><?php echo htmlspecialchars($_SESSION['email']) ?></b></h2>
                    <h2>AND MORE TO COME...</h2>
                </div>

                <a href="delete/delete.php" class="sign">Delete Account</a>
                <a href="login/signout.php" class="sign">Sign Out</a>
            <?php else: ?>
                <a href="login/signin.php" class="sign">Sign In</a>
            <?php endif; ?>
            <p style="color: red" class="account"><b>Note: </b>In development</p>
        </section>
    </div>

    <script src="script.js"></script>

    <?= $footer ?>
    </body>
</html>
