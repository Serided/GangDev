<?php require_once '/var/www/gangdev/shared/php/init.php'; ?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Isaac</title>
        <?= $head ?>
        <link rel="stylesheet" href="style.css">
    </head>
    <body>
        <?= $navbar ?>
        <?= $warn ?>

        <div class="sect cont entry">
            <div class="bgWrapper"></div>
            <div class="shimmer">
                <div style="background-image: url('https://gangdev.co/shared/files/img/isaac/icon.webp')" class="isaac"></div>
            </div>
            <p class="arrow">^</p>
            <h1 class="title shimmerText">
                Isaac
            </h1>
        </div>

        <div class="sect cont two" id="overview">
            <h2>About Me</h2>
            <div class="timeline">
                <div class="timelineItem">
                    <div class="timelineBox">
                        <h3>Sussy</h3>
                        <p>Birth – Present</p>
                    </div>
                    <div class="timelineDetails">
                        <p>incredibly</p>
                        <ul>
                            <li>no drugs tho
                        </ul>
                    </div>
                </div>
            </div>
            <p class="desc">
                very secret
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
            </div>
            <div>
                <p class="desc favorites">Some of my favorite projects:</p>
            </div>
            <div class="favorites">
                <div><a href="https://gaming.gangdev.co/theBigOne" target="_blank">- The BIG One -</a></div>
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
