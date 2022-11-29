function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

window.onload = function() {
    var file = document.getElementById("inFileId");
    var audio = document.getElementById("audioId");

    file.onchange = function () {
        var files = this.files;
        // Deal with multiple audio files later.
        audio.src = URL.createObjectURL(files[0]);
        audio.load();
        audio.play();
        
        // Here is the one that shows the sound wave
        var context = new AudioContext();
        var src = context.createMediaElementSource(audio);
        var analyzer = context.createAnalyser();

        var canvas = document.getElementById("canvasId");
        // Should be at the center of the page and relatively big 
        // This is static size at the moment
        canvas.width  = window.innerWidth * 0.7;
        // canvas.width  = window.innerWidth;
        // canvas.height = window.innerHeight;
        canvas.height = window.innerHeight * 0.3;

        var ctx = canvas.getContext("2d");

        src.connect(analyzer);
        analyzer.connect(context.destination);

        analyzer.fftSize = 256;

        var bufferLength = analyzer.frequencyBinCount;
        console.log(bufferLength);

        var dataArray = new Uint8Array(bufferLength);

        var WIDTH = canvas.width;
        var HEIGHT = canvas.height;

        var barWidth = (WIDTH/bufferLength) * 2.5;
        var barHeight;
        var x = 0;
        var y = 0;
        var max_val_dataArray = 0;
        function renderFrame() {
            // This shows the animation
            requestAnimationFrame(renderFrame);
            x = 0;
            y = 0;

            analyzer.getByteFrequencyData(dataArray);
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
            left_index = Math.floor(bufferLength/2);
            console.log(dataArray.length);
            for (var i = left_index-1; i >= 0 ; i--) {
                barHeight = dataArray[i];
                max_val_dataArray = Math.max(...dataArray);
                ctx.fillStyle = `rgb(${255-(84*(barHeight/max_val_dataArray))}, ${255-(59*(barHeight/max_val_dataArray))}, ${255}, 0.5)`;
                ctx.fillRect(x, 0, barWidth, barHeight);

                x += barWidth + 1;
            }
            for (var j = 0; j <= left_index; j++) {
                barHeight = dataArray[j];
                max_val_dataArray = Math.max(...dataArray);
                // rgb(187,218,187)
                ctx.fillStyle = `rgb(${255-(68*(barHeight/max_val_dataArray))}, 
                ${255-(37*(barHeight/max_val_dataArray))}, 
                ${255-(68*(barHeight/max_val_dataArray))}, 0.5)`;
                ctx.fillRect(y, HEIGHT-barHeight, barWidth, barHeight);
                y += barWidth + 1;
            }
        }
        audio.play();
        renderFrame();
    };
};