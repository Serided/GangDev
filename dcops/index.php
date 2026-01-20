<?php
// index.php — DCOPS landing page
?>
<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width,initial-scale=1" />
	<title>DCOPS — Datacenter Operations Software</title>
	<meta name="description" content="DCOPS is datacenter operations software: progress tracking, workflow visibility, audits, and operational metrics." />
	<link rel="stylesheet" href="style.css?v=1" />
</head>

<body>
<header class="topbar">
	<div class="wrap nav">
		<a class="brand" href="/">
			<div class="logo" aria-label="DCOPS logo placeholder">
				<span>DCOPS</span>
			</div>
			<div class="brandText">
				<strong>DCOPS</strong>
				<small>Datacenter Operations Software</small>
			</div>
		</a>

		<nav class="navlinks" aria-label="Primary navigation">
			<a href="#platform">Platform</a>
			<a href="#capabilities">Capabilities</a>
			<a href="#principles">Principles</a>
		</nav>

		<div class="cta">
			<a class="btn" href="#contact">Contact</a>
			<a class="btn primary" href="#get-started">Get started</a>
		</div>
	</div>
</header>

<main>
	<section class="hero">
		<div class="wrap heroGrid">
			<div class="heroLeft">
				<div class="kicker">
					<span class="dot"></span>
					<span>Operational clarity for modern datacenters</span>
				</div>

				<h1>Track work. Prove progress. Run cleaner ops.</h1>

				<p class="lead">
					DCOPS is a lightweight operations layer for datacenter teams — progress tracking, workflow visibility,
					audits, and metrics in one place. Built for real floors, real throughput, and real accountability.
				</p>

				<div class="heroActions" id="get-started">
					<a class="btn primary" href="#contact">Request access</a>
					<a class="btn" href="#platform">See platform</a>
				</div>

				<p class="subnote">
					Designed for rack lifecycle, audits, inbound/outbound, staging, and shift execution. No fluff.
				</p>

				<div class="heroStats">
					<div class="stat">
						<span class="statLabel">Visibility</span>
						<span class="statValue">Work → Status → Proof</span>
					</div>
					<div class="stat">
						<span class="statLabel">Speed</span>
						<span class="statValue">Fast logging, low friction</span>
					</div>
					<div class="stat">
						<span class="statLabel">Trust</span>
						<span class="statValue">Audit-ready history</span>
					</div>
				</div>
			</div>

			<div class="heroRight panel">
				<div class="dash">
					<div class="dashTop">
						<div class="pill">OPS DASHBOARD</div>
						<div class="pill faint" id="clock">—</div>
					</div>

					<div class="dashGrid">
						<div class="card">
							<h3>Shift Throughput</h3>
							<p class="big" id="throughput">128</p>
							<p class="mini">Units processed (today)</p>
							<div class="bar"><i id="barFill"></i></div>
						</div>

						<div class="card">
							<h3>Open Items</h3>
							<p class="big" id="openItems">7</p>
							<p class="mini">Waiting validation / closure</p>
							<div class="mini">Escalations: <b id="esc">1</b></div>
						</div>

						<div class="card">
							<h3>Audit Health</h3>
							<p class="big" id="auditScore">94%</p>
							<p class="mini">Pass rate (30 days)</p>
							<div class="mini">Exceptions: <b id="exceptions">3</b></div>
						</div>

						<div class="card">
							<h3>Cycle Time</h3>
							<p class="big" id="cycleTime">22m</p>
							<p class="mini">Median task completion</p>
							<div class="mini">Target: <b>20m</b></div>
						</div>
					</div>

					<div class="table">
						<div class="row">
							<div>Inbound staging verification</div>
							<span class="tag ok">OK</span>
						</div>
						<div class="row">
							<div>Rack lifecycle checklist</div>
							<span class="tag ok">OK</span>
						</div>
						<div class="row">
							<div>SLC audit queue</div>
							<span class="tag warn">ATTN</span>
						</div>
						<div class="row">
							<div>Outbound reconciliation</div>
							<span class="tag">ACTIVE</span>
						</div>
					</div>

					<div class="dashFooter">
						<span class="faint">Preview mock — your metrics + workflows plug in here.</span>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section id="platform">
		<div class="wrap">
			<div class="sectionTitle">
				<div>
					<h2>Platform</h2>
					<p>One place for shift execution, lifecycle progress, audit trails, and operational reporting.</p>
				</div>
			</div>

			<div class="grid2">
				<div class="panel soft">
					<h3 class="panelTitle">Progress tracking that doesn’t slow the floor down</h3>
					<ul class="bullets">
						<li>Fast task logging with evidence attachments (photos, notes, IDs)</li>
						<li>Clear status states: queued → active → blocked → complete</li>
						<li>Ownership, timestamps, and a clean chain of custody</li>
					</ul>
				</div>

				<div class="panel soft">
					<h3 class="panelTitle">Operational reporting that leadership actually uses</h3>
					<ul class="bullets">
						<li>Throughput, cycle time, backlog, and SLA views</li>
						<li>Audit exception tracking and recurring issue detection</li>
						<li>Shift summaries that can export cleanly</li>
					</ul>
				</div>
			</div>
		</div>
	</section>

	<section id="capabilities">
		<div class="wrap">
			<div class="sectionTitle">
				<div>
					<h2>Capabilities</h2>
					<p>Focused features built for datacenter reality: lifecycle, auditing, inventory touchpoints, and throughput.</p>
				</div>
			</div>

			<div class="features">
				<div class="feature">
					<div class="icon">↻</div>
					<h3>Lifecycle</h3>
					<p>Track racks/assets from intake to deploy to return, with status, owner, and proof.</p>
				</div>
				<div class="feature">
					<div class="icon">✓</div>
					<h3>Audits</h3>
					<p>Queue, validate, record exceptions, and keep an audit-ready history without chaos.</p>
				</div>
				<div class="feature">
					<div class="icon">⚑</div>
					<h3>Escalations</h3>
					<p>Flag blockers, route to the right owners, and prevent “lost work” across shifts.</p>
				</div>
				<div class="feature">
					<div class="icon">▦</div>
					<h3>Dashboards</h3>
					<p>Throughput, backlog, cycle time, and SLA views that match how the floor actually runs.</p>
				</div>
				<div class="feature">
					<div class="icon">⛓</div>
					<h3>Traceability</h3>
					<p>Every change is logged. Every item has a story. No more “who touched this?”</p>
				</div>
				<div class="feature">
					<div class="icon">⇄</div>
					<h3>Integrations</h3>
					<p>Built to connect into existing processes—CSV imports, API endpoints, and automation hooks.</p>
				</div>
			</div>
		</div>
	</section>

	<section id="principles">
		<div class="wrap">
			<div class="sectionTitle">
				<div>
					<h2>Principles</h2>
					<p>Industrial software should be quiet, fast, and reliable — not a distraction.</p>
				</div>
			</div>

			<div class="principles">
				<div class="principle">
					<h3>Low friction</h3>
					<p>Fast inputs, minimal steps, and defaults that match real workflows.</p>
				</div>
				<div class="principle">
					<h3>Proof-first</h3>
					<p>Attach evidence where it matters: photos, IDs, notes, timestamps.</p>
				</div>
				<div class="principle">
					<h3>Audit-ready</h3>
					<p>Clean history, consistent status states, and searchable records.</p>
				</div>
			</div>
		</div>
	</section>

	<section id="contact" class="contact">
		<div class="wrap">
			<div class="contactCard panel">
				<div class="contactLeft">
					<h2>Contact</h2>
					<p class="muted">
						Want DCOPS for your team or your facility? Reach out and we’ll set up a quick walkthrough.
					</p>

					<div class="contactMeta">
						<div>
							<span class="label">Email</span>
							<span class="value"><a href="mailto:hello@dcops.co">hello@dcops.co</a></span>
						</div>
						<div>
							<span class="label">Focus</span>
							<span class="value">Datacenter ops • lifecycle • audits • throughput</span>
						</div>
					</div>
				</div>

				<form class="contactForm" onsubmit="return window.DCOPS_submitContact(event);">
					<label>
						<span>Name</span>
						<input type="text" name="name" placeholder="Your name" required />
					</label>

					<label>
						<span>Company</span>
						<input type="text" name="company" placeholder="Company / team" />
					</label>

					<label>
						<span>Email</span>
						<input type="email" name="email" placeholder="you@company.com" required />
					</label>

					<label>
						<span>Message</span>
						<textarea name="message" rows="4" placeholder="What are you trying to track or improve?" required></textarea>
					</label>

					<button class="btn primary" type="submit">Send</button>
					<p class="formNote" id="formNote">This form currently simulates submission (no backend). Hook it to PHP/mail when ready.</p>
				</form>
			</div>
		</div>
	</section>

	<footer class="footer">
		<div class="wrap foot">
			<span class="faint">© <?php echo date('Y'); ?> DCOPS. Built for datacenter operations.</span>
			<span class="faint">Status: <span id="statusBadge" class="status wip">in progress</span></span>
		</div>
	</footer>
</main>

<script src="script.js?v=1"></script>
</body>
</html>
