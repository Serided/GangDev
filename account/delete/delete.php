<?php require_once '/var/www/gangdev/shared/php/init.php'; ?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recovery</title>
        <link href="delete.css" rel="stylesheet" >
	    <?= $head ?>
    </head>
    <body>
        <div class="deleteContainer">
            <h2>Are you</h2>
            <h1>SURE?</h1>
            <p class="mTop">
                To confirm, type '<b>I want to delete my account.</b>' below.
            </p>
            <form action="process_delete.php" method="post" class="mTop">
                <input type="text" id="delete" name="delete" required>
            </form>
            <button type="submit" class="submit mTop">:( Ya ):</button>
        </div>
    </body>
</html>