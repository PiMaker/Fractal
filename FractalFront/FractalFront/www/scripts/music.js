var music = {
    media: null,
    finished: null,
    init: function () {
    },
    play: function (url) {
        console.log("Started playing: " + url);
        //music.media && music.media.release();
        music.media = new Media(url, music.finished, function(error) {
            console.log("ERR: " + JSON.stringify(error));
        }, function(state) {
            console.log("STA: " + Media.MEDIA_MSG[state]);
        });
        console.log("-> Calling .play()");
        music.media.play();
    },
    getWaveForm: function (callback) {
        if (music.media !== null) {
            music.media.getWaveForm(callback);
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
    getCurrentTime: function (callback) {
        if (music.media !== null) {
            music.media.getCurrentPosition(callback);
        }
    },
    setCurrentTime: function (newTime) {
        music.media.seekTo(newTime);
    },
    setPaused: function (paused) {
        console.log("Setting paused to: " + paused);
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