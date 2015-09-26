var waveformVisualization = {
    draw: function (canvasCtx) {
        var width = canvasCtx.canvas.width;
        var height = canvasCtx.canvas.height;

        music.getWaveForm(function(dataArray) {
            canvasCtx.clearRect(0, 0, width, height);

            canvasCtx.lineWidth = 1;
            canvasCtx.strokeStyle = 'rgb(255, 255, 255)';

            canvasCtx.beginPath();

            var sliceWidth = width * 1.0 / dataArray.length;
            var x = 0;

            for (var i = 0; i < dataArray.length; i++) {

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
        });
    },
    rendering: false,
    beginRendering: function (canvas) {
        var canvasCtx = canvas.getContext("2d", { antialias: false });
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