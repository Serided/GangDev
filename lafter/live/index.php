<?php
require_once __DIR__ . '/../src/php/init.php';
$user = lafter_logged_in() ? lafter_user() : null;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lafter — Live</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Indie+Flower&family=Caveat:wght@700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Nothing+You+Could+Do&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../style.css">
</head>
<body>
    <nav>
        <a href="https://lafter.gg" class="logo-link"><div class="logo">L<span>a</span>fter</div></a>
        <ul>
            <?php if ($user): ?>
            <li><a href="https://lafter.gg/lookup">Lookup</a></li>
            <li><a href="https://lafter.gg/live" class="nav-active">Live</a></li>
            <li><a href="https://lafter.gg/download">Download</a></li>
            <li class="nav-user">
                <button class="user-btn" id="user-menu-btn"><?= htmlspecialchars($_SESSION['display_name']) ?></button>
                <div class="user-dropdown" id="user-dropdown">
                    <?php if ($user['riot_name']): ?>
                    <span class="dropdown-riot"><?= htmlspecialchars($user['riot_name'] . '#' . $user['riot_tag']) ?></span>
                    <?php endif; ?>
                    <a href="https://my.lafter.gg" class="dropdown-item">Account</a>
                    <a href="<?= lafter_signout_url() ?>" class="dropdown-item signout">Sign Out</a>
                </div>
            </li>
            <?php else: ?>
            <li><a href="https://lafter.gg#features">Features</a></li>
            <li><a href="https://lafter.gg#how">How It Works</a></li>
            <li><a href="<?= lafter_login_url('https://lafter.gg/live') ?>" class="nav-signin">Sign In</a></li>
            <?php endif; ?>
        </ul>
    </nav>

    <?php if (lafter_can_use_api()): ?>
    <section class="gate-message">
        <h2>Live Sessions</h2>
        <p>No active sessions. Live draft viewer will appear here when the desktop connector is streaming.</p>
    </section>
    <?php else: ?>
    <section class="gate-message">
        <h2>Coming Soon</h2>
        <p><?= lafter_gate_message() ?></p>
    </section>
    <?php endif; ?>

    <footer>
        <p>Lafter is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties.</p>
        <p>&copy; 2026 Lafter — <a href="https://gangdev.co">gangdev.co</a></p>
    </footer>

    <script src="../script.js"></script>
    <?php require '/var/www/gangdev/lafter/src/php/admin_footer.php'; ?>
</body>
</html>
