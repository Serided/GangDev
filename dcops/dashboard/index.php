<?php
require_once '/var/www/gangdev/shared/php/init_dcops.php';

dcops_enforce_org_dashboard_host();
dcops_require_milestone();
?>

<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>DCOPS · Milestone</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="./style.css">
</head>
<body>

<div class="dashboard">
	<h1>Milestone</h1>

	<div class="tiles">
		<a class="tile primary" href="">UCO</a>
		<div class="tile disabled">EAG</div>
		<div class="tile disabled">SCU</div>
	</div>
</div>

<script src="./script.js"></script>
</body>
</html>
