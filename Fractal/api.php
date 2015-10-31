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
} else {
    die("Unknown action.");
}