<?php
if (session_status() == PHP_SESSION_NONE) session_start();

if(isset($_SESSION['name'])){
	$text = $_POST['text'];

	$text_message = "<div class='msgln'><span class='chat-time'>".date("g:i A")."</span> <b class='user-name'>".$_SESSION['name']."</b> ".stripslashes(htmlspecialchars($text))."<br></div>";
	file_put_contents("../tmp/universalChatLog.html", $text_message, FILE_APPEND | LOCK_EX);
}
?>