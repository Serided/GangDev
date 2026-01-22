<?php
require_once '/var/www/gangdev/shared/php/init_dcops.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	header('Location: /login/signin.php');
	exit;
}

$email = strtolower(trim($_POST['email'] ?? ''));
$password = $_POST['password'] ?? '';

if ($email === '' || $password === '') {
	header('Location: /login/signin.php?error=' . urlencode('Email and password are required.'));
	exit;
}

$stmt = $pdo->prepare("
    SELECT id, email, real_name, password_hash, verified, organization, admin_rank, trust_state, effective_rank
    FROM dcops.users
    WHERE email = ?
    LIMIT 1
");
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
	header('Location: /login/signin.php?error=' . urlencode('Invalid email or password.'));
	exit;
}

if (empty($user['verified'])) {
	header('Location: /login/signin.php?error=' . urlencode('Please verify your email before signing in.'));
	exit;
}

$_SESSION['dcops_user_id'] = (int)$user['id'];
$_SESSION['dcops_name'] = $user['real_name'];
$_SESSION['dcops_email'] = $user['email'];
$_SESSION['dcops_org'] = $user['organization'];
$_SESSION['dcops_admin_rank'] = (int)$user['admin_rank'];
$_SESSION['dcops_trust_state'] = (int)$user['trust_state'];
$_SESSION['dcops_effective_rank'] = (int)$user['effective_rank'];

header('Location: https://dcops.co/');
exit;
