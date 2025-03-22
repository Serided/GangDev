<?php
require_once '/var/www/gangdev/shared/php/init.php';
$error = '';
if (isset($_GET['error'])) {
    if ($_GET['error'] == 1) {
        $error = "All fields are required.";
    } elseif ($_GET['error'] == 2) {
	    $error = "Emails do not match.";
    } elseif ($_GET['error'] == 3) {
        $error = "Passwords do not match.";
    } elseif ($_GET['error'] == 4) {
        $error = "An account with that email already exists.";
    } elseif ($_GET['error'] == 5) {
	    $error = "An account with that display name already exists.";
    } elseif ($_GET['error'] == 6) {
        $error = "An error occurred. Please try again.";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sign Up</title>
        <link href="login.css" rel="stylesheet" >
        <?= $head ?>
    </head>
    <body>
        <?= $navbar ?>
        <div class="bgWrapper"></div>

        <div class="loginContainer signup">
            <h1 class="signup">Create Account</h1>
            <hr class="signup">

            <?php if ($error): ?>
                <p style="color: red;"><?= htmlspecialchars($error) ?></p>
            <?php endif; ?>

            <form method="post" action="process_signup.php">
                <div class="doubleRow">
                    <div class="margin">
                        <div class="labelRow">
                            <label for="displayname">Display Name:</label>
                            <span class="tooltip">ⓘ
                                <span class="tooltipText">
                                    The name other players will know you by.
                                </span>
                            </span>
                        </div>
                        <div class="inputContainer signup">
                            <input type="text" id="displayname" name="displayname" required>
                        </div>
                    </div>

                    <div class="margin">
                        <div class="labelRow">
                            <label for="username">Username:</label>
                            <span class="tooltip">ⓘ
                                <span class="tooltipText">
                                    A unique identifier for you (and it helps you sign in faster).
                                </span>
                            </span>
                        </div>
                        <div class="inputContainer signup">
                            <input type="text" id="username" name="username" required>
                        </div>
                    </div>
                </div>

                <div class="doubleRow">
                    <div class="margin">
                        <div class="labelRow">
                            <label for="email">Email:</label>
                            <span class="tooltip">ⓘ
                                <span class="tooltipText">
                                    How we store your account.
                                </span>
                            </span>
                        </div>
                        <div class="inputContainer signup">
                            <input type="email" id="email" name="email" required>
                        </div>
                    </div>
                    <div class="margin">
                        <div class="labelRow">
                            <label for="password">Password:</label>
                            <span id="togglePassword" onclick="togglePassword()">[Show]</span>
                            <span class="tooltip">ⓘ
                                <span class="tooltipText">
                                    The main thing making your data yours.
                                </span>
                            </span>
                        </div>
                        <div class="inputContainer signup">
                            <input type="password" id="password" name="password" required>
                        </div>
                    </div>
                </div>

                <div class="doubleRow">
                    <div class="margin">
                        <div class="labelRow">
                            <label for="confirmEmail">Confirm Email:</label>
                        </div>
                        <div class="inputContainer signup">
                            <input type="email" id="confirmEmail" name="confirmEmail" required>
                        </div>
                    </div>
                    <div class="margin">
                        <div class="labelRow">
                            <label for="confirmPassword">Confirm Password:</label>
                        </div>
                        <div class="inputContainer signup">
                            <input type="password" id="confirmPassword" name="confirmPassword" required>
                        </div>
                    </div>
                </div>

                <div class="centeredDiv">
                    <button type="submit" class="submit signup">Ya</button>
                </div>

                <div class="centeredDiv">
                    <div>
                        <label class="customCheckbox">
                            <input type="checkbox" id="terms" name="terms" required>
                            <span class="checkmark"></span>
                            <label for="terms" class="chex">By proceeding, you are agreeing to our <a href="https://shared.gangdev.co/docs/tos.php" target="_blank">Terms Of Service</a>.</label>
                        </label><br>

                        <label class="customCheckbox">
                            <input type="checkbox" id="privacy" name="privacy" required>
                            <span class="checkmark"></span>
                            <label for="privacy" class="chex">By proceeding, you are agreeing to our <a href="https://shared.gangdev.co/docs/pp.php" target="_blank">Privacy Policy</a>.</label>
                        </label><br>

                        <label class="customCheckbox">
                            <input type="checkbox" id="subscribe" name="subscribe">
                            <span class="checkmark"></span>
                            <label for="subscribe" class="chex">I want emails updates on company news and promotions.</label>
                        </label><br>
                    </div>
                </div>

                <div class="create centeredDiv"><a href="signin.php"> - Sign In - </a></div>
            </form>
        </div>

        <script src="login.js"></script>
        <script src="https://shared.gangdev.co/js/script.js"></script>
    </body>
</html>