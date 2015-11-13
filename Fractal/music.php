<?php

// Load config
$config = (require "config.php");

// Auth
if (hash("sha256", $config["password"]) != $_GET["password"]) {
    // Shows login page if unauthorized
    die('<html><head><meta http-equiv="refresh" content="0; url=index.php"/></head><body>Click the following link if you are not redirected automatically: <a href="index.php">Fractal</a></body></html>');
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
    <link href="css/music.css" rel="stylesheet"/>
    <link href="css/font-awesome.min.css" rel="stylesheet"/>
    <link href="css/platformOverrides.css" rel="stylesheet"/>
    <link href="css/ply.css" rel="stylesheet"/>
    <link href="css/bootstrap-slider.min.css" rel="stylesheet">
    <style>:focus {
            outline: none !important;
        }</style>
    <link href="css/text.css" rel="stylesheet"/>

    <script>var allowModify = <?
        if ($config["allow-modify"])
        {
            echo("1");
        }
        else
        {
            echo("0");
        }
    ?>;</script>

    <!--PHP-Generated music data-->
    <script>var musicData = {
            <?

                        // Require
                        require_once "getID3/getid3.php";

                        // Initialize getID3 engine
                        $getID3 = new getID3;

                        // Define helpers
                        function endsWith($haystack, $needle) {
                            return $needle === "" || (($temp = strlen($haystack) - strlen($needle)) >= 0 && strpos($haystack, $needle, $temp) !== FALSE);
                        }

                        // Read music files
                        $files = scandir("music");

                        // Echo files
                        $counter = 0;
                        foreach ($files as $file)
                        {
                            $endsWithMp3 = endsWith($file, ".mp3");
                            if (!($endsWithMp3 || endsWith($file, ".wav") || endsWith($file, ".ogg")))
                            {
                                continue;
                            }

                            echo("_".$counter.":{");

                            echo("Filename:'".$file."',");
                            echo('URL:"'.substr($_SERVER['REQUEST_URI'], 0, strrpos($_SERVER['REQUEST_URI'], '/') + 1)."music/".$file.'"');

                            if ($endsWithMp3)
                            {
                                echo(",ID3Tags:{");

                                // Analyze file for ID3-Tags
                                $fileInfo = $getID3->analyze("music/".$file);
                                getid3_lib::CopyTagsToComments($fileInfo);
                                if (isset($fileInfo["comments_html"]))
                                {
                                    foreach ($fileInfo["comments_html"] as $tag => $tagvalue) {
                                        echo($tag.':"'.implode(" & ", str_replace('"', "'", $tagvalue)).'",');
                                    }
                                }

                                echo("}");
                            }

                            echo("},");
                            $counter++;
                        }

                    ?>
        };</script>
</head>
<body data-role="page">
<!--Main Content Container-->
<div id="container">
    <!--Visual Half-->
    <div class="second-half" style="position: relative;" id="second-half-div">
        <div id="play-list-container">
            <!--List-->
            <ul id="play-list" class="list_style_default list_style_transparent"
                style="height: 100%; width: 100%; padding: 0; overflow-y: visible;"></ul>
        </div>
        <canvas id="wave-canvas" width="75" height="40"></canvas>
        <span id="music-title"></span>

        <div id="control-div">
            <i class="fa fa-backward clickable" id="btnBackward" onclick="player.backwardButtonClicked();"></i>
            <i class="fa fa-play clickable" id="btnPlayPause" onclick="player.playPauseButtonClicked();"></i>
            <i class="fa fa-forward clickable" id="btnForward" onclick="player.forwardButtonClicked();"></i>
            <input id="volumeSlider" data-slider-id='volumeSlider_id' type="text" data-slider-min="0" data-slider-max="100" data-slider-step="1" data-slider-value="100"/>
            <button id="btnShowList" class="btn btn-primary" onclick="showList()"><i class="fa fa-arrow-circle-up"></i></button>
        </div>
    </div>
    <!--List Half-->
    <div class="first-half" id="first-half-div">
        <!--List-->
        <ul id="music-list" class="list_style_default">
        </ul>
        <div class="footer">
            <p class="small"><? echo($config["title"]) ?>&nbsp;-&nbsp;<span id="clock"></span></p>
            <button class="btn btn-info" id="btnHideList" onclick="showList()"><i class="fa fa-arrow-down"></i></button>
            <a class="btn btn-info" id="btnUpload"><i class="fa fa-plus"></i></a>
        </div>
    </div>
</div>

<!--Scripts-->
<script src="scripts/jquery-2.1.4.min.js"></script>
<script src="scripts/jquery.color.js"></script>
<script src="scripts/ply.min.js"></script>
<script src="scripts/sha256.min.js"></script>
<script src="scripts/tether.min.js"></script>
<script src="scripts/sortable.min.js"></script>
<script src="scripts/bootstrap.min.js"></script>
<script src="scripts/bootstrap-slider.min.js"></script>
<script src="scripts/music.js"></script>
<!--Custom-->
<script src="scripts/visualizations/waveformVisualization.js"></script>
<!--Custom-->
<script src="scripts/fractal.js"></script>
<!--Custom-->
<script src="scripts/player.js"></script>
<!--Custom-->
</body>
</html>