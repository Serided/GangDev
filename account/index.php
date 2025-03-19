<?php
require_once '/var/www/gangdev/shared/php/init.php';

$userId = $_SESSION['user_id'] ?? null;
$remainingSeconds = 0;
if ($userId) {
	$stmt = $pdo->prepare("SELECT deletion_requested_at FROM users WHERE id = ?");
	$stmt->execute([$userId]);
	$user = $stmt->fetch(PDO::FETCH_ASSOC);

	if ($user && $user['deletion_requested_at']) {
		$deletionTime = strtotime($user['deletion_requested_at']) + (30 * 24 * 60 * 60); // 30 days later
		$remainingSeconds = $deletionTime - time();
	}
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
    <body>
        <?= $navbar ?>
        <?= $warn ?>

        <div id="cropModal" style="display:none;"><div id="cropContent"></div></div>

        <?php if ($remainingSeconds > 0): ?>
            <div class="sect altCont deleteWarning">
                <h2>
                    <i>Your account is scheduled for deletion in <b style="color: red"><span id="timeRemaining"></span></b>.</i>
                </h2>
                <form action="delete/cancel_delete.php" method="post">
                    <button type="submit" class="button cancelDelete">Stawp it :(</button>
                </form>
            </div>
        <?php endif; ?>

        <div class="sect cont account">
            <div class="shimmer">
                <div id="iDisplay" style="background-image: url('<?= htmlspecialchars($userIconUrl) ?>');"></div>
            </div>
            <input type="file" id="iconFile" accept="image/*" style="display: none;">
            <div>
                <h1 class="shimmer-txt">
                    Welcome, <b><?php echo htmlspecialchars($_SESSION['displayname']) ?></b>!
                </h1>
            </div>
        </div>

        <div class="sect cont three">
            <?php if (isset($_SESSION["user_id"])): ?>
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
        </div>


        <script src="script.js"></script>
        <?php if ($remainingSeconds > 0): ?>
            <script>
                let remainingSeconds = <?php echo $remainingSeconds; ?>;
                startCountdown(remainingSeconds, 'timeRemaining');
            </script>
        <?php endif; ?>

        <?= $footer ?>
    </body>
</html>
