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
                <a href="php/vivienne.php" class="vivienne">&nbsp+ Vivienne</a>
            </h1>
        </div>

        <div class="sect cont two" id="overview">
            <h2>About Me</h2>
            <div class="timeline">
                <div class="timelineItem">
                    <div class="timelineBox">
                        <h3>Customer Service</h3>
                        <p>Jun. 2022 - Aug. 2022</p>
                    </div>
                    <div class="timelineDetails">
                        <p>At Walmart, I excelled in a fast-paced retail environment, handling transactions, customer service, and logistics with efficiency.</p>
                        <ul>
                            <li>Processed high-volume transactions with speed and accuracy.</li>
                            <li>Provided exceptional customer service for purchases, returns, and inquiries.</li>
                            <li><strong>Maneuvered and organized heavy shopping carts in a demanding, fast-paced environment.</strong></li>
                            <li>Maintained a clean, organized store to enhance customer experience.</li>
                            <li>Developed resilience, efficiency, and teamwork under constant pressure.</li>
                        </ul>
                    </div>
                </div>
                <div class="timelineItem">
                    <div class="timelineBox">
                        <h3>In-N-Out</h3>
                        <p>Nov. 2022 - May 2024</p>
                    </div>
                    <div class="timelineDetails">
                        <p>At In‑N‑Out Burger, known for exceptional quality and service, I developed key skills:</p>
                        <ul>
                            <li>Operated registers, drive‑thru, fry, and prep stations.</li>
                            <li><strong>Provided efficient service in high‑volume settings.</strong></li>
                            <li>Trained teammates to foster leadership.</li>
                            <li>Upheld strict food safety and cleanliness.</li>
                            <li>Excelled in problem‑solving under pressure.</li>
                        </ul>
                    </div>
                </div>
                <div class="timelineItem">
                    <div class="timelineBox">
                        <h3>Mechanic</h3>
                        <p>Jul. 2024 - Oct. 2024</p>
                    </div>
                    <div class="timelineDetails">
                        <p>At Quincy Foods, LLC, I maintained and repaired large-scale combines, ensuring peak efficiency.</p>
                        <ul>
                            <li>Diagnosed and repaired hydraulic, electrical, and mechanical systems.</li>
                            <li>Performed preventative maintenance to prevent downtime.</li>
                            <li>Utilized technical manuals and diagnostics for troubleshooting.</li>
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
                        <p>GangDev is a software development startup specializing in games, AI, and custom applications.</p>
                        <ul>
                            <li><strong>Designing and building game engines, AI models, and web applications.</strong></li>
                            <li>Leading full-stack development across frontend and backend systems.</li>
                            <li>Managing project workflows, client relations, and business operations.</li>
                            <li>Developing scalable, high-performance, and secure solutions.</li>
                            <li><strong>Building a brand and online presence, establishing GangDev in the tech industry.</strong></li>
                        </ul>
                    </div>
                </div>
            </div>
            <p class="desc">
                With hands-on experience in <strong>cloud computing</strong>, <strong>DevOps</strong>, and
                <strong>server administration</strong>, I manage my own infrastructure and lead large-scale projects,
                all while actively contributing to <i>collaborative open-source development</i>—a journey that’s taught
                me the true value of teamwork and shared innovation.<br><br>

                One of my proudest achievements is founding <strong>GangDev</strong>, a company built on
                <i>work ethic, efficiency, and scalable solutions</i>. I've engineered a high-performance web platform
                and crafted procedural game mechanics that
                <strong>boost scalability, refine AI behavior, and enhance in-game systems</strong>.<br><br>

                My goal is to grow <strong>GangDev</strong> into a trademarked, mid-sized development company that
                generates seven to eight figures annually through <i>innovative digital products</i>. Whether working
                solo or as part of a team, I bring a
                <strong>problem-solving mindset, deep technical expertise, and relentless drive</strong> to every project I tackle.
            </p>
        </div>

        <div class="sect cont three" id="expertise">
            <div>
                <h2>Expertise</h2>
                <p class="desc">I have a vast array of experience in computer science.</p>
            </div>
            <div class="tiltedGrid">
                <div class="tiltedCell">
                    <strong>Web Development</strong><br>PHP, HTML, CSS, JavaScript, Ruby
                </div>
                <div class="tiltedCell">
                    <strong>App and Software Development</strong><br>Java, Kotlin, Rust.
                </div>
                <div class="tiltedCell">
                    <strong>AI and Machine Learning</strong><br>Python, Tensorflow, Rust.
                </div>
                <div class="tiltedCell">
                    <strong>Database Management</strong><br>PostgreSQL, MySQL, SQLite, Oracle, Cassandra.
                </div>
                <div class="tiltedCell">
                    <strong>Systems and Infrastructure</strong><br>Linux, DevoOps, Cloud Computing, Apache.
                </div>
            </div>
            <div>
                <p class="desc">Some of my favorite projects:</p>
            </div>
            <div class="favorites">
                <div><a href="https://github.com/Serided/GangDev" target="_blank">GangDev Website</a></div>
                <div><a href="https://gaming.gangdev.co/gameEngine" target="_blank">Game Engine (Alpha)</a></div>
                <div><a href="https://gaming.gangdev.co/game1" target="_blank">First Multiplayer Game (Alpha) [Online]</a></div>
                <div><a href="https://apps.gangdev.co/roastGenerator" target="_blank">Roast Generator</a></div>
                <div><a href="https://apps.gangdev.co/mmfGenerator" target="_blank">MMF Generator</a></div>
            </div>
        </div>

        <div class="sect cont four">
            <h2>My Links</h2>
            <p>
                <a href="https://www.instagram.com/ser1ded/" target="_blank">Instagram</a><br>
                <a href="https://scandinalienballer.wixsite.com/jenshansenportfolio" target="_blank">Digital Media Portfolio</a><br>
                <a href="https://www.youtube.com/@serided" target="_blank">YouTube</a><br>
                <a href="https://github.com/Serided" target="_blank">GitHub</a><br>
                <a href="https://stackoverflow.com/users/20779197/serided" target="_blank">Stack Overflow</a>
            </p>
        </div>

        <div class="sect cont one" id="contact">
            <h2>Contact</h2>
            <a href="mailto:company@gangdev.co">(company@gangdev.co)</a>
            <form action="/shared/php/process_contact.php" method="post">
                <div class="details">
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
