<?php

// Load config
$config = (require "../config.php");

// Auth
if (hash("sha256", $config["password"]) != $_POST["password"] || !$config["allow-modify"]) {
    // Shows login page if unauthorized
    die('{"status":"error"}');
}

// A list of permitted file extensions
$allowed = array('mp3', 'wav', 'ogg');

if(isset($_FILES['upl']) && $_FILES['upl']['error'] == 0)
{
	$extension = pathinfo($_FILES['upl']['name'], PATHINFO_EXTENSION);

	if(!in_array(strtolower($extension), $allowed)){
		echo '{"status":"error"}';
		exit;
	}

	$filepath = '../music/'.$_FILES['upl']['name'];

	if (file_exists($filepath))
	{
		echo '{"status":"error"}';
		exit;
	}

	if(move_uploaded_file($_FILES['upl']['tmp_name'], $filepath))
	{
		echo '{"status":"success"}';
		exit;
	}
}

echo '{"status":"error"}';
exit;