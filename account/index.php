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

$warningMessage = "";
if(isset($_GET['status'])) {
	$status = $_GET['status'];
	switch($status) {
		case 'toofast':
			$warningMessage = "Please wait a few seconds before making another change.";
			break;
		case 'empty':
			$warningMessage = "All fields must be filled.";
			break;
		case 'nochange':
			$warningMessage = "No changes were made.";
			break;
        case 'emailexists':
            $warningMessage = "The email address is already in use.";
            break;
		case 'error':
			$warningMessage = "An error occurred while updating your information.";
			break;
		case 'success':
			$warningMessage = "Your information was updated successfully.";
			break;
		default:
			$warningMessage = "";
	}
}
?>
<!DOCTYPE html>
<html lang="en">
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

        <div class="sect cont entry">
            <div class="bgWrapper"></div>
            <?php if (isset($_SESSION["user_id"])): ?>
            <div class="shimmer" id="iDisplay">
                <div style="background-image: url('<?= htmlspecialchars($userIconUrl) ?>');" id="icon"></div>
            </div>
            <input type="file" id="iconFile" accept="image/*" style="display: none;">
            <div>
                <h1 class="shimmerText">
                    Welcome, <b><?php echo htmlspecialchars($_SESSION['displayname']) ?></b>!
                </h1>
            </div>
            <?php else: ?>
            <div class="shimmer">
                <div class="icon"></div>
            </div>
            <div>
                <h1 class="shimmerText">
                    ^<br>this could b u
                </h1>
            </div>
            <?php endif; ?>
        </div>

        <div class="sect cont two">
            <?php if (isset($_SESSION["user_id"])): ?>
            <div class="accountNav">
                <input type="radio" id="pInfo" name="sections" checked>
                <label for="pInfo">Personal Info</label>

                <input type="radio" id="aSecurity" name="sections">
                <label for="aSecurity">Account Security</label>

                <input type="radio" id="customization" name="sections">
                <label for="customization">Customization</label>

                <input type="radio" id="preferences" name="sections">
                <label for="preferences">Preferences</label>

                <input type="radio" id="billing" name="sections">
                <label for="billing">Billing</label>
            </div>
            <div class="accountCont">
                <div class="accountInfo" id="sectpInfo">
	                <?php if (!empty($warningMessage)): ?>
                      <div class="statusMessage">
                          <p><?php echo $warningMessage; ?></p>
                      </div>
	                <?php endif; ?>
                    <form id="changeForm" action="php/process_change.php" method="post">
                        <label for="displayname">Display Name:</label>
                        <input type="text" name="displayname" id="displayname" value="<?php echo htmlspecialchars($_SESSION['displayname']); ?>" required>
                        <label for="email">Email:</label>
                        <input type="email" name="email" id="email" value="<?php echo htmlspecialchars($_SESSION['email']); ?>" required>
                    </form>
                </div>
                <div class="accountInfo" id="sectaSecurity">
                    <h2>Username: <b><?php echo htmlspecialchars($_SESSION['username']) ?></b></h2>
                    <h2>Password: <b>NOT SETUP</b></h2>
                    <button onclick="window.location.href='delete/delete.php'" class="delete">Delete Account</button>
                </div>
                <div class="accountInfo" id="sectcustomization">
                    customization
                </div>
                <div class="accountInfo" id="sectpreferences">
                    preferences
                </div>
                <div class="accountInfo" id="sectbilling">
                    billing
                </div>
            </div>

            <button onclick="window.location.href='login/signout.php'" class="signout">Sign Out</button>
            <?php else: ?>
            <a href="login/signin.php" class="signin">Sign In</a>
            <?php endif; ?>
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
