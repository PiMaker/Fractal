﻿var playListJQ = $("#play-list");

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

    // Clock
    var clockElement = $("#clock");
    function clock() {
        var currentDate = new Date();
        clockElement.text(currentDate.getHours() + ":" + currentDate.getMinutes());
        setTimeout(clock, 1);
    }
    clock();

    $("#music-list").scrollTop = 0; // Force scroll bar to show

    $("#btnUpload").attr("href", "upload?password=" + sessionStorage.getItem("fractal-pass"));

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
            var newElement = $("<li><span class='handle'>☰</span><span class='list-text'>" + text + "</span><span class='music-filename'>" + musicTitle.Filename + "</span><span class='music-url'>" + musicTitle.URL + "</span></li>");
            newElement.addClass("list-group-item");

            var playBtn = $('<button><i style="color: white;"></i></button>');
            playBtn.children().first().addClass("fa");
            playBtn.children().first().addClass("fa-play");
            playBtn.appendTo(newElement);
            playBtn.addClass("remove-btn");
            playBtn.addClass("btn");
            playBtn.addClass("btn-info");
            playBtn.on("click", playButton);

            if (allowModify === 1) {
                var removeBtn = $('<button style="right: 4.5em !important;"><i style="color: white;"></i></button>');
                removeBtn.children().first().addClass("fa");
                removeBtn.children().first().addClass("fa-times");
                removeBtn.appendTo(newElement);
                removeBtn.addClass("remove-btn");
                removeBtn.addClass("btn");
                removeBtn.addClass("btn-info");
                removeBtn.on("click", deleteButton);
            }

            newElement.appendTo($(musicList));

            //newElement.tooltip({title: "test"});
        }
    }

    // Create sortable lists
    Sortable.create(musicList, {
        group: {name: "music-list-group", pull: "clone", put: false},
        handle: ".handle",
        scroll: true,
        sort: false,
        onSort: function(evt) {
            // Reset button events
            $(musicList).find("button").each(function() {
                var el = $(this);
                el.off("click");
                if (el.find("i").first().is(".fa-times"))
                {
                    // Remove button
                    el.on("click", deleteButton);
                }
                else
                {
                    // Play button
                    el.on("click", playButton);
                }
            });
        }
    });

    Sortable.create(document.getElementById("play-list"), {
        group: {name: "music-list-group", pull: false, put: true},
        handle: ".handle",
        scroll: true,
        sort: true,
        onSort: function (evt) {
            updateRandomModeText();
            var item = $(evt.item);
            if (item.find("button").length === 2 && playListJQ.has(item).length) {
                item.find("button").remove();
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
                //item.tooltip("disable");
            }
        }
    });
});

function deleteButton() {
    var filename = $(this).parent().find(".music-filename").first().text();
    var URL = $(this).parent().find(".music-url").first().text();
    Ply.dialog("confirm", 'Are you sure you want to delete "' + filename + '"?')
        .done(function (ui) {
            $.ajax({
                dataType: "json",
                url: "api.php?password=" + sha256(sessionStorage.getItem("fractal-pass")) + "&action=delete&item=" + encodeURIComponent(filename),
                success: function (data) {
                    if (data.success == "deleted") {
                        $(".music-url").filter(function (el) {
                            return $(this).text() == URL;
                        }).parent().remove();
                        Ply.dialog("alert", "Aaaand it's gone!");
                    } else if (data.error != undefined) {
                        Ply.dialog("alert", "There was an error deleting this element: " + data.error);
                    } else {
                        Ply.dialog("alert", "There was an error deleting this element: Unknown server error.");
                    }
                },
                error: function (error, nothing, msg) {
                    Ply.dialog("alert", "There was an error deleting this element: " + msg + " (" + error.status + ")");
                }
            });
        });
}

function playButton() {
    player.playUrl($(this).parent().find(".music-url").first().text());
}