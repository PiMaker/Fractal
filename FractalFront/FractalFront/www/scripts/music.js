var music = {
    media: null,
    finished: null,
    init: function () {
    },
    play: function (url) {
        music.media && music.media.release();
        music.media = new Media(url, music.finished);
        music.media.setVolume(1.0);
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
        music.media.successCallback = newOnFinished;
    }
};

/*var music = {
    context: null,
    analyser: null,
    audio: null,
    finished: null,
    init: function() {
        try {
            music.context = new (window.AudioContext || window.webkitAudioContext)();
            music.analyser = music.context.createAnalyser();
            music.audio = new Audio();
            music.audio.onended = music.finished;
        } catch (e) {
            alert("Web Audio API is not supported on this device. Music can't be played. Consider buying a new device.");
        }
    },
    play: function (url, depth) {
        if (depth === 10) {
            return;
        }

        try {
            music.audio.pause();
            music.init();
            music.audio.src = url;
            var source = music.context.createMediaElementSource(music.audio);
            source.connect(music.analyser);
            music.analyser.connect(music.context.destination);
            music.audio.play();
        } catch (e) {
            if (depth == undefined) {
                depth = 0;
            }
            music.play(url, depth + 1);
        }
    },
    getWaveForm: function(callback) {
        var bufferLength = music.analyser.frequencyBinCount;
        var dataArray = new Uint8Array(bufferLength);
        music.analyser.getByteTimeDomainData(dataArray);
        callback(dataArray);
    },
    getFft: function (callback) {
        var bufferLength = music.analyser.frequencyBinCount;
        var buffer = new Uint8Array(bufferLength);
        music.analyser.getByteFrequencyData(buffer);
        callback(buffer);
    },
    getDuration: function() {
        return music.audio.duration;
    },
    getCurrentTime: function() {
        return music.audio.currentTime;
    },
    setCurrentTime: function(newTime) {
        music.audio.currentTime = newTime;
    },
    setPaused: function (paused) {
        if (paused) {
            music.audio.pause();
        } else {
            music.audio.play();
        }
    },
    setOnFinished: function (newOnFinished) {
        music.finished = newOnFinished;
        music.audio.onended = newOnFinished;
    }
};*/