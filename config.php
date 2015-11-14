<?php

return array(
    // Password for player access. Leave blank to not set a password. Please note that this password only secures the
    // Fractal music application. Your mp3-files will always remain accessible, although uploading and deleting is also
    // restricted to authenticated users.
    "password" => "changeme",

    // Change to true/false depending on whether you want Fractal to only be accessible over encrypted connections.
    // This is strongly recommended when using a password.
    "enforce-ssl" => true,

    // Text that will be displayed on the login page. Note that the login page will not be accessible if you haven't
    // set a password.
    "motd" => "Please log in to use this Fractal Music Streaming server:",

    // The website title. This will be displayed in most browsers as a tab name and as a default favourite title.
    "title" => "Fractal",

    // Change to true/false depending on whether you want to allow modifications (adding and removing files) to your
    // music library through the Fractal Music Applications web interface.
    "allow-modify" => true
);