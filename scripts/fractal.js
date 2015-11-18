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

if (sessionStorage.getItem("fractal-pass") == undefined) {
    sessionStorage.setItem("fractal-pass", sha256(""));
}

var deviceWidth = 0;
$(window).bind('resize', function () {
    deviceWidth = $('[data-role="page"]').first().width();
}).trigger("resize");

$(function () {
    // Page has been loaded.

    // Clock
    var clockElement = $("#clock");

    function prettyPrint(number) {
        var s = number + "";
        while (s.length < 2) {
            s = "0" + s;
        }
        return s;
    }

    function clock() {
        var currentDate = new Date();
        clockElement.text(prettyPrint(currentDate.getHours()) + ":" + prettyPrint(currentDate.getMinutes())
            + (deviceWidth <= 768 ? " - Tap elements to add to playlist" : ""));
        setTimeout(clock, 1);
    }

    clock();

    var volumeSlider = $('#volumeSlider');
    volumeSlider.slider({
        formatter: function (value) {
            return value + "/100";
        }
    });
    volumeSlider.on("change", function (val) {
        if (music.audio) {
            var value = val.value.newValue / 100.0;
            music.audio.volume = value;
            localStorage.setItem("fractal-volume", value);
        }
    });
    var sliderVal = localStorage.getItem("fractal-volume");
    if (sliderVal != undefined) {
        volumeSlider.slider("setValue", sliderVal*100);
    }

    var musicListJQ = $("#music-list");

    musicListJQ.scrollTop = 0; // Force scroll bar to show

    $("#btnUpload").attr("href", "upload/index.php?password=" + sessionStorage.getItem("fractal-pass"));

    var canvas = document.getElementById("wave-canvas");

    music.init();
    player.init();

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

            newElement.find(".list-text").bind("click", function () {
                var t = $(this);
                var tp = t.parent();
                tp.stop().css("background-color", "rgba(0,0,0,255)").css("border", "rgba(0,0,0,255)");
                var from = {property: 0};
                var to = {property: 255};
                $(from).animate(to, {
                    duration: 500,
                    progress: function () {
                        var rgba = "rgba(" + (this.property|0) + "," + (this.property|0) + "," + (this.property|0)  +",255)";
                        tp.css("background-color", rgba)
                          .css("border", rgba);
                    }
                });
                setTimeout(function () {
                    tp.stop().css("background-color", "rgba(255,255,255,255)").css("border", "rgba(255,255,255,255)");
                }, 500);
                tp.css("background-color", "");
                tp.css("border", "");
                var clone = tp.clone();
                $("#play-list").append(clone);
                fixPlayListItem({item:clone});
            });

            var playBtn = $('<button><i style="color: white;"></i></button>');
            playBtn.children().first().addClass("fa");
            playBtn.children().first().addClass("fa-play");
            playBtn.appendTo(newElement);
            playBtn.addClass("remove-btn");
            playBtn.addClass("btn");
            playBtn.addClass("btn-info");
            playBtn.on("click", playButton);

            if (allowModify === 1) {
                var removeBtn = $('<button style="right: 4.5em;" class="btn-remove-left"><i style="color: white;"></i></button>');
                removeBtn.children().first().addClass("fa");
                removeBtn.children().first().addClass("fa-times");
                removeBtn.appendTo(newElement);
                removeBtn.addClass("remove-btn");
                removeBtn.addClass("btn");
                removeBtn.addClass("btn-info");
                removeBtn.on("click", deleteButton);
            }

            newElement.appendTo(musicListJQ);

            //newElement.tooltip({title: "test"});
        }
    }

    var musics = $(musicList).children("li");
    musics.sort(function (a,b) {
        return $(a).find(".list-text").first().text().localeCompare($(b).find(".list-text").first().text());
    });
    musics.detach().appendTo(musicListJQ);

    // Create sortable lists
    Sortable.create(musicList, {
        group: {name: "music-list-group", pull: "clone", put: false},
        handle: ".handle",
        scroll: true,
        sort: false,
        onSort: function (evt) {
            // Reset button events
            $(musicList).find("button").each(function () {
                var el = $(this);
                el.off("click");
                if (el.find("i").first().is(".fa-times")) {
                    // Remove button
                    el.on("click", deleteButton);
                }
                else {
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
        onSort: fixPlayListItem
    });

    var musicListItems = musicListJQ.find("li");
    musicListJQ.scroll(function () {
        musicListItems.each(function () {
            var children = $(this).find("*");
            if (isVisible($(this))) {
                children.css("display", "block");
            } else {
                children.css("display", "none");
            }
        });
    });
    musicListJQ.trigger("scroll");

    window.onresize = function () {
        if (deviceWidth > 768) {
            //noinspection JSValidateTypes
            document.getElementById("first-half-div").style = "";
            //noinspection JSValidateTypes
            document.getElementById("second-half-div").style = "position: relative;";
            isListHidden = true;
        }

        musicListJQ.trigger("scroll");
    };

    waveformVisualization.beginRendering(canvas);

    if (getParameterByName("autoplay") == "1") {
        player.chooseNext();
    }
});

function deleteButton() {
    var filename = $(this).parent().find(".music-filename").first().text();
    var URL = $(this).parent().find(".music-url").first().text();
    Ply.dialog("confirm", 'Are you sure you want to delete "' + filename + '"?')
        .done(function () {
            $.ajax({
                dataType: "json",
                url: "api.php?password=" + sessionStorage.getItem("fractal-pass") + "&action=delete&item=" + encodeURIComponent(filename),
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

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function playButton() {
    player.playUrl($(this).parent().find(".music-url").first().text());
}

function fixPlayListItem(evt) {
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

function isVisible($obj) {
    var top = $(window).scrollTop() - 50;
    var bottom = top + $(window).height();
    var objTop = $obj.offset().top;
    var objBottom = objTop + $obj.height();

    return objTop < bottom && objBottom > top;
}


var isListHidden = true;
var animationDuration = 600;

function showList() {
    var list = $(".first-half");
    var visual = $(".second-half");

    if (isListHidden) {
        isListHidden = false;
        list.css("display", "flex");
        list.velocity({height: "100%"}, {
            duration: animationDuration,
            complete: function () {
                visual.css("display", "none");
                $("#music-list").trigger("scroll");
            }
        });
        visual.velocity({height: "0%"}, {duration: animationDuration});
        $("#music-list").find("li *").css("display", "block");
    } else {
        isListHidden = true;
        visual.css("display", "block");
        list.velocity({height: "0%"}, {
            duration: animationDuration,
            complete: function () {
                list.css("display", "none");
                $("#music-list").find("li *").css("display", "none");
            }
        });
        visual.velocity({height: "100%"}, {duration: animationDuration});
    }
}