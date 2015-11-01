<?php

// Load config
$config = (require "config.php");

// Helpers
function auth()
{
    global $config;
    return hash("sha256", $config["password"]) == $_GET["password"];
}

// Check action
if ($_GET["action"] == "login") {
    if (auth()) {
        die('{"success": 1}');
    } else {
        die('{"error": "Invalid password."}');
    }
} elseif ($_GET["action"] == "delete") {
    if (auth()) {
        if ($config["allow-modify"]) {
            if (unlink("music/" . $_GET["item"])) {
                die('{"success": "deleted"}');
            } else {
                die('{"error": "File could not be deleted."}');
            }
        } else {
            die('{"error": "Modifications are not allowed. To enable, set allow-modify to true in config.php."}');
        }
    } else {
        die('{"error": "Not authenticated."}');
    }
} else {
    die("Unknown action.");
}