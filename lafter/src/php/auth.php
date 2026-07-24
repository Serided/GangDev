<?php
/**
 * auth.php — Lafter auth helpers.
 * Lafter has standalone accounts (lafter.users).
 * Optional gangdev link via gangdev_user_id.
 * Admin = lafter.users.role = 'admin' OR gangdev.users.role = 'admin' (platform override).
 */

/**
 * Get the current Lafter user from session.
 * Checks lafter_user_id first (lafter login), then gangdev user_id (gangdev SSO).
 */
function lafter_user(): ?array {
	global $pdo;

	// Lafter direct login
	$lafterId = $_SESSION['lafter_user_id'] ?? null;
	if ($lafterId) {
		$stmt = $pdo->prepare("SELECT * FROM lafter.users WHERE id = ?");
		$stmt->execute([$lafterId]);
		return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
	}

	// Gangdev SSO login (user logged in via gangdev.co)
	$gangdevId = $_SESSION['user_id'] ?? null;
	if ($gangdevId) {
		$stmt = $pdo->prepare("SELECT * FROM lafter.users WHERE gangdev_user_id = ?");
		$stmt->execute([$gangdevId]);
		return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
	}

	return null;
}

/**
 * Auto-create lafter user row when logging in via gangdev SSO.
 */
function lafter_ensure_user(): ?array {
	global $pdo;

	$gangdevId = $_SESSION['user_id'] ?? null;
	if (!$gangdevId) return null;

	$user = lafter_user();
	if ($user) return $user;

	// Create lafter row linked to gangdev account
	$stmt = $pdo->prepare("
		INSERT INTO lafter.users (gangdev_user_id, display_name, username, email, password_hash, role, created_at, updated_at)
		VALUES (?, ?, ?, ?, '', 'user', NOW(), NOW())
		ON CONFLICT (gangdev_user_id) DO NOTHING
	");
	$stmt->execute([
		$gangdevId,
		$_SESSION['display_name'] ?? '',
		$_SESSION['username'] ?? '',
		$_SESSION['email'] ?? '',
	]);

	return lafter_user();
}

/**
 * Is the current user logged in (either lafter or gangdev session)?
 */
function lafter_logged_in(): bool {
	return isset($_SESSION['lafter_user_id']) || isset($_SESSION['user_id']);
}

/**
 * Admin check. True if:
 * - lafter.users.role = 'admin' (product-level)
 * - OR gangdev.users.role = 'admin' (platform override via session)
 */
function lafter_is_admin(): bool {
	// Platform-level override
	if (($_SESSION['user_role'] ?? '') === 'admin') return true;

	// Product-level check
	$user = lafter_user();
	return $user && ($user['role'] ?? '') === 'admin';
}

/**
 * Get lafter login URL.
 */
function lafter_login_url(string $returnTo = 'https://lafter.gg'): string {
	return 'https://lafter.gg/account/login/signin.php?redirect=' . urlencode($returnTo);
}

/**
 * Get lafter signout URL.
 */
function lafter_signout_url(): string {
	return 'https://lafter.gg/account/login/signout.php';
}
