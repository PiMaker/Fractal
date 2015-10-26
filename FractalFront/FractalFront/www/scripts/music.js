var music = {
    media: null,
    finished: null,
    init: function () {
    },
    play: function (url) {
        music.media && music.media.release();
        music.media = new Media(url, music.finished);
        music.media.play();
    },
    getWaveForm: function (callback) {
        if (music.media !== null) {
            music.media.getWaveForm(function (d) {
                callback(d);
            });
        } else {
            callback(new Int8Array(1024));
        }
    },
    getFft: function (callback) {
        if (music.media !== null) {
            music.media.getFft(callback);
        } else {
            callback(new Int8Array(1024));
        }
    },
    getDuration: function () {
        if (music.media !== null) {
            return Math.abs(music.media.getDuration());
        } else {
            return 0;
        }
    },
    getCurrentTime: function () {
        var temp = -16;
        music.media.getCurrentPosition(function (millis) {
            temp = millis;
        }, function () {
            temp = 0;
        });
        while (temp === -16) { }
        return temp;
    },
    setCurrentTime: function (newTime) {
        music.media.seekTo(newTime * 1000);
    },
    setPaused: function (paused) {
        if (paused) {
            music.media.pause();
        } else {
            music.media.play();
        }
    },
    setOnFinished: function (newOnFinished) {
        music.finished = newOnFinished;
        music.media && (music.media.successCallback = newOnFinished);
    }
};