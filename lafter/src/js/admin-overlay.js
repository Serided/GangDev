/**
 * admin-overlay.js — Admin-only controls.
 * 1. Collapsible admin panel (square button, bottom-right)
 * 2. Public/Private toggle (reloads page)
 * 3. Key status (clickable to change)
 * 4. Admin/User view toggle (adds ?view=user to URL, reloads — PHP handles the rest)
 * 5. Auto key popup on expired/missing key
 */

(function() {
	'use strict';

	if (typeof LAFTER_USER === 'undefined' || LAFTER_USER.role !== 'admin') return;

	const API_BASE = '/api';
	let overlayEl = null;
	let toolbarEl = null;
	let panelOpen = localStorage.getItem('lafter_panel_open') === 'true';

	// Detect current view from PHP session (injected via LAFTER_USER.view)
	const isUserView = LAFTER_USER.view === 'user';

	// === Admin Toolbar ===

	function createToolbar() {
		toolbarEl = document.createElement('div');
		toolbarEl.id = 'lafter-admin-toolbar';
		toolbarEl.innerHTML = `
			<button class="admin-toggle" id="admin-toggle-btn">▲</button>
			<div class="admin-panel" id="admin-panel">
				<div class="admin-panel-row">
					<span class="toolbar-label">MODE</span>
					<button id="toggle-public-btn" class="toolbar-btn">...</button>
				</div>
				<div class="admin-panel-row">
					<span class="toolbar-label">KEY</span>
					<span class="toolbar-status toolbar-key-clickable" id="toolbar-key-status" title="Click to change key"></span>
				</div>
				<div class="admin-panel-row">
					<span class="toolbar-label">VIEW</span>
					<button id="view-cycle-btn" class="toolbar-btn view-btn ${isUserView ? 'active' : ''}">${isUserView ? 'User' : 'Admin'}</button>
				</div>
			</div>
		`;
		document.body.appendChild(toolbarEl);

		document.getElementById('admin-toggle-btn').addEventListener('click', togglePanel);
		document.getElementById('toggle-public-btn').addEventListener('click', togglePublic);
		document.getElementById('toolbar-key-status').addEventListener('click', () => showKeyOverlay());
		document.getElementById('view-cycle-btn').addEventListener('click', cycleView);
		applyPanelState();
		refreshStatus();
	}

	function togglePanel() {
		panelOpen = !panelOpen;
		localStorage.setItem('lafter_panel_open', panelOpen);
		applyPanelState();
	}

	function applyPanelState() {
		document.getElementById('admin-panel').classList.toggle('open', panelOpen);
		document.getElementById('admin-toggle-btn').classList.toggle('open', panelOpen);
	}

	// === View Cycle — just toggles ?view=user in the URL and reloads ===

	function cycleView() {
		const url = new URL(window.location.href);
		if (isUserView) {
			url.searchParams.set('view', 'admin');
		} else {
			url.searchParams.set('view', 'user');
		}
		window.location.href = url.toString();
	}

	// === Status ===

	async function refreshStatus() {
		try {
			const res = await fetch(`${API_BASE}/admin.php?action=status`, { credentials: 'include' });
			const data = await res.json();

			const btn = document.getElementById('toggle-public-btn');
			const keyStatus = document.getElementById('toolbar-key-status');

			btn.textContent = data.is_public ? '🟢 PUBLIC' : '🔒 PRIVATE';
			btn.className = 'toolbar-btn ' + (data.is_public ? 'public' : 'private');

			if (data.key_expired) {
				keyStatus.textContent = '⚠️ Expired';
				keyStatus.className = 'toolbar-status toolbar-key-clickable expired';
				if (!isUserView) showKeyOverlay();
			} else if (!data.key_set) {
				keyStatus.textContent = '⚠️ Not set';
				keyStatus.className = 'toolbar-status toolbar-key-clickable expired';
				if (!isUserView) showKeyOverlay();
			} else {
				keyStatus.textContent = '✓ ' + data.key_prefix;
				keyStatus.className = 'toolbar-status toolbar-key-clickable ok';
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
			if (data.success) location.reload();
		} catch (e) {
			console.warn('[Lafter Admin] Toggle failed:', e.message);
		}
	}

	// === Key Overlay ===

	function showKeyOverlay() {
		if (overlayEl) return;

		overlayEl = document.createElement('div');
		overlayEl.id = 'lafter-admin-overlay';
		overlayEl.innerHTML = `
			<div class="admin-key-popup">
				<div class="popup-icon">⚠️</div>
				<h3>API Key Needed</h3>
				<p>Paste your key from <a href="https://developer.riotgames.com" target="_blank">developer.riotgames.com</a></p>
				<div class="key-input-row">
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
