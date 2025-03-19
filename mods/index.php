<?php require_once '/var/www/gangdev/shared/php/init.php'; ?>
<!DOCTYPE html>
<html lang="en" >
	<head>
		<meta charset="UTF-8">
		<title>Mods</title>
        <?= $head ?>
	</head>
	<body class="main-p fullw">
	<?= $navbar ?>

		<h1>
			Mods
		</h1>

		<div class="fullw sect">
			<section >
				<h2>
					<a href="minecraft/resource_packs">Minecraft (Resource Packs)</a>
                </h2>
				<p >
                    The majority of art expertise in GangDev comes from creating Resource Packs for Minecraft, and this is
                    a collection of those.<br>
					<br>
					<b>A list of resource packs you can read up on and download.</b>
				</p>
			</section>
		</div>

        <div class="fullw sect spacing">
            <section >
                <h2>
                    <a href="minecraft/data_packs">Minecraft (Data Packs)</a>
                </h2>
                <p >
                    The majority of coding experience in GangDev originates in MCFunction, Minecraft's built-in coding
                    language, along with some json. This is an assortment of developed data packs from GangDev.<br>
                    <br>
                    <b>A list of mods you can read up on and download.</b>
                </p>
            </section>
        </div>

		<div class="fullw sect spacing">
			<section >
				<h2>
					<a href="">IN PROGRESS</a>
				</h2>
				<p >
					Coming soon...<br>
					<br>
					<b>UNKNOWN</b>
				</p>
			</section>
		</div>

		<div class="fullw sect spacing">
			<section >
				<h2 style="color:red">
					<b>Note:</b>
				</h2>
				<p >
					In development.
				</p>
			</section>
		</div>

	<?= $footer ?>
	</body>
</html>
