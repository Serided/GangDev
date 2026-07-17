<?php
require_once '/var/www/gangdev/shared/php/init.php';
$error = '';
if (isset($_GET['error'])) {
	if ($_GET['error'] == 1) {
		$error = "The text you entered does not match the required phrase.";
	} elseif ($_GET['error'] == 2) {
        $error = "Error scheduling account deletion.";
    } elseif ($_GET['error'] == 3) {
        $error = "Invalid request.";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Deletion</title>
        <link href="delete.css" rel="stylesheet" >
	    <?= $head ?>
    </head>
    <body>
        <?= $navbar ?>
        <div class="bgWrapper"></div>

        <div class="deleteContainer">
            <h2>Are you</h2>
            <h1>SURE?</h1>

	        <?php if ($error): ?>
                <p class="error"><?= htmlspecialchars($error) ?></p>
	        <?php endif; ?>

            <p class="mTop">
                <b>IT IS PERMANENT</b>, and because of this,<br>
                <i>You will have 30 days to change your mind.</i><br><br>
                If so, type '<b>I want to delete my account.</b>' below.
            </p>

            <form action="request_delete.php" method="post" class="mTop">
                <div class="inputContainer">
                    <input type="text" id="delete" name="delete" placeholder="but u dont actually, right??" required>
                </div>
                <div class="centeredDiv">
                    <button type="submit" class="submit mTop">:( Ya ):</button>
                </div>
            </form>
        </div>
        <script src="https://shared.gangdev.co/js/script.js"></script>
    </body>
</html>