<?php
/**
 * head.php — Candor <head> includes (favicons + meta).
 * Use in all Candor pages: <?php require '/var/www/gangdev/candor/src/php/head.php'; ?>
 */
$v = '13';
$base = 'https://candor.you/src/img/favicon';
?>
<link rel="icon" href="<?= $base ?>/favicon.ico?v=<?= $v ?>" type="image/x-icon">
<link rel="icon" href="<?= $base ?>/favicon-dark.ico?v=<?= $v ?>" type="image/x-icon" media="(prefers-color-scheme: dark)">
<link rel="shortcut icon" href="<?= $base ?>/favicon.ico?v=<?= $v ?>" type="image/x-icon">
<link rel="shortcut icon" href="<?= $base ?>/favicon-dark.ico?v=<?= $v ?>" type="image/x-icon" media="(prefers-color-scheme: dark)">
<link rel="icon" type="image/png" sizes="32x32" href="<?= $base ?>/favicon-32.png?v=<?= $v ?>">
<link rel="icon" type="image/png" sizes="32x32" href="<?= $base ?>/favicon-dark-32.png?v=<?= $v ?>" media="(prefers-color-scheme: dark)">
<link rel="icon" type="image/png" sizes="64x64" href="<?= $base ?>/favicon-64.png?v=<?= $v ?>">
<link rel="icon" type="image/png" sizes="64x64" href="<?= $base ?>/favicon-dark-64.png?v=<?= $v ?>" media="(prefers-color-scheme: dark)">
<link rel="icon" type="image/png" sizes="128x128" href="<?= $base ?>/favicon-128.png?v=<?= $v ?>">
<link rel="icon" type="image/png" sizes="128x128" href="<?= $base ?>/favicon-dark-128.png?v=<?= $v ?>" media="(prefers-color-scheme: dark)">
