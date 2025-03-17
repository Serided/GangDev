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
        <?= $navbar ?>

        <div class="loginContainer">
            <h1>Sign In</h1>
            <hr class="marginBoost">

            <?php if ($error): ?>
                <p style="color: red"><?= htmlspecialchars($error) ?></p>
            <?php endif; ?>

            <form method="post" action="process_signin.php">
                <div class="margin">
                    <label for="username">Username: </label><br>
                    <div class="inputContainer">
                        <input type="text" id="username" name="username" required><br>
                    </div>
                    <div class="forgot"><a href="../recovery/username.php">forgot username?</a></div>
                </div>

                <div>
                    <div class="labelRow">
                        <label for="password">Password:</label>
                        <span id="togglePassword" onclick="togglePassword()">[Show]</span>
                    </div>
                    <div class="inputContainer">
                        <input type="password" id="password" name="password" required>
                    </div>
                    <div class="forgot"><a href="../recovery/password.php">forgot password?</a></div>
                </div>

                <div class="centeredDiv">
                    <button type="submit" class="submit">Ya</button>
                </div>
            </form>

            <div>
                <label class="customCheckbox">
                    <input type="checkbox" id="rememberMe" name="rememberMe">
                    <span class="checkmark"></span>
                    <label for="rememberMe" class="chex">Remember me</label>
                </label><br>
            </div>

            <div class="create"><a href="signup.php"> - Create A New Account - </a></div>
        </div>

        <script src="login.js"></script>
    </body>
</html>