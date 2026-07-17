<?php
/**
 * email.php — Shared email template builder.
 * Generates consistent branded HTML emails across all products.
 *
 * Usage:
 *   $html = gangdev_email([
 *       'brand' => 'DCOPS',           // or 'Candor', 'GangDev'
 *       'brand_html' => '<span style="color:#4a0f1a;">DC</span><span style="color:#bfa14a;">OPS</span>',
 *       'subtitle' => 'DCOPS is built and operated by GangDev.',
 *       'greeting' => 'Hi John,',
 *       'body' => 'Use this code to finish signing in:',
 *       'highlight' => '482910',       // big emphasized content (OTP, link, etc.)
 *       'footnote' => 'This code expires in 10 minutes.',
 *       'footer' => 'If you didn\'t request this, ignore this email.',
 *   ]);
 */

function gangdev_email(array $opts): string {
	$brand = htmlspecialchars($opts['brand'] ?? 'GangDev', ENT_QUOTES, 'UTF-8');
	$brandHtml = $opts['brand_html'] ?? $brand;
	$subtitle = htmlspecialchars($opts['subtitle'] ?? '', ENT_QUOTES, 'UTF-8');
	$greeting = htmlspecialchars($opts['greeting'] ?? '', ENT_QUOTES, 'UTF-8');
	$body = htmlspecialchars($opts['body'] ?? '', ENT_QUOTES, 'UTF-8');
	$highlight = $opts['highlight'] ?? '';
	$highlightIsLink = isset($opts['highlight_url']);
	$highlightUrl = $opts['highlight_url'] ?? '';
	$footnote = htmlspecialchars($opts['footnote'] ?? '', ENT_QUOTES, 'UTF-8');
	$footer = htmlspecialchars($opts['footer'] ?? '', ENT_QUOTES, 'UTF-8');

	$highlightBlock = '';
	if ($highlight !== '') {
		if ($highlightIsLink) {
			$highlightBlock = '
			<div style="margin-top:14px;">
				<a href="' . htmlspecialchars($highlightUrl, ENT_QUOTES, 'UTF-8') . '" style="display:inline-block; padding:12px 24px; background:#0b1220; color:#fff; border-radius:8px; text-decoration:none; font-weight:700; font-size:14px;">' . htmlspecialchars($highlight, ENT_QUOTES, 'UTF-8') . '</a>
			</div>';
		} else {
			$highlightBlock = '
			<div style="margin-top:14px; font-size:28px; letter-spacing:6px; font-weight:800; color:#0b1220;">
				' . htmlspecialchars($highlight, ENT_QUOTES, 'UTF-8') . '
			</div>';
		}
	}

	return '
<div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace; background:#f7f9fc; padding:28px;">
  <div style="max-width:720px; margin:0 auto; background:#ffffff; border:1px solid rgba(11,18,32,.14); border-radius:16px; overflow:hidden;">
    <div style="padding:18px; border-bottom:1px solid rgba(11,18,32,.14);">
      <div style="font-weight:800; font-size:18px; letter-spacing:1px;">' . $brandHtml . '</div>
      ' . ($subtitle ? '<div style="color:rgba(11,18,32,.55); font-size:12px; margin-top:6px;">' . $subtitle . '</div>' : '') . '
    </div>

    <div style="padding:18px;">
      ' . ($greeting ? '<div style="font-size:14px; color:#0b1220;">' . $greeting . '</div>' : '') . '
      ' . ($body ? '<div style="margin-top:10px; color:rgba(11,18,32,.72); font-size:13px;">' . $body . '</div>' : '') . '
      ' . $highlightBlock . '
      ' . ($footnote ? '<div style="margin-top:14px; color:rgba(11,18,32,.55); font-size:12px;">' . $footnote . '</div>' : '') . '
    </div>

    ' . ($footer ? '<div style="padding:14px 18px; border-top:1px solid rgba(11,18,32,.08); color:rgba(11,18,32,.45); font-size:11px;">' . $footer . '</div>' : '') . '
  </div>
</div>';
}
