// CANVAS
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// RESIM YÜKLEME FONKSIYONU
function loadImage(src) {
    const img = new Image();
    img.src = src;
    img.onerror = () => console.log("YÜKLENEMEDİ: " + src);
    return img;
}

/* === RESİM YOLLARININ TAMAMI DÜZELTİLDİ === */
const images = {
    background: loadImage("assets/images/gamebackground.png"),
    finalBackground: loadImage("assets/images/finalbackground.png"),

    star: loadImage("assets/images/star.png"),
    burger: loadImage("assets/images/burger.png"),
    hourglass: loadImage("assets/images/hourglass.png"),

    idle: loadImage("assets/characters/idleMc.png"),
    dead: loadImage("assets/characters/dead.png"),
    left: loadImage("assets/characters/mcLeft.png"),
    right: loadImage("assets/characters/mcRight.png")
};

// OYUN DEĞİŞKENLERİ
let gameStarted = false;
let gameOver = false;
let score = 0;

document.addEventListener("keydown", (e) => {
    if (!gameStarted && e.key === "Enter") {
        gameStarted = true;
        gameLoop();
    }
});

// OYUN ÇİZİM DÖNGÜSÜ
function gameLoop() {
    if (!gameStarted) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(images.background, 0, 0, canvas.width, canvas.height);

    requestAnimationFrame(gameLoop);
}

// İLK EKRAN
function drawStartScreen() {
    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText("Oyuna başlamak için ENTER'a bas", 80, 250);
}

drawStartScreen();
