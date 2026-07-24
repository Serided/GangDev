<?php
require_once __DIR__ . '/src/php/init.php';

$user = null;
if (isset($_SESSION['user_id'])) {
	$user = lafter_ensure_user(); // auto-creates lafter row on first visit
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lafter</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Indie+Flower&family=Caveat:wght@700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Kaushan+Script&family=Nothing+You+Could+Do&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
    <?php if ($user && $user['role'] === 'admin'): ?>
    <link rel="stylesheet" href="src/css/admin-overlay.css">
    <?php endif; ?>
</head>
<body>
    <nav>
        <a href="https://lafter.gg" class="logo-link"><div class="logo">L<span>a</span>fter</div></a>
        <ul>
            <?php if ($user): ?>
            <li><a href="https://lafter.gg/lookup">Lookup</a></li>
            <li><a href="https://live.lafter.gg/<?= htmlspecialchars($user['riot_name'] ?? $_SESSION['username']) ?>">Live</a></li>
            <li><a href="https://lafter.gg/download">Download</a></li>
            <li class="nav-user">
                <button class="user-btn" id="user-menu-btn"><?= htmlspecialchars($_SESSION['display_name']) ?></button>
                <div class="user-dropdown" id="user-dropdown">
                    <?php if ($user['riot_name']): ?>
                    <span class="dropdown-riot"><?= htmlspecialchars($user['riot_name'] . '#' . $user['riot_tag']) ?></span>
                    <?php else: ?>
                    <a href="https://my.lafter.gg/link" class="dropdown-item">Link Riot ID</a>
                    <?php endif; ?>
                    <a href="https://my.lafter.gg" class="dropdown-item">Profile</a>
                    <a href="https://account.gangdev.co" class="dropdown-item">Account</a>
                    <a href="<?= lafter_signout_url() ?>" class="dropdown-item signout">Sign Out</a>
                </div>
            </li>
            <?php else: ?>
            <li><a href="#features">Features</a></li>
            <li><a href="#how">How It Works</a></li>
            <li><a href="#data">Data</a></li>
            <li><a href="<?= lafter_login_url('https://lafter.gg') ?>" class="nav-signin">Sign In</a></li>
            <?php endif; ?>
        </ul>
    </nav>

    <section class="hero">
        <h1>Draft like it's a <span class="accent">joke.</span></h1>
        <p>Live opponent scouting, team comp scoring, and draft recommendations — shared with your team the moment champ select starts.</p>
        <div class="cta-group">
            <?php if ($user): ?>
            <a href="https://lafter.gg/lookup" class="btn btn-primary">Lookup a Player</a>
            <a href="https://lafter.gg/download" class="btn btn-secondary">Get the Connector</a>
            <?php else: ?>
            <a href="<?= lafter_login_url('https://lafter.gg') ?>" class="btn btn-primary">Get Started</a>
            <a href="#how" class="btn btn-secondary">Learn More</a>
            <?php endif; ?>
        </div>
    </section>

    <section class="features" id="features">
        <div class="feature">
            <div class="feature-icon">📊</div>
            <h3>Statistics</h3>
            <p>Win rates, champion pools, role performance, and trends across all your linked accounts.</p>
        </div>
        <div class="feature">
            <div class="feature-icon">🔴</div>
            <h3>Live Sessions</h3>
            <p>Share champion select in real-time. Teammates see picks, bans, and recommendations live.</p>
        </div>
        <div class="feature">
            <div class="feature-icon">🔍</div>
            <h3>Scouting</h3>
            <p>Opponent match history, one-tricks, and win rates pulled the moment you enter champ select.</p>
        </div>
        <div class="feature">
            <div class="feature-icon">⚖️</div>
            <h3>Composition</h3>
            <p>CC, tankiness, AP/AD balance, engage, peel — see what's missing and fill the gaps.</p>
        </div>
        <div class="feature">
            <div class="feature-icon">⚔️</div>
            <h3>Clash</h3>
            <p>Scout all 5 opponents, coordinate bans, and optimize draft order for organized 5v5.</p>
        </div>
        <div class="feature">
            <div class="feature-icon">📈</div>
            <h3>Post-Game</h3>
            <p>Detailed performance breakdowns pushed to your entire session. Pin your best games.</p>
        </div>
    </section>

    <section class="how-it-works" id="how">
        <h2>How It Works</h2>
        <div class="steps">
            <div class="step">
                <div class="step-number">1</div>
                <h4>Connect</h4>
                <p>Link your Riot ID. Grab the connector — sits in your system tray, detects League on its own.</p>
            </div>
            <div class="step-line"></div>
            <div class="step">
                <div class="step-number">2</div>
                <h4>Queue</h4>
                <p>Hit champ select. Session goes live automatically. Teammates join from your profile.</p>
            </div>
            <div class="step-line"></div>
            <div class="step">
                <div class="step-number">3</div>
                <h4>Draft</h4>
                <p>Live picks, bans, opponent data, recommendations. Everyone on the same page. Every game.</p>
            </div>
        </div>
    </section>

    <section class="data-section" id="data">
        <h3>Data Usage</h3>
        <p>Read-only. Doesn't touch your client. Just reads public match data and displays it.</p>
        <div class="api-badges">
            <span class="badge" data-info="Resolves Riot IDs to unique player identifiers (PUUID) for account lookup.">Account-V1</span>
            <span class="badge" data-info="Retrieves summoner profile data — level, profile icon, account age.">Summoner-V4</span>
            <span class="badge" data-info="Full match history — every player's builds, damage, gold, KDA, timeline events.">Match-V5</span>
            <span class="badge" data-info="Ranked tier, LP, win/loss record, league placement.">League-V4</span>
            <span class="badge" data-info="Mastery points and level per champion — shows what a player mains.">Champion-Mastery-V4</span>
            <span class="badge" data-info="Looks up any player's active game — champions, runes, summoner spells in real-time.">Spectator-V5</span>
            <span class="badge" data-info="Clash tournament data — team rosters, schedules, bracket info.">Clash-V1</span>
            <span class="badge" data-info="Current free champion rotation — what's available to play this week.">Champion-V3</span>
            <span class="badge" data-info="Server status and incidents — shows when League is down or having issues.">Status-V4</span>
        </div>
        <div class="badge-info" id="badge-info"></div>
    </section>

    <?php if (!$user): ?>
    <section class="status-section">
        <p class="status-line">⏳ Waiting on production API approval from Riot Games.</p>
    </section>
    <?php endif; ?>
    <footer>
        <p>Lafter is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games and all associated properties are trademarks or registered trademarks of Riot Games, Inc.</p>
        <p>&copy; 2026 Lafter — <a href="https://gangdev.co">gangdev.co</a></p>
    </footer>

    <script src="script.js"></script>
    <?php if ($user && $user['role'] === 'admin'): ?>
    <script>const LAFTER_USER = { role: '<?= $user['role'] ?>' };</script>
    <script src="src/js/admin-overlay.js" defer></script>
    <?php endif; ?>
</body>
</html>
