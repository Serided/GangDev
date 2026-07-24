<?php
require_once __DIR__ . '/../src/php/init.php';
$user = lafter_logged_in() ? lafter_user() : null;
$can_use = lafter_can_use_api();
$is_admin = lafter_is_admin();
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
            <li><a href="https://lafter.gg/live">Live</a></li>
            <li><a href="https://lafter.gg/download" class="nav-active">Download</a></li>
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
            <li><a href="<?= lafter_login_url('https://lafter.gg/download') ?>" class="nav-signin">Sign In</a></li>
            <?php endif; ?>
        </ul>
    </nav>

    <?php if (!$can_use): ?>
    <!-- Gate: non-admin during private mode -->
    <section class="gate-message">
        <h2>Coming Soon</h2>
        <p><?= lafter_gate_message() ?></p>
    </section>

    <?php else: ?>
    <!-- Full download page -->
    <section class="download-section">
        <h1>Lafter Connector</h1>
        <p class="download-subtitle">A lightweight system tray app that reads your champion select and streams it to your team.</p>

        <div class="download-how">
            <h2>How it works</h2>
            <div class="download-steps">
                <div class="dl-step">
                    <span class="step-num">1</span>
                    <p>Install the connector and sign in with your Lafter account.</p>
                </div>
                <div class="dl-step">
                    <span class="step-num">2</span>
                    <p>It sits in your system tray and detects when you enter champ select.</p>
                </div>
                <div class="dl-step">
                    <span class="step-num">3</span>
                    <p>Your picks, bans, and team comp stream live to your Lafter session — teammates see everything in real time.</p>
                </div>
            </div>
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
                <p>~5MB — lighter than a patch note</p>
            </div>
            <div class="dl-feature">
                <span>🔄</span>
                <p>Auto-updates — never uninstall, it handles itself</p>
            </div>
        </div>

        <div class="download-status">
            <?php if ($is_admin): ?>
            <div class="status-icon">🛠️</div>
            <h2>Testing Locally</h2>
            <p>Running via <code>cargo tauri dev</code> on your machine. No download needed during development.</p>
            <p class="status-detail">The auto-updater will pull from <code>lafter.gg/api/update.json</code> once builds are published. For now, the app hot-reloads on save.</p>
            <?php else: ?>
            <div class="status-icon">⏳</div>
            <h2>Coming Soon</h2>
            <p>The Lafter Connector is in active development. It'll be available for download here once it's ready.</p>
            <p class="status-detail">You'll get a small installer — run it once, and it keeps itself updated automatically. No manual re-downloads.</p>
            <?php endif; ?>
        </div>

        <div class="download-tech">
            <h3>Under the hood</h3>
            <ul>
                <li>Built with <a href="https://tauri.app" target="_blank">Tauri</a> — Rust backend, web frontend</li>
                <li>Reads the League Client (LCU) API on localhost</li>
                <li>Streams champ select state to <code>lafter.gg</code> via WebSocket</li>
                <li>Auto-links your Riot account to your Lafter profile on first connection</li>
            </ul>
        </div>
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
