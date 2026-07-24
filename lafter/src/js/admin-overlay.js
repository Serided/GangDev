/**
 * admin-overlay.js — Admin-only controls.
 * 1. API key expired popup (auto-appears on 403)
 * 2. Admin toolbar (public/private toggle, key status)
 * Only loads for admin users (LAFTER_USER.role === 'admin').
 */

(function() {
	'use strict';

	if (typeof LAFTER_USER === 'undefined' || LAFTER_USER.role !== 'admin') return;

	const API_BASE = '/api';
	let overlayEl = null;
	let toolbarEl = null;

	// === Admin Toolbar (always visible for admin) ===

	function createToolbar() {
		toolbarEl = document.createElement('div');
		toolbarEl.id = 'lafter-admin-toolbar';
		toolbarEl.innerHTML = `
			<span class="toolbar-label">ADMIN</span>
			<button id="toggle-public-btn" class="toolbar-btn">...</button>
			<span class="toolbar-status" id="toolbar-key-status"></span>
		`;
		document.body.appendChild(toolbarEl);

		document.getElementById('toggle-public-btn').addEventListener('click', togglePublic);
		refreshStatus();
	}

	async function refreshStatus() {
		try {
			const res = await fetch(`${API_BASE}/admin.php?action=status`, { credentials: 'include' });
			const data = await res.json();

			const btn = document.getElementById('toggle-public-btn');
			const keyStatus = document.getElementById('toolbar-key-status');

			btn.textContent = data.is_public ? '🟢 PUBLIC' : '🔒 PRIVATE';
			btn.className = 'toolbar-btn ' + (data.is_public ? 'public' : 'private');

			if (data.key_expired) {
				keyStatus.textContent = '⚠️ Key expired';
				keyStatus.className = 'toolbar-status expired';
				showKeyOverlay();
			} else if (!data.key_set) {
				keyStatus.textContent = '⚠️ No key set';
				keyStatus.className = 'toolbar-status expired';
				showKeyOverlay();
			} else {
				keyStatus.textContent = '✓ ' + data.key_prefix;
				keyStatus.className = 'toolbar-status ok';
			}
		} catch (e) {
			console.warn('[Lafter Admin] Status check failed:', e.message);
		}
	}

	async function togglePublic() {
		try {
			const res = await fetch(`${API_BASE}/admin.php?action=toggle_public`, {
				method: 'POST',
				credentials: 'include',
			});
			const data = await res.json();
			if (data.success) refreshStatus();
		} catch (e) {
			console.warn('[Lafter Admin] Toggle failed:', e.message);
		}
	}

	// === Key Expired Overlay ===

	function showKeyOverlay() {
		if (overlayEl) return;

		overlayEl = document.createElement('div');
		overlayEl.id = 'lafter-admin-overlay';
		overlayEl.innerHTML = `
			<div class="admin-key-popup">
				<div class="popup-icon">⚠️</div>
				<h3>API Key Needed</h3>
				<p>Paste your key from <a href="https://developer.riotgames.com" target="_blank">developer.riotgames.com</a></p>
				<div class="input-row">
					<input type="text" id="new-riot-key" placeholder="RGAPI-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" autocomplete="off" spellcheck="false">
					<button id="save-key-btn">Save</button>
				</div>
				<div class="popup-status" id="key-status"></div>
				<button class="dismiss-btn" id="dismiss-overlay">Dismiss</button>
			</div>
		`;

		document.body.appendChild(overlayEl);

		document.getElementById('save-key-btn').addEventListener('click', submitKey);
		document.getElementById('new-riot-key').addEventListener('keydown', (e) => {
			if (e.key === 'Enter') submitKey();
		});
		document.getElementById('dismiss-overlay').addEventListener('click', hideKeyOverlay);

		setTimeout(() => document.getElementById('new-riot-key').focus(), 100);
	}

	async function submitKey() {
		const input = document.getElementById('new-riot-key');
		const status = document.getElementById('key-status');
		const btn = document.getElementById('save-key-btn');
		const key = input.value.trim();

		if (!/^RGAPI-[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(key)) {
			status.textContent = 'Invalid format.';
			status.className = 'popup-status error';
			return;
		}

		btn.disabled = true;
		btn.textContent = 'Saving...';

		try {
			const res = await fetch(`${API_BASE}/admin.php?action=update_key`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({ key }),
			});
			const data = await res.json();

			if (data.success) {
				status.textContent = '✓ Key updated.';
				status.className = 'popup-status success';
				setTimeout(() => { hideKeyOverlay(); refreshStatus(); }, 1000);
			} else {
				status.textContent = data.message || 'Failed.';
				status.className = 'popup-status error';
				btn.disabled = false;
				btn.textContent = 'Save';
			}
		} catch (e) {
			status.textContent = 'Network error.';
			status.className = 'popup-status error';
			btn.disabled = false;
			btn.textContent = 'Save';
		}
	}

	function hideKeyOverlay() {
		if (overlayEl) { overlayEl.remove(); overlayEl = null; }
	}

	// === Polling ===
	setInterval(refreshStatus, 60000);

	// === Init ===
	createToolbar();
})();
