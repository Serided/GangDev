<?php
require_once '/var/www/gangdev/shared/php/init.php';

$error = '';
if (isset($_GET['error'])) {
    if ($_GET['error'] == 1) {
        $error = "All fields are required.";
    } elseif ($_GET['error'] == 2) {
        $error = "Passwords do not match.";
    } elseif ($_GET['error'] == 3) {
        $error = "An account with that email already exists.";
    } elseif ($_GET['error'] == 4) {
        $error = "An error occurred. Pleast try again.";
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
        <div class="loginContainer signup">
            <h1 class="signup">Create Account</h1>
            <hr class="signup">

            <?php if ($error): ?>
                <p style="color: red;"><?= htmlspecialchars($error) ?></p>
            <?php endif; ?>

            <form method="post" action="process_signup.php">
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
                        <input type="text" id="displayname" name="displayname" class="signup" required>
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
                        <input type="text" id="username" name="username" class="signup" required>
                    </div>
                </div>

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
                        <input type="email" id="email" name="email" class="signup" required>
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
                        <input type="password" id="password" name="password" class="signup" required>
                    </div>
                </div>

                <div>
                    <div class="labelRow">
                        <label for="confirmPassword">Confirm Password:</label>
                        <span class="tooltip">ⓘ
                            <span class="tooltipText">
                                The main thing making your data yours.
                            </span>
                        </span>
                    </div>
                    <div class="inputContainer signup">
                        <input type="password" id="confirmPassword" name="confirmPassword" class="signup" required>
                    </div>
                </div>

                <div class="centeredDiv">
                    <button type="submit" class="submit">Ya</button>
                </div>

                <div>
                    <label class="customCheckbox">
                        <input type="checkbox" id="rememberme" name="rememberme">
                        <span class="checkmark"></span>
                        <label for="rememberme" class="rememberme">Remember me</label>
                    </label><br>

                    <label class="customCheckbox">
                        <input type="checkbox" id="terms" name="terms" required>
                        <span class="checkmark"></span>
                        <label for="terms" class="terms">By proceeding, you are agreeing to our <a href="https://shared.gangdev.co/docs/tos.php" target="_blank">Terms Of Service</a>.</label>
                    </label><br>

                    <label class="customCheckbox">
                        <input type="checkbox" id="privacy" name="privacy" required>
                        <span class="checkmark"></span>
                        <label for="privacy" class="privacy">By proceeding, you are agreeing to our <a href="https://shared.gangdev.co/docs/pp.php" target="_blank">Privacy Policy</a>.</label>
                    </label><br>

                    <label class="customCheckbox">
                        <input type="checkbox" id="subscribe" name="subscribe">
                        <span class="checkmark"></span>
                        <label for="subscribe" class="subscribe">I want emails updates on company news and promotions.</label>
                    </label><br>
                </div>
            </form>
        </div>

        <script src="login.js"></script>
    </body>
</html>