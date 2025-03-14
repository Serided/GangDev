<?php
require_once 'https://shared.gangdev.co/php/init.php';
$navbar = file_get_contents ("https://shared.gangdev.co/html/navBar.html");
$footer = file_get_contents("https://shared.gangdev.co/html/footer.html");
$head = file_get_contents("https://shared.gangdev.co/html/repetitive.html");
?>
<!DOCTYPE html>
<html lang="en" class="fullw">
	<head>
		<meta charset="UTF-8">
		<title>Apps</title>
        <?= $head ?>
	</head>
	<body class="main-p fullw">
	<?= $navbar ?>

		<h1>
			Apps
		</h1>

		<div class="fullw sect">
			<section class="fullw">
				<h2>
					<a href="roastGenerator">Roast Generator</a>
				</h2>
				<p class="fullw">
					A terribly effective way to satisfy your urge for carnage and slaughter, this app can both automatically
                    and manually generate a roast.<br>
					<br>
					<b>Click big chonky button to generate roast.</b>
				</p>
			</section>
		</div>

        <div class="fullw sect spacing">
            <section class="fullw">
                <h2>
                    <a href="mmfGenerator">MMF Generator</a>
                </h2>
                <p class="fullw">
                    The MMF Generator, also known as the Minecraft Mass Forceload Generator, is used to generate mass forceload commands. <br>
                    Snapping to the largest chunk-sized area possible, this generator enables large scale Minecraft projects requiring constantly loaded areas.<br>
                    <br>
                    <b>Takes in two sets of xz coordinates.</b>
                </p>
            </section>
        </div>

        <div class="fullw sect spacing">
            <section class="fullw">
                <h2>
                    <a href="universalChat" target="_blank">Universal Chat</a>
                </h2>
                <p class="fullw">
                    The first official multiplayer app created by GangDev to allow users to interact on the web.<br>
                    <br>
                    <b>Join with a custom username to view and contribute to a universal chat.</b>
                </p>
            </section>
        </div>

		<div class="fullw sect spacing">
			<section class="fullw">
				<h2>
					<a href="">IN PROGRESS</a>
				</h2>
				<p class="fullw">
					Coming soon...<br>
					<br>
					<b>UNKNOWN</b>
				</p>
			</section>
		</div>

		<div class="fullw sect spacing">
			<section class="fullw">
				<h2 style="color:red">
					<b>Note:</b>
				</h2>
				<p class="fullw">
					In development.
				</p>
			</section>
		</div>

	<?= $footer ?>
	</body>
</html>
