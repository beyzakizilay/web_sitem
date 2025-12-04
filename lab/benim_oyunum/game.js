let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;

let frame = 0;
let point = 0;
let stage = false;
let start = false;

// === Arkaplan Görselleri ===
let gameBackground = new Image();
gameBackground.src = "assets/images/gamebackground.png";

let finalBackground = new Image();
finalBackground.src = "assets/images/finalbackground.png";

// === Oyuncu Görselleri ===
let playerImage = new Image();
playerImage.src = "assets/characters/idleMc.png";  // TEK RESİM

let deadImage = new Image();
deadImage.src = "assets/characters/dead.png";

// === Yıldız Görseli ===
let starImage = new Image();
starImage.src = "assets/images/star.png";

// === Oyuncu ===
let player = {
    x: 200,
    y: 200,
    width: 57,
    height: 86,
    speed: 3,
    Xvelocity: 0,
    Yvelocity: 0,
    jumpForce: -15,
    grounded: false,
    jumpCount: 0,
    maxJump: 2,
};

let gravity = 1;

function jump() {
    if (player.jumpCount < player.maxJump) {
        player.Yvelocity = player.jumpForce;
        player.jumpCount++;
    }
}

let keys = {};

window.addEventListener("keydown", (e) => {
    let key = e.key;

    // ENTER ile oyun başlat
    if (key === "Enter" && start === false) {
        start = true;
        stage = false;
        point = 0;
        frame = 0;
        player.x = 200;
        player.y = 200;
        player.Xvelocity = 0;
        player.Yvelocity = 0;
    }

    keys[key] = true;

    if (key === " " || key === "w" || key === "W") {
        jump();
    }
});

window.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

// === Hareket ===
function MovementController() {
    if (keys["ArrowLeft"] || keys["a"] || keys["A"]) {
        player.Xvelocity = -player.speed;
    }
    else if (keys["ArrowRight"] || keys["d"] || keys["D"]) {
        player.Xvelocity = player.speed;
    }
    else {
        player.Xvelocity = 0;
    }
}

// === Platformlar ===
let platforms = [
    { x: 0, y: 400, width: 500, height: 20 },
    { x: 120, y: 300, width: 200, height: 20 },
    { x: 50, y: 200, width: 150, height: 20 },
    { x: 250, y: 100, width: 200, height: 20 },
];

// === Platform Çiz ===
function drawPlatforms() {
    ctx.fillStyle = "#333";
    for (let p of platforms) {
        ctx.fillRect(p.x, p.y, p.width, p.height);
    }
}

// === Çarpışma ===
function platformCollision() {
    player.grounded = false;

    for (let p of platforms) {
        if (player.x < p.x + p.width &&
            player.x + player.width > p.x &&
            player.y < p.y + p.height &&
            player.y + player.height > p.y) {

            if (player.Yvelocity > 0) {
                player.y = p.y - player.height;
                player.Yvelocity = 0;
                player.grounded = true;
                player.jumpCount = 0;
            }
        }
    }
}

// === Yıldızlar ===
let stars = [];

function spawnStar() {
    stars.push({
        x: Math.random() * 450,
        y: -20,
        width: 32,
        height: 32,
        speed: 2,
    });
}

function drawStars() {
    for (let s of stars) {
        ctx.drawImage(starImage, s.x, s.y, s.width, s.height);
        s.y += s.speed;

        if (s.y > 500) {
            stars.splice(stars.indexOf(s), 1);
        }

        // Çarpışma
        if (player.x < s.x + s.width &&
            player.x + player.width > s.x &&
            player.y < s.y + s.height &&
            player.y + player.height > s.y) {

            stars.splice(stars.indexOf(s), 1);
            point++;
        }
    }
}

// === Oyun Döngüsü ===
function gameLoop() {
    ctx.clearRect(0, 0, 500, 500);

    if (!start) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, 500, 500);

        ctx.fillStyle = "white";
        ctx.font = "28px Arial";
        ctx.fillText("ENTER'a basarak başla!", 100, 250);
        return requestAnimationFrame(gameLoop);
    }

    ctx.drawImage(gameBackground, 0, 0, 500, 500);

    MovementController();

    player.Yvelocity += gravity;
    player.x += player.Xvelocity;
    player.y += player.Yvelocity;

    if (player.y > 480) {
        stage = true;
    }

    platformCollision();

    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

    drawPlatforms();
    drawStars();

    frame++;
    if (frame % 120 === 0) {
        spawnStar();
    }

    ctx.fillStyle = "white";
    ctx.font = "22px Georgia";
    ctx.fillText("Puan: " + point, 20, 30);

    if (stage) {
        ctx.drawImage(finalBackground, 0, 0, 500, 500);

        ctx.fillStyle = "white";
        ctx.font = "32px Arial";
        ctx.fillText("Oyun Bitti!", 160, 230);

        ctx.font = "24px Arial";
        ctx.fillText("Toplam Puan: " + point, 160, 270);

        return;
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();
