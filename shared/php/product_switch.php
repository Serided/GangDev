<?php
/**
 * product_switch.php — "Other sign-ins" popup for login pages.
 * 
 * Usage: Set $currentProduct before including.
 *   $currentProduct = 'candor'; // or 'dcops', 'gangdev'
 *   require '/var/www/gangdev/shared/php/product_switch.php';
 */

$currentProduct = $currentProduct ?? '';

$products = [
	'gangdev' => ['label' => 'GangDev', 'badge' => 'main', 'url' => 'https://account.gangdev.co/login/signin.php'],
	'candor' => ['label' => 'Candor', 'badge' => 'product', 'url' => 'https://account.candor.you/login/signin.php'],
	'dcops' => ['label' => 'DCOPS', 'badge' => 'product', 'url' => 'https://account.dcops.co/login/signin.php'],
	'lafter' => ['label' => 'Lafter', 'badge' => 'product', 'url' => 'https://lafter.gg/account/login/signin.php'],
];
?>
<div class="productSwitch">
	<button class="switchBtn" type="button">other sign-ins</button>
	<div class="pop">
		<?php foreach ($products as $key => $p): ?>
			<?php if ($key !== $currentProduct): ?>
				<a href="<?= htmlspecialchars($p['url']) ?>"><span><?= htmlspecialchars($p['label']) ?></span><span class="badge"><?= htmlspecialchars($p['badge']) ?></span></a>
			<?php endif; ?>
		<?php endforeach; ?>
	</div>
</div>
