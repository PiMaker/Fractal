var waveformVisualization = {
    amplitudeMultiplier: 0.15,
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

            canvasCtx.lineWidth = 1;

            canvasCtx.beginPath();

            var sliceWidth = width / dataArray.length * 2;
            var x = 0;

            for (var i = 0; i < dataArray.length; i += 2) {

                var v = (dataArray[i]) / (128.0);
                var y = v * height2;
                var ydiff = y - height2;

                if (i > position) {
                    canvasCtx.stroke();
                    canvasCtx.beginPath();
                    canvasCtx.moveTo(x, height2 + ydiff * waveformVisualization.amplitudeMultiplier);
                    canvasCtx.strokeStyle = "#ecf0f1";
                    position = 99999999;
                    continue;
                }

                if (i === 0) {
                    canvasCtx.moveTo(x, height2 + ydiff * waveformVisualization.amplitudeMultiplier);
                } else {
                    canvasCtx.lineTo(x, height2 + ydiff * waveformVisualization.amplitudeMultiplier);
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
        waveformVisualization.ca.onmouseout = undefined;
    },
    mouseSet: function (evt) {
        var rect = waveformVisualization.canvas.getBoundingClientRect();
        waveformVisualization.mousePos = {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }
};