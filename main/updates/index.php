<?php require_once '/var/www/gangdev/main/src/php/init.php'; ?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>GangDev — Updates</title>
    <link rel="stylesheet" href="style.css">
    <script defer src="script.js"></script>
    <?= $head ?>
</head>
<body>
<?= $navbar ?>
<?= $warn ?>

<div class="updatesShell">
    <header class="updatesHeader">
        <h1>Updates</h1>
        <p class="headerSub">What's new across GangDev products.</p>
    </header>

    <main class="updatesMain">

        <!-- GANGDEV (PLATFORM) -->
        <section class="productSection" data-product="gangdev">
            <div class="productHead">
                <img class="productIcon" src="https://gangdev.co/src/img/favicon/new/favicon-96x96.png" alt="GangDev">
                <span class="productName">GangDev</span>
                <span class="productTag">platform</span>
            </div>
            <div class="carousel">
                <div class="carouselTrack">
                    <article class="updateCard" data-date="2026-07-17 20:00">
                        <div class="updateMeta">
                            <span class="updateDate">2026-07-17 — 20:00</span>
                            <span class="updateType feat">Feature</span>
                        </div>
                        <h3>Unified auth — Sign in with GangDev</h3>
                        <p>All products (Candor, DCOPS, Lafter) can now authenticate via a single GangDev account using a secure auth-code exchange. One identity across everything.</p>
                    </article>
                    <article class="updateCard" data-date="2026-07-17 18:30">
                        <div class="updateMeta">
                            <span class="updateDate">2026-07-17 — 18:30</span>
                            <span class="updateType feat">Feature</span>
                        </div>
                        <h3>Central identity schema</h3>
                        <p>Migrated all user/auth tables to a dedicated <code>gangdev</code> PostgreSQL schema. Session tokens, remember tokens, and password resets now live in their own namespace. Cleaner, more scalable.</p>
                    </article>
                    <article class="updateCard" data-date="2026-07-17 15:00">
                        <div class="updateMeta">
                            <span class="updateDate">2026-07-17 — 15:00</span>
                            <span class="updateType infra">Infrastructure</span>
                        </div>
                        <h3>Project restructure</h3>
                        <p>Reorganized the entire codebase: gangdev.co content now lives under <code>main/</code>, each product gets its own root folder, and <code>shared/</code> is strictly cross-product infrastructure (db, mailer, base init).</p>
                    </article>
                    <article class="updateCard" data-date="2026-07-16 22:00">
                        <div class="updateMeta">
                            <span class="updateDate">2026-07-16 — 22:00</span>
                            <span class="updateType fix">Security</span>
                        </div>
                        <h3>Full security audit + credential rotation</h3>
                        <p>Blocked public access to .env and sensitive files via .htaccess. Rotated DB password, SECRET_KEY, and SMTP credentials. Verified SPF/DKIM/DMARC records.</p>
                    </article>
                    <article class="updateCard" data-date="2026-07-16 19:00">
                        <div class="updateMeta">
                            <span class="updateDate">2026-07-16 — 19:00</span>
                            <span class="updateType feat">Feature</span>
                        </div>
                        <h3>Contact form status banners</h3>
                        <p>Success/error banners now appear site-wide after form submissions. Auto-hides after 4 seconds, URL cleaned via history.replaceState. Works on every page via shared includes.</p>
                    </article>
                </div>
                <div class="carouselNav">
                    <button class="carouselBtn prev" aria-label="Previous">‹</button>
                    <span class="carouselCount"></span>
                    <button class="carouselBtn next" aria-label="Next">›</button>
                </div>
            </div>
        </section>

        <!-- CRUST -->
        <section class="productSection" data-product="crust">
            <div class="productHead">
                <span class="productName">Crust</span>
                <span class="productTag">game engine</span>
            </div>
            <div class="carousel">
                <div class="carouselTrack">
                    <article class="updateCard" data-date="2026-07-17 16:00">
                        <div class="updateMeta">
                            <span class="updateDate">2026-07-17 — 16:00</span>
                            <span class="updateType fix">Fix</span>
                        </div>
                        <h3>Server paths + Node 22 upgrade</h3>
                        <p>Fixed all require paths after the project restructure. Upgraded to Node v22 LTS. Regenerated maps, restarted PM2 — gateway, game1, and game2 all online.</p>
                    </article>
                    <article class="updateCard" data-date="2026-07-17 15:30">
                        <div class="updateMeta">
                            <span class="updateDate">2026-07-17 — 15:30</span>
                            <span class="updateType infra">Infrastructure</span>
                        </div>
                        <h3>package.json + npm scripts</h3>
                        <p>Created proper package.json with scripts for gateway, game1, game2, and map generation. Dependencies: ws, dotenv, jsonwebtoken, noisejs.</p>
                    </article>
                    <article class="updateCard" data-date="2026-07-16 17:00">
                        <div class="updateMeta">
                            <span class="updateDate">2026-07-16 — 17:00</span>
                            <span class="updateType fix">Fix</span>
                        </div>
                        <h3>WebSocket connection fix</h3>
                        <p>Game servers weren't starting due to missing .js extensions on ES module imports in serverLoop.js. Fixed — gateway and game servers now connect properly.</p>
                    </article>
                </div>
                <div class="carouselNav">
                    <button class="carouselBtn prev" aria-label="Previous">‹</button>
                    <span class="carouselCount"></span>
                    <button class="carouselBtn next" aria-label="Next">›</button>
                </div>
            </div>
        </section>

        <!-- CANDOR -->
        <section class="productSection" data-product="candor">
            <div class="productHead">
                <span class="productName">Candor</span>
                <span class="productTag">personal OS</span>
            </div>
            <div class="carousel">
                <div class="carouselTrack">
                    <article class="updateCard" data-date="2026-07-17 20:30">
                        <div class="updateMeta">
                            <span class="updateDate">2026-07-17 — 20:30</span>
                            <span class="updateType feat">Feature</span>
                        </div>
                        <h3>Sign in with GangDev</h3>
                        <p>Candor login and signup pages now offer one-click sign-in via GangDev identity. Auto-provisions a Candor profile on first use — no separate registration needed.</p>
                    </article>
                    <article class="updateCard" data-date="2026-07-17 14:00">
                        <div class="updateMeta">
                            <span class="updateDate">2026-07-17 — 14:00</span>
                            <span class="updateType infra">Infrastructure</span>
                        </div>
                        <h3>Init refactor + shared base</h3>
                        <p>Candor's init now uses init_base.php from shared/ with absolute paths. All asset URLs switched to absolute for cross-subdomain loading.</p>
                    </article>
                </div>
                <div class="carouselNav">
                    <button class="carouselBtn prev" aria-label="Previous">‹</button>
                    <span class="carouselCount"></span>
                    <button class="carouselBtn next" aria-label="Next">›</button>
                </div>
            </div>
        </section>

        <!-- DCOPS -->
        <section class="productSection" data-product="dcops">
            <div class="productHead">
                <span class="productName">DCOPS</span>
                <span class="productTag">operations</span>
            </div>
            <div class="carousel">
                <div class="carouselTrack">
                    <article class="updateCard" data-date="2026-07-17 20:30">
                        <div class="updateMeta">
                            <span class="updateDate">2026-07-17 — 20:30</span>
                            <span class="updateType feat">Feature</span>
                        </div>
                        <h3>Sign in with GangDev</h3>
                        <p>DCOPS login and signup pages now support GangDev identity sign-in with auto-provisioning.</p>
                    </article>
                </div>
                <div class="carouselNav">
                    <button class="carouselBtn prev" aria-label="Previous">‹</button>
                    <span class="carouselCount"></span>
                    <button class="carouselBtn next" aria-label="Next">›</button>
                </div>
            </div>
        </section>

        <!-- LAFTER -->
        <section class="productSection" data-product="lafter">
            <div class="productHead">
                <span class="productName brandLafter">L<span class="brandLafterA">a</span>fter</span>
                <span class="productTag">drafting tool</span>
            </div>
            <div class="carousel">
                <div class="carouselTrack">
                    <article class="updateCard" data-date="2026-07-17 13:00">
                        <div class="updateMeta">
                            <span class="updateDate">2026-07-17 — 13:00</span>
                            <span class="updateType feat">Feature</span>
                        </div>
                        <h3>Added to navbar</h3>
                        <p>Lafter now appears in the Products tab across all gangdev.co pages with its custom Indie Flower branding.</p>
                    </article>
                </div>
                <div class="carouselNav">
                    <button class="carouselBtn prev" aria-label="Previous">‹</button>
                    <span class="carouselCount"></span>
                    <button class="carouselBtn next" aria-label="Next">›</button>
                </div>
            </div>
        </section>

    </main>
</div>

<?= $footer ?>
</body>
</html>
