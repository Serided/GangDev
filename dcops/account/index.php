<?php
require_once '/var/www/gangdev/shared/php/init_dcops.php';

if (!isset($_SESSION['dcops_user_id'])) {
	header('Location: https://account.dcops.co/login/signin.php');
	exit;
}

$name  = $_SESSION['dcops_name'] ?? '';
$email = $_SESSION['dcops_email'] ?? '';
$org   = $_SESSION['dcops_org'] ?? '';
?>
<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>DCOPS — Account</title>

	<link rel="stylesheet" href="/account/style.css">
</head>
<body>

<div class="page">

	<div class="top">
		<div class="brand">
			<span class="dc">DC</span><span class="ops">OPS</span>
		</div>

		<form method="post" action="/login/signout.php">
			<button type="submit" class="signOutBtn">Sign out</button>
		</form>
	</div>

	<div class="card">
		<div class="row">
			<span class="label">Name</span>
			<span class="value"><?= htmlspecialchars($name) ?></span>
		</div>

		<div class="row">
			<span class="label">Email</span>
			<span class="value"><?= htmlspecialchars($email) ?></span>
		</div>

		<div class="row">
			<span class="label">Organization</span>
			<span class="value"><?= htmlspecialchars($org ?: '—') ?></span>
		</div>
	</div>

</div>

</body>
</html>
