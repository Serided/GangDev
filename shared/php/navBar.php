<?php
require_once '/var/www/gangdev/shared/php/init.php';
?>
<div class="hNavbar">

    <link rel="stylesheet" href="https://shared.gangdev.co/css/navbar.css">

    <label class="hamburger">
        <input type="checkbox" id="hamburger">
    </label>

    <aside class="sidebar one">

        <nav>

            <input type="radio" id="account" name="menu">
            <label for="account" class="account-btn btnText">
                <div class="profile" style="background-image: url('<?= htmlspecialchars($userIconUrl) ?>');">
                    <p><?= htmlspecialchars($displayname) ?></p>
                </div>
            </label>

            <?php if (isset($_SESSION["user_id"])): ?> <!-- change account tab content -->
                <aside class="sidebar two">
                    <nav>
                        <a href="http://account.gangdev.co" class="btnText"><button class="hamburger-btn btnText two">Account</button></a>
                        <a href="" class="btnText"><button class="hamburger-btn btnText two">Leaderboard</button></a>
                        <a href="https://account.gangdev.co/login/signout.php" class="btnText"><button class="hamburger-btn btnText two">Sign Out</button></a>
                    </nav>
                </aside>
            <?php else: ?>
                <aside class="sidebar two">
                    <nav>
                        <a href="https://account.gangdev.co/login/signin.php" class="btnText"><button class="hamburger-btn btnText two">Sign In</button></a>
                    </nav>
                </aside>
            <?php endif; ?>

            <a href="https://gangdev.co/"><button class="hamburger-btn btnText one">Home</button></a>

            <input type="radio" id="products" name="menu">
            <label for="products" class="hamburger-btn btnText one">Products</label>
            <aside class="sidebar two">
                <nav>
                    <a href="https://dcops.co/"><button class="hamburger-btn btnText two">dcops.co</button></a>
                    <a href="https://candor.you/"><button class="hamburger-btn btnText two">candor.you</button></a>
                    <a href="https://inspectre.link/"><button class="hamburger-btn btnText two">inspectre</button></a>
                </nav>
            </aside>

            <input type="radio" id="labs" name="menu">
            <label for="labs" class="hamburger-btn btnText one">Labs</label>
            <aside class="sidebar two">
                <nav>
                    <a href="https://gaming.gangdev.co/gameEngine"><button class="hamburger-btn btnText two">Game Engine<br> <b style="color: dodgerblue;">(Alpha)</b> </button> </a>
                    <a href="https://gaming.gangdev.co/basicFighterGame" target="_blank"><button class="hamburger-btn btnText two">Fighting Game<br> <b style="color: dodgerblue;">(Beta)</b> </button> </a>
                    <a href="https://crust.gangdev.co/game1" target="_blank"><button class="hamburger-btn btnText two">Crust<br> <b style="color: dodgerblue;">(Alpha)</b> <b style="color: lightgreen;">[Online]</b> </button> </a>
                    <a href="https://apps.gangdev.co/web/roastGenerator"><button class="hamburger-btn btnText two">Roast Generator<br> <b style="color: dodgerblue;">(Alpha)</b> </button> </a>
                    <a href="https://apps.gangdev.co/web/mmfGenerator"><button class="hamburger-btn btnText two">MMF Generator<br> <b style="color: dodgerblue;">(Beta)</b> </button> </a>
                </nav>
            </aside>

            <input type="radio" id="company" name="menu">
            <label for="company" class="hamburger-btn btnText one">Company</label>
            <aside class="sidebar two">
                <nav>
                    <a href="https://jens.gangdev.co/"><button class="hamburger-btn btnText two">Founder</button></a>
                    <a href="https://gangdev.co/" class="btnText"><button class="hamburger-btn btnText two">About</button></a>
                    <a href="https://gangdev.co/" class="btnText"><button class="hamburger-btn btnText two">Contact</button></a>
                    <a href="https://updates.gangdev.co/" class="btnText"><button class="hamburger-btn btnText two">Updates</button></a>
                </nav>
            </aside>

        </nav>

    </aside>

    <script src="https://gangdev.co/shared/js/navbar.js"></script>

</div>
<button class="sectBtn" id="upBtn">W</button>
<button class="sectBtn" id="downBtn">S</button>
