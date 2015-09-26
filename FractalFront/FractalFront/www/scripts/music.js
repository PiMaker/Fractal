var music = {
    context: null,
    analyser: null,
    audio: null,
    init: function() {
        try {
            music.context = new (window.AudioContext || window.webkitAudioContext)();
            music.analyser = music.context.createAnalyser();
            music.audio = new Audio();
        } catch (e) {
            alert("Web Audio API is not supported on this device. Music can't be played.");
        }
    },
    play: function(url) {
        music.audio.pause();
        music.audio.src = url;
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
    getFft: function(callback) {
        // TODO
    }
};