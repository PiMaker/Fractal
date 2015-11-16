var waveformVisualization = {
    amplitudeMultiplier: 0.15,
    precisionModifier: 8,
    canvas: null,
    mousePos: {x: 0, y: 0},
    draw: function (canvasCtx) {
        canvasCtx.canvas.width = document.getElementById("second-half-div").offsetWidth;
        var width = canvasCtx.canvas.width;
        var height = canvasCtx.canvas.height;
        var height2 = height / 1.44;
        music.getWaveForm(function (dataArray) {
            canvasCtx.clearRect(0, 0, width, height);

            var duration = music.getDuration();
            var position = 99999999;
            if (duration > 0) {
                position = (music.getCurrentTime() / duration) * dataArray.length;
                canvasCtx.strokeStyle = "#d35400";
            } else {
                canvasCtx.strokeStyle = "#ecf0f1";
            }

            var ampMul = waveformVisualization.amplitudeMultiplier;
            if (music.audio) {
                if (music.audio.volume > 0.05) {
                    ampMul /= music.audio.volume;
                } else {
                    ampMul = 0;
                }
            }

            canvasCtx.lineWidth = 1;

            canvasCtx.beginPath();

            var sliceWidth = width / dataArray.length * waveformVisualization.precisionModifier;
            var x = 0;

            for (var i = 0; i < dataArray.length; i += waveformVisualization.precisionModifier) {

                var ydiff = height2 + ((dataArray[i] / 128.0) * height2 - height2) * ampMul;

                if (i > position) {
                    canvasCtx.lineTo(x, ydiff);
                    canvasCtx.stroke();
                    canvasCtx.beginPath();
                    canvasCtx.moveTo(x, ydiff);
                    canvasCtx.strokeStyle = "#ecf0f1";
                    position = 99999999;
                    continue;
                }

                if (i === 0) {
                    canvasCtx.moveTo(x, ydiff);
                } else {
                    canvasCtx.lineTo(x, ydiff);
                }

                x += sliceWidth;
            }

            canvasCtx.stroke();

            canvasCtx.fillStyle = "rgba(211, 84, 0, 0.5)";
            canvasCtx.fillRect(0, height2 - (height - height2), waveformVisualization.mousePos.x, height);
        });
    },
    rendering: false,
    beginRendering: function (canvas) {
        waveformVisualization.canvas = canvas;
        canvas.onmousemove = waveformVisualization.mouseSet;
        canvas.onmouseout = function () {
            waveformVisualization.mousePos = {x: 0, y: 0};
        };
        canvas.onmousedown = function () {
            music.setCurrentTime(waveformVisualization.mousePos.x / (canvas.width / music.getDuration()));
        };
        var canvasCtx = canvas.getContext("2d", {antialias: false});
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        waveformVisualization.rendering = true;
        requestAnimationFrame(function cb() {
            waveformVisualization.draw(canvasCtx);
            if (waveformVisualization.rendering) {
                requestAnimationFrame(cb);
            }
        });
    },
    stopRendering: function () {
        waveformVisualization.rendering = false;
        waveformVisualization.canvas.onmousemove = undefined;
        waveformVisualization.canvas.onmouseout = undefined;
        waveformVisualization.canvas.onmousedown = undefined;
    },
    mouseSet: function (evt) {
        var rect = waveformVisualization.canvas.getBoundingClientRect();
        waveformVisualization.mousePos = {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }
};