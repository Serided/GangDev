<?php
session_start();
if(isset($_GET['logout'])){

	// logout message
	$logout_message = "<div class='msgln'><span class='left-info'>User <b class='user-name-left'>". $_SESSION['name'] ."</b> has left the chat session.</span><br></div>";
	file_put_contents("../../../tmp/testMultiplayerChatLog.html", $logout_message, FILE_APPEND | LOCK_EX);

	session_destroy();
	header("Location: testMultiplayerChat.php"); //Redirect the user
}
if(isset($_POST['enter'])){
	if($_POST['name'] != ""){
		$_SESSION['name'] = stripslashes(htmlspecialchars($_POST['name']));

        // logon message
        $logon_message = "<div class='msgln'><span class='join-info'>User <b class='user-name-join'>". $_SESSION['name'] ."</b> has joined the chat session.</span><br></div>";
        file_put_contents("../../../tmp/testMultiplayerChatLog.html", $logon_message, FILE_APPEND | LOCK_EX);
	}
	else{
		echo '<span class="error">Please type in a name</span>';
	}
}
function loginForm(){
	echo
		'<div id="loginform"> 
        <p>Please enter your name to continue!</p> 
        <form action="testMultiplayerChat.php" method="post"> 
        <label for="name">Name &mdash;</label> 
        <input type="text" name="name" id="name" maxlength="25"/> 
        <input type="submit" name="enter" id="enter" value="Enter" /> 
        </form> 
        </div>';
}
?>
<?php
$navbar = file_get_contents ("../../../html/navBar.html");
$copyright = file_get_contents("../../../html/copyright.html");
$fader = file_get_contents("../../../html/pageFader.html");
$head = file_get_contents("../../../html/repetitive.html");
?>
<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>Test Multiplayer Chat</title>
		<meta charset="UTF-8" name="description" content="Test Multiplayer Chat"/>
		<link rel="stylesheet" href="/css/apps/testMultiplayerChat.css"/>
        <?= $head ?>
	</head>
    <body>
    <?php
    if(!isset($_SESSION['name'])){
        loginForm();
    }
    else {
        ?>
	    <?= $fader ?>
	    <?= $navbar ?>
        <div id="wrapper">
            <div id="menu">
                <p class="welcome">Welcome, <b><?php echo $_SESSION['name']; ?></b></p>
                <p class="logout"><a id="exit" href="#">Exit Chat</a></p>
            </div>
            <div id="chatbox">
                <?php
                $filename = "../../../tmp/testMultiplayerChatLog.html";
                if(file_exists($filename) && filesize($filename) > 0){
                    $contents = file_get_contents($filename);
                    echo $contents;
                }
                else {
                    $defaultMsg = "<div class='msgln'><span class='chat-time'>".date("g:i A")."</span> <b class='user-name'>Server</b> I just reset the chat.<br></div>";
                    file_put_contents($filename, $defaultMsg);
                    echo $defaultMsg;
                }
                ?>
            </div>
            <form name="message" action="">
                <input name="usermsg" type="text" id="usermsg" maxlength="500"/>
                <input name="submitmsg" type="submit" id="submitmsg" value="Send" />
            </form>
        </div>
        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
        <script type="text/javascript" src="/js/apps/testMultiplayerChat/script.js"></script>
    </body>
</html>
<?php
}
?>