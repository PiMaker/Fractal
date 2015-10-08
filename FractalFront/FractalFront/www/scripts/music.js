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
        } catch (e) {
            alert("Web Audio API is not supported on this device. Music can't be played. Consider buying a new device.");
        }
    },
    play: function(url) {
        music.audio.pause();
        music.audio.src = url;
        music.audio.onended = music.finished;
        music.audio.play();
        var source = music.context.createMediaElementSource(music.audio);
        source.connect(music.analyser);
        music.analyser.connect(music.context.destination);
    },
    getWaveForm: function(callback) {
        var bufferLength = music.analyser.frequencyBinCount;
        var dataArray = new Uint8Array(bufferLength);
        music.analyser.getByteTimeDomainData(dataArray);
        callback(dataArray);
    },
    getFft: function (callback) {
        var bufferLength = music.analyser.frequencyBinCount;
        var buffer = new Uint8Array();
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
    }
};