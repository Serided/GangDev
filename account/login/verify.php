<?php
require_once '/var/www/gangdev/shared/php/init.php';
require_once "/var/www/gangdev/account/php/db.php";

if (isset($_GET['token'])) {
	$token = $_GET['token'];

	// find token
	$stmt = $pdo->prepare("SELECT * FROM pending_users WHERE verification_token = ?");
	$stmt->execute([$token]);
	$pendingUser = $stmt->fetch(PDO::FETCH_ASSOC);

	if ($pendingUser) {
		// check if token expired
		if (strtotime($pendingUser['token_expires']) >= time()) {
			$stmt = $pdo->prepare("INSERT INTO users (displayname, username, email, password, verified) VALUES (?, ?, ?, ?, ?)");
			if ($stmt->execute([$pendingUser['displayname'], $pendingUser['username'], $pendingUser['email'], $pendingUser['password']])) {
				$_SESSION["user_id"] = $pdo->lastInsertId();
				$_SESSION["displayname"] = $pendingUser['displayname'];
				$_SESSION["username"] = $pendingUser['username'];
				$_SESSION["email"] = $pendingUser['email'];
				$_SESSION["verified"] = true;

				$folder = '/var/www/gangdev/user/' . $_SESSION["user_id"];
				if (!file_exists($folder)) {
					mkdir($folder, 0755, true);
					mkdir($folder . '/icon', 0755, true);
					mkdir($folder . '/data', 0755, true);
				}

				/*if ($rememberMe) {
					$token = bin2hex(random_bytes(16));  // 32-character token
					$expiry = date('Y-m-d H:i:s', time() + (30 * 24 * 60 * 60));  // 30 days from now

					$stmt = $pdo->prepare("INSERT INTO user_remember_tokens (user_id, token, expires_at) VALUES (?, ?, ?)");
					$stmt->execute([$_SESSION['user_id'], $token, $expiry]);

					// Set a persistent cookie for 30 days
					setcookie('rememberMe', $token, time() + (30 * 24 * 60 * 60), '/', '.gangdev.co', false, true);
				}*/

				$stmt = $pdo->prepare("DELETE FROM pending_users WHERE id = ?");
				$stmt->execute([$pendingUser['id']]);

				echo "Your email has been verified, and your account is now active.";
				header("Location: https://account.gangdev.co");
				exit();
			} else {
				echo "There was an error creating your account. Please try again.";
			}
		} else {
			echo "The verification link has expired.";
		}
	} else {
		echo "Invalid verification token.";
	}
} else {
	echo "No verification token provided.";
}
?>