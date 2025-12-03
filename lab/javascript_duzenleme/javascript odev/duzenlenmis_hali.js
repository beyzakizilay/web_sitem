const canvas = document.getElementById("myCanvas");
canvas.width = 900;
canvas.height = 500;
const ctx = canvas.getContext("2d");

let start = false;
let gravity = 0.4;
let point = 0;
let stars = 0;

let dash = false;
let themeIndex = 0;

// GitHub'daki dosya adlarına birebir uyumlu
const themes = [
    "resimler/bg1.jpeg",
    "resimler/bg2.jpeg"
];

let bg = new Image();
bg.onload = () => console.log("Arka plan YÜKLENDİ!");
bg.src = themes[0];

let starImg = new Image();
starImg.src = "resimler/star.jpeg";

let heartImg = new Image();
heartImg.src = "resimler/heart.jpeg";

let enemyImg = new Image();
enemyImg.src = "resimler/ufo.jpeg";

let mcIdle = new Image();
mcIdle.src = "resimler/player.jpeg";

const player = {
    x: 50,
    y: 300,
    w: 50,
    h: 60,
    hp: 3,
    vy: 0,
    onGround: false
};

const enemy = {
    x: 700,
    y: 300,
    w: 60,
    h: 60,
    vx: 2
};

const item = {
    x: 300,
    y: 350,
    w: 30,
    h: 30,
    type: "star"
};

function respawnItem() {
    item.x = Math.random() * 700 + 50;
    item.type = Math.random() < 0.2 ? "heart" : "star";
}

function draw() {
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    ctx.drawImage(mcIdle, player.x, player.y, player.w, player.h);
    ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.w, enemy.h);

    if (item.type === "star") {
        ctx.drawImage(starImg, item.x, item.y, item.w, item.h);
    } else {
        ctx.drawImage(heartImg, item.x, item.y, item.w, item.h);
    }

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Puan: " + point, 20, 30);
    ctx.fillText("Yıldız: " + stars, 20, 55);
    ctx.fillText("Can: " + player.hp.toFixed(1), 20, 80);
}

function update() {
    player.vy += gravity;
    player.y += player.vy;

    if (player.y + player.h >= canvas.height - 50) {
        player.y = canvas.height - 50 - player.h;
        player.vy = 0;
        player.onGround = true;
    }

    let speed = dash ? 6 : 2;

    if (keys.d) player.x += speed;
    if (keys.a) player.x -= speed;

    enemy.x += enemy.vx;

    if (enemy.x < 0 || enemy.x + enemy.w > canvas.width) {
        enemy.vx *= -1;
    }

    if (checkCollision(player, item)) {
        if (item.type === "star") {
            stars++;
            point += 10;
        } else {
            player.hp = Math.min(player.hp + 0.5, 3);
        }
        respawnItem();
    }

    if (checkCollision(player, enemy)) {
        player.hp -= 0.02;
    }

    if (player.hp <= 0) {
        gameOverScreen();
        return;
    }
}

function checkCollision(a, b) {
    return (
        a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y
    );
}

function gameOverScreen() {
    ctx.fillStyle = "black";
    ctx.globalAlpha = 0.7;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;

    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("GAME OVER", canvas.width / 2 - 120, canvas.height / 2);
}

const keys = { a: false, d: false };

window.addEventListener("keydown", e => {
    if (!start && (e.key === "t" || e.key === "T")) {
        start = true;
        loop();
        setInterval(() => point++, 1000);
    }

    if (e.key === "a") keys.a = true;
    if (e.key === "d") keys.d = true;

    if (e.key === " " && player.onGround) {
        player.vy = -10;
        player.onGround = false;
    }

    if (e.key === "Shift") {
        dash = true;
        setTimeout(() => dash = false, 300);
    }

    if (e.key === "k") {
        themeIndex = (themeIndex + 1) % themes.length;
        bg.src = themes[themeIndex];
    }
});

window.addEventListener("keyup", e => {
    if (e.key === "a") keys.a = false;
    if (e.key === "d") keys.d = false;
});

function loop() {
    if (!start) return;
    draw();
    update();
    requestAnimationFrame(loop);
}
