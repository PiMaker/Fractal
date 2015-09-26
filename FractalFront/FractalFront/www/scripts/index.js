(function() {
    "use strict";

    document.addEventListener( "deviceready", onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( "pause", onPause.bind( this ), false );
        document.addEventListener( "resume", onResume.bind( this ), false );

        // Cordova has been loaded. Perform any initialization that requires Cordova here.
        $("#music-list").scrollTop = 0; // Force scroll bar to show on windows platform

        music.init();
        music.play("http://stepro.synology.me/digiworld_music/intro.mp3");
        waveformVisualization.beginRendering(document.getElementById("wave-canvas"));
    };

    function onPause() {
        // This application has been suspended. Save application state here.
    };

    function onResume() {
        // This application has been reactivated. Restore application state here.
    };
})();