<?php
require_once '/var/www/gangdev/lafter/src/php/init.php';

$error = $_GET['error'] ?? '';
$redirect = $_GET['redirect'] ?? '';
$currentProduct = 'lafter';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lafter — Create Account</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Indie+Flower&family=Caveat:wght@700&family=Nothing+You+Could+Do&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="login.css">
</head>
<body class="is-signup">

<div class="canvas">
    <div class="shell">

        <div class="top">
            <a class="brand" href="https://lafter.gg/">
                <div class="brand-logo">L<span class="brand-a">a</span>fter</div>
                <div class="brand-sub">account</div>
            </a>

            <?php require '/var/www/gangdev/shared/php/product_switch.php'; ?>
        </div>

        <div class="body">
            <form method="post" action="process_signup.php" autocomplete="on" class="form-pane">
                <div class="form-header">
                    <h1>Create your account</h1>
                    <p>To have a good laf.</p>
                </div>

                <div class="form-fields">
                    <div class="field">
                        <label class="label">Display Name</label>
                        <div class="input-row">
                            <input class="input" name="display_name" required autocomplete="nickname" spellcheck="false" maxlength="20">
                            <div class="hint">
                                <button class="hint-btn" type="button" aria-label="Display name info">?</button>
                                <div class="hint-pop">What others see. Your public identity on Lafter.</div>
                            </div>
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">Email</label>
                        <input class="input" type="email" name="email" required autocomplete="email">
                    </div>

                    <div class="field">
                        <label class="label">Username</label>
                        <div class="input-row">
                            <input class="input" name="username" required autocomplete="username" autocapitalize="none" spellcheck="false" pattern="[A-Za-z0-9_]{3,20}" maxlength="20">
                            <div class="hint">
                                <button class="hint-btn" type="button" aria-label="Username info">?</button>
                                <div class="hint-pop">Used only for sign-in. Keep it private and hard to guess.</div>
                            </div>
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">Password</label>
                        <div class="pw-wrap">
                            <input class="input pw" type="password" name="password" required autocomplete="new-password" id="pw-signup">
                            <button class="pw-btn" type="button" data-toggle="pw-signup">Show</button>
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">Confirm Password</label>
                        <input class="input" type="password" name="confirm_password" required autocomplete="new-password">
                    </div>
                </div>

                <input type="hidden" name="redirect" value="<?= htmlspecialchars($redirect ?: 'https://lafter.gg') ?>">

                <div class="form-actions">
                    <button class="btn primary" type="submit">Create account</button>
                    <div class="links">
                        <a href="signin.php<?= $redirect ? '?redirect=' . urlencode($redirect) : '' ?>">Already have an account?</a>
                    </div>
                </div>

                <div class="divider"><span>or</span></div>

                <a href="https://account.gangdev.co/login/signin.php?redirect=<?= urlencode($redirect ?: 'https://lafter.gg') ?>" class="btn gangdev-btn">
                    <img class="gangdev-icon" src="https://gangdev.co/src/img/favicon/new/favicon-96x96.png" alt="GangDev">
                    Sign in with GangDev
                </a>

                <?php if ($error): ?>
                <div class="error"><?= htmlspecialchars($error) ?></div>
                <?php endif; ?>
            </form>
        </div>

        <div class="footer">
            <a href="https://gangdev.co/">GangDev</a>
            <a href="https://lafter.gg/">Lafter</a>
        </div>

    </div>
</div>

<script src="login.js"></script>
</body>
</html>
