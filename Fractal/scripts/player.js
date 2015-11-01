var player = {
    state: "stopped", // Can be "stopped", "playing" or "paused"
    playedList: [],
    init: function () {
        music.setOnFinished(player.chooseNext);
    },
    playUrl: function (url) {
        music.play(url);
        player.playedList.push(url);
        player.state = "playing";
        player.setGUIBasedOnState(url);
    },
    playPauseButtonClicked: function () {
        var url = "";
        if (player.state === "playing") {
            music.setPaused(true);
            player.state = "paused";
        }
        else if (player.state === "paused") {
            music.setPaused(false);
            player.state = "playing";
        }
        else if (player.state === "stopped") {
            var currentPlayList = player.getCurrentPlayListUrls();
            if (currentPlayList.length > 0) {
                url = player.popPlayList();
            } else {
                url = player.chooseRandomSongUrl();
            }
            player.playedList.push(url);
            music.play(url);
            player.state = "playing";
        }

        player.setGUIBasedOnState(url);
    },
    forwardButtonClicked: function () {
        player.chooseNext();
    },
    backwardButtonClicked: function () {
        if (player.playedList.length > 0) {
            var popped = player.playedList.pop();
            music.play(popped);
            player.setGUIBasedOnState(popped);
        } else {
            player.chooseNext();
            player.setGUIBasedOnState();
        }
    },
    chooseNext: function () {
        player.state = "stopped";
        player.playPauseButtonClicked();
    },
    getCurrentPlayListUrls: function () {
        return $("#play-list").find("li .music-url").map(function () {
            return $(this).text();
        }).toArray();
    },
    popPlayList: function () {
        var el = $("#play-list").find("li .music-url").first();
        var url = el.text();
        el.parent().remove();
        updateRandomModeText();
        return url;
    },
    chooseRandomSongUrl: function () {
        console.log("Choosing random song...");
        var toRet = "/" + decodeURIComponent(music.audio.src.replace(/^(?:\/\/|[^\/]+)*\//, ""));
        var oldSrc = toRet;
        console.log("Initial: " + toRet);
        while (toRet === oldSrc) {
            console.log("Generating...");
            var allUrls = $("#music-list").find("li .music-url").map(function () {
                return $(this).text();
            }).toArray();
            toRet = allUrls[Math.floor(Math.random() * allUrls.length)];
            console.log("New: " + toRet);
        }
        console.log("Returning found value.");
        return toRet;
    },
    setGUIBasedOnState: function (url) {
        var btn = $("#btnPlayPause");
        btn.removeClass("fa-pause");
        btn.removeClass("fa-play");
        if (player.state === "playing") {
            btn.addClass("fa-pause");
        } else {
            btn.addClass("fa-play");
        }

        if (url != undefined && url !== "") {
            var text = $("#music-list").find("li .music-url").filter(function () {
                return $(this).text() === url;
            }).first().parent().find(".list-text").first().text();
            $("#music-title").text(text);
        }
    }
};