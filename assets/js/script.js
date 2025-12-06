const canvas = document.querySelector("#game"),
    ctx = canvas.getContext("2d");

const grid = 30;  //pixel
const speedIncrease = 0.07;

let baseSpeed = 6,
    snakeBody = [{ x: 10, y: 10 }],
    velocity = { x: 1, y: 0 },
    lastMove = "right",

    food = { x: 15, y: 15 },
    particles = [],

    score = 0;

const foodImg = new Image();
foodImg.src = "./assets/image/image.png";

engine.speed = baseSpeed;

engine.update = update;
engine.draw = draw;

function spawnParticles(x, y) {
    for (let i = 0; i < 8; i++) {
        particles.push({
            x,
            y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            alpha: 1,
            size: 3 + Math.random() * 2,
            color: "yellow"
        });
    }
}

function updateParticles() {
    particles = particles.filter(p => p.alpha > 0);
    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.03;
    });
}

function update() {
    const head = { ...snakeBody[0] };

    head.x += velocity.x;
    head.y += velocity.y;

    if (head.x < 0) head.x = canvas.width / grid - 1;
    if (head.x >= canvas.width / grid) head.x = 0;
    if (head.y < 0) head.y = canvas.height / grid - 1;
    if (head.y >= canvas.height / grid) head.y = 0;

    for (let i = 1; i < snakeBody.length; i++) {
        if (snakeBody[i].x === head.x && snakeBody[i].y === head.y) {
            resetGame();
            return;
        }
    }

    snakeBody.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        engine.speed += speedIncrease;

        spawnFood();
        spawnParticles(head.x * grid + grid / 2, head.y * grid + grid / 2);
        /* score show */
    } else {
        snakeBody.pop()
    }

    updateParticles();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#303030ff";

    for (let i = 0; i < canvas.width; i += grid) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
    for (let j = 0; j < canvas.height; j += grid) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(canvas.width, j);
        ctx.stroke();
    }

    ctx.drawImage(foodImg, food.x * grid, food.y * grid, grid, grid);

    // snake
    ctx.fillStyle = "#4caf50";
    snakeBody.forEach((s, i) => {
        let radius = 6;
        ctx.beginPath();
        ctx.roundRect(
            s.x * grid,
            s.y * grid,
            grid,
            grid,
            radius
        );
        ctx.fill();
    });

    // Particles
    particles.forEach(p => {
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1;
}

function spawnFood() {
    food.x = Math.floor(Math.random() * (canvas.width / grid));
    food.y = Math.floor(Math.random() * (canvas.height / grid));

    for (let s of snakeBody) {
        if (s.x === food.x && s.y === food.y) {
            spawnFood();
            return;
        }
    }
}

document.addEventListener("keydown", e => {
    if (e.key === "ArrowUp" && lastMove !== "down") {
        velocity = { x: 0, y: -1 };
        lastMove = "up";
    }
    if (e.key === "ArrowDown" && lastMove !== "up") {
        velocity = { x: 0, y: 1 };
        lastMove = "down";
    }
    if (e.key === "ArrowLeft" && lastMove !== "right") {
        velocity = { x: -1, y: 0 };
        lastMove = "left";
    }
    if (e.key === "ArrowRight" && lastMove !== "left") {
        velocity = { x: 1, y: 0 };
        lastMove = "right";
    }
});

function resetGame() {
    snakeBody = [{ x: 10, y: 10 }];
    velocity = { x: 1, y: 0 };
    lastMove = "right";
    score = 0;
    engine.speed = baseSpeed;
    engine.accumulator = 0;
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        engine.togglePause()
    } else if (e.key === "F9" || e.key === "F11") {
        engine.setFullScreen(() => {
            setTimeout(() => {
                if (!engine.pause) {
                    engine.togglePause()
                }

                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;

                if (engine.pause) {
                    engine.togglePause()
                }
            },100)
        })
    }
})

requestAnimationFrame(engine.gameLoop);