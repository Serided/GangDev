<?php
if (session_status() == PHP_SESSION_NONE) session_start();
header('Content-type: application/json');

if (!isset($_SESSION['user_id'])) {
	echo json_encode(["status" => "error", "message" => "User not logged in."]);
	exit();
}

if (!isset($_FILES['icon'])) {
	echo json_encode(["status" => "error", "message" => "No file uploaded."]);
	exit();
}

$file = $_FILES['icon'];

$finfo = new finfo(FILEINFO_MIME_TYPE);
if ($finfo->file($file['tmp_name']) != "image/jpeg") {
	echo json_encode(["status" => "error", "message" => "Only JPEG files allowed."]);
	exit();
}

$maxFileSize = 2 * 1024 * 1024; // 2MB limit
if ($file['size'] > $maxFileSize) {
	echo json_encode(["status" => "error", "message" => "File is too big."]);
	exit();
}

$userId = $_SESSION['user_id'];
$folder = '/var/www/gangdev/user/' . $userId;

if (!file_exists($folder)) {
	mkdir($folder, 0755, true);
}
$ifolder = $folder . '/icon';
if (!file_exists($ifolder)) {
	mkdir($ifolder, 0755, true);
}

$destination = $ifolder . '/user-icon.jpg';
if (file_exists($destination)) {
	unlink($destination);
}
if (move_uploaded_file($file['tmp_name'], $destination)) {
	$iconUrl = 'https://gangdev.co/user/' . $userId . '/icon/user-icon.jpg';
	echo json_encode(["status" => "success", "url" => $iconUrl]);
} else {
	echo json_encode(["status" => "error", "message" => "Error saving file."]);
}