(function () {
    "use strict";

    let lastTime = 0;

    const engine = {

        accumulator: 0,
        speed: 2,
        update: undefined,
        draw: undefined,
        pause: false,

        gameLoop: (time) => {
            let delta = (time - lastTime) / 1000;
            lastTime = time;
            engine.accumulator += delta;

            const step = 1 / engine.speed;
            while (engine.accumulator >= step) {
                if (engine.update && !engine.pause) {
                    engine.update.call();
                }
                engine.accumulator -= step;
            }

            if (engine.draw) {
                engine.draw.call();
            }
            requestAnimationFrame(engine.gameLoop);
        },
        togglePause: () => {
            if (!engine.pause) {
                engine.pause = true
            } else {
                engine.pause = false
            }
        },
        setFullScreen: (callBack) => {
            if (!document.fullscreen) {
                console.time()
                document.documentElement.requestFullscreen();
                console.timeEnd()
            } else {
                document.exitFullscreen();
            }

            document.addEventListener("fullscreenchange", function handler()  {
                if (callBack) {
                    callBack.call();
                }

                document.addEventListener("fullscreenchange",handler)
            })
        }
    }

    window.engine = engine;

}).call(this);