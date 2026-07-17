<?php require_once '/var/www/gangdev/main/src/php/init.php'; ?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Updates</title>
    <link rel="stylesheet" href="style.css">
    <script defer src="script.js"></script>
    <?= $head ?>
</head>
<body>
<?= $navbar ?>
<?= $warn ?>

<div class="updatesShell">

    <!-- SLIDE: v0.2.0 (CURRENT) -->
    <div class="slide active" data-version="0.2.0">
        <header class="slideHeader">
            <span class="version">v0.2.0</span>
            <span class="versionState current">Current</span>
            <span class="timestamp">2026-07-17 — 13:34</span>
        </header>

        <h1 class="slideTitle">Unified Identity + Multi-Product Auth</h1>
        <p class="slideLead">One account across everything. Central schema, cross-product sign-in, and a full infrastructure overhaul.</p>

        <!-- GANGDEV -->
        <section class="productBlock theme-gangdev" data-href="https://gangdev.co">
            <div class="productBanner">
                <img class="productIcon" src="https://gangdev.co/src/img/favicon/new/favicon-96x96.png" alt="">
                <span class="productName">GangDev</span>
                <span class="productTag">platform</span>
            </div>
            <ul class="changeList">
                <li><span class="tag feat">Feature</span> Sign in with GangDev — secure auth-code exchange across all products</li>
                <li><span class="tag infra">Infra</span> Central <code>gangdev</code> PostgreSQL schema for identity (users, sessions, remember_tokens, password_resets, pending_users, auth_codes)</li>
                <li><span class="tag infra">Infra</span> Full project restructure — <code>main/</code>, per-product roots, <code>shared/</code> strictly cross-product</li>
                <li><span class="tag fix">Security</span> .env blocked, credentials rotated, .htaccess hardened, directory listing disabled</li>
                <li><span class="tag feat">Feature</span> Contact form status banners (site-wide, auto-dismiss)</li>
                <li><span class="tag feat">Feature</span> Updates page rework</li>
            </ul>
        </section>

        <!-- CRUST -->
        <section class="productBlock theme-crust" data-href="https://crust.gangdev.co/game1">
            <div class="crustMapBg"></div>
            <div class="productBanner">
                <span class="productName">CRUST</span>
                <span class="productTag">game engine</span>
            </div>
            <ul class="changeList">
                <li><span class="tag fix">Fix</span> WebSocket connection — missing .js extensions on ES module imports</li>
                <li><span class="tag infra">Infra</span> package.json + npm scripts (gateway, game1, game2, map generation)</li>
                <li><span class="tag infra">Infra</span> Node v22 LTS upgrade, PM2 restart, map regeneration</li>
                <li><span class="tag fix">Fix</span> All server paths updated for new folder structure</li>
            </ul>
        </section>

        <!-- CANDOR -->
        <section class="productBlock theme-candor" data-href="https://candor.you">
            <div class="productBanner">
                <img class="productIcon" src="https://candor.you/src/img/logo/candor-mark.png?v=13" alt="">
                <span class="productName">Candor</span>
                <span class="productTag">personal OS</span>
            </div>
            <ul class="changeList">
                <li><span class="tag feat">Feature</span> Sign in with GangDev on login + signup pages</li>
                <li><span class="tag infra">Infra</span> Init refactor — init_base.php, absolute asset URLs for subdomains</li>
                <li><span class="tag feat">Feature</span> Removed confirm email from signup (streamlined)</li>
            </ul>
        </section>

        <!-- DCOPS -->
        <section class="productBlock theme-dcops" data-href="https://dcops.co">
            <div class="productBanner">
                <span class="productName"><span class="dc">DC</span><span class="ops">OPS</span></span>
                <span class="productTag">operations</span>
            </div>
            <ul class="changeList">
                <li><span class="tag feat">Feature</span> Sign in with GangDev on login + signup pages</li>
                <li><span class="tag infra">Infra</span> Init refactor + shared base integration</li>
            </ul>
        </section>

        <!-- LAFTER -->
        <section class="productBlock theme-lafter" data-href="https://lafter.gg">
            <div class="productBanner">
                <span class="productName">L<span class="brandLafterA">a</span>fter</span>
                <span class="productTag">drafting tool</span>
            </div>
            <ul class="changeList">
                <li><span class="tag feat">Feature</span> Added to navbar — Products tab with Indie Flower branding</li>
                <li><span class="tag feat">Feature</span> Listed on gangdev.co home page Products section</li>
            </ul>
        </section>

        <!-- INSPECTRE -->
        <section class="productBlock theme-inspectre" data-href="https://inspectre.link">
            <div class="productBanner">
                <img class="productIcon" src="https://inspectre.link/src/inspectre-extension/icons/ghost.png" alt="">
                <span class="productName">inspectre</span>
                <span class="productTag">inspector</span>
            </div>
            <ul class="changeList">
                <li><span class="tag infra">Infra</span> Migrated from <code>f12/</code> to standalone <code>inspectre/</code> project</li>
            </ul>
        </section>
    </div>

    <!-- SLIDE: v0.1.0 -->
    <div class="slide" data-version="0.1.0">
        <header class="slideHeader">
            <span class="version">v0.1.0</span>
            <span class="versionState past">Previous</span>
            <span class="timestamp">2026-06-20 — 00:00</span>
        </header>

        <h1 class="slideTitle">Foundation</h1>
        <p class="slideLead">Initial site launch. Flat folder structure, basic auth, individual product pages.</p>

        <section class="productBlock theme-gangdev" data-href="https://gangdev.co">
            <div class="productBanner">
                <img class="productIcon" src="https://gangdev.co/src/img/favicon/new/favicon-96x96.png" alt="">
                <span class="productName">GangDev</span>
                <span class="productTag">platform</span>
            </div>
            <ul class="changeList">
                <li><span class="tag feat">Feature</span> Landing page with animated backgrounds and section carousel</li>
                <li><span class="tag feat">Feature</span> Account system — signup, signin, email verification, password reset</li>
                <li><span class="tag feat">Feature</span> User profiles with icon upload + cropper</li>
                <li><span class="tag feat">Feature</span> Hamburger nav with sidebar and product links</li>
                <li><span class="tag infra">Infra</span> Apache2 + PHP + PostgreSQL on Vultr VPS</li>
                <li><span class="tag infra">Infra</span> PHPMailer integration via Namecheap Private Email</li>
                <li><span class="tag infra">Infra</span> SSL via Let's Encrypt for all subdomains</li>
            </ul>
        </section>

        <section class="productBlock theme-crust" data-href="https://crust.gangdev.co/game1">
            <div class="crustMapBg"></div>
            <div class="productBanner">
                <span class="productName">CRUST</span>
                <span class="productTag">game engine</span>
            </div>
            <ul class="changeList">
                <li><span class="tag feat">Feature</span> Multiplayer WebSocket engine — gateway + game server architecture</li>
                <li><span class="tag feat">Feature</span> JWT auth flow (PHP → client → gateway → game server)</li>
                <li><span class="tag feat">Feature</span> Perlin noise terrain generation (water, sand, grass, forest, mountain)</li>
                <li><span class="tag feat">Feature</span> Two game instances (game1, game2) on separate ports</li>
            </ul>
        </section>

        <section class="productBlock theme-candor" data-href="https://candor.you">
            <div class="productBanner">
                <img class="productIcon" src="https://candor.you/src/img/logo/candor-mark.png?v=13" alt="">
                <span class="productName">Candor</span>
                <span class="productTag">personal OS</span>
            </div>
            <ul class="changeList">
                <li><span class="tag feat">Feature</span> Separate user system with email verification</li>
                <li><span class="tag feat">Feature</span> Do dashboard scaffold (tasks, notes, planner)</li>
                <li><span class="tag feat">Feature</span> Profile onboarding (birthday, health consent, unit system)</li>
            </ul>
        </section>

        <section class="productBlock theme-dcops" data-href="https://dcops.co">
            <div class="productBanner">
                <span class="productName"><span class="dc">DC</span><span class="ops">OPS</span></span>
                <span class="productTag">operations</span>
            </div>
            <ul class="changeList">
                <li><span class="tag feat">Feature</span> Separate user system with OTP verification</li>
                <li><span class="tag feat">Feature</span> Organization-based access (milestone/meta/personal)</li>
                <li><span class="tag feat">Feature</span> Trust-level + admin-rank permission system</li>
            </ul>
        </section>

        <section class="productBlock theme-inspectre" data-href="https://inspectre.link">
            <div class="productBanner">
                <img class="productIcon" src="https://inspectre.link/src/inspectre-extension/icons/ghost.png" alt="">
                <span class="productName">inspectre</span>
                <span class="productTag">inspector</span>
            </div>
            <ul class="changeList">
                <li><span class="tag feat">Feature</span> Browser extension — DOM inspector tool (Chrome)</li>
            </ul>
        </section>
    </div>

    <!-- SLIDE ARROWS (A / D) -->
    <button class="slideArrow" id="arrowLeft" aria-label="Previous version"><span class="arrowChevron">&lt;</span> A</button>
    <button class="slideArrow" id="arrowRight" aria-label="Next version">D <span class="arrowChevron">&gt;</span></button>

</div>

<?= $footer ?>
</body>
</html>
