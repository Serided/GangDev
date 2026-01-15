<?php require_once '/var/www/gangdev/shared/php/init.php'; ?>
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
                <div style="background-image: url('https://gangdev.co/shared/files/img/jens/icon.webp')" class="jens"></div>
            </div>
            <p class="arrow">^</p>
            <h1 class="title shimmerText">
                Jens
                <!-- <a href="php/babe.php" class="babe">&nbsp+ Unknown</a> -->
            </h1>
        </div>

        <div class="sect cont two" id="overview">
            <h2>About Me</h2>
            <div class="timeline">
                <div class="timelineItem">
                    <div class="timelineBox">
                        <h3>In-N-Out</h3>
                        <p>Nov. 2022 - May 2024</p>
                    </div>
                    <div class="timelineDetails">
                        <p>
                            At <strong>In‑N‑Out Burger</strong>, known for exceptional <strong>quality and service</strong>, I developed key skills:
                        </p>
                        <ul>
                            <li>Operated registers, drive‑thru, fry, and prep stations.</li>
                            <li><strong>Provided efficient service in high‑volume settings.</strong></li>
                            <li>Trained teammates to foster leadership.</li>
                            <li><strong>Upheld industry-leading customer service standards.</strong></li>
                            <li>Upheld strict food safety and cleanliness.</li>
                            <li>Excelled in problem‑solving under pressure.</li>
                        </ul>
                    </div>
                </div>
                <div class="timelineItem">
                    <div class="timelineBox">
                        <h3>Mechanic</h3>
                        <p>Jul. 2024 - Jul. 2025</p>
                    </div>
                    <div class="timelineDetails">
                        <p>
                            At <strong>Quincy Foods, LLC</strong>, I <strong>maintained and repaired large-scale combines</strong>, ensuring peak efficiency.
                        </p>
                        <ul>
                            <li><strong>Diagnosed and repaired hydraulic, electrical, and mechanical systems.</strong></li>
                            <li>Performed preventative maintenance to prevent downtime.</li>
                            <li><strong>Utilized technical manuals and diagnostics for troubleshooting.</strong></li>
                            <li>Ensured safety compliance and optimal equipment performance.</li>
                            <li><strong>Worked 90+ grueling hours weekly, pushing physical and mental limits.</strong></li>
                        </ul>
                    </div>
                </div>
                <div class="timelineItem">
                    <div class="timelineBox">
                        <h3>Startup</h3>
                        <p>Nov. 2024 - Present</p>
                    </div>
                    <div class="timelineDetails">
                        <p>
                            <strong>GangDev</strong> is a software development startup specializing in <strong>games, AI, and custom applications</strong>.
                        </p>
                        <ul>
                            <li><strong>Designing and building game engines, AI models, and web applications.</strong></li>
                            <li>Leading full-stack development across frontend and backend systems.</li>
                            <li>Managing project workflows, client relations, and business operations.</li>
                            <li>Developing scalable, high-performance, and secure solutions.</li>
                            <li><strong>Building a brand and online presence, establishing GangDev in the tech industry.</strong></li>
                        </ul>
                    </div>
                </div>
                <div class="timelineItem">
                    <div class="timelineBox">
                        <h3>DC Technician</h3>
                        <p>Jun. 2025 - Aug. 2025</p>
                    </div>
                    <div class="timelineDetails">
                        <p>
                            Contracted through <strong>TEKsystems</strong> to deploy and service infrastructure in <strong>Microsoft’s secure datacenter environment</strong>.
                        </p>
                        <ul>
                            <li><strong>Installed M1s/M2s, T2s, line cards, and SFP modules across full racks.</strong></li>
                            <li><strong>Built out coupler panels, patch panels, and routed power/OOB cabling.</strong></li>
                            <li>Maintained labeling, port mapping, and airflow-optimized cable dressing.</li>
                            <li><strong>Operated under active security clearance and strict access protocols.</strong></li>
                            <li>Worked long shifts in cold, high-noise environments to meet deployment goals.</li>
                        </ul>
                    </div>
                </div>
                <div class="timelineItem">
                    <div class="timelineBox">
                        <h3>DC Logistics</h3>
                        <p>Sep. 2025 – Present</p>
                    </div>
                    <div class="timelineDetails">
                        <p>
                            Contracted through <strong>Milestone Technologies</strong> to execute
                            <strong>Meta’s datacenter logistics</strong>.
                        </p>
                        <ul>
                            <li><strong>Promoted to Project Lead after ~3.5 months as an L1 due to performance and SLC proficiency.</strong></li>
                            <li>Lead SLC operations and conduct SLC audits across an entire data center.</li>
                            <li>Execute full rack lifecycle operations across inbound and outbound logistics.</li>
                            <li><strong>Recognized with a performance bonus for impeccable rack operations.</strong></li>
                            <li><strong>Authored and presented a rewrite of the SLC SOP for leadership approval.</strong></li>
                        </ul>
                    </div>
                </div>

            </div>
            <p class="desc">
                I’ve always gotten bored fast. I can’t stand standing around, so I defaulted to coding.
                I’ve got a weird style, but it works — and I legit can’t sleep at night knowing my code’s gonna need a full rewrite in a few years.
                I build things to last, not to patch later; no hacks, no bandaids, just clean setups that hold up.
                Eventually I’ll be this generation’s <strong>Tony Stark</strong> — just gotta keep grinding.<br><br>

                I started <strong>GangDev</strong> because I’ve got a vision for how I want to impact the world, and I’m tired of being boxed in by outdated norms that slow everything down.
                I’ve set up <strong>cloud and physical servers</strong> from scratch, built <strong>web platforms completely from the ground up</strong>,
                and made <strong>game systems that scale forever without falling apart</strong>.
                I’m always trying to make stuff cleaner, faster, and smarter — one giga project at a time.<br><br>

                I'm not chasing clout, trying to boost my ego, or flaunt a fake persona; that's why I build things that are real.
                I want to be something my dad would be proud of — something <strong>전설적인</strong>.
            </p>
        </div>

        <div class="sect cont three" id="expertise">
            <div>
                <h2>Expertise</h2>
                <p class="desc">I have a vast array of expertise.</p>
            </div>
            <div class="tiltedGrid">
                <div class="tiltedCell">
                    <strong>Web Development</strong><br>PHP, HTML, CSS, JavaScript, and Ruby.
                </div>
                <div class="tiltedCell">
                    <strong>App and Software Development</strong><br>Java, Kotlin, and Rust.
                </div>
                <div class="tiltedCell">
                    <strong>AI and Machine Learning</strong><br>Python, Tensorflow, and Rust.
                </div>
                <div class="tiltedCell">
                    <strong>Database Management</strong><br>PostgreSQL, MySQL, SQLite, Oracle, and Cassandra.
                </div>
                <div class="tiltedCell">
                    <strong>Systems and Infrastructure</strong><br>Linux, DevoOps, Cloud Computing, and Apache.
                </div>
                <div class="tiltedCell">
                    <strong>IT & Data Center Ops</strong><br>HW logistics, RMA, structured cabling, and rack deployment.
                </div>
                <div class="tiltedCell">
                    <strong>Mech/Electrical Systems</strong><br>MRO on agricultural combines; hydraulics, wiring, and system diagnostics.
                </div>
                <div class="tiltedCell">
                    <strong>Customer Experience</strong><br>Exceptional service, communication, and issue resolution.
                </div>
            </div>
            <div>
                <p class="desc favorites">Some of my favorite projects:</p>
            </div>
            <div class="favorites">
                <div><a href="https://github.com/Serided/GangDev" target="_blank">- GangDev Website -</a></div>
                <div><a href="https://gaming.gangdev.co/gameEngine" target="_blank">- Game Engine (Alpha) -</a></div>
                <div><a href="https://crust.gangdev.co/game1" target="_blank">- Crust (Alpha) <b style="color: lightgreen">[Online]</b> -</a></div>
                <div><a href="https://apps.gangdev.co/web/roastGenerator" target="_blank">- Roast Generator -</a></div>
                <div><a href="https://apps.gangdev.co/web/mmfGenerator" target="_blank">- MMF Generator -</a></div>
            </div>
        </div>

        <div class="sect cont four">
            <h2>My Links</h2>
            <p>
                <a href="https://www.linkedin.com/in/jens-hansen-2486a6329/" target="_blank">LinkedIn</a><br>
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
            <form action="/shared/php/process_contact.php" method="post">
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
