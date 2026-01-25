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

$name = $_SESSION['dcops_name'] ?? 'Milestone';
$email = $_SESSION['dcops_email'] ?? '';
$rank = (int)($_SESSION['effective_rank'] ?? 0);
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
    <aside class="side" id="side" data-collapsed="0">
        <div class="sideTop">
            <button class="brandBtn" id="sideCollapse" type="button" aria-label="Toggle sidebar">
                <span class="brandMark">DO</span>
                <span class="brandFull">
						<span class="dc">DC</span><span class="ops">OPS</span>
					</span>
            </button>
        </div>

        <nav class="nav" id="nav">
            <div class="navGroup" data-group="dashboard">
                <button class="navGroupBtn" type="button">
                    <span class="ico">⌂</span>
                    <span class="lbl">Dashboard</span>
                    <span class="chev">+</span>
                </button>
                <div class="navGroupBody">
                    <a class="navItem active" href="./"><span class="dot"></span><span class="txt">Overview</span></a>
                </div>
            </div>

            <div class="navGroup" data-group="operations">
                <button class="navGroupBtn" type="button">
                    <span class="ico">⚙</span>
                    <span class="lbl">Operations</span>
                    <span class="chev">+</span>
                </button>

                <div class="navGroupBody">
                    <div class="navModule" data-module="movements">
                        <button class="navModuleBtn" type="button">
                            <span class="dot"></span><span class="txt">Movements</span><span class="chev">+</span>
                        </button>
                        <div class="navModuleBody">
                            <a class="navLeaf" href="#" data-disabled="1">Move Orders</a>
                            <a class="navLeaf" href="#" data-disabled="1">Transfers</a>
                            <a class="navLeaf" href="#" data-disabled="1">Shipments</a>
                            <a class="navLeaf" href="#" data-disabled="1">Transport</a>
                            <a class="navLeaf" href="#" data-disabled="1">Returns</a>
                        </div>
                    </div>

                    <div class="navModule" data-module="rackops">
                        <button class="navModuleBtn" type="button">
                            <span class="dot"></span><span class="txt">Rack Operations</span><span class="chev">+</span>
                        </button>
                        <div class="navModuleBody">
                            <a class="navLeaf" href="#" data-disabled="1">SLC</a>
                            <a class="navLeaf" href="#" data-disabled="1">Verify</a>
                            <a class="navLeaf" href="#" data-disabled="1">Re-SLC</a>
                            <a class="navLeaf" href="#" data-disabled="1">Exceptions</a>
                        </div>
                    </div>

                    <div class="navModule" data-module="audit">
                        <button class="navModuleBtn" type="button">
                            <span class="dot"></span><span class="txt">Audit</span><span class="chev">+</span>
                        </button>
                        <div class="navModuleBody">
                            <a class="navLeaf" href="#" data-disabled="1">Cycle Count</a>
                            <a class="navLeaf" href="#" data-disabled="1">SLC Audit</a>
                        </div>
                    </div>

                    <div class="navModule" data-module="issues">
                        <button class="navModuleBtn" type="button">
                            <span class="dot"></span><span class="txt">Issues</span><span class="chev">+</span>
                        </button>
                        <div class="navModuleBody">
                            <a class="navLeaf" href="#" data-disabled="1">Failed Racks</a>
                            <a class="navLeaf" href="#" data-disabled="1">Holds</a>
                            <a class="navLeaf" href="#" data-disabled="1">Blocked</a>
                            <a class="navLeaf" href="#" data-disabled="1">Pending Action</a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="navGroup" data-group="tools">
                <button class="navGroupBtn" type="button">
                    <span class="ico">▦</span>
                    <span class="lbl">Tools</span>
                    <span class="chev">+</span>
                </button>
                <div class="navGroupBody">
                    <a class="navItem" href="#" data-disabled="1"><span class="dot"></span><span class="txt">Visualizer</span></a>
                    <a class="navItem" href="#" data-disabled="1"><span class="dot"></span><span class="txt">Imports</span></a>
                    <a class="navItem" href="#" data-disabled="1"><span class="dot"></span><span class="txt">Layouts</span></a>
                </div>
            </div>

            <div class="navGroup" data-group="team">
                <button class="navGroupBtn" type="button">
                    <span class="ico">⌁</span>
                    <span class="lbl">Team</span>
                    <span class="chev">+</span>
                </button>
                <div class="navGroupBody">
                    <a class="navItem" href="#" data-disabled="1"><span class="dot"></span><span class="txt">Individual Performance</span></a>
                    <a class="navItem" href="#" data-disabled="1"><span class="dot"></span><span class="txt">Leaderboards</span></a>
                    <a class="navItem" href="#" data-disabled="1"><span class="dot"></span><span class="txt">Assigned Tasks</span></a>
                    <a class="navItem" href="#" data-disabled="1"><span class="dot"></span><span class="txt">Assign Tasks</span></a>
                </div>
            </div>

            <div class="navGroup" data-group="admin">
                <button class="navGroupBtn" type="button">
                    <span class="ico">✶</span>
                    <span class="lbl">Admin</span>
                    <span class="chev">+</span>
                </button>
                <div class="navGroupBody">
                    <a class="navItem" href="#" data-disabled="1"><span class="dot"></span><span class="txt">Settings</span></a>
                    <a class="navItem" href="#" data-disabled="1"><span class="dot"></span><span class="txt">Permissions</span></a>
                    <a class="navItem" href="#" data-disabled="1"><span class="dot"></span><span class="txt">Debug</span></a>
                </div>
            </div>
        </nav>

        <div class="sideBottom">
            <div class="userLine">
                <span class="userName" title="<?= htmlspecialchars($email) ?>"><?= htmlspecialchars($name) ?></span>
                <a class="accountLink" href="https://account.dcops.co/">Account</a>
            </div>
            <div class="userMeta">
                <span class="pillMini">milestone</span>
                <span class="pillMini">rank <?= (int)$rank ?></span>
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
                <div class="filterGroup">
                    <button class="filterPill" id="activityPill" type="button" aria-haspopup="dialog" aria-expanded="false">
                        <span class="filterLabel">Activity</span>
                        <span class="filterValue" id="activityValue">All</span>
                    </button>

                    <button class="filterPill" id="locationPill" type="button" aria-haspopup="dialog" aria-expanded="false">
                        <span class="filterLabel">Location</span>
                        <span class="filterValue" id="locationValue">All</span>
                    </button>
                </div>
            </div>
        </header>

        <section class="content">
            <div class="grid">
                <section class="panel">
                    <div class="panelTop">
                        <div>
                            <div class="panelTitle">KPIs</div>
                            <div class="panelSub" id="kpiSubtitle">All locations</div>
                        </div>
                        <div class="panelActions">
                            <button class="miniBtn" id="deckPrev" type="button">‹</button>
                            <button class="miniBtn" id="deckNext" type="button">›</button>
                        </div>
                    </div>

                    <div class="deckTabsWrap">
                        <div class="deckTabs" id="deckTabs"></div>
                    </div>

                    <div class="deckArea" id="deckArea"></div>

                    <div class="quickRow">
                        <a class="quick primary" href="#" data-disabled="1">Open UCO SLC Audit</a>
                        <a class="quick" href="#" data-disabled="1">Visualizer Assist</a>
                        <a class="quick" href="#" data-disabled="1">Issues</a>
                    </div>
                </section>

                <section class="panel">
                    <div class="panelTop">
                        <div>
                            <div class="panelTitle">Individual Performance</div>
                            <div class="panelSub" id="perfSubtitle">Filtered by activity + location</div>
                        </div>
                    </div>

                    <div class="perfTable" id="perfTable"></div>
                </section>

                <section class="panel panelWide">
                    <div class="panelTop">
                        <div>
                            <div class="panelTitle">Activity Feed</div>
                            <div class="panelSub">Filtered by activity + location</div>
                        </div>
                    </div>

                    <div class="feed" id="feed">
                        <div class="feedItem">
                            <div class="feedTitle">UCO audit is priority</div>
                            <div class="feedMeta">Once we wire the audit workflow, this feed will become real-time.</div>
                        </div>
                        <div class="feedItem">
                            <div class="feedTitle">KPI sections are activity-scoped</div>
                            <div class="feedMeta">Select multiple activities to unlock the Summary KPI section.</div>
                        </div>
                    </div>
                </section>
            </div>
        </section>
    </main>

    <div class="modal" id="filterModal" aria-hidden="true">
        <div class="modalCard" role="dialog" aria-modal="true" aria-labelledby="filterTitle">
            <div class="modalTop">
                <div class="modalTitle" id="filterTitle">Filter</div>
                <button class="modalClose" id="filterClose" type="button" aria-label="Close">×</button>
            </div>
            <div class="modalBody">
                <div class="modalList" id="filterList"></div>
            </div>
            <div class="modalBottom">
                <button class="btnGhost" id="filterCancel" type="button">Cancel</button>
                <button class="btnPrimary" id="filterSave" type="button">Save</button>
            </div>
        </div>
    </div>

    <div class="backdrop" id="backdrop"></div>
</div>

<script>
    window.DCOPS_DASH = {
        userName: <?= json_encode($name) ?>,
        userEmail: <?= json_encode($email) ?>,
        userRank: <?= json_encode($rank) ?>
    }
</script>
<script src="./script.js"></script>
</body>
</html>
