/**
 * lookup.js — Player lookup functionality.
 * Calls /api/account/{name}/{tag} then chains summoner + league data.
 */

(function() {
	'use strict';

	const input = document.getElementById('lookup-input');
	const btn = document.getElementById('lookup-btn');
	const results = document.getElementById('lookup-results');

	if (!input || !btn || !results) return;

	btn.addEventListener('click', doLookup);
	input.addEventListener('keydown', (e) => { if (e.key === 'Enter') doLookup(); });

	async function doLookup() {
		const val = input.value.trim();
		if (!val) return;

		// Parse Riot ID: "Name#Tag" or "Name-Tag"
		let name, tag;
		if (val.includes('#')) {
			[name, tag] = val.split('#');
		} else if (val.includes('-')) {
			const lastDash = val.lastIndexOf('-');
			name = val.substring(0, lastDash);
			tag = val.substring(lastDash + 1);
		} else {
			results.innerHTML = '<p class="lookup-error">Use format: Name#Tag</p>';
			return;
		}

		if (!name || !tag) {
			results.innerHTML = '<p class="lookup-error">Use format: Name#Tag</p>';
			return;
		}

		btn.disabled = true;
		btn.textContent = '...';
		results.innerHTML = '<p class="lookup-loading">Looking up...</p>';

		try {
			// Step 1: Get PUUID
			const accRes = await fetch(`/api/index.php?endpoint=account&p1=${encodeURIComponent(name)}&p2=${encodeURIComponent(tag)}`, { credentials: 'include' });
			const accData = await accRes.json();

			if (!accData.success || !accData.data) {
				results.innerHTML = `<p class="lookup-error">${accData.message || accData.error || 'Player not found.'}</p>`;
				btn.disabled = false;
				btn.textContent = 'Search';
				return;
			}

			const puuid = accData.data.puuid;
			const gameName = accData.data.gameName;
			const tagLine = accData.data.tagLine;

			// Step 2: Get summoner
			const sumRes = await fetch(`/api/index.php?endpoint=summoner&p1=${encodeURIComponent(puuid)}`, { credentials: 'include' });
			const sumData = await sumRes.json();

			// Step 3: Get league (needs summoner ID, not PUUID)
			let leagueData = { success: false };
			if (sumData.success && sumData.data?.id) {
				const leagueRes = await fetch(`/api/index.php?endpoint=league&p1=${encodeURIComponent(sumData.data.id)}`, { credentials: 'include' });
				leagueData = await leagueRes.json();
			}

			// Render
			renderPlayer({
				gameName,
				tagLine,
				puuid,
				summoner: sumData.success ? sumData.data : null,
				league: leagueData.success ? leagueData.data : null,
			});

		} catch (e) {
			results.innerHTML = `<p class="lookup-error">Network error: ${e.message}</p>`;
		}

		btn.disabled = false;
		btn.textContent = 'Search';
	}

	function renderPlayer(player) {
		const level = player.summoner?.summonerLevel ?? '?';
		const iconId = player.summoner?.profileIconId ?? 1;
		const iconUrl = `https://ddragon.leagueoflegends.com/cdn/14.14.1/img/profileicon/${iconId}.png`;

		// Parse ranked data
		let rankedHtml = '<span class="player-unranked">Unranked</span>';
		if (player.league && Array.isArray(player.league)) {
			const soloQ = player.league.find(q => q.queueType === 'RANKED_SOLO_5x5');
			const flex = player.league.find(q => q.queueType === 'RANKED_FLEX_SR');

			if (soloQ || flex) {
				rankedHtml = '';
				if (soloQ) {
					rankedHtml += `<div class="rank-entry"><span class="rank-queue">Solo/Duo</span> <span class="rank-tier">${soloQ.tier} ${soloQ.rank}</span> <span class="rank-lp">${soloQ.leaguePoints} LP</span> <span class="rank-record">${soloQ.wins}W ${soloQ.losses}L</span></div>`;
				}
				if (flex) {
					rankedHtml += `<div class="rank-entry"><span class="rank-queue">Flex</span> <span class="rank-tier">${flex.tier} ${flex.rank}</span> <span class="rank-lp">${flex.leaguePoints} LP</span> <span class="rank-record">${flex.wins}W ${flex.losses}L</span></div>`;
				}
			}
		}

		results.innerHTML = `
			<div class="player-card">
				<img class="player-icon" src="${iconUrl}" alt="icon">
				<div class="player-info">
					<h2 class="player-name">${player.gameName}<span class="player-tag">#${player.tagLine}</span></h2>
					<span class="player-level">Level ${level}</span>
				</div>
				<div class="player-ranks">${rankedHtml}</div>
			</div>
		`;
	}
})();
