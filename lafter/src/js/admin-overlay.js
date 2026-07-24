/**
 * admin-overlay.js — Admin-only API key expired popup.
 * Only loads/renders for admin users. Polls /api/health every 60s.
 * When key_expired = true, shows a paste field overlay.
 */

(function() {
	'use strict';

	// Only init if user is admin (set by PHP in a global)
	if (typeof LAFTER_USER === 'undefined' || LAFTER_USER.role !== 'admin') return;

	const API_BASE = 'https://api.lafter.gg';
	let pollInterval = null;
	let overlayEl = null;

	// Start polling health endpoint
	function startPolling() {
		pollInterval = setInterval(checkHealth, 60000); // Every 60s
		checkHealth(); // Immediate first check
	}

	async function checkHealth() {
		try {
			const res = await fetch(`${API_BASE}/health`);
			const data = await res.json();
			if (data.key_expired) {
				showOverlay();
			}
		} catch (e) {
			// Network error — don't show overlay, might just be offline
			console.warn('[Lafter Admin] Health check failed:', e.message);
		}
	}

	function showOverlay() {
		if (overlayEl) return; // Already showing

		overlayEl = document.createElement('div');
		overlayEl.id = 'lafter-admin-overlay';
		overlayEl.innerHTML = `
			<div class="admin-key-popup">
				<div class="popup-icon">⚠️</div>
				<h3>API Key Expired</h3>
				<p>Paste your new key from <a href="https://developer.riotgames.com" target="_blank">developer.riotgames.com</a></p>
				<div class="input-row">
					<input type="text" id="new-riot-key" placeholder="RGAPI-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" autocomplete="off" spellcheck="false">
					<button id="save-key-btn">Save</button>
				</div>
				<div class="popup-status" id="key-status"></div>
			</div>
		`;

		document.body.appendChild(overlayEl);

		// Event listeners
		document.getElementById('save-key-btn').addEventListener('click', submitKey);
		document.getElementById('new-riot-key').addEventListener('keydown', (e) => {
			if (e.key === 'Enter') submitKey();
		});

		// Auto-focus the input
		setTimeout(() => document.getElementById('new-riot-key').focus(), 100);
	}

	async function submitKey() {
		const input = document.getElementById('new-riot-key');
		const status = document.getElementById('key-status');
		const btn = document.getElementById('save-key-btn');
		const key = input.value.trim();

		// Validate format
		if (!/^RGAPI-[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(key)) {
			status.textContent = 'Invalid format. Should be RGAPI-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
			status.className = 'popup-status error';
			return;
		}

		btn.disabled = true;
		btn.textContent = 'Saving...';
		status.textContent = '';

		try {
			const res = await fetch(`${API_BASE}/admin.php?action=update_key`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({ key }),
			});

			const data = await res.json();

			if (data.success) {
				status.textContent = '✓ Key updated. Resuming...';
				status.className = 'popup-status success';
				setTimeout(hideOverlay, 1500);
			} else {
				status.textContent = data.message || 'Failed to update key.';
				status.className = 'popup-status error';
				btn.disabled = false;
				btn.textContent = 'Save';
			}
		} catch (e) {
			status.textContent = 'Network error. Try again.';
			status.className = 'popup-status error';
			btn.disabled = false;
			btn.textContent = 'Save';
		}
	}

	function hideOverlay() {
		if (overlayEl) {
			overlayEl.remove();
			overlayEl = null;
		}
	}

	// Init
	startPolling();
})();
