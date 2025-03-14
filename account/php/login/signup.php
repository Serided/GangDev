<?php
if (session_status() == PHP_SESSION_NONE) session_start();
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
$head = file_get_contents("https://shared.gangdev.co/html/repetitive.html");
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
                <label for="displayname">Display Name:</label>
                <span class="tooltip">ⓘ
                    <span class="tooltipText">
                        The name other players will know you by.
                    </span>
                </span><br>
                <input type="text" id="displayname" name="displayname" class="signup" required><br><br>

                <label for="username">Username:</label>
                <span class="tooltip">ⓘ
                    <span class="tooltipText">
                        A unique identifier for you (and it helps you sign in faster).
                    </span>
                </span><br>
                <input type="text" id="username" name="username" class="signup" required><br><br>

                <label for="email">Email:</label>
                <span class="tooltip">ⓘ
                    <span class="tooltipText">
                        How we store your account.
                    </span>
                </span><br>
                <input type="email" id="email" name="email" class="signup" required><br><br>

                <label for="password">Password:</label>
                <span class="tooltip">ⓘ
                    <span class="tooltipText">
                        The main thing making your data yours.
                    </span>
                </span><br>
                <input type="password" id="password" name="password" class="signup" required><br><br>

                <label for="password">Confirm Password:</label>
                <span class="tooltip">ⓘ
                    <span class="tooltipText">
                        The main thing making your data yours.
                    </span>
                </span><br>
                <input type="password" id="confirm_password" name="confirm_password" class="signup" required>
                <div></div>

                <div></div>

                <button type="submit" class="submit signup">Ya</button>

                <div class="checkboxes">
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
    </body>
</html>