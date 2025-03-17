<?php require_once '/var/www/gangdev/shared/php/init.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recovery</title>
    <link href="recovery.css" rel="stylesheet" >
	<?= $head ?>
</head>
<body>
<div class="deleteContainer">
    <div class="centeredDiv">
        <h2>Are you</h2>
        <h1>SURE?</h1>
    </div>
    <div class="centeredDiv">
        <p class="mTop">
            To confirm, type 'I want to delete my account.' down below.
        </p>
        <form action="process_delete.php" method="post" class="mTop">
            <input type="text" id="delete" name="delete" required>
            <button type="submit" class="submit">Ya :(</button>
        </form>
    </div>
</div>
</body>
</html>