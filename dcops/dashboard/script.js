const $ = (id) => document.getElementById(id)

const side = $('side')
const hamburger = $('hamburger')
const sideToggle = $('sideToggle')
const backdrop = $('backdrop')

const teamDrawer = $('teamDrawer')
const teamBtn = $('teamBtn')
const teamClose = $('teamClose')

const activitySelect = $('activitySelect')
const locationSelect = $('locationSelect')
const kpiSubtitle = $('kpiSubtitle')

const kpiTrack = $('kpiTrack')
const kpiDots = $('kpiDots')
const kpiPrev = $('kpiPrev')
const kpiNext = $('kpiNext')

const globalSearch = $('globalSearch')
const searchResults = $('searchResults')

const LS_ACTIVITY = 'dcops_activity'
const LS_LOCATION = 'dcops_location'
const LS_KPI_PAGE = 'dcops_kpi_page'

function setBackdrop(on){
    if(on) backdrop.classList.add('open')
    else backdrop.classList.remove('open')
}

function openSide(){
    side.classList.add('open')
    setBackdrop(true)
}

function closeSide(){
    side.classList.remove('open')
    setBackdrop(false)
}

function openTeam(){
    teamDrawer.classList.add('open')
    teamDrawer.setAttribute('aria-hidden','false')
    setBackdrop(true)
}

function closeTeam(){
    teamDrawer.classList.remove('open')
    teamDrawer.setAttribute('aria-hidden','true')
    setBackdrop(false)
}

function closeAll(){
    closeSide()
    closeTeam()
}

hamburger?.addEventListener('click', () => {
    if(side.classList.contains('open')) closeSide()
    else openSide()
})

sideToggle?.addEventListener('click', () => {
    if(side.classList.contains('open')) closeSide()
    else openSide()
})

teamBtn?.addEventListener('click', () => {
    if(teamDrawer.classList.contains('open')) closeTeam()
    else openTeam()
})

teamClose?.addEventListener('click', closeTeam)
backdrop?.addEventListener('click', closeAll)

document.querySelectorAll('[data-disabled="1"]').forEach(el => {
    el.addEventListener('click', (e) => {
        e.preventDefault()
    })
})

function subtitle(){
    const a = activitySelect.value
    const l = locationSelect.value

    const aLabel = a === 'all' ? 'All activities' : (a === 'slc_audit' ? 'SLC Audit' : a)
    const lLabel = l === 'all' ? 'All locations' : l.toUpperCase()

    kpiSubtitle.textContent = `${aLabel} · ${lLabel}`
}

function loadFilters(){
    const a = localStorage.getItem(LS_ACTIVITY)
    const l = localStorage.getItem(LS_LOCATION)
    if(a) activitySelect.value = a
    if(l) locationSelect.value = l
    subtitle()
}

activitySelect.addEventListener('change', () => {
    localStorage.setItem(LS_ACTIVITY, activitySelect.value)
    subtitle()
})

locationSelect.addEventListener('change', () => {
    localStorage.setItem(LS_LOCATION, locationSelect.value)
    subtitle()
})

function kpiPageCount(){
    return kpiTrack ? kpiTrack.children.length : 0
}

function setKpiPage(i){
    const count = kpiPageCount()
    if(!count) return
    const idx = Math.max(0, Math.min(count - 1, i))
    const w = kpiTrack.clientWidth
    kpiTrack.scrollTo({ left: idx * w, behavior: 'smooth' })
    localStorage.setItem(LS_KPI_PAGE, String(idx))
    updateDots(idx)
}

function currentKpiPage(){
    const w = kpiTrack.clientWidth
    if(!w) return 0
    return Math.round(kpiTrack.scrollLeft / w)
}

function updateDots(idx){
    kpiDots.querySelectorAll('.dot').forEach(d => {
        d.classList.toggle('active', Number(d.dataset.i) === idx)
    })
}

kpiPrev?.addEventListener('click', () => setKpiPage(currentKpiPage() - 1))
kpiNext?.addEventListener('click', () => setKpiPage(currentKpiPage() + 1))

kpiDots?.querySelectorAll('.dot').forEach(d => {
    d.addEventListener('click', () => setKpiPage(Number(d.dataset.i)))
})

let kpiScrollTimer = null
kpiTrack?.addEventListener('scroll', () => {
    clearTimeout(kpiScrollTimer)
    kpiScrollTimer = setTimeout(() => {
        const idx = currentKpiPage()
        updateDots(idx)
        localStorage.setItem(LS_KPI_PAGE, String(idx))
    }, 60)
})

function restoreKpiPage(){
    const v = localStorage.getItem(LS_KPI_PAGE)
    if(v) setKpiPage(Number(v))
    else setKpiPage(0)
}

function normalizeQuery(q){
    return q.trim().replace(/\s+/g,' ')
}

function fakeSearch(q){
    const query = normalizeQuery(q)
    if(!query) return []
    const results = []

    const looksLikeRack = /(\bUCO1\b|\bEAG\b|\bSCU\b|\d{1,2}[A-Z]\b|\d{2}[FB]\b|\b\d{1,2}\b)/i.test(query)

    if(looksLikeRack){
        results.push({
            primary: query.toUpperCase(),
            secondary: 'Jump (not wired yet)',
            tag: 'Rack'
        })
    }

    if(/uco/i.test(query)){
        results.push({ primary: 'UCO', secondary: 'Campus', tag: 'Location' })
    }
    if(/eag/i.test(query)){
        results.push({ primary: 'EAG', secondary: 'Campus', tag: 'Location' })
    }
    if(/scu/i.test(query)){
        results.push({ primary: 'SCU', secondary: 'Campus', tag: 'Location' })
    }

    return results.slice(0,5)
}

function renderSearch(results){
    if(!results.length){
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

function escapeHtml(s){
    return String(s)
        .replaceAll('&','&amp;')
        .replaceAll('<','&lt;')
        .replaceAll('>','&gt;')
        .replaceAll('"','&quot;')
        .replaceAll("'","&#039;")
}

let searchTimer = null
globalSearch?.addEventListener('input', () => {
    clearTimeout(searchTimer)
    searchTimer = setTimeout(() => {
        renderSearch(fakeSearch(globalSearch.value))
    }, 80)
})

document.addEventListener('click', (e) => {
    if(!searchResults.contains(e.target) && e.target !== globalSearch){
        searchResults.classList.remove('open')
    }
})

document.querySelectorAll('.locCard').forEach(btn => {
    btn.addEventListener('click', () => {
        const loc = btn.dataset.loc
        if(loc === 'eag' || loc === 'scu') return
        locationSelect.value = loc
        localStorage.setItem(LS_LOCATION, loc)
        subtitle()
    })
})

loadFilters()
setTimeout(restoreKpiPage, 0)
