// === Canvas ve Başlangıç Ayarları ===
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;

let frame = 0;
let point = 0;
let rl = 0;
let start = false;

// === Arkaplan Görselleri ===
let gameBackground = new Image();
gameBackground.src = "./images/gamebackground.png";

let finalBackground = new Image();
finalBackground.src = "./images/finalbackground.png";

// === Oyuncu Görselleri ===
let playerImage = new Image();
playerImage.src = "./characters/idleMc.png";

let deadImage = new Image();
deadImage.src = "./characters/dead.png";

let playerImageRight = new Image();
playerImageRight.src = "./characters/mcRight.png";

let playerImageLeft = new Image();
playerImageLeft.src = "./characters/mcLeft.png";

// === Yıldız Görseli ===
let starImage = new Image();
starImage.src = "./images/star.png";

// === Oyuncu Nesnesi ===
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

// === Gravite ===
let gravity = 1;
let milye = 1;
let stage = false;

function jump(){
    if(player.jumpCount < player.maxJump){
        player.Yvelocity = player.jumpForce;
        player.jumpCount++;
    }
}

// === Klavye Kontrolleri ===
let keys = {};

window.addEventListener("keydown", (e) => {
    let key = e.key;

    // --- ENTER İLE OYUNU BAŞLAT ---
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
function MovementController(){
    if(keys["ArrowLeft"] || keys["a"] || keys["A"]){
        player.Xvelocity = -player.speed;
        playerImage.src = "./characters/mcLeft.png";
    }
    else if(keys["ArrowRight"] || keys["d"] || keys["D"]){
        player.Xvelocity = player.speed;
        playerImage.src = "./characters/mcRight.png";
    }
    else {
        player.Xvelocity = 0;
        playerImage.src = "./characters/idleMc.png";
    }
}

// === Platformlar ===
let platforms = [
    {x:0, y:400, width:500, height:20},
    {x:120, y:300, width:200, height:20},
    {x:50, y:200, width:150, height:20},
    {x:250, y:100, width:200, height:20},
];

// === Platform Çizimi ===
function drawPlatforms(){
    ctx.fillStyle="#333";
    for(let p of platforms){
        ctx.fillRect(p.x, p.y, p.width, p.height);
    }
}

// === Çarpışma ===
function platformCollision(){
    player.grounded = false;

    for(let p of platforms){
        if(player.x < p.x + p.width &&
           player.x + player.width > p.x &&
           player.y < p.y + p.height &&
           player.y + player.height > p.y){

            if(player.Yvelocity > 0){
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

function spawnStar(){
    stars.push({
        x: Math.random() * 450,
        y: -20,
        width: 32,
        height: 32,
        speed: 2,
    });
}

function drawStars(){
    for(let s of stars){
        ctx.drawImage(starImage, s.x, s.y, s.width, s.height);
        s.y += s.speed;

        if(s.y > 500){
            stars.splice(stars.indexOf(s), 1);
        }

        // Çarpışma
        if(player.x < s.x + s.width &&
           player.x + player.width > s.x &&
           player.y < s.y + s.height &&
           player.y + player.height > s.y){

            stars.splice(stars.indexOf(s), 1);
            point++;
        }
    }
}

// === Oyun Döngüsü ===
function gameLoop(){
    ctx.clearRect(0,0,500,500);

    // Başlangıç ekranı (Enter bekleme)
    if(!start){
        ctx.fillStyle = "black";
        ctx.fillRect(0,0,500,500);

        ctx.fillStyle="white";
        ctx.font="28px Arial";
        ctx.fillText("ENTER'a basarak başla!", 100, 250);
        return requestAnimationFrame(gameLoop);
    }

    ctx.drawImage(gameBackground, 0, 0, 500, 500);

    MovementController();

    player.Yvelocity += gravity * milye;
    player.x += player.Xvelocity;
    player.y += player.Yvelocity;

    if(player.y > 480){
        stage = true;
    }

    platformCollision();

    // Karakter
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

    drawPlatfo
