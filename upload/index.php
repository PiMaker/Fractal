<?php

// Load config
$config = (require "../config.php");

// Auth
if (hash("sha256", $config["password"]) != $_GET["password"] || !$config["allow-modify"]) {
// Shows login page if unauthorized
die('<html><head><meta http-equiv="refresh" content="0; url=../index.php"/></head><body>Click the following link if you are not redirected automatically: <a href="../index.php">Fractal</a></body></html>');
}

?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8"/>
		<title>Fractal - Upload</title>

		<!-- The main CSS file -->
		<link href="assets/css/style.css" rel="stylesheet" />
	</head>

	<body>
		<form id="upload" method="post" action="upload.php" enctype="multipart/form-data">
			<div id="drop">
				Drop Here

				<a>Browse</a>
				<input type="file" name="upl" multiple />
                <input type="hidden" name="password" id="passwordHidden" />
			</div>
			<ul>
			</ul>
		</form>

		<div style="width: 100%; text-align: center;">
			<button class="btn btn-primary" onclick="window.history.back()">Back to Fractal</button>
		</div>
        
		<!-- JavaScript Includes -->
		<script src="../scripts/jquery-2.1.4.min.js"></script>
		<script src="assets/js/jquery.knob.js"></script>

		<!-- jQuery File Upload Dependencies -->
		<script src="assets/js/jquery.ui.widget.js"></script>
		<script src="assets/js/jquery.iframe-transport.js"></script>
		<script src="assets/js/jquery.fileupload.js"></script>
		
		<!-- Our main JS file -->
		<script src="assets/js/script.js"></script>

        <script>
            $("#passwordHidden").val(sessionStorage.getItem("fractal-pass"));
        </script>
	</body>
</html>