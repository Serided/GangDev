<?php
/**
 * admin.php — Platform-level admin utilities.
 * Any gangdev product can include this for admin checks and dev tools.
 * 
 * Admin status comes from gangdev.users.role = 'admin', set in session at login.
 * One user, one role, works everywhere.
 */

/**
 * Is the current session an admin?
 */
function gangdev_is_admin(): bool {
	return ($_SESSION['user_role'] ?? '') === 'admin';
}

/**
 * Require admin — exits with 403 if not.
 */
function gangdev_require_admin(): void {
	if (!gangdev_is_admin()) {
		http_response_code(403);
		exit(json_encode(['error' => 'unauthorized']));
	}
}
