<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lafter — League of Legends Draft Tool</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;600;700&family=Nunito:wght@300;400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <nav>
        <div class="logo">L<span>a</span>fter</div>
        <ul>
            <li><a href="#features">Features</a></li>
            <li><a href="#how">How It Works</a></li>
            <li><a href="#data">Data Usage</a></li>
        </ul>
    </nav>

    <section class="hero">
        <h1>Draft smarter.<br>Win <span class="accent">together</span>.</h1>
        <p>Lafter connects to your League client and gives your whole team real-time draft recommendations, opponent scouting, and team comp analysis — all in the browser.</p>
        <div class="cta-group">
            <a href="#" class="btn btn-primary">Create Account</a>
            <a href="#" class="btn btn-secondary">Download Connector</a>
        </div>
    </section>

    <section class="features" id="features">
        <div class="feature">
            <div class="feature-icon">📊</div>
            <h3>Player Statistics</h3>
            <p>Connect your Riot account to see win rates, champion pools, role performance, and trends across all your linked accounts.</p>
        </div>
        <div class="feature">
            <div class="feature-icon">🔴</div>
            <h3>Live Draft Sessions</h3>
            <p>Share your champion select in real-time with teammates. They see picks, bans, and recommendations live in their browser.</p>
        </div>
        <div class="feature">
            <div class="feature-icon">🔍</div>
            <h3>Opponent Scouting</h3>
            <p>Instantly pull opponent match history, one-tricks, and win rates the moment you enter champ select.</p>
        </div>
        <div class="feature">
            <div class="feature-icon">⚖️</div>
            <h3>Team Comp Analysis</h3>
            <p>See what your team is missing — CC, tankiness, AP/AD balance, engage, peel — and get suggestions to fill the gaps.</p>
        </div>
        <div class="feature">
            <div class="feature-icon">⚔️</div>
            <h3>Clash Mode</h3>
            <p>Built for organized 5v5. Scout all 5 opponents, coordinate bans as a team, and optimize your draft order.</p>
        </div>
        <div class="feature">
            <div class="feature-icon">📈</div>
            <h3>Post-Game Stats</h3>
            <p>After the game, detailed performance breakdowns are pushed to everyone in your session. Pin your best games to your profile.</p>
        </div>
    </section>

    <section class="how-it-works" id="how">
        <h2>How It Works</h2>
        <div class="steps">
            <div class="step">
                <div class="step-number">1</div>
                <h4>Connect</h4>
                <p>Create an account and link your Riot ID. Download the lightweight Lafter Connector that sits in your system tray.</p>
            </div>
            <div class="step">
                <div class="step-number">2</div>
                <h4>Queue Up</h4>
                <p>The connector auto-detects champion select. Your session goes live and teammates join via your profile link.</p>
            </div>
            <div class="step">
                <div class="step-number">3</div>
                <h4>Draft Together</h4>
                <p>Everyone sees live picks, bans, recommendations, and opponent data in their browser. Make the right call under the timer.</p>
            </div>
        </div>
    </section>

    <section class="data-section" id="data">
        <h3>Riot API Data Usage</h3>
        <p>Lafter is a read-only analysis tool. It does not modify, automate, or interact with the League of Legends client. It retrieves publicly available match and player data to display statistics and draft recommendations.</p>
        <div class="api-badges">
            <span class="badge">Account-V1</span>
            <span class="badge">Summoner-V4</span>
            <span class="badge">Match-V5</span>
            <span class="badge">League-V4</span>
            <span class="badge">Champion-Mastery-V4</span>
            <span class="badge">Spectator-V5</span>
        </div>
    </section>

    <footer>
        <p>Lafter is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games and all associated properties are trademarks or registered trademarks of Riot Games, Inc.</p>
        <br>
        <p>&copy; 2026 Lafter &mdash; <a href="https://gangdev.co">gangdev.co</a></p>
    </footer>

    <script src="script.js"></script>
</body>
</html>
