var music = {
    context: null,
    analyser: null,
    audio: null,
    finished: null,
    bufferLength: null,
    init: function () {
        try {
            music.context = new (window.AudioContext || window.webkitAudioContext)();
            music.analyser = music.context.createAnalyser();
            music.bufferLength = music.analyser.frequencyBinCount;
            music.audio = new Audio();
        } catch (e) {
            alert("Web Audio API is not supported on this platform. Music can't be played. Consider using a different browser.");
        }
    },
    play: function (url) {
        music.audio.pause();
        music.audio.src = url;
        music.audio.volume = 1.0;
        music.audio.onended = music.finished;
        var source = music.context.createMediaElementSource(music.audio);
        source.connect(music.analyser);
        music.analyser.connect(music.context.destination);
        music.audio.play();
    },
    getWaveForm: function (callback) {
        var dataArray = new Uint8Array(music.bufferLength);
        music.analyser.getByteTimeDomainData(dataArray);
        callback(dataArray);
    },
    getFft: function (callback) {
        var dataArray = new Uint8Array(music.bufferLength);
        music.analyser.getByteFrequencyData(dataArray);
        callback(dataArray);
    },
    getDuration: function () {
        return music.audio.duration;
    },
    getCurrentTime: function () {
        return music.audio.currentTime;
    },
    setCurrentTime: function (newTime) {
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
        music.audio.onended = music.finished;
    }
};