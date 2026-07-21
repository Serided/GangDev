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
            <h2>About Me</h2>
            <div class="timeline">

                <div class="timelineItem">
                    <div class="companyBanner bannerIno">
                        <span class="bannerName">In-N-Out Burger</span>
                    </div>
                    <div class="timelineDetails">
                        <div class="detailsTitle">Team Member</div>
                        <div class="dateBadge">Nov 2022 – May 2024</div>
                        <ul>
                            <li>Registers, drive-thru, fry, prep — all stations.</li>
                            <li>Trained new hires; upheld service standards under volume.</li>
                        </ul>
                    </div>
                </div>

                <div class="timelineItem">
                    <div class="companyBanner bannerQuincy">
                        <span class="bannerName">Quincy Foods</span>
                    </div>
                    <div class="timelineDetails">
                        <div class="detailsTitle">Mechanic</div>
                        <div class="dateBadge">Jul 2024 – Jul 2025</div>
                        <ul>
                            <li>Hydraulic, electrical, and mechanical repair on large-scale combines.</li>
                            <li>90+ hour weeks; diagnostics, preventative maintenance, safety compliance.</li>
                        </ul>
                    </div>
                </div>

                <div class="timelineItem">
                    <div class="companyBanner bannerGangdev">
                        <img class="bannerLogo" src="https://gangdev.co/src/img/favicon/new/favicon-96x96.png" alt="">
                        <span class="bannerName">GangDev</span>
                    </div>
                    <div class="timelineDetails">
                        <div class="detailsTitle">Founder & Lead Engineer</div>
                        <div class="dateBadge">Nov 2024 – Present</div>
                        <ul>
                            <li>Full-stack platforms from scratch — Candor, DCOPS, inspectre, Lafter, Crust.</li>
                            <li>Infra, auth, DB architecture, product design, and deployment.</li>
                        </ul>
                    </div>
                </div>

                <div class="timelineItem">
                    <div class="companyBanner bannerTeksystems">
                        <span class="bannerName">TEKsystems</span>
                    </div>
                    <div class="timelineDetails">
                        <div class="detailsTitle">Data Center Technician</div>
                        <div class="dateBadge">Jun 2025 – Aug 2025</div>
                        <ul>
                            <li>Microsoft DC: rack builds, M1s/M2s, T2s, line cards, SFP modules.</li>
                            <li>Coupler panels, patch panels, structured cabling under clearance.</li>
                        </ul>
                    </div>
                </div>

                <div class="timelineItem">
                    <div class="companyBanner bannerMilestone">
                        <span class="bannerName">Milestone Technologies</span>
                    </div>
                    <div class="timelineDetails">
                        <div class="detailsTitle">DC Logistics → SLC Project Lead → Metrics Lead</div>
                        <div class="dateBadge">Sep 2025 – Jun 2026</div>
                        <ul>
                            <li>Meta DC logistics; promoted twice in under 5 months.</li>
                            <li>Authored SLC SOP rewrite; performance bonus for flawless ops.</li>
                        </ul>
                    </div>
                </div>

                <div class="timelineItem">
                    <div class="companyBanner bannerAws">
                        <span class="bannerName">Amazon Web Services</span>
                    </div>
                    <div class="timelineDetails">
                        <div class="detailsTitle">DCO Technician</div>
                        <div class="dateBadge">Jun 2026 – Present</div>
                        <ul>
                            <li>Data Center Operations — break/fix, cabling, hardware deployment at scale.</li>
                        </ul>
                    </div>
                </div>

            </div>
            <p class="desc">
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

        <div class="sect cont three" id="expertise">
            <div>
                <h2>Expertise</h2>
            </div>
            <div class="tiltedGrid">
                <div class="tiltedCell">
                    <strong>Web</strong><br>PHP, HTML, CSS, JS, Ruby.
                </div>
                <div class="tiltedCell">
                    <strong>Software</strong><br>Java, Kotlin, Rust.
                </div>
                <div class="tiltedCell">
                    <strong>AI / ML</strong><br>Python, TensorFlow, Rust.
                </div>
                <div class="tiltedCell">
                    <strong>Databases</strong><br>PostgreSQL, MySQL, SQLite, Oracle, Cassandra.
                </div>
                <div class="tiltedCell">
                    <strong>Infra</strong><br>Linux, Apache, cloud, DevOps.
                </div>
                <div class="tiltedCell">
                    <strong>DC Ops</strong><br>Rack deployment, structured cabling, RMA, logistics.
                </div>
                <div class="tiltedCell">
                    <strong>Mechanical</strong><br>Hydraulics, electrical, diagnostics on ag combines.
                </div>
                <div class="tiltedCell">
                    <strong>Game Dev</strong><br>Custom engines, WebSocket multiplayer, physics.
                </div>
            </div>
        </div>

        <div class="sect cont four">
            <h2>My Links</h2>
            <p>
                <a href="https://www.linkedin.com/in/the-jens-hansen/" target="_blank">LinkedIn</a><br>
                <a href="https://profile.indeed.com/p/jensh-vmz588q" target="_blank">Indeed</a><br>
                <a href="https://github.com/Serided" target="_blank">GitHub</a><br>
                <a href="https://stackoverflow.com/users/20779197/serided" target="_blank">Stack Overflow</a><br>
                <a href="https://www.coursera.org/learner/serided" target="_blank">Coursera</a><br>
                <a href="https://scandinalienballer.wixsite.com/jenshansenportfolio" target="_blank">Digital Media Portfolio</a><br>
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
                    <div><textarea name="message" id="message" rows="7" maxlength="2500" style="width: " required></textarea></div>
                    <?php endif; ?>
                </div>
                <div><button type="submit">Send</button></div>
            </form>
        </div>

        <?= $footer ?>
    </body>
</html>
