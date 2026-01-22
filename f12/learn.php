<?php ?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>inspectre - learn more</title>

        <link rel="stylesheet" href="style.css">
        <script src="script.js" defer></script>
    </head>
    <body class="page-learn">

        <canvas id="bgCanvas" aria-hidden="true"></canvas>

        <div id="app">

            <header id="topbar">
                <div class="brand"><a class="brand-link" href="index.php">inspectre</a></div>

                <div class="actions">
                    <a class="learn-link" href="index.php">Home</a>
                    <a class="primary" href="files/downloads/inspectre-extension.zip" download>Demo</a>
                </div>
            </header>

            <main id="learnMain">

                <section class="learn-hero">
                    <h1 class="learn-title">What is <span class="brand-inline">inspectre</span>?</h1>
                    <p class="learn-lede">
                        It’s a browser tool that lets you instantly tweak what you see on a page for content, demos, and satire.
                        Click stuff. Change it. Screenshot it. That’s the whole point.
                    </p>

                    <div class="learn-grid">
                        <div class="learn-card">
                            <div class="learn-card-title">Fast edits</div>
                            <p class="learn-card-body">
                                Click-to-edit text. Nudge numbers. Swap images. No digging through devtools menus for every tiny change.
                            </p>
                        </div>

                        <div class="learn-card">
                            <div class="learn-card-title">One-click “extra” elements</div>
                            <p class="learn-card-body">
                                Clone a UI row/card and place it cleanly. Great for “new stat”, “new line item”, “new widget” type flexes.
                            </p>
                        </div>

                        <div class="learn-card">
                            <div class="learn-card-title">Presets (Tier 1)</div>
                            <p class="learn-card-body">
                                Save a setup and re-apply it later. Different “personas” per site. Quick switches for different clips.
                            </p>
                        </div>

                        <div class="learn-card">
                            <div class="learn-card-title">Emulated pages (Tier 1)</div>
                            <p class="learn-card-body">
                                Practice on realistic, fake dashboards so you don’t need accounts just to make a joke.
                            </p>
                        </div>
                    </div>

                    <div class="disclaimer">
                        <div class="disclaimer-title">Quick disclaimer</div>
                        <p class="disclaimer-body">
                            inspectre is for satire, mockups, demos, and content. Don’t use it to mislead people in real-world decisions
                            or mess with real services you don’t own.
                        </p>
                    </div>

                    <div class="learn-jump">
                        <a class="learn-link" href="#pricing">Skip to pricing</a>
                    </div>
                </section>

                <section id="pricing" class="pricing">
                    <h2 class="pricing-title">Plans</h2>
                    <p class="pricing-sub">Demo is free. Subscriptions add the “creator” stuff.</p>

                    <div class="pricing-grid">
                        <div class="plan">
                            <div class="plan-top">
                                <div class="plan-name">Demo</div>
                                <div class="plan-price">$0</div>
                            </div>
                            <div class="plan-note">Chrome extension</div>
                            <ul class="plan-list">
                                <li>Click-to-edit text + numbers</li>
                                <li>Basic image replace</li>
                                <li>Quick reset</li>
                                <li>Built for clips</li>
                            </ul>
                            <a class="primary plan-cta" href="files/downloads/inspectre-extension.zip" download>Try Demo</a>
                        </div>

                        <div class="plan featured">
                            <div class="plan-top">
                                <div class="plan-name">Creator</div>
                                <div class="plan-price">$9<span class="mo">/mo</span></div>
                            </div>
                            <div class="plan-note">DevTools companion panel</div>
                            <ul class="plan-list">
                                <li>Saved presets (per site)</li>
                                <li>Undo / redo</li>
                                <li>Clean export</li>
                                <li><strong>Emulated pages</strong> (no account needed)</li>
                            </ul>
                            <button class="primary plan-cta" type="button" disabled>Unavailable</button>
                        </div>

                        <div class="plan">
                            <div class="plan-top">
                                <div class="plan-name">Studio</div>
                                <div class="plan-price">$19<span class="mo">/mo</span></div>
                            </div>
                            <div class="plan-note">Desktop creator app</div>
                            <ul class="plan-list">
                                <li>Projects + templates</li>
                                <li>Batch exports</li>
                                <li>Macros / workflows</li>
                                <li>Asset library</li>
                            </ul>
                            <button class="primary plan-cta" type="button" disabled>Unavailable</button>
                        </div>
                    </div>

                    <div class="pricing-fine">
                        <span class="fine">Cancel anytime. No weird commitments.</span>
                    </div>

                    <div class="learn-back">
                        <a class="learn-link" href="index.php">Back</a>
                    </div>
                </section>

                <section class="learn-hero" style="margin-top:32px;">
                    <h2 class="learn-title">How to install</h2>

                    <div class="learn-card" style="max-width:640px;margin:0 auto;">
                        <ol class="learn-card-body">
                            <li>Click <strong>Try Demo</strong> to download the ZIP</li>
                            <li>Unzip the folder</li>
                            <li>Open <code>chrome://extensions</code></li>
                            <li>Enable <strong>Developer mode</strong> (top right)</li>
                            <li>Click <strong>Load unpacked</strong></li>
                            <li>Select the unzipped folder</li>
                        </ol>
                    </div>
                </section>

            </main>

        </div>

        <div class="socials-bottom">
            <a href="https://www.tiktok.com/@inspectre.f12" target="_blank" rel="noopener">TikTok</a>
            <a href="https://www.instagram.com/@inspectre.f12" target="_blank" rel="noopener">Instagram</a>
            <a href="https://www.youtube.com/@inspectre.f12" target="_blank" rel="noopener">YouTube</a>
        </div>

    </body>
</html>