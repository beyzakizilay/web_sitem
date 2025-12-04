// Canvas
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Game state
let gameStarted = false;
let gameOver = false;

// Load images
const bg = new Image();
bg.src = "assests/images/gamebackground.png";

const finalBg = new Image();
finalBg.src = "assests/images/finalbackground.png";

const starImg = new Image();
starImg.src = "assests/images/star.webp";

const idleMc = new Image();
idleMc.src = "assests/characters/idleMc.png";

const mcLeft = new Image();
mcLeft.src = "assests/characters/mcLeft.png";

const mcRight = new Image();
mcRight.src = "assests/characters/mcRight.png";

const mcDead = new Image();
mcDead.src = "assests/characters/dead.png";

// Player
let player = {
    x: 200,
    y: 400,
    width: 80,
    height: 80,
    speed: 6,
    img: idleMc
};

// Stars
let stars = [];
let score = 0;

// Create stars
function createStar() {
    stars.push({
        x: Math.random() * 450,
        y: -20,
        size: 30,
        speed: 3
    });
}
setInterval(createStar, 1500);

// Movement
let moveLeft = false;
let moveRight = false;

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        if (!gameStarted) {
            gameStarted = true;
        } else if (gameOver) {
            location.reload();
        }
    }

    if (e.key === "ArrowLeft") {
        moveLeft = true;
        player.img = mcLeft;
    }
    if (e.key === "ArrowRight") {
        moveRight = true;
        player.img = mcRight;
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft") moveLeft = false;
    if (e.key === "ArrowRight") moveRight = false;

    if (!moveLeft && !moveRight) {
        player.img = idleMc;
    }
});

// Draw player
function drawPlayer() {
    ctx.drawImage(player.img, player.x, player.y, player.width, player.height);
}

// Draw stars
function drawStars() {
    stars.forEach((s, index) => {
        s.y += s.speed;
        ctx.drawImage(starImg, s.x, s.y, s.size, s.size);

        // Collision
        if (
            s.x < player.x + player.width &&
            s.x + s.size > player.x &&
            s.y < player.y + player.height &&
            s.y + s.size > player.y
        ) {
            stars.splice(index, 1);
            score++;
        }

        // Missed star = game over
        if (s.y > 500) {
            gameOver = true;
        }
    });
}

// Game loop
function update() {
    if (!gameStarted) {
        ctx.fillStyle = "white";
        ctx.font = "26px Arial";
        ctx.fillText("Oyuna başlamak için ENTER'a bas", 50, 250);
        return;
    }

    if (gameOver) {
        ctx.drawImage(finalBg, 0, 0, 500, 500);
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.fillText("Oyun Bitti!", 180, 100);
        ctx.fillText("Skor: " + score, 200, 150);
        ctx.fillText("Yeniden başlamak için ENTER", 60, 400);
        return;
    }

    // Background
    ctx.drawImage(bg, 0, 0, 500, 500);

    // Movement
    if (moveLeft && player.x > 0) player.x -= player.speed;
    if (moveRight && player.x < 420) player.x += player.speed;

    // Draw elements
    drawPlayer();
    drawStars();

    ctx.fillStyle = "yellow";
    ctx.font = "20px Arial";
    ctx.fillText("Skor: " + score, 20, 30);
}

function gameLoop() {
    ctx.clearRect(0, 0, 500, 500);
    update();
    requestAnimationFrame(gameLoop);
}

gameLoop();
