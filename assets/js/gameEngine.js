(function () {
    "use strict";

    let lastTime = 0;

    const engine = {

        accumulator: 0,
        speed: 2,
        update: undefined,
        draw: undefined,
        isPause: false,

        gameLoop: (time) => {
            let delta = (time - lastTime) / 1000;
            lastTime = time;
            engine.accumulator += delta;

            const step = 1 / engine.speed;
            while (engine.accumulator >= step) {
                if (engine.update && !engine.isPause) {
                    engine.update.call();
                }
                engine.accumulator -= step;
            }

            if (engine.draw) {
                engine.draw.call();
            }
            requestAnimationFrame(engine.gameLoop);
        },
        togglePause: (target) => {
            if (target == null) {
                if (!engine.isPause) {
                    engine.isPause = true
                } else {
                    engine.isPause = false
                }
            } else {
                if (typeof target === "boolean") {
                    if (engine.isPause !== target)
                        engine.togglePause()
                } else {
                    throw new Error("In togglePause target type must be boolean!");
                }
            }
        },
        setFullScreen: (callBack) => {
            if (!document.fullscreen) {
                document.documentElement.requestFullscreen();
            } else {
                document.exitFullscreen();
            }

            document.addEventListener("fullscreenchange", function handler() {
                if (callBack) {
                    setTimeout(callBack, 90);
                }

                document.addEventListener("fullscreenchange", handler)
            })
        },

    }

    window.engine = engine;

}).call(this);