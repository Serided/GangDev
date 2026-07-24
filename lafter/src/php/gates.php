<?php
/**
 * gates.php — Feature gating for Lafter.
 * Controls what's publicly visible vs. dev/admin-only.
 * 
 * Public state stored in a flag file (toggleable by admin via UI).
 * While private: all Riot-powered features are admin-only.
 */

define('LAFTER_PUBLIC_FLAG', LAFTER_FLAG_DIR . '/.lafter_public');

/**
 * Is the product publicly available?
 */
function lafter_is_public(): bool {
	return file_exists(LAFTER_PUBLIC_FLAG);
}

/**
 * Toggle public/private state. Admin only.
 */
function lafter_set_public(bool $public): void {
	if ($public) {
		@file_put_contents(LAFTER_PUBLIC_FLAG, date('c'));
	} else {
		if (file_exists(LAFTER_PUBLIC_FLAG)) @unlink(LAFTER_PUBLIC_FLAG);
	}
}

/**
 * Check if Riot-powered features are available to the current user.
 * Returns true if: product is public OR user is admin (dev testing).
 * 
 * Admin can append ?view=user to any page to see it as a normal user would.
 */
function lafter_can_use_api(): bool {
	// Admin user-view override: toggle via ?view=user / ?view=admin, persists in session
	if (isset($_GET['view']) && lafter_is_admin()) {
		if ($_GET['view'] === 'user') {
			$_SESSION['lafter_view'] = 'user';
		} else {
			unset($_SESSION['lafter_view']);
		}
	}
	if (!empty($_SESSION['lafter_view']) && $_SESSION['lafter_view'] === 'user' && lafter_is_admin()) {
		return lafter_is_public(); // only true if actually public
	}
	if (lafter_is_public()) return true;
	return lafter_is_admin();
}

/**
 * Gate message for features pending production API.
 */
function lafter_gate_message(): string {
	return 'Lafter is in development. This feature will be available once our production API is approved by Riot Games.';
}
