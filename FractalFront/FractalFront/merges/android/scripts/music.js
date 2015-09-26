var music = {
    media: null,
    init: function () {
    },
    play: function (url) {
        music.media = new Media(url);
        music.media.play();
    },
    getWaveForm: function(callback) {
        if (music.media !== null) {
            music.media.getWaveForm(function(d) {
                callback(d);
            });
        } else {
            callback(new Int8Array(1024));
        }
    },
    getFft: function(callback) {
        if (music.media !== null) {
            music.media.getFft(callback);
        } else {
            callback(new Int8Array(1024));
        }
    }
};