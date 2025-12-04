// Canvas ayarları
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ---- RESİM YOLLARI TAM DÜZELTİLMİŞ ----
const images = {
    background: "images/gamebackground.png",
    finalBackground: "images/finalbackground.png",
    burger: "images/burger.png",
    hourglass: "images/hourglass.png",
    star: "images/star.png",

    idle: "assets/characters/idleMc.png",
    dead: "assets/characters/dead.png",
    left: "assets/characters/mcLeft.png"   // BU DOSYA YOKSA HATA ALIRSIN
};

// Resimleri yükleme
const loadedImages = {};

function loadImages(callback) {
    let total = Object.keys(images).length;
    let loaded = 0;

    for (let key in images) {
        const img = new Image();
        img.src = images[key];

        img.onload = () => {
            loadedImages[key] = img;
            loaded++;

            if (loaded === total) {
                callback();
            }
        };

        img.onerror = () => {
            console.error("YÜKLENEMEDİ:", images[key]);
        };
    }
}

// Oyuncu
let player = {
    x: 100,
    y: 350,
    width: 80,
    height: 80,
    speed: 5
};

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Arkaplan
    ctx.drawImage(loadedImages.background, 0, 0, canvas.width, canvas.height);

    // Oyuncu
    ctx.drawImage(loadedImages.idle, player.x, player.y, player.width, player.height);

    requestAnimationFrame(gameLoop);
}

// Başlat
loadImages(() => {
    console.log("TÜM RESİMLER YÜKLENDİ");
    gameLoop();
});
