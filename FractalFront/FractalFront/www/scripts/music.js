var music = {
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
    }
};