<?php
$candorMeta = isset($candorMeta) ? (string)$candorMeta : '';
$candorLead = isset($candorLead) ? (string)$candorLead : '';
$candorAuthed = !empty($candorAuthed);
$candorName = isset($candorName) ? (string)$candorName : '';
$candorShowMyOs = !empty($candorShowMyOs);
$candorNavClass = isset($candorNavClass) ? trim((string)$candorNavClass) : '';
$navClass = 'nav' . ($candorNavClass !== '' ? ' ' . $candorNavClass : '');
?>
<header class="<?= htmlspecialchars($navClass) ?>" style="--brand-mark-size: 84px; --brand-name-size: 36px; --brand-lead-size: calc(var(--brand-name-size) * 0.5);">
    <a class="brand brandLink" href="https://candor.you/">
        <div class="logo"><span class="logoGlyph">C</span></div>
        <div class="brandText">
            <div class="brandTitle">
                <?php if ($candorLead !== ''): ?>
                    <span class="brandLead"><?= htmlspecialchars($candorLead) ?></span>
                <?php endif; ?>
                <span class="brandName">Candor</span>
            </div>
            <?php if ($candorMeta !== ''): ?>
                <div class="meta minimal"><?= htmlspecialchars($candorMeta) ?></div>
            <?php endif; ?>
        </div>
    </a>

    <div class="actions">
        <?php if ($candorAuthed): ?>
            <span class="welcome">Welcome, <a class="accountLink" href="https://account.candor.you/"><?= htmlspecialchars($candorName) ?></a></span>
            <?php if ($candorShowMyOs): ?>
                <a class="btn primary" href="https://do.candor.you/">My OS</a>
            <?php endif; ?>
            <a class="btn accent" href="https://account.candor.you/login/signout.php">Sign out</a>
        <?php else: ?>
            <a class="btn primary" href="https://account.candor.you/login/signin.php">Sign in</a>
            <a class="btn accent" href="https://account.candor.you/login/signup.php">Create account</a>
        <?php endif; ?>
    </div>
</header>
