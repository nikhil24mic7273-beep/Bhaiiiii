const face = document.getElementById("face");
const game = document.getElementById("game");
const scoreDisplay = document.getElementById("score");
const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-button");

const bgMusic = document.getElementById("bgMusic");
const outMusic = document.getElementById("outMusic");
const gameOverVideo = document.getElementById("gameOverVideo");

bgMusic.volume = 0.35;
outMusic.volume = 0.6;

let faceY;
let velocity;

let gravity = 0.35;
let jump = -44;

let gameRunning = false;

let pipes = [];
let score = 0;

let pipeTimer;


// ====================
// START GAME
// ====================
function startGame() {

    // Normal face
    document.querySelector("#face img").src =
        "face.jpeg";

    // Stop Game Over music
    outMusic.pause();
    outMusic.currentTime = 0;

    // Hide and reset video
    gameOverVideo.pause();
    gameOverVideo.currentTime = 0;
    gameOverVideo.style.display = "none";

    gameRunning = true;

    score = 0;
    scoreDisplay.textContent = score;

    faceY = 300;
    velocity = 0;

    face.style.top = faceY + "px";


    // Remove old pipes
    document.querySelectorAll(".pipe").forEach(pipe => {
        pipe.remove();
    });

    pipes = [];


    // Hide start screen
    startScreen.style.display = "none";


    // Start background music
    bgMusic.currentTime = 0;
    bgMusic.play();


    clearInterval(pipeTimer);

    // Create pipes
    pipeTimer = setInterval(createPipe, 1800);

    gameLoop();
}


// ====================
// FLAP
// ====================
function flap() {

    if (!gameRunning) return;

    velocity = jump;
}


// ====================
// CREATE PIPE
// ====================
function createPipe() {

    if (!gameRunning) return;

    const gap = 180;

    const minHeight = 80;
    const maxHeight = 400;

    const topHeight =
        Math.floor(
            Math.random() * (maxHeight - minHeight)
        ) + minHeight;

    const bottomHeight =
        700 - topHeight - gap;


    // TOP PIPE
    const topPipe = document.createElement("div");

    topPipe.classList.add("pipe", "top");

    topPipe.style.height =
        topHeight + "px";

    topPipe.style.left = "500px";


    // BOTTOM PIPE
    const bottomPipe = document.createElement("div");

    bottomPipe.classList.add("pipe", "bottom");

    bottomPipe.style.height =
        bottomHeight + "px";

    bottomPipe.style.left = "500px";


    game.appendChild(topPipe);
    game.appendChild(bottomPipe);


    pipes.push({

        top: topPipe,
        bottom: bottomPipe,

        x: 500,

        scored: false

    });
}


// ====================
// GAME LOOP
// ====================
function gameLoop() {

    if (!gameRunning) return;


    // Gravity
    velocity += gravity;

    faceY += velocity;

    face.style.top =
        faceY + "px";


    // Move pipes
    pipes.forEach(pipe => {

        pipe.x -= 3;

        pipe.top.style.left =
            pipe.x + "px";

        pipe.bottom.style.left =
            pipe.x + "px";


        // SCORE
        if (
            !pipe.scored &&
            pipe.x + 70 < 100
        ) {

            pipe.scored = true;

            score++;

            scoreDisplay.textContent =
                score;
        }


        // COLLISION
        if (checkCollision(pipe)) {

            gameOver();

        }

    });


    // Remove old pipes
    pipes = pipes.filter(pipe => {

        if (pipe.x < -100) {

            pipe.top.remove();

            pipe.bottom.remove();

            return false;
        }

        return true;

    });


    // Hit ground
    if (faceY > 640) {

        gameOver();

    }


    // Hit ceiling
    if (faceY < 0) {

        gameOver();

    }


    requestAnimationFrame(gameLoop);
}


// ====================
// COLLISION DETECTION
// ====================
function checkCollision(pipe) {

    const faceLeft = 100;
    const faceRight = 155;

    const faceTop = faceY;
    const faceBottom = faceY + 55;

    const pipeLeft = pipe.x;
    const pipeRight = pipe.x + 70;


    if (
        faceRight > pipeLeft &&
        faceLeft < pipeRight
    ) {

        const topHeight =
            pipe.top.offsetHeight;

        const bottomTop =
            700 - pipe.bottom.offsetHeight;


        if (
            faceTop < topHeight ||
            faceBottom > bottomTop
        ) {

            return true;

        }

    }

    return false;
}


// ====================
// GAME OVER
// ====================
function gameOver() {

    if (!gameRunning) return;

    gameRunning = false;

    clearInterval(pipeTimer);


    // Change face
    document.querySelector("#face img").src = "./gameover.jpeg";


    // Stop normal music
    bgMusic.pause();
    bgMusic.currentTime = 0;


    // Play Game Over music
    outMusic.currentTime = 0;
    outMusic.play();


    // Wait for Game Over music
    outMusic.onended = function() {

        // Show Game Over screen
        startScreen.style.display = "flex";

        startScreen.querySelector("h1").textContent =
            "GAME OVER";

        startScreen.querySelector("p").textContent =
            "Score: " + score;

        startButton.textContent =
            "PLAY AGAIN";


        // Show and play video
       gameOverVideo.style.display = "block";
       gameOverVideo.currentTime = 0;
       gameOverVideo.muted = false;
       gameOverVideo.volume = 1;
       gameOverVideo.play(); 

    };
}


// ====================
// START BUTTON
// ====================
startButton.addEventListener(
    "click",
    startGame
);


// ====================
// KEYBOARD
// ====================
document.addEventListener(
    "keydown",
    function(event) {

        if (event.code === "Space") {

            event.preventDefault();


            if (!gameRunning) {

                startGame();

            } else {

                flap();

            }

        }

    }
);


// ====================
// MOUSE / TOUCH
// ====================
game.addEventListener(
    "click",
    function(event) {

        if (event.target === startButton) {
            return;
        }

        if (gameRunning) {

            flap();

        }

    }
);
