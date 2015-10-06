(function() {
    "use strict";

    document.addEventListener( "deviceready", onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( "pause", onPause.bind( this ), false );
        document.addEventListener( "resume", onResume.bind( this ), false );

        // Cordova has been loaded. Perform any initialization that requires Cordova here.
        $("#music-list").scrollTop = 0; // Force scroll bar to show on windows platform

        var canvas = document.getElementById("wave-canvas");

        music.init();
        waveformVisualization.beginRendering(canvas);

        // Update list
        var musicList = document.getElementById("music-list");
        var jsonData = JSON.parse(getParameterByName("d"));
        for (var i in jsonData) {
            if (jsonData.hasOwnProperty(i)) {
                var musicTitle = jsonData[i];
                var text = musicTitle.ID3Tags.Title + " - " + musicTitle.ID3Tags.JoinedArtists;
                $(musicList).append("<li>" + text).addClass("list-group-item");
            }
        }

        // Create sortable list
        Sortable.create(musicList, {
            group: { name: "music-list-group", pull: "clone", put: false }
        });
    };

    function onPause() {
        // This application has been suspended. Save application state here.
    };

    function onResume() {
        // This application has been reactivated. Restore application state here.
    };
})();

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}