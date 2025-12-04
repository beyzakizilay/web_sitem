// === Canvas Ayarları ===
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 500;

// === Değişkenler ===
let gameOver = false;
let point = 0;
let rl = 0;
let start = false;
let playerX = 200;
let playerY = 380;
let fallingStarY = -20;

// === Arka Plan Görselleri ===
let gameBackground = new Image();
gameBackground.src = "./assets/images/gamebackground.png";

let finalBackground = new Image();
finalBackground.src = "./assets/images/finalbackground.png";

// === Oyuncu Görselleri ===
let playerIdle = new Image();
playerIdle.src = "./assets/characters/idleMc.png";

let playerRight = new Image();
playerRight.src = "./assets/characters/mcRight.png";

let playerLeft = new Image();
playerLeft.src = "./assets/characters/mcLeft.png";

let playerDead = new Image();
playerDead.src = "./assets/characters/dead.png";

// === Yıldız Görseli ===
let starImage = new Image();
starImage.src = "./assets/images/star.png";

// === Klavye Kontrolü ===
document.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        start = true;
    }
    if (e.key === "ArrowRight") rl = 1;
    if (e.key === "ArrowLeft") rl = -1;
});

document.addEventListener("keyup", function (e) {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") rl = 0;
});

// === Oyun Döngüsü ===
function gameLoop() {

    // Oyun başlamadıysa başlangıç ekranı
    if (!start) {
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.fillText("Başlamak için ENTER'a bas", 220, 250);
        ctx.drawImage(playerIdle, playerX, playerY, 70, 100);
        requestAnimationFrame(gameLoop);
        return;
    }

    // Arka plan
    ctx.drawImage(gameBackground, 0, 0, canvas.width, canvas.height);

    // Oyuncu hareketi
    playerX += rl * 5;
    if (playerX < 0) playerX = 0;
    if (playerX > 730) playerX = 730;

    // Yıldız düşüşü
    fallingStarY += 5;
    if (fallingStarY > 500) {
        fallingStarY = -20;
        fallingStarX = Math.random() * 750;
    }

    // Yıldız çizimi
    ctx.drawImage(starImage, fallingStarX, fallingStarY, 40, 40);

    // Oyuncu çizimi
    if (!gameOver) {
        if (rl === 1) ctx.drawImage(playerRight, playerX, playerY, 70, 100);
        else if (rl === -1) ctx.drawImage(playerLeft, playerX, playerY, 70, 100);
        else ctx.drawImage(playerIdle, playerX, playerY, 70, 100);
    } else {
        ctx.drawImage(playerDead, playerX, playerY, 70, 100);
    }

    // Çarpışma kontrolü
    if (
        fallingStarY > 360 &&
        fallingStarX > playerX - 20 &&
        fallingStarX < playerX + 50
    ) {
        point++;
        fallingStarY = -20;
        fallingStarX = Math.random() * 750;
    }

    // Puan yazısı
    ctx.fillStyle = "white";
    ctx.font = "25px Arial";
    ctx.fillText("Puan: " + point, 20, 40);

    requestAnimationFrame(gameLoop);
}

// Yıldız başlangıç x konumu
let fallingStarX = Math.random() * 750;

// Oyun başlat
gameLoop();
