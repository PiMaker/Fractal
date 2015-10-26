function is0(val) {
    return val === 0;
}

var every = function (arr, func) {
    return arr.every(func);
}

var waveformVisualization = {
    amplitudeMultiplier: 0.8,
    draw: function (canvasCtx) {
        var width = canvasCtx.canvas.width;
        var height = canvasCtx.canvas.height;
        var height2 = height / 1.43;

        music.getWaveForm(function(dataArray) {
            canvasCtx.clearRect(0, 0, width, height);

            if (every(dataArray, is0)) return;

            var duration = music.getDuration();
            var position = 99999999;
            if (duration > 0) {
                position = (music.getCurrentTime() / duration) * dataArray.length;
            }

            canvasCtx.lineWidth = 1;
            canvasCtx.strokeStyle = "#d35400";

            canvasCtx.beginPath();

            var sliceWidth = width * 1.0 / dataArray.length * 2;
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
        });
    },
    rendering: false,
    beginRendering: function (canvas) {
        var canvasCtx = canvas.getContext("2d", { antialias: true });
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        waveformVisualization.rendering = true;
        requestAnimationFrame(function cb() {
            waveformVisualization.draw(canvasCtx);
            if (waveformVisualization.rendering) {
                requestAnimationFrame(cb);
            }
        });
    },
    stopRendering: function() {
        waveformVisualization.rendering = false;
    }
};