<?php
if (session_status() == PHP_SESSION_NONE) session_start();

if(isset($_SESSION['name'])){
		$file_path = "../tmp/universalChatLog.html";
		$file_handle = fopen($file_path, "w");
		$text_message = "<div class='msgln'><span class='chat-time'>" . date("g:i A") . "</span> <b class='user-name'>Server</b> I just reset the chat.<br></div>";
		fwrite($file_handle, "");
		fclose($file_handle);
		file_put_contents($file_path, $text_message, FILE_APPEND | LOCK_EX);
}
?>