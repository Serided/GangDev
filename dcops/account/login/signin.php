<?php
require_once '/var/www/gangdev/shared/php/init_dcops.php';

$error = $_GET['error'] ?? '';
$ok = $_GET['ok'] ?? '';
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>DCOPS - Sign in</title>

    <link rel="stylesheet" href="/login/login.css">
    <script src="/login/login.js" defer></script>
</head>
<body>

<div class="canvas">
    <div class="shell">

        <div class="top">
            <div class="brand">
                <div class="brandMark"><span class="dc">DC</span><span class="ops">OPS</span></div>
                <div class="meta">account</div>
            </div>

            <div class="productSwitch">
                <button class="switchBtn" type="button">other sign-ins</button>
                <div class="pop">
                    <a href="https://account.gangdev.co/login/signin.php"><span>GangDev</span><span class="badge">main</span></a>
                    <a href="https://account.candor.you/login/signin.php"><span>Candor</span><span class="badge">product</span></a>
                </div>
            </div>
        </div>

        <div class="body">
            <h1>Sign in</h1>
            <p>Secure sign-in. Verification may be required.</p>

            <form method="post" action="/login/process_signin.php" autocomplete="on">
                <div class="grid" style="grid-template-columns: 1fr;">
                    <div class="field">
                        <div class="label">Email</div>
                        <input class="input" name="email" required autocomplete="email" inputmode="email">
                    </div>

                    <div class="field">
                        <div class="label">Password</div>
                        <div class="pwWrap">
                            <input class="input pw" type="password" name="password" required autocomplete="current-password" id="pwLogin">
                            <button class="pwBtn" type="button" data-toggle-password="#pwLogin">show</button>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <button class="btn primary" type="submit">Continue</button>
                    <div class="links">
                        <a href="/login/signup.php">Create account</a>
                    </div>
                </div>

                <?php if ($error !== ''): ?>
                    <div class="error"><?= htmlspecialchars($error) ?></div>
                <?php endif; ?>

                <?php if ($ok !== ''): ?>
                    <div class="ok"><?= htmlspecialchars($ok) ?></div>
                <?php endif; ?>
            </form>
        </div>

        <div class="footer">
            <a class="footLink" href="https://gangdev.co/"><span class="footStrong">GangDev</span></a>
            <a class="footLink" href="https://dcops.co/"><span class="footStrong">DCOPS</span></a>
        </div>

    </div>
</div>

</body>
</html>
