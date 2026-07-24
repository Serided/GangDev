<?php
require_once __DIR__ . '/../src/php/init.php';
$user = isset($_SESSION['user_id']) ? lafter_user() : null;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lafter — Download</title>
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
            <li><a href="https://live.lafter.gg/<?= htmlspecialchars($user['riot_name'] ?? $_SESSION['username']) ?>">Live</a></li>
            <li><a href="https://lafter.gg/download" class="nav-active">Download</a></li>
            <li class="nav-user">
                <button class="user-btn" id="user-menu-btn"><?= htmlspecialchars($_SESSION['display_name']) ?></button>
                <div class="user-dropdown" id="user-dropdown">
                    <?php if ($user['riot_name']): ?>
                    <span class="dropdown-riot"><?= htmlspecialchars($user['riot_name'] . '#' . $user['riot_tag']) ?></span>
                    <?php endif; ?>
                    <a href="https://my.lafter.gg" class="dropdown-item">Profile</a>
                    <a href="https://account.gangdev.co" class="dropdown-item">Account</a>
                    <a href="<?= lafter_signout_url() ?>" class="dropdown-item signout">Sign Out</a>
                </div>
            </li>
            <?php else: ?>
            <li><a href="https://lafter.gg#features">Features</a></li>
            <li><a href="https://lafter.gg#how">How It Works</a></li>
            <li><a href="<?= lafter_login_url('https://lafter.gg/download') ?>" class="nav-signin">Sign In</a></li>
            <?php endif; ?>
        </ul>
    </nav>

    <section class="download-section">
        <h1>Lafter Connector</h1>
        <p class="download-subtitle">A lightweight system tray app that reads your champion select and streams it to your team.</p>

        <div class="download-status">
            <div class="status-icon">⏳</div>
            <h2>Waiting on Production API</h2>
            <p>The Lafter Connector requires an approved production API key from Riot Games. Our application is under review.</p>
            <p class="status-detail">Once approved, the connector will be available for download here. It's a small (~5-8MB) Tauri app that sits in your system tray — no port forwarding, no Overwolf, just a clean outbound connection.</p>
        </div>

        <div class="download-features">
            <div class="dl-feature">
                <span>🔒</span>
                <p>Read-only — never writes to your League client</p>
            </div>
            <div class="dl-feature">
                <span>📡</span>
                <p>All connections outbound — no ports opened</p>
            </div>
            <div class="dl-feature">
                <span>🪶</span>
                <p>~5-8MB — lighter than a patch note</p>
            </div>
        </div>
    </section>

    <footer>
        <p>Lafter is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties.</p>
        <p>&copy; 2026 Lafter — <a href="https://gangdev.co">gangdev.co</a></p>
    </footer>

    <script src="../script.js"></script>
</body>
</html>
