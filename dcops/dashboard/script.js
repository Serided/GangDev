const $ = (id) => document.getElementById(id)

const side = $('side')
const hamburger = $('hamburger')
const backdrop = $('backdrop')
const topbar = document.querySelector('.topbar')

const activityPill = $('activityPill')
const locationPill = $('locationPill')
const activityValue = $('activityValue')
const locationValue = $('locationValue')

const filterModal = $('filterModal')
const filterTitle = $('filterTitle')
const filterList = $('filterList')
const filterClose = $('filterClose')
const filterCancel = $('filterCancel')
const filterSave = $('filterSave')

const deckPrev = $('deckPrev')
const deckNext = $('deckNext')
const deckTabs = $('deckTabs')
const deckArea = $('deckArea')
const kpiSubtitle = $('kpiSubtitle')

const perfTable = $('perfTable')
const perfSubtitle = $('perfSubtitle')

const globalSearch = $('globalSearch')
const searchResults = $('searchResults')

const LS_ACTIVITIES = 'dcops_activities'
const LS_LOCATIONS = 'dcops_locations'
const LS_DECK_KEY = 'dcops_kpi_deck'

const ACTIVITIES = [
    { key: 'slc_audit', label: 'SLC Audit' },
    { key: 'movements', label: 'Movements' },
    { key: 'rack_ops', label: 'Rack Ops' }
]

const LOCATIONS = [
    { key: 'uco', label: 'UCO' },
    { key: 'eag', label: 'EAG' },
    { key: 'scu', label: 'SCU' }
]

const KPI_DECKS = {
    slc_audit: {
        label: 'SLC Audit',
        tiles: [
            { name: 'Completed Today', value: '—', meta: 'SLC audit completions' },
            { name: 'Pending Re-SLC', value: '—', meta: 'Needs re-work' },
            { name: 'Pending Audit', value: '—', meta: 'Awaiting audit' },
            { name: 'Pending L2', value: '—', meta: 'Awaiting verification' },
            { name: 'Failures', value: '—', meta: 'Failed / not done' },
            { name: 'Avg Time', value: '—', meta: 'Per rack' },
            { name: 'Oldest Pending', value: '—', meta: 'Longest waiting' },
            { name: 'Today Rate', value: '—', meta: 'Racks / hour' }
        ]
    },
    movements: {
        label: 'Movements',
        tiles: [
            { name: 'Move Orders', value: '—', meta: 'Open' },
            { name: 'Transfers', value: '—', meta: 'In progress' },
            { name: 'Shipments', value: '—', meta: 'Queued' },
            { name: 'Transport', value: '—', meta: 'Active' },
            { name: 'Returns', value: '—', meta: 'Processing' },
            { name: 'Exceptions', value: '—', meta: 'Needs attention' }
        ]
    },
    rack_ops: {
        label: 'Rack Ops',
        tiles: [
            { name: 'SLC Completed', value: '—', meta: 'Today' },
            { name: 'Pending Set', value: '—', meta: 'Feet down' },
            { name: 'Pending Labels', value: '—', meta: 'Tagging' },
            { name: 'Re-SLC Queue', value: '—', meta: 'Rework' },
            { name: 'Failures', value: '—', meta: 'Failed / blocked' }
        ]
    }
}

const SUMMARY_TILE_MAP = {
    slc_audit: [
        { name: 'Audit Done', meta: 'Today' },
        { name: 'Audit Pending', meta: 'Queue' }
    ],
    movements: [
        { name: 'Moves Open', meta: 'Queue' },
        { name: 'Moves Issues', meta: 'Exceptions' }
    ],
    rack_ops: [
        { name: 'SLC Done', meta: 'Today' },
        { name: 'Re-SLC Pending', meta: 'Queue' }
    ]
}

let state = {
    filterMode: null,
    activities: [],
    locations: [],
    decks: [],
    activeDeckKey: null,
    modalDraft: []
}

function setBackdrop(on) {
    if (on) backdrop.classList.add('open')
    else backdrop.classList.remove('open')
}

function openSide() {
    side.classList.add('open')
    topbar.classList.add('menuOpen')
    setBackdrop(true)
}

function closeSide() {
    side.classList.remove('open')
    topbar.classList.remove('menuOpen')
    setBackdrop(false)
}

function toggleSide() {
    if (side.classList.contains('open')) closeSide()
    else openSide()
}

function openModal() {
    filterModal.setAttribute('aria-hidden', 'false')
    filterModal.classList.add('open')
    setBackdrop(true)
}

function closeModal() {
    filterModal.setAttribute('aria-hidden', 'true')
    filterModal.classList.remove('open')
    setBackdrop(false)
}

function closeAllOverlays() {
    closeModal()
    if (side.classList.contains('open')) closeSide()
    searchResults.classList.remove('open')
    searchResults.innerHTML = ''
}

function preventDisabledClicks() {
    document.querySelectorAll('[data-disabled="1"]').forEach(el => {
        el.addEventListener('click', (e) => e.preventDefault())
    })
}

function setChev(btn, open) {
    const chev = btn.querySelector('.chev')
    if (!chev) return
    chev.textContent = open ? '−' : '+'
}

function initAccordion() {
    const groups = Array.from(document.querySelectorAll('.navGroup'))
    const modules = Array.from(document.querySelectorAll('.navModule'))

    groups.forEach(g => {
        const btn = g.querySelector('.navGroupBtn')
        if (!btn) return
        setChev(btn, g.classList.contains('open'))
        btn.addEventListener('click', () => {
            const isOpen = g.classList.contains('open')

            groups.forEach(x => {
                x.classList.remove('open')
                const b = x.querySelector('.navGroupBtn')
                if (b) setChev(b, false)
            })

            modules.forEach(m => {
                m.classList.remove('open')
                const mb = m.querySelector('.navModuleBtn')
                if (mb) setChev(mb, false)
            })

            if (!isOpen) {
                g.classList.add('open')
                setChev(btn, true)
            }
        })
    })

    modules.forEach(m => {
        const btn = m.querySelector('.navModuleBtn')
        if (!btn) return
        setChev(btn, m.classList.contains('open'))
        btn.addEventListener('click', () => {
            const parentGroup = m.closest('.navGroup')
            if (!parentGroup) return
            const siblings = Array.from(parentGroup.querySelectorAll('.navModule'))
            const isOpen = m.classList.contains('open')

            siblings.forEach(x => {
                x.classList.remove('open')
                const b = x.querySelector('.navModuleBtn')
                if (b) setChev(b, false)
            })

            if (!isOpen) {
                m.classList.add('open')
                setChev(btn, true)
            }
        })
    })
}

function safeJson(v, fallback) {
    try { return JSON.parse(v) } catch { return fallback }
}

function dedupe(arr) {
    const out = []
    const seen = new Set()
    for (const v of arr) {
        if (seen.has(v)) continue
        seen.add(v)
        out.push(v)
    }
    return out
}

function normalizeSelections() {
    state.activities = dedupe(state.activities).filter(k => ACTIVITIES.some(a => a.key === k))
    state.locations = dedupe(state.locations).filter(k => LOCATIONS.some(l => l.key === k))
    if (state.activities.length === 0) state.activities = ['slc_audit']
    if (state.locations.length === 0) state.locations = ['scu']
}

function labelFor(keys, catalog, allLabel) {
    const allKeys = catalog.map(x => x.key)
    const selected = keys.filter(k => allKeys.includes(k))
    if (selected.length === allKeys.length) return allLabel
    const labels = selected.map(k => catalog.find(x => x.key === k)?.label ?? k)
    if (labels.length <= 2) return labels.join(', ')
    return `${labels.slice(0, 2).join(', ')} +${labels.length - 2}`
}

function buildDecks() {
    const selected = state.activities.slice()
    const decks = []

    if (selected.length > 1) {
        const tiles = []
        selected.forEach(k => {
            const row = SUMMARY_TILE_MAP[k] || []
            row.forEach(t => tiles.push({ name: t.name, value: '—', meta: `${KPI_DECKS[k]?.label ?? k} · ${t.meta}` }))
        })
        decks.push({ key: 'summary', label: 'Summary', tiles })
    }

    selected.forEach(k => {
        const def = KPI_DECKS[k]
        if (!def) return
        decks.push({ key: k, label: def.label, tiles: def.tiles })
    })

    state.decks = decks
}

function setActiveDeck(key) {
    state.activeDeckKey = key
    localStorage.setItem(LS_DECK_KEY, key)
    renderDeckTabs()
    renderDeckArea()
    renderPerf()
}

function renderFilterPills() {
    const aText = labelFor(state.activities, ACTIVITIES, 'All')
    const lText = labelFor(state.locations, LOCATIONS, 'All')
    activityValue.textContent = aText
    locationValue.textContent = lText
    kpiSubtitle.textContent = `${lText} locations`
    perfSubtitle.textContent = `Filtered by activity + location`
}

function syncModalChecks() {
    filterList.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.checked = state.modalDraft.includes(cb.value)
    })
}

function openFilter(mode) {
    state.filterMode = mode
    state.modalDraft = (mode === 'activity' ? state.activities.slice() : state.locations.slice())
    filterTitle.textContent = mode === 'activity' ? 'Activity' : 'Location'

    const list = mode === 'activity' ? ACTIVITIES : LOCATIONS
    const allKeys = list.map(x => x.key)

    filterList.innerHTML = `
		<div class="filterRowTop">
			<button class="filterMini" id="filterAll" type="button">All</button>
			<button class="filterMini" id="filterNone" type="button">Clear</button>
		</div>
		${list.map(item => {
        const checked = state.modalDraft.includes(item.key) ? 'checked' : ''
        return `
				<label class="checkRow">
					<input type="checkbox" value="${escapeHtml(item.key)}" ${checked}>
					<span class="checkText">${escapeHtml(item.label)}</span>
				</label>
			`
    }).join('')}
	`

    $('filterAll').addEventListener('click', () => {
        state.modalDraft = allKeys.slice()
        syncModalChecks()
    })

    $('filterNone').addEventListener('click', () => {
        state.modalDraft = []
        syncModalChecks()
    })

    filterList.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', () => {
            const key = cb.value
            if (cb.checked) {
                if (!state.modalDraft.includes(key)) state.modalDraft.push(key)
            } else {
                state.modalDraft = state.modalDraft.filter(x => x !== key)
            }
        })
    })

    openModal()
}

function applyFilterSave() {
    if (state.filterMode === 'activity') state.activities = state.modalDraft.slice()
    if (state.filterMode === 'location') state.locations = state.modalDraft.slice()

    normalizeSelections()
    localStorage.setItem(LS_ACTIVITIES, JSON.stringify(state.activities))
    localStorage.setItem(LS_LOCATIONS, JSON.stringify(state.locations))

    buildDecks()
    if (!state.decks.some(d => d.key === state.activeDeckKey)) state.activeDeckKey = state.decks[0]?.key ?? null
    if (state.activeDeckKey) localStorage.setItem(LS_DECK_KEY, state.activeDeckKey)

    renderFilterPills()
    renderDeckTabs()
    renderDeckArea()
    renderPerf()
    closeModal()
}

function renderDeckTabs() {
    deckTabs.innerHTML = ''
    state.decks.forEach((d) => {
        const b = document.createElement('button')
        b.type = 'button'
        b.className = 'deckTab' + (d.key === state.activeDeckKey ? ' active' : '')
        b.textContent = d.label
        b.addEventListener('click', () => setActiveDeck(d.key))
        deckTabs.appendChild(b)
    })
    const activeIndex = state.decks.findIndex(d => d.key === state.activeDeckKey)
    if (activeIndex >= 0) {
        const el = deckTabs.children[activeIndex]
        if (el && typeof el.scrollIntoView === 'function') el.scrollIntoView({ block: 'nearest', inline: 'center' })
    }
}

function renderDeckArea() {
    const deck = state.decks.find(d => d.key === state.activeDeckKey)
    if (!deck) {
        deckArea.innerHTML = ''
        return
    }
    deckArea.innerHTML = `
		<div class="tilesRail">
			${deck.tiles.map(t => `
				<div class="kpiTileX">
					<div class="kpiName">${escapeHtml(t.name)}</div>
					<div class="kpiValue">${escapeHtml(t.value)}</div>
					<div class="kpiMeta">${escapeHtml(t.meta || '')}</div>
				</div>
			`).join('')}
		</div>
	`
}

function renderPerf() {
    const deck = state.decks.find(d => d.key === state.activeDeckKey)
    const mode = deck?.key || 'summary'

    const selfEmail = (window.DCOPS_DASH?.userEmail || '').toLowerCase()
    const selfName = (window.DCOPS_DASH?.userName || 'You')

    const people = [
        { name: selfName, email: selfEmail, reslc: 4, audit: 6, done: 5, fail: 1 },
        { name: 'Operator A', email: 'a@milestone.tech', reslc: 2, audit: 4, done: 3, fail: 0 },
        { name: 'Operator B', email: 'b@milestone.tech', reslc: 1, audit: 3, done: 2, fail: 1 },
        { name: 'Operator C', email: 'c@milestone.tech', reslc: 0, audit: 2, done: 1, fail: 0 }
    ]

    const sorted = people.slice().sort((x, y) => {
        if (x.email === selfEmail && y.email !== selfEmail) return -1
        if (y.email === selfEmail && x.email !== selfEmail) return 1
        return (y.done - x.done) || (y.audit - x.audit) || (y.reslc - x.reslc)
    })

    const cols = mode === 'movements'
        ? ['Name', 'Transfers', 'Shipments', 'Returns', 'Issues']
        : ['Name', 'Re-SLC', 'Audited', 'Completed', 'Failures']

    const rows = sorted.map(p => {
        const isSelf = p.email && selfEmail && p.email === selfEmail
        const rowClass = 'perfRow' + (isSelf ? ' self' : '')
        const cells = mode === 'movements'
            ? [p.name, '—', '—', '—', '—']
            : [p.name, String(p.reslc), String(p.audit), String(p.done), String(p.fail)]
        return `
			<div class="${rowClass}">
				${cells.map(v => `<div class="perfC">${escapeHtml(v)}</div>`).join('')}
			</div>
		`
    }).join('')

    perfTable.innerHTML = `
		<div class="perfHead">
			${cols.map(c => `<div class="perfH">${escapeHtml(c)}</div>`).join('')}
		</div>
		<div class="perfBody">${rows}</div>
	`
}

function deckIndex() {
    return state.decks.findIndex(d => d.key === state.activeDeckKey)
}

function goPrevDeck() {
    const i = deckIndex()
    if (i <= 0) return
    setActiveDeck(state.decks[i - 1].key)
}

function goNextDeck() {
    const i = deckIndex()
    if (i < 0 || i >= state.decks.length - 1) return
    setActiveDeck(state.decks[i + 1].key)
}

function normalizeQuery(q) {
    return q.trim().replace(/\s+/g, ' ')
}

function fakeSearch(q) {
    const query = normalizeQuery(q)
    if (!query) return []
    const results = []
    const looksLikeRack = /(\bUCO1\b|\bEAG\b|\bSCU\b|\d{1,2}[A-Z]\b|\d{2}[FB]\b|\b\d{1,2}\b)/i.test(query)
    if (looksLikeRack) results.push({ primary: query.toUpperCase(), secondary: 'Jump (not wired yet)', tag: 'Rack' })
    if (/uco/i.test(query)) results.push({ primary: 'UCO', secondary: 'Campus', tag: 'Location' })
    if (/eag/i.test(query)) results.push({ primary: 'EAG', secondary: 'Campus', tag: 'Location' })
    if (/scu/i.test(query)) results.push({ primary: 'SCU', secondary: 'Campus', tag: 'Location' })
    return results.slice(0, 6)
}

function renderSearch(results) {
    if (!results.length) {
        searchResults.classList.remove('open')
        searchResults.innerHTML = ''
        return
    }
    searchResults.classList.add('open')
    searchResults.innerHTML = results.map(r => `
		<div class="searchRow" role="button" tabindex="0">
			<div class="searchRowLeft">
				<div class="searchPrimary">${escapeHtml(r.primary)}</div>
				<div class="searchSecondary">${escapeHtml(r.secondary)}</div>
			</div>
			<div class="searchTag">${escapeHtml(r.tag)}</div>
		</div>
	`).join('')
    Array.from(searchResults.querySelectorAll('.searchRow')).forEach((row) => {
        row.addEventListener('click', () => {
            searchResults.classList.remove('open')
        })
    })
}

function escapeHtml(s) {
    return String(s)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;')
}

function loadState() {
    const a = safeJson(localStorage.getItem(LS_ACTIVITIES), null)
    const l = safeJson(localStorage.getItem(LS_LOCATIONS), null)

    state.activities = Array.isArray(a) ? a : ['slc_audit']
    state.locations = Array.isArray(l) ? l : ['scu']

    normalizeSelections()
    buildDecks()

    state.activeDeckKey = localStorage.getItem(LS_DECK_KEY) || (state.decks[0]?.key ?? null)
    if (!state.decks.some(d => d.key === state.activeDeckKey)) state.activeDeckKey = state.decks[0]?.key ?? null

    renderFilterPills()
    renderDeckTabs()
    renderDeckArea()
    renderPerf()
}

function wireEvents() {
    hamburger.addEventListener('click', toggleSide)
    backdrop.addEventListener('click', closeAllOverlays)

    activityPill.addEventListener('click', () => openFilter('activity'))
    locationPill.addEventListener('click', () => openFilter('location'))

    filterClose.addEventListener('click', closeModal)
    filterCancel.addEventListener('click', closeModal)
    filterSave.addEventListener('click', applyFilterSave)

    deckPrev.addEventListener('click', goPrevDeck)
    deckNext.addEventListener('click', goNextDeck)

    let searchTimer = null
    globalSearch.addEventListener('input', () => {
        clearTimeout(searchTimer)
        searchTimer = setTimeout(() => renderSearch(fakeSearch(globalSearch.value)), 70)
    })

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllOverlays()
    })

    document.addEventListener('click', (e) => {
        if (!searchResults.contains(e.target) && e.target !== globalSearch) {
            searchResults.classList.remove('open')
        }
    })
}

preventDisabledClicks()
initAccordion()
loadState()
wireEvents()
