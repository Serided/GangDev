<?php require_once '/var/www/gangdev/shared/php/init.php'; ?>
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
        <div class="deleteContainer">
            <h2>Are you</h2>
            <h1>SURE?</h1>
            <p class="mTop">
                <b>IT IS PERMANENT</b>, and because of this,<br>
                <i>You will have 30 days to change your mind.</i><br><br>
                If so, type '<b>I want to delete my account.</b>' below.
            </p>
            <form action="request_delete.php" method="post" class="mTop">
                <div class="inputContainer">
                    <input type="text" id="delete" name="delete" placeholder="but u dont actually, right??" required>
                </div>
            </form>
            <button type="submit" class="submit mTop">:( Ya ):</button>
        </div>
    </body>
</html>