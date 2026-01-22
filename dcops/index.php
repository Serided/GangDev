<?php
require_once '/var/www/gangdev/shared/php/init_dcops.php';

$u = null;

if (!empty($_SESSION['dcops_user_id'])) {
    $u = [
            'real_name' => $_SESSION['dcops_real_name'] ?? null,
    ];
}

$btnText = ($u && !empty($u['real_name'])) ? $u['real_name'] : 'Sign in';
$btnHref = ($u && !empty($u['real_name'])) ? 'https://account.dcops.co/' : 'https://account.dcops.co/login/signin.php';
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>DCOPS</title>

    <link rel="stylesheet" href="style.css">
    <script src="script.js" defer></script>
</head>
<body>

<div class="canvas">

    <div class="edge edge-top">
        <span>dcops</span>
        <span class="muted">root</span>
    </div>

    <div class="edge edge-bottom">
        <span class="muted">built by</span>
        <span class="credit">GangDev</span>
    </div>

    <div class="edge edge-left muted">system</div>
    <div class="edge edge-right muted">idle</div>

    <div class="center">
        <div class="mark">
            <span class="corner tl"></span>
            <span class="corner br"></span>

            <div class="logo">
            <span class="name">
                <span class="dc">DC</span><span class="ops">OPS</span>
            </span>
            </div>
        </div>

        <div class="sub">awaiting definition</div>

        <a class="authBtn" href="<?= htmlspecialchars($btnHref) ?>">
            <?= htmlspecialchars($btnText) ?>
        </a>
    </div>

</div>

</body>
</html>
