<?php
require_once '/var/www/gangdev/shared/php/init.php';
$error = '';
if (isset($_GET['error'])) {
	if ($_GET['error'] == 1) {
		$error = "Username or password invalid.";
	}
}
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sign In</title>
        <link href="login.css" rel="stylesheet" >
        <?= $head ?>
    </head>
    <body>
        <div class="loginContainer">
            <h1>Sign In</h1>
            <hr class="marginBoost">

            <?php if ($error): ?>
                <p style="color: red"><?= htmlspecialchars($error) ?></p>
            <?php endif; ?>

            <form method="post" action="process_signin.php">
                <label for="username">Username: </label><br>
                <input type="text" id="username" name="username" required><br>
                <div class="forgot margin"><a href="../recovery/username.php">forgot username?</a></div>

                <label for="password">Password: </label><br>
                <div class="passwordContainer">
                    <input type="password" id="password" name="password" required><br>
                    <span class="togglePassword" onclick="togglePassword('password')">👁️</span>
                </div>
                <div class="forgot"><a href="../recovery/password.php">forgot password?</a></div>

                <button type="submit" class="submit">Ya</button>
            </form>
            <div>
                <label class="customCheckbox">
                    <input type="checkbox" id="rememberme" name="rememberme">
                    <span class="checkmark"></span>
                    <label for="rememberme" class="rememberme">Remember me</label>
                </label><br>
            </div>
            <div class="create"><a href="signup.php"> - Create A New Account - </a></div>
        </div>

        <script src="login.js"></script>
    </body>
</html>