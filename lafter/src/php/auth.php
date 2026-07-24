<?php
/**
 * auth.php — Lafter auth helpers.
 * Uses gangdev.co session (shared cookie on .gangdev.co domain).
 * Admin role comes from gangdev.users.role (platform-level, works across all products).
 */

/**
 * Get the current Lafter user (gangdev session + lafter-specific data).
 * Returns null if not logged in or no lafter row exists.
 */
function lafter_user(): ?array {
	global $pdo;
	
	$gangdevId = $_SESSION['user_id'] ?? null;
	if (!$gangdevId) return null;

	$stmt = $pdo->prepare("
		SELECT lu.*, u.display_name, u.username, u.email, u.role
		FROM lafter.users lu
		JOIN gangdev.users u ON u.id = lu.gangdev_user_id
		WHERE lu.gangdev_user_id = ?
	");
	$stmt->execute([$gangdevId]);
	return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
}

/**
 * Auto-create lafter user row on first visit (if gangdev session exists).
 */
function lafter_ensure_user(): ?array {
	global $pdo;

	$gangdevId = $_SESSION['user_id'] ?? null;
	if (!$gangdevId) return null;

	$user = lafter_user();
	if ($user) return $user;

	$stmt = $pdo->prepare("
		INSERT INTO lafter.users (gangdev_user_id)
		VALUES (?)
		ON CONFLICT (gangdev_user_id) DO NOTHING
	");
	$stmt->execute([$gangdevId]);
	
	return lafter_user();
}

/**
 * Platform-level admin check. Works across all gangdev products.
 * Uses session role (set at login from gangdev.users.role).
 */
function lafter_is_admin(): bool {
	return ($_SESSION['user_role'] ?? '') === 'admin';
}

/**
 * Get gangdev login URL with redirect back to lafter.
 */
function lafter_login_url(string $returnTo = 'https://lafter.gg'): string {
	return 'https://account.gangdev.co/login/signin.php?redirect=' . urlencode($returnTo);
}

/**
 * Get gangdev signout URL.
 */
function lafter_signout_url(): string {
	return 'https://account.gangdev.co/login/signout.php';
}
