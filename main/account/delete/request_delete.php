<?php
require_once '/var/www/gangdev/shared/php/init.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
	$deleteText = trim($_POST["delete"]);
	$requiredText = "I want to delete my account.";

	if ($deleteText !== $requiredText) {
		header("Location: delete.php?error=1");
		exit();
	}

	if (!isset($_SESSION['user_id'])) {
		echo "User not logged in.";
		exit();
	}
	$userId = $_SESSION['user_id'];
	$now = date('Y-m-d H:i:s');

	$stmt = $pdo->prepare("UPDATE users SET deletion_requested_at = ? WHERE id = ?");
	if ($stmt->execute([$now, $userId])) {
		echo "Your account deletion has been scheduled. It will be permanently deleted in 30 days.";
		echo "<br><br>You will be redirected shortly.";
		echo "<script>
                setTimeout(function() {
                    window.location.href = 'https://account.gangdev.co';
                }, 5000);
              </script>";
		exit();
	} else {
		header("Location: delete.php?error=2");
		exit();
	}
} else {
	header("Location: delete.php?error=3");
}
?>
