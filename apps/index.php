<?php require_once '/var/www/gangdev/shared/php/init.php'; ?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>Apps</title>
        <?= $head ?>
	</head>
	<body class="main-p fullw">
        <?= $navbar ?>
        <?= $warn ?>

        <div class="sect cont apps">
            <h1>
                Apps
            </h1>
        </div>

		<div class="sect cont">
            <h2>
                <a href="roastGenerator">Roast Generator</a>
            </h2>
            <p>
                A terribly effective way to satisfy your urge for carnage and slaughter, this app can both automatically
                and manually generate a roast.<br>
                <br>
                <b>Click big chonky button to generate roast.</b>
            </p>
		</div>

        <div class="sect cont">
            <h2>
                <a href="mmfGenerator">MMF Generator</a>
            </h2>
            <p>
                The MMF Generator, also known as the Minecraft Mass Forceload Generator, is used to generate mass forceload commands. <br>
                Snapping to the largest chunk-sized area possible, this generator enables large scale Minecraft projects requiring constantly loaded areas.<br>
                <br>
                <b>Takes in two sets of xz coordinates.</b>
            </p>
        </div>

        <div class="sect cont">
            <h2>
                <a href="universalChat" target="_blank">Universal Chat</a>
            </h2>
            <p>
                The first official multiplayer app created by GangDev to allow users to interact on the web.<br>
                <br>
                <b>Join with a custom username to view and contribute to a universal chat.</b>
            </p>
        </div>

		<div class="sect cont">
            <h2>
                <a href="">IN PROGRESS</a>
            </h2>
            <p>
                Coming soon...<br>
                <br>
                <b>UNKNOWN</b>
            </p>
		</div>

	    <?= $footer ?>
	</body>
</html>
