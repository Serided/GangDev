<?php require_once '/var/www/gangdev/shared/php/init.php'; ?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>Mods</title>
        <?= $head ?>
	</head>
	<body>
	    <?= $navbar ?>
		<?= $warn ?>

        <div class="sect cont entry">
            <div class="bgWrapper"></div>
            <h1>
                Mods
            </h1>
        </div>

        <div class="sect cont two">
            <h2>
                <a href="minecraft/resource_packs">Minecraft (Resource Packs)</a>
            </h2>
            <p>
                The majority of art expertise in GangDev comes from creating Resource Packs for Minecraft, and this is
                a collection of those.<br>
                <br>
                <b>A list of resource packs you can read up on and download.</b>
            </p>
		</div>

        <div class="sect cont three">
            <h2>
                <a href="minecraft/data_packs">Minecraft (Data Packs)</a>
            </h2>
            <p>
                The majority of coding experience in GangDev originates in MCFunction, Minecraft's built-in coding
                language, along with some json. This is an assortment of developed data packs from GangDev.<br>
                <br>
                <b>A list of mods you can read up on and download.</b>
            </p>
        </div>

        <div class="sect cont four">
            <h2>
                <a href="">IN PROGRESS</a>
            </h2>
            <p>
                Coming soon...<br>
                <br>
                <b>UNKNOWN</b>
            </p>
		</div>

        <div class="sect cont three">
            <h2 style="color:red">
                <b>Note:</b>
            </h2>
            <p>
                In development.
            </p>
		</div>

	<?= $footer ?>
	</body>
</html>
