<?php
require_once '/var/www/gangdev/shared/php/init_dcops.php';

$error = $_GET['error'] ?? '';
$ok = $_GET['ok'] ?? '';
$t = $_GET['t'] ?? '';

$prefill = [
        'real_name' => '',
        'email' => '',
];

if ($t !== '') {
    $stmt = $pdo->prepare("SELECT real_name, email FROM dcops.signup_transfers WHERE token = ? AND expires_at > NOW()");
    $stmt->execute([$t]);
    $row = $stmt->fetch();
    if ($row) {
        $prefill['real_name'] = $row['real_name'] ?? '';
        $prefill['email'] = $row['email'] ?? '';
    }
}
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>DCOPS — Create account</title>
    <link rel="stylesheet" href="auth.css">
    <script src="auth.js" defer></script>
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
                    <a href="/login/signin.php"><span>DCOPS</span><span class="badge">here</span></a>
                </div>
            </div>
        </div>

        <div class="body">
            <h1 class="h1">Create your DCOPS account</h1>
            <p class="p">Company email required. Verification is mandatory.</p>

            <form method="post" action="process_signup.php" autocomplete="on">
                <input type="hidden" name="t" value="<?= htmlspecialchars($t) ?>">

                <div class="grid">
                    <div class="field" style="grid-column: 1 / -1;">
                        <div class="label">Real name</div>
                        <input class="input" name="real_name" value="<?= htmlspecialchars($prefill['real_name']) ?>" required autocomplete="name">
                    </div>

                    <div class="field" style="grid-column: 1 / -1;">
                        <div class="label">Company email</div>
                        <input class="input" name="email" value="<?= htmlspecialchars($prefill['email']) ?>" required autocomplete="email" inputmode="email" data-company-email>
                        <div class="note" data-company-note></div>
                    </div>

                    <div class="field">
                        <div class="label">Password</div>
                        <input class="input" type="password" name="password" required autocomplete="new-password">
                    </div>

                    <div class="field">
                        <div class="label">Confirm password</div>
                        <input class="input" type="password" name="confirm_password" required autocomplete="new-password">
                    </div>
                </div>

                <div class="row">
                    <button class="btn primary" type="submit">Create account</button>
                    <div class="links">
                        <a href="/login/signin.php">Sign in</a>
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
            <span>Sent via GangDev</span>
            <span>for DCOPS</span>
        </div>
    </div>
</div>
</body>
</html>
