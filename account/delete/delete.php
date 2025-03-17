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
                IT IS PERMANENT, and because of this,<br>
                <u>You will have 30 days to change your mind.</u><br>
                If so, type '<b>I want to delete my account.</b>' below.
            </p>
            <form action="process_delete.php" method="post" class="mTop">
                <div class="inputContainer">
                    <input type="text" id="delete" name="delete" placeholder="I want to delete my account." required>
                </div>
            </form>
            <button type="submit" class="submit mTop">:( Ya ):</button>
        </div>
    </body>
</html>