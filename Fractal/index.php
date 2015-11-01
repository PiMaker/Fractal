<?php

// Define helpers
function redirect($url, $statusCode = 303)
{
    header('Location: ' . $url, true, $statusCode);
    die();
}

// Load config
$config = (require "config.php");

// Enforce https if specified
if ($config["enforce-ssl"] && $_SERVER["HTTPS"] != "on") {
    header("Location: https://" . $_SERVER["HTTP_HOST"] . $_SERVER["REQUEST_URI"]);
    exit();
}

// Check for password
if ($config["password"] == "") {
    redirect("music.php"); // Exits the script and loads Fractal if there is no password specified
}

?>

<!DOCTYPE html>
<html>
<head>
    <!--Meta Tags-->
    <meta charset="utf-8"/>
    <meta name="viewport"
          content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, target-densitydpi=device-dpi"/>

    <!--Title-->
    <title><? echo($config["title"]); ?></title>

    <!--CSS Links-->
    <link href="css/bootstrap.min.css" rel="stylesheet"/>
    <link href="css/login.css" rel="stylesheet"/>
    <link href="css/waitMe.min.css" rel="stylesheet"/>
    <link href="css/ply.css" rel="stylesheet"/>
    <style>:focus {
            outline: none !important;
        }</style>
    <link href="css/text.css" rel="stylesheet"/>
</head>
<body>
<div class="container">
    <form class="form-signin" onsubmit="return false;">
        <h2 class="form-signin-heading"><? echo($config["motd"]); ?></h2>
        <label for="inputPassword" class="sr-only">Password</label>
        <input type="password" id="inputPassword" class="form-control" placeholder="Password"
               onkeydown="if (event.keyCode === 13) document.getElementById('btnConnect').click()" autofocus>

        <div class="checkbox">
            <label>
                <input type="checkbox" value="remember-password" id="chkPassword"> Remember password (unencrypted!)
                <script>document.getElementById("chkPassword").checked = false;</script>
            </label>
        </div>
        <button class="btn btn-lg btn-primary btn-block" type="button" id="btnConnect">Login</button>
    </form>
</div>
<!-- /container -->

<!--Scripts-->
<script src="scripts/jquery-2.1.4.min.js"></script>
<script src="scripts/waitMe.min.js"></script>
<script src="scripts/promise.js"></script>
<script src="scripts/ply.min.js"></script>
<script src="scripts/bootstrap.min.js"></script>
<script src="scripts/sha256.min.js"></script>
<script src="scripts/login.js"></script>
<!--Custom-->
</body>
</html>
