var playListJQ = $("#play-list");

function updateRandomModeText() {
    playListJQ.children().filter(function() {
        return $(this).text() === randomModeText;
    }).remove();
    if (playListJQ.children().length === 0) {
        playListJQ.append("<li id='random-mode-text'>" + randomModeText);
    }
}

var randomModeText = "Random playlist, drag songs here to create your own";
$("#play-list").append("<li id='random-mode-text'>" + randomModeText);

document.addEventListener( "deviceready", onDeviceReady.bind( this ), false );

function onDeviceReady() {
    // Handle the Cordova pause and resume events
    document.addEventListener( "pause", onPause.bind( this ), false );
    document.addEventListener( "resume", onResume.bind( this ), false );

    // Cordova has been loaded. Perform any initialization that requires Cordova here.
    $("#music-list").scrollTop = 0; // Force scroll bar to show on windows platform

    var canvas = document.getElementById("wave-canvas");

    music.init();
    player.init();
    waveformVisualization.beginRendering(canvas);

    // Update list
    var musicList = document.getElementById("music-list");
    var jsonData = JSON.parse(sessionStorage.jsonData);
    for (var i in jsonData) {
        if (jsonData.hasOwnProperty(i)) {
            var musicTitle = jsonData[i];
            var text = "ERROR";
            if (musicTitle.ID3Tags.Title == undefined) {
                text = musicTitle.Filename;
            } else if (musicTitle.ID3Tags.JoinedArtists == undefined) {
                text = musicTitle.ID3Tags.Title + " (" + musicTitle.Filename + ")";
            } else {
                text = musicTitle.ID3Tags.Title + " - " + musicTitle.ID3Tags.JoinedArtists;
            }
            var newElement = $("<li><span class='handle'>☰</span><span class='list-text'>" + text + "</span><span class='music-url'>" + musicTitle.URL + "</span></li>");
            newElement.addClass("list-group-item");
            newElement.tooltip({
                placement: i === 0 ? "bottom" : "top",
                title: text
            });
            newElement.appendTo($(musicList));
        }
    }

    // Create sortable lists
    Sortable.create(musicList, {
        group: { name: "music-list-group", pull: "clone", put: false },
        handle: ".handle",
        scroll: true,
        sort: false
    });

    Sortable.create(document.getElementById("play-list"), {
        group: { name: "music-list-group", pull: false, put: true },
        handle: ".handle",
        scroll: true,
        sort: true,
        onSort: function(evt) {
            updateRandomModeText();
            var item = $(evt.item);
            if (item.has("button").length === 0 && playListJQ.has(item).length) {
                var removeBtn = $("<button><i></i></button>");
                removeBtn.children().first().addClass("fa");
                removeBtn.children().first().addClass("fa-times");
                removeBtn.appendTo(item);
                removeBtn.addClass("remove-btn");
                removeBtn.addClass("btn");
                removeBtn.addClass("btn-info");
                removeBtn.on("click", function() {
                    item.remove();
                    updateRandomModeText();
                });
                item.tooltip("disable");
            }
        }
    });
};

function onPause() {
    // This application has been suspended. Save application state here.
};

function onResume() {
    // This application has been reactivated. Restore application state here.
};

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}