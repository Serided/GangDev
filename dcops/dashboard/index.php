<?php
require_once '/var/www/gangdev/shared/php/init_dcops.php';

if (!isset($_SESSION['dcops_user_id'])) {
    header('Location: https://account.dcops.co/login/signin.php');
    exit;
}

$org = $_SESSION['dcops_org'] ?? 'personal';
if ($org !== 'milestone') {
    http_response_code(403);
    exit;
}

$name = $_SESSION['dcops_name'] ?? '';
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>DCOPS · Milestone</title>
    <link rel="stylesheet" href="./style.css">
</head>
<body>
<div class="app">
    <aside class="side" id="side">
        <div class="sideTop">
            <a class="brand" href="./">
                <span class="dc">DC</span><span class="ops">OPS</span>
            </a>
            <button class="sideToggle" id="sideToggle" type="button" aria-label="Toggle menu">
                <span></span><span></span><span></span>
            </button>
        </div>

        <nav class="nav">
            <a class="navItem active" href="./">
                <span class="navDot"></span>
                <span>Dashboard</span>
            </a>

            <div class="navSection">Operations</div>

            <a class="navItem" href="#" data-disabled="1">
                <span class="navDot"></span>
                <span>Movements</span>
            </a>

            <a class="navItem" href="#" data-disabled="1">
                <span class="navDot"></span>
                <span>Rack Operations</span>
            </a>

            <a class="navItem" href="#" data-disabled="1">
                <span class="navDot"></span>
                <span>Audit</span>
            </a>

            <a class="navItem" href="#" data-disabled="1">
                <span class="navDot"></span>
                <span>Issues</span>
            </a>

            <div class="navSection">Tools</div>

            <a class="navItem" href="#" data-disabled="1">
                <span class="navDot"></span>
                <span>Visualizer</span>
            </a>

            <a class="navItem" href="#" data-disabled="1">
                <span class="navDot"></span>
                <span>Team</span>
            </a>

            <div class="navSection">Admin</div>

            <a class="navItem" href="#" data-disabled="1">
                <span class="navDot"></span>
                <span>Layouts</span>
            </a>

            <a class="navItem" href="#" data-disabled="1">
                <span class="navDot"></span>
                <span>Imports</span>
            </a>

            <a class="navItem" href="#" data-disabled="1">
                <span class="navDot"></span>
                <span>Settings</span>
            </a>
        </nav>

        <div class="sideBottom">
            <div class="userLine">
                <span class="userName"><?= htmlspecialchars($name ?: 'Milestone') ?></span>
                <a class="accountLink" href="https://account.dcops.co/">Account</a>
            </div>
        </div>
    </aside>

    <main class="main">
        <header class="topbar">
            <div class="topLeft">
                <button class="hamburger" id="hamburger" type="button" aria-label="Open menu">
                    <span></span><span></span><span></span>
                </button>
                <div class="crumbs">
                    <span class="crumbStrong">Milestone</span>
                    <span class="crumbMuted">Dashboard</span>
                </div>
            </div>

            <div class="topCenter">
                <div class="searchWrap">
                    <input class="search" id="globalSearch" type="search" placeholder="Jump to rack, hall, DC... (ex: UCO1.1A.03F.23)" autocomplete="off">
                    <div class="searchResults" id="searchResults"></div>
                </div>
            </div>

            <div class="topRight">
                <div class="pillGroup">
                    <div class="pill">
                        <span class="pillLabel">Activity</span>
                        <select class="pillSelect" id="activitySelect">
                            <option value="all">All</option>
                            <option value="slc_audit">SLC Audit</option>
                        </select>
                    </div>

                    <div class="pill">
                        <span class="pillLabel">Location</span>
                        <select class="pillSelect" id="locationSelect">
                            <option value="all">All</option>
                            <option value="uco">UCO</option>
                            <option value="eag">EAG</option>
                            <option value="scu">SCU</option>
                        </select>
                    </div>
                </div>

                <button class="iconBtn" id="teamBtn" type="button" aria-label="Team">
                    Team
                </button>
            </div>
        </header>

        <section class="content">
            <div class="grid">
                <section class="panel">
                    <div class="panelTop">
                        <div>
                            <div class="panelTitle">KPIs</div>
                            <div class="panelSub" id="kpiSubtitle">All activities · All locations</div>
                        </div>
                        <div class="panelActions">
                            <button class="miniBtn" id="kpiPrev" type="button">‹</button>
                            <button class="miniBtn" id="kpiNext" type="button">›</button>
                        </div>
                    </div>

                    <div class="kpiWrap">
                        <div class="kpiTrack" id="kpiTrack">
                            <div class="kpiPage">
                                <div class="kpiTile">
                                    <div class="kpiName">Completed Today</div>
                                    <div class="kpiValue" id="kpiDone">0</div>
                                    <div class="kpiMeta">SLC + Audit</div>
                                </div>
                                <div class="kpiTile">
                                    <div class="kpiName">Pending Audit</div>
                                    <div class="kpiValue" id="kpiPendingAudit">0</div>
                                    <div class="kpiMeta">Needs review</div>
                                </div>
                                <div class="kpiTile">
                                    <div class="kpiName">Pending L2</div>
                                    <div class="kpiValue" id="kpiPendingL2">0</div>
                                    <div class="kpiMeta">In queue</div>
                                </div>
                                <div class="kpiTile">
                                    <div class="kpiName">Failures</div>
                                    <div class="kpiValue" id="kpiFail">0</div>
                                    <div class="kpiMeta">Blocked / issues</div>
                                </div>
                            </div>

                            <div class="kpiPage">
                                <div class="kpiTile accent">
                                    <div class="kpiName">UCO Focus</div>
                                    <div class="kpiValue" id="kpiUco">0%</div>
                                    <div class="kpiMeta">Completion</div>
                                </div>
                                <div class="kpiTile">
                                    <div class="kpiName">Hot Halls</div>
                                    <div class="kpiValue" id="kpiHotHalls">0</div>
                                    <div class="kpiMeta">Most failures</div>
                                </div>
                                <div class="kpiTile">
                                    <div class="kpiName">Avg per Rack</div>
                                    <div class="kpiValue" id="kpiAvg">—</div>
                                    <div class="kpiMeta">Time</div>
                                </div>
                                <div class="kpiTile">
                                    <div class="kpiName">Team Online</div>
                                    <div class="kpiValue" id="kpiOnline">0</div>
                                    <div class="kpiMeta">Active now</div>
                                </div>
                            </div>
                        </div>

                        <div class="dots" id="kpiDots">
                            <button class="dot active" type="button" data-i="0" aria-label="Page 1"></button>
                            <button class="dot" type="button" data-i="1" aria-label="Page 2"></button>
                        </div>
                    </div>

                    <div class="quickRow">
                        <a class="quick primary" href="#" data-disabled="1">Open UCO SLC Audit</a>
                        <a class="quick" href="#" data-disabled="1">Visualizer Assist</a>
                        <a class="quick" href="#" data-disabled="1">Issues</a>
                    </div>
                </section>

                <section class="panel">
                    <div class="panelTop">
                        <div>
                            <div class="panelTitle">Locations</div>
                            <div class="panelSub">Choose where you're working</div>
                        </div>
                    </div>

                    <div class="locCards">
                        <button class="locCard" type="button" data-loc="uco">
                            <div class="locName">UCO</div>
                            <div class="locMeta">Primary</div>
                        </button>
                        <button class="locCard" type="button" data-loc="eag">
                            <div class="locName">EAG</div>
                            <div class="locMeta">Disabled</div>
                        </button>
                        <button class="locCard" type="button" data-loc="scu">
                            <div class="locName">SCU</div>
                            <div class="locMeta">Disabled</div>
                        </button>
                    </div>
                </section>

                <section class="panel panelWide">
                    <div class="panelTop">
                        <div>
                            <div class="panelTitle">Activity Feed</div>
                            <div class="panelSub">Filtered by location + activity</div>
                        </div>
                    </div>

                    <div class="feed" id="feed">
                        <div class="feedItem">
                            <div class="feedTitle">Ready: UCO audit is the priority</div>
                            <div class="feedMeta">This feed will show rack events once we wire the audit tool.</div>
                        </div>
                        <div class="feedItem">
                            <div class="feedTitle">Tip: search works globally</div>
                            <div class="feedMeta">Try typing a rack label like UCO1.1A.03F.23</div>
                        </div>
                    </div>
                </section>
            </div>
        </section>
    </main>

    <div class="drawer" id="teamDrawer" aria-hidden="true">
        <div class="drawerTop">
            <div class="drawerTitle">Team</div>
            <button class="drawerClose" id="teamClose" type="button" aria-label="Close">×</button>
        </div>

        <div class="drawerBody">
            <div class="teamCard">
                <div class="teamLine">
                    <span class="teamDot online"></span>
                    <span class="teamName">Online users</span>
                    <span class="teamVal" id="teamOnline">0</span>
                </div>
                <div class="teamSub">Presence + stats will be wired after UCO audit tool is live.</div>
            </div>

            <div class="teamCard">
                <div class="teamLine">
                    <span class="teamDot"></span>
                    <span class="teamName">Actions</span>
                </div>
                <div class="teamActions">
                    <button class="quick" type="button" data-disabled="1">View output</button>
                    <button class="quick" type="button" data-disabled="1">Assign quota</button>
                    <button class="quick" type="button" data-disabled="1">Ping</button>
                </div>
            </div>
        </div>
    </div>

    <div class="backdrop" id="backdrop"></div>
</div>

<script src="./script.js"></script>
</body>
</html>
