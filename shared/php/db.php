<?php
if (!empty($_ENV['SKIP_LOCAL_DB']) && $_ENV['SKIP_LOCAL_DB'] === 'true') {
	return null;
}

try {
	$pdo = new PDO(
		"pgsql:host=" . $_ENV["DB_HOST"] . ";port=" . $_ENV["DB_PORT"] . ";dbname=" . $_ENV["DB_NAME"],
		$_ENV["DB_USER"],
		$_ENV["DB_PASSWORD"]
	);
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$pdo->exec("SET search_path TO gangdev, public");
} catch (PDOException $e) {
	die("Database connection failed: " . $e->getMessage());
}
