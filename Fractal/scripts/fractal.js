var playListJQ = $("#play-list");

function updateRandomModeText() {
    playListJQ.children().filter(function () {
        return $(this).text() === randomModeText;
    }).remove();
    if (playListJQ.children().length === 0) {
        playListJQ.append("<li id='random-mode-text'>" + randomModeText);
    }
}

var randomModeText = "Random playlist, drag songs here to create your own";
playListJQ.append("<li id='random-mode-text'>" + randomModeText);

$(function () {
    // Page has been loaded.

    $("#music-list").scrollTop = 0; // Force scroll bar to show

    var canvas = document.getElementById("wave-canvas");

    music.init();
    player.init();
    waveformVisualization.beginRendering(canvas);

    // Update list
    var musicList = document.getElementById("music-list");
    for (var i in musicData) {
        if (musicData.hasOwnProperty(i)) {
            var musicTitle = musicData[i];
            var text = "ERROR";
            if (musicTitle.ID3Tags == undefined || musicTitle.ID3Tags.title == undefined) {
                text = musicTitle.Filename;
            } else if (musicTitle.ID3Tags.artist == undefined) {
                text = musicTitle.ID3Tags.title + " (" + musicTitle.Filename + ")";
            } else {
                text = musicTitle.ID3Tags.title + " - " + musicTitle.ID3Tags.artist;
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
        group: {name: "music-list-group", pull: "clone", put: false},
        handle: ".handle",
        scroll: true,
        sort: false
    });

    Sortable.create(document.getElementById("play-list"), {
        group: {name: "music-list-group", pull: false, put: true},
        handle: ".handle",
        scroll: true,
        sort: true,
        onSort: function (evt) {
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
                removeBtn.on("click", function () {
                    item.remove();
                    updateRandomModeText();
                });
                item.tooltip("disable");
            }
        }
    });
});