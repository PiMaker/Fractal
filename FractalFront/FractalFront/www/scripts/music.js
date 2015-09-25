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

        music.analyser.fftSize = 2048;
        var bufferLength = music.analyser.frequencyBinCount;
        var dataArray = new Uint8Array(bufferLength);

        var canvas = document.getElementById("wave-canvas");
        var width = canvas.width;
        var height = canvas.height;
        var canvasCtx = canvas.getContext("2d", { antialias: true });
        canvasCtx.clearRect(0, 0, width, height);

        function draw() {
            requestAnimationFrame(draw);

            music.analyser.getByteFrequencyData(dataArray);
            alert(dataArray[120]);
            music.analyser.getByteTimeDomainData(dataArray);

            canvasCtx.clearRect(0, 0, width, height);

            canvasCtx.lineWidth = 1;
            canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

            canvasCtx.beginPath();

            var sliceWidth = width * 1.0 / bufferLength;
            var x = 0;

            for (var i = 0; i < bufferLength; i++) {

                var v = dataArray[i] / 128.0;
                var y = v * height / 2;

                if (i === 0) {
                    canvasCtx.moveTo(x, y);
                } else {
                    canvasCtx.lineTo(x, y);
                }

                x += sliceWidth;
            }

            canvasCtx.stroke();
        };

        draw();
    }
};