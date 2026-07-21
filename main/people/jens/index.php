<?php require_once '/var/www/gangdev/main/src/php/init.php'; ?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Jens</title>
        <?= $head ?>
        <link rel="stylesheet" href="style.css">
    </head>
    <body>
        <?= $navbar ?>
        <?= $warn ?>

        <div class="sect cont entry">
            <div class="bgWrapper"></div>
            <div class="shimmer">
                <div style="background-image: url('https://gangdev.co/src/img/jens/icon.webp')" class="jens"></div>
            </div>
            <p class="arrow">^</p>
            <h1 class="title shimmerText">
                Jens
                <a href="php/babe.php" class="babe">&nbsp+ Jalyn</a>
            </h1>
        </div>

        <div class="sect cont two" id="overview">
            <div class="overviewLayout">
                <div class="timeline">
                    <div class="timelineLine"></div>

                    <div class="timelineItem">
                        <div class="companyBanner bannerIno">
                            <img class="bannerLogo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/InNOut_2021_logo.svg/320px-InNOut_2021_logo.svg.png" alt="In-N-Out">
                        </div>
                        <div class="timelineDetails">
                            <div class="detailsTitle">Team Member</div>
                            <div class="dateBadge">Nov 2022 – May 2024</div>
                            <ul>
                                <li>All stations — registers, drive-thru, fry, prep.</li>
                                <li>Trained hires; high-volume service under pressure.</li>
                            </ul>
                        </div>
                    </div>

                    <div class="timelineItem">
                        <div class="companyBanner bannerQuincy">
                            <span class="bannerIcon">🌾</span>
                            <span class="bannerName">Quincy Foods</span>
                        </div>
                        <div class="timelineDetails">
                            <div class="detailsTitle">Mechanic</div>
                            <div class="dateBadge">Jul 2024 – Jul 2025</div>
                            <ul>
                                <li>Hydraulic, electrical, mechanical repair on large-scale combines.</li>
                                <li>90+ hour weeks; diagnostics and preventative maintenance.</li>
                            </ul>
                        </div>
                    </div>

                    <div class="timelineItem">
                        <div class="companyBanner bannerGangdev">
                            <img class="bannerLogo" src="https://gangdev.co/src/img/favicon/new/favicon-96x96.png" alt="GangDev">
                            <span class="bannerName">GangDev</span>
                        </div>
                        <div class="timelineDetails">
                            <div class="detailsTitle">Founder & Lead Engineer</div>
                            <div class="dateBadge">Nov 2024 – Present</div>
                            <ul>
                                <li>Full-stack platforms from scratch — Candor, DCOPS, inspectre, Lafter, Crust.</li>
                                <li>Infra, auth, data architecture, product design, deployment.</li>
                            </ul>
                        </div>
                    </div>

                    <div class="timelineItem">
                        <div class="companyBanner bannerTeksystems">
                            <span class="bannerName">TEK<span class="tekAccent">systems</span></span>
                        </div>
                        <div class="timelineDetails">
                            <div class="detailsTitle">Data Center Technician</div>
                            <div class="dateBadge">Jun 2025 – Aug 2025</div>
                            <ul>
                                <li>Microsoft DC: rack builds, M1s/M2s, T2s, line cards, SFPs.</li>
                                <li>Structured cabling under active security clearance.</li>
                            </ul>
                        </div>
                    </div>

                    <div class="timelineItem">
                        <div class="companyBanner bannerMilestone">
                            <span class="bannerName">milestone</span>
                        </div>
                        <div class="timelineDetails">
                            <div class="detailsTitle">DC Logistics → SLC Lead → Metrics Lead</div>
                            <div class="dateBadge">Sep 2025 – Jun 2026</div>
                            <ul>
                                <li>Meta DC logistics; promoted twice in under 5 months.</li>
                                <li>Authored SLC SOP rewrite; performance bonus.</li>
                            </ul>
                        </div>
                    </div>

                    <div class="timelineItem">
                        <div class="companyBanner bannerAws">
                            <span class="bannerName">aws</span>
                        </div>
                        <div class="timelineDetails">
                            <div class="detailsTitle">DCO Technician</div>
                            <div class="dateBadge">Jun 2026 – Present</div>
                            <ul>
                                <li>Data Center Operations — break/fix, cabling, hardware at scale.</li>
                            </ul>
                        </div>
                    </div>

                </div>

                <div class="aboutText">
                    <h2>About Me</h2>
                    <p>
                        Can't stand standing around — so I code. I build things to last, not to patch later.
                        No hacks, no bandaids, just clean setups that hold up.
                        Eventually I'll be this generation's <strong>Tony Stark</strong>.<br><br>

                        Started <strong>GangDev</strong> because I'm tired of being boxed in.
                        Cloud servers from scratch, web platforms from zero, game engines that scale.
                        Cleaner, faster, smarter — one giga project at a time.<br><br>

                        Not chasing clout. Building things that are real.
                        Something my dad would be proud of — something <strong>전설적인</strong>.
                    </p>
                </div>
            </div>
        </div>

        <div class="sect cont three" id="expertise">
            <h2>Expertise</h2>
            <div class="tiltedGrid">
                <div class="tiltedCell"><strong>Web</strong><br>PHP, HTML, CSS, JS, Ruby.</div>
                <div class="tiltedCell"><strong>Software</strong><br>Java, Kotlin, Rust.</div>
                <div class="tiltedCell"><strong>AI / ML</strong><br>Python, TensorFlow, Rust.</div>
                <div class="tiltedCell"><strong>Databases</strong><br>PostgreSQL, MySQL, SQLite, Oracle, Cassandra.</div>
                <div class="tiltedCell"><strong>Infra</strong><br>Linux, Apache, cloud, DevOps.</div>
                <div class="tiltedCell"><strong>DC Ops</strong><br>Rack deployment, structured cabling, RMA, logistics.</div>
                <div class="tiltedCell"><strong>Mechanical</strong><br>Hydraulics, electrical, diagnostics on ag combines.</div>
                <div class="tiltedCell"><strong>Game Dev</strong><br>Custom engines, WebSocket multiplayer, physics.</div>
            </div>
        </div>

        <div class="sect cont four">
            <h2>My Links</h2>
            <p>
                <a href="https://www.linkedin.com/in/the-jens-hansen/" target="_blank">LinkedIn</a><br>
                <a href="https://github.com/Serided" target="_blank">GitHub</a><br>
                <a href="https://stackoverflow.com/users/20779197/serided" target="_blank">Stack Overflow</a><br>
                <a href="https://www.instagram.com/ser1ded/" target="_blank">Instagram</a><br>
                <a href="https://www.youtube.com/@serided" target="_blank">YouTube</a><br>
            </p>
        </div>

        <div class="sect cont one" id="contact">
            <h2>Contact</h2>
            <a href="mailto:jens.hansen@gangdev.co">(jens.hansen@gangdev.co)</a>
            <form action="https://gangdev.co/src/php/process_contact.php" method="post">
                <div class="details">
                    <input type="hidden" name="recipient" value="jens">
                    <?php if (!isset($_SESSION["user_id"])): ?>
                    <label for="name">Name: *</label><br>
                    <div class="info"><input name="name" id="name" type="text" required></div>
                    <label for="email">Email:</label><br>
                    <div class="info"><input name="email" id="email" type="email"></div>
                    <label for="message">Message: *</label><br>
                    <div><textarea name="message" id="message" rows="5" maxlength="1000" required></textarea></div>
                    <?php else: ?>
                    <label for="name">Name:</label><br>
                    <div class="info"><input name="name" id="name" type="text"></div>
                    <label for="message">Message:</label><br>
                    <div><textarea name="message" id="message" rows="7" maxlength="2500" required></textarea></div>
                    <?php endif; ?>
                </div>
                <div><button type="submit">Send</button></div>
            </form>
        </div>

        <?= $footer ?>
    </body>
</html>
