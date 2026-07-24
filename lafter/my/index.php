<?php
require_once '/var/www/gangdev/lafter/src/php/init.php';

// If not logged in, redirect to signin
if (!lafter_logged_in()) {
	header('Location: ' . lafter_login_url('https://my.lafter.gg'));
	exit;
}

$user = lafter_user();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lafter — Account</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Indie+Flower&family=Caveat:wght@700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Nothing+You+Could+Do&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://lafter.gg/style.css">
</head>
<body>
    <nav>
        <a href="https://lafter.gg" class="logo-link"><div class="logo">L<span>a</span>fter</div></a>
        <ul>
            <li><a href="https://lafter.gg/lookup">Lookup</a></li>
            <li><a href="https://lafter.gg/live">Live</a></li>
            <li><a href="https://lafter.gg/download">Download</a></li>
            <li class="nav-user">
                <button class="user-btn" id="user-menu-btn"><?= htmlspecialchars($_SESSION['display_name']) ?></button>
                <div class="user-dropdown" id="user-dropdown">
                    <?php if ($user && $user['riot_name']): ?>
                    <span class="dropdown-riot"><?= htmlspecialchars($user['riot_name'] . '#' . $user['riot_tag']) ?></span>
                    <?php endif; ?>
                    <a href="https://my.lafter.gg" class="dropdown-item nav-active">Account</a>
                    <a href="<?= lafter_signout_url() ?>" class="dropdown-item signout">Sign Out</a>
                </div>
            </li>
        </ul>
    </nav>

    <section class="account-section">
        <h1><?= htmlspecialchars($user['display_name'] ?? $_SESSION['display_name']) ?></h1>

        <div class="account-card">
            <div class="account-row">
                <span class="account-label">Username</span>
                <span class="account-value"><?= htmlspecialchars($user['username'] ?? $_SESSION['username']) ?></span>
            </div>
            <div class="account-row">
                <span class="account-label">Email</span>
                <span class="account-value"><?= htmlspecialchars($user['email'] ?? $_SESSION['email']) ?></span>
            </div>
            <?php if ($user && $user['riot_name']): ?>
            <div class="account-row">
                <span class="account-label">Riot ID</span>
                <span class="account-value riot-value"><?= htmlspecialchars($user['riot_name'] . '#' . $user['riot_tag']) ?></span>
            </div>
            <p class="account-hint">Linked automatically by the Lafter Connector.</p>
            <?php else: ?>
            <div class="account-row">
                <span class="account-label">Riot ID</span>
                <span class="account-value unlinked">Not linked</span>
            </div>
            <p class="account-hint">Install the <a href="https://lafter.gg/download">Lafter Connector</a> to link your Riot account automatically.</p>
            <?php endif; ?>
        </div>

        <a href="<?= lafter_signout_url() ?>" class="account-signout">Sign Out</a>
    </section>

    <footer>
        <p>&copy; 2026 Lafter — <a href="https://gangdev.co">gangdev.co</a></p>
    </footer>

    <script src="https://lafter.gg/script.js"></script>
    <?php require '/var/www/gangdev/lafter/src/php/admin_footer.php'; ?>
</body>
</html>
