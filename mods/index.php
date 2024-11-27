<?php
$navbar = file_get_contents ("../shared/html/navBar.html");
$footer = file_get_contents("../shared/html/footer.html");
$head = file_get_contents("../shared/html/repetitive.html");
?>
<!DOCTYPE html>
<html lang="en" class="fullw">
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
			<section class="fullw">
				<h2>
					<a href="minecraft/resource_packs">Minecraft (Resource Packs)</a>
                </h2>
				<p class="fullw">
                    The majority of art expertise in GangDev comes from creating Resource Packs for Minecraft, and this is
                    a collection of those.<br>
					<br>
					<b>A list of resource packs you can read up on and download.</b>
				</p>
			</section>
		</div>

        <div class="fullw sect spacing">
            <section class="fullw">
                <h2>
                    <a href="minecraft/data_packs">Minecraft (Data Packs)</a>
                </h2>
                <p class="fullw">
                    The majority of coding experience in GangDev originates in MCFunction, Minecraft's built-in coding
                    language, along with some json. This is an assortment of developed data packs from GangDev.<br>
                    <br>
                    <b>A list of mods you can read up on and download.</b>
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
