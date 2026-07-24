<?php
/**
 * admin_footer.php — Include at the bottom of every lafter page.
 * Loads admin overlay CSS + JS if the user is admin.
 */
if (lafter_is_admin()): ?>
<link rel="stylesheet" href="https://lafter.gg/src/css/admin-overlay.css">
<script>const LAFTER_USER = { role: 'admin', view: '<?= (!empty($_SESSION['lafter_view']) && $_SESSION['lafter_view'] === 'user') ? 'user' : 'admin' ?>' };</script>
<script src="https://lafter.gg/src/js/admin-overlay.js" defer></script>
<?php endif; ?>
