(function() {
    "use strict";

    var randomModeText = "Random playlist, drag songs here to create your own";
    $("#play-list").append("<li>" + randomModeText);

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
                var text = "ERROR";
                if (musicTitle.ID3Tags.Title == undefined || musicTitle.ID3Tags.JoinedArtists == undefined) {
                    text = musicTitle.Filename;
                } else {
                    text = musicTitle.ID3Tags.Title + " - " + musicTitle.ID3Tags.JoinedArtists;
                }
                $(musicList).append("<li><span class='handle'>☰</span>" + text).addClass("list-group-item");
            }
        }

        // Create sortable lists
        Sortable.create(musicList, {
            group: { name: "music-list-group", pull: "clone", put: false },
            handle: ".handle",
            scroll: true,
            sort: false
        });

        var playListJQ = $("#play-list");
        function updateRandomModeText() {
            playListJQ.children().filter(function () {
                return $(this).text() === randomModeText;
            }).remove();
            if (playListJQ.children().length === 0) {
                playListJQ.append("<li>" + randomModeText);
            }
        }

        Sortable.create(document.getElementById("play-list"), {
            group: { name: "music-list-group", pull: false, put: true },
            handle: ".handle",
            scroll: true,
            sort: true,
            onSort: function(evt) {
                updateRandomModeText();
                var item = $(evt.item);
                var removeBtn = item.append("<button>");
                removeBtn.addClass("remove-btn");
                removeBtn.on("click", function() {
                    item.remove();
                    updateRandomModeText();
                });
            }
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