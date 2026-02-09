<?php
require_once '/var/www/gangdev/shared/php/init_candor.php';

candor_require_verified();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	candor_redirect('https://account.candor.you/');
}

$userId = candor_current_user_id();
$birthdate = trim($_POST['birthdate'] ?? '');
$timezone = trim($_POST['timezone'] ?? '');
$timezone = $timezone !== '' ? $timezone : null;
$unitSystem = trim($_POST['unit_system'] ?? 'metric');
$unitSystem = $unitSystem === 'imperial' ? 'imperial' : 'metric';
$heightRaw = trim($_POST['height_cm'] ?? '');
$weightRaw = trim($_POST['weight_kg'] ?? '');
$heightFtRaw = trim($_POST['height_ft'] ?? '');
$heightInRaw = trim($_POST['height_in'] ?? '');
$weightLbRaw = trim($_POST['weight_lb'] ?? '');
$consent = isset($_POST['consent_health']) && $_POST['consent_health'] === '1';
$adaptiveSleep = isset($_POST['adaptive_sleep']) && $_POST['adaptive_sleep'] === '1';
$redirect = trim($_POST['redirect'] ?? 'https://account.candor.you/');

function candor_safe_redirect($url, $fallback) {
	$parts = parse_url($url);
	if (!$parts || empty($parts['host'])) {
		return $fallback;
	}
	$host = strtolower($parts['host']);
	if ($host === 'candor.you' || substr($host, -10) === '.candor.you') {
		return $url;
	}
	return $fallback;
}

function candor_with_param($url, $key, $value) {
	$sep = strpos($url, '?') === false ? '?' : '&';
	return $url . $sep . urlencode($key) . '=' . urlencode($value);
}

$redirect = candor_safe_redirect($redirect, 'https://account.candor.you/');

$existingProfile = candor_profile_row($userId);
if ($birthdate === '' && !empty($existingProfile['birthdate'])) {
	$birthdate = (string)$existingProfile['birthdate'];
}

if ($birthdate === '' || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $birthdate)) {
	candor_redirect(candor_with_param($redirect, 'profile_error', 'Please enter a valid birthday.'));
}

if ($birthdate > date('Y-m-d')) {
	candor_redirect(candor_with_param($redirect, 'profile_error', 'Birthday cannot be in the future.'));
}

if (!$consent) {
	candor_redirect(candor_with_param($redirect, 'profile_error', 'Consent is required to store baseline data.'));
}

if ($timezone !== null) {
	$validZones = DateTimeZone::listIdentifiers();
	if (!in_array($timezone, $validZones, true)) {
		candor_redirect(candor_with_param($redirect, 'profile_error', 'Please select a valid time zone.'));
	}
}

$height = null;
$weight = null;

if ($unitSystem === 'imperial') {
	if ($heightFtRaw !== '' || $heightInRaw !== '') {
		$feet = (int)$heightFtRaw;
		$inches = (int)$heightInRaw;
		if ($feet < 3 || $feet > 8 || $inches < 0 || $inches > 11) {
			candor_redirect(candor_with_param($redirect, 'profile_error', 'Height must be between 3-8 ft and 0-11 in.'));
		}
		$totalInches = ($feet * 12) + $inches;
		$height = (int)round($totalInches * 2.54);
		if ($height < 90 || $height > 250) {
			candor_redirect(candor_with_param($redirect, 'profile_error', 'Height must be between 90 and 250 cm.'));
		}
	}
	if ($weightLbRaw !== '') {
		$weightLb = (float)$weightLbRaw;
		if ($weightLb < 66 || $weightLb > 660) {
			candor_redirect(candor_with_param($redirect, 'profile_error', 'Weight must be between 66 and 660 lb.'));
		}
		$weight = round($weightLb / 2.20462, 1);
		if ($weight < 30 || $weight > 300) {
			candor_redirect(candor_with_param($redirect, 'profile_error', 'Weight must be between 30 and 300 kg.'));
		}
	}
} else {
	if ($heightRaw !== '') {
		$height = (int)$heightRaw;
		if ($height < 90 || $height > 250) {
			candor_redirect(candor_with_param($redirect, 'profile_error', 'Height must be between 90 and 250 cm.'));
		}
	}
	if ($weightRaw !== '') {
		$weight = (float)$weightRaw;
		if ($weight < 30 || $weight > 300) {
			candor_redirect(candor_with_param($redirect, 'profile_error', 'Weight must be between 30 and 300 kg.'));
		}
	}
}

try {
	$stmt = $pdo->prepare("
		INSERT INTO candor.user_profiles
			(user_id, birthdate, timezone, height_cm, weight_kg, unit_system, consent_health, adaptive_sleep, consent_at, created_at, updated_at, onboarding_completed_at)
		VALUES
			(?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW(),
			 CASE WHEN ? THEN NOW() ELSE NULL END)
		ON CONFLICT (user_id) DO UPDATE SET
			birthdate = EXCLUDED.birthdate,
			timezone = EXCLUDED.timezone,
			height_cm = EXCLUDED.height_cm,
			weight_kg = EXCLUDED.weight_kg,
			unit_system = EXCLUDED.unit_system,
			consent_health = EXCLUDED.consent_health,
			adaptive_sleep = EXCLUDED.adaptive_sleep,
			consent_at = CASE WHEN EXCLUDED.consent_health THEN NOW() ELSE candor.user_profiles.consent_at END,
			updated_at = NOW(),
			onboarding_completed_at = CASE
				WHEN EXCLUDED.birthdate IS NOT NULL AND EXCLUDED.consent_health THEN COALESCE(candor.user_profiles.onboarding_completed_at, NOW())
				ELSE candor.user_profiles.onboarding_completed_at
			END
	");
	$stmt->execute([
		(int)$userId,
		$birthdate,
		$timezone,
		$height,
		$weight,
		$unitSystem,
		$consent,
		$adaptiveSleep,
		$consent
	]);
} catch (Throwable $e) {
	candor_redirect(candor_with_param($redirect, 'profile_error', 'Unable to save baseline right now.'));
}

candor_redirect(candor_with_param($redirect, 'profile_ok', 'Saved.'));
