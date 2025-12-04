/** @type {HTMLCanvasElement} */

const canvas = document.getElementById("myCanvas");
canvas.width = 1920 / 1.5;
canvas.height = 1080 / 1.5;
canvas.style.border = "20px double #367e0a";
const ctx = canvas.getContext("2d");

/* ---------- Oyun Başlangıç Değişkenleri ---------- */
let start = false;                 
let gravity = 0.2;                 
let floor;                         
let starCounter = 0;               
let point = 0;                     
let functionEnder = 0;             
let burgerCounter = 3;             
let burgerController = false;      
let hourglassController = false;  
let burger30 = false;              
let burger50 = false;              
let burger70 = false;              
let burger100 = false;             
let hourglass50 = false;           
let hourglass70 = false;           
let hourglass100 = false;          
let isCUsed = false;               
let finalPoint;                    
let yildizSure;                    

/* ---------- Görseller ---------- */
const playerImage = new Image();
playerImage.src = "./characters/idleMc.png";

const playerLeftImage = new Image();
playerLeftImage.src = "./characters/mcLeft.png";

const playerRightImage = new Image();
playerRightImage.src = "./characters/mcRight.png";

const enemyImage = new Image();
enemyImage.src = "./characters/ufo.png";

const starImage = new Image();
starImage.src = "./images/star.png";

/* ---------- Yardımcı Sınıflar ---------- */
class Picture {
  constructor({ position, imageSrc }) {
    this.position = position;
    this.image = new Image();
    this.image.src = imageSrc;
  }
  draw(width, height) {
    ctx.drawImage(this.image, this.position.x, this.position.y, width, height);
  }
  update(width, height) {
    this.draw(width, height);
  }
}

class Character {
  hp = 3;
  picture = playerImage;

  constructor(position) {
    this.position = position;
    this.velocity = { x: 0, y: 1 };
    this.onGround = false;
    this.width = 490 / 8.5;
    this.height = 710 / 8.5;
  }

  draw() {
    ctx.drawImage(this.picture, this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();

    // Yerçekimi
    if (this.position.y + this.height + this.velocity.y < canvas.height - floor) {
      this.velocity.y += gravity;
      this.onGround = false;
    } else {
      this.velocity.y = 0;
      this.onGround = true;
    }

    // X sınırları
    if (this.position.x + this.width + this.velocity.x < canvas.width && this.position.x + this.velocity.x >= 0) {
      this.position.x += this.velocity.x;
    } else if (this.position.x < 0) {
      keys.a.pressed = false;
    } else {
      keys.d.pressed = false;
    }

    this.position.y += this.velocity.y;
  }
}

class Enemy {
  picture = enemyImage;

  constructor(position) {
    this.position = position;
    this.velocity = { x: 0.75, y: 1 };
    this.width = 380 / 3;
    this.height = 252 / 3;
  }

  draw() {
    ctx.drawImage(this.picture, this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();

    if (this.position.y + this.height + this.velocity.y < canvas.height - floor) {
      this.velocity.y += gravity;
    } else {
      this.velocity.y = 0;
    }

    if (this.position.x + this.width + this.velocity.x > canvas.width || this.position.x + this.velocity.x < 0) {
      this.velocity.x = -this.velocity.x;
    }
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class Star {
  picture = starImage;

  constructor(position) {
    this.position = position;
    this.velocity = { x: 0, y: 0 };
    this.width = 74 / 2.75;
    this.height = 74 / 2.75;
  }

  draw() {
    ctx.drawImage(this.picture, this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

/* ---------- Oyun Objeleri ---------- */
const player = new Character({ x: 0, y: 800 / 1.5 });
const enemy = new Enemy({ x: 900, y: 800 / 1.5 });
const star = new Star({ x: Math.floor(Math.random() * 1000) + 100, y: 680 / 1.5 });

const keys = { d: { pressed: false }, a: { pressed: false }, space: { pressed: false }, x: { pressed: false }, c: { pressed: false }, t: { pressed: false } };

/* ---------- Arka Plan ve UI ---------- */
const bground = new Picture({ position: { x: 0, y: 0 }, imageSrc: "./images/gameBackground.png" });
let health = new Picture({ position: { x: 10 / 1.5, y: 10 / 1.5 }, imageSrc: "./images/h3.png" });
let finalBackground = new Picture({ position: { x: 0, y: 0 }, imageSrc: "./images/finalBackground.png" });
let deadMc = new Picture({ position: { x: 550, y: 280 / 1.5 }, imageSrc: "./characters/dead.png" });

/* ---------- Oyun Fonksiyonları ---------- */
function pointUpgradeBySecond() {
  point++;
}

function starTimer() {
  star.position.x = Math.floor(Math.random() * 1000) + 100;
}

/* ---------- Ana Döngü ---------- */
function animate() {
  window.requestAnimationFrame(animate);

  ctx.fillStyle = "#384848";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  bground.update(canvas.width, canvas.height);
  floor = 130 / 1.5;

  star.update();
  player.update();
  enemy.update();
  health.update(50, 50);

  /* Bilgi Paneli */
  ctx.fillStyle = "white";
  ctx.font = "20px Georgia";
  ctx.fillText("Puan: " + point, 1450 / 1.5, 50 / 1.5);
  ctx.fillText("Toplanan Yıldız: " + starCounter, 1450 / 1.5, 80 / 1.5);
  ctx.fillText("Düşman Hızı: " + enemy.velocity.x.toFixed(2), 1450 / 1.5, 110 / 1.5);

  /* TODO: Hamburger ve kum saati mekaniği burada optimize edilecek */

  /* Oyun Bitti Kontrolü */
  if (player.hp <= 0) {
    clearInterval(finalPoint);
    finalBackground.update();
    deadMc.update();
    ctx.fillText("GAME OVER", 830 / 1.5, 500 / 1.5);
    ctx.fillText("Toplam Puan: " + point, 790 / 1.5, 540 / 1.5);
    ctx.fillText("Toplanan Yıldız: " + starCounter, 800 / 1.5, 580 / 1.5);
    return;
  }

  /* Yıldız Toplama */
  if (player.position.x < star.position.x + star.width &&
      player.position.x + player.width > star.position.x &&
      player.position.y < star.position.y + star.height &&
      player.position.y + player.height > star.position.y) {
    starCounter++;
    point += 10;
    clearInterval(yildizSure);
    yildizSure = setInterval(starTimer, 6000);
    starTimer();
  }

  /* Düşman Çarpışması */
  if (player.position.x < enemy.position.x + enemy.width &&
      player.position.x + player.width > enemy.position.x &&
      player.position.y < enemy.position.y + enemy.height &&
      player.position.y + player.height > enemy.position.y) {
    functionEnder++;
    if (functionEnder === 1) player.hp -= 0.5;
  } else {
    functionEnder = 0;
  }

  /* Hareket Kontrolü */
  player.velocity.x = 0;
  if (keys.d.pressed) player.velocity.x = 1.5, player.picture = playerRightImage;
  else if (keys.a.pressed) player.velocity.x = -1.5, player.picture = playerLeftImage;
  else player.picture = playerImage;
}

/* ---------- Tuş Eventleri ---------- */
window.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  if ((key === "t" || key === "s") && !start) {
    keys.t.pressed = true;
    animate();
    finalPoint = setInterval(pointUpgradeBySecond, 1000);
    yildizSure = setInterval(starTimer, 6000);
    start = true;
  }
  else if (key === "d") keys.d.pressed = true;
  else if (key === "a") keys.a.pressed = true;
  else if (key === " " && player.onGround) player.velocity.y = -8.5;
  else if (key === "x") keys.x.pressed = true, burgerController = true;
  else if (key === "c") keys.c.pressed = true, hourglassController = true;
});

window.addEventListener("keyup", (e) => {
  const key = e.key.toLowerCase();
  if (key === "d") keys.d.pressed = false;
  else if (key === "a") keys.a.pressed = false;
  else if (key === "x") keys.x.pressed = false;
  else if (key === "c") keys.c.pressed = false;
});

/* ---------- Bilgi Butonu ---------- */
const bilgiButon = document.getElementById("bilgi");
bilgiButon.addEventListener("click", () => {
  if (bilgiButon.innerHTML === "") {
    bilgiButon.innerHTML = `
      <p style='color:white'>
        Oyunda sarı saçlı karakter Ryanı canlandırıyorsunuz. Yıldızları toplayın, düşmana çarpmayın. 
        <br>Kontroller: A -> Sol, D -> Sağ, Boşluk -> Zıpla, X -> Hamburger, C -> Kum Saati, T/S -> Başla
      </p>`;
  } else {
    bilgiButon.innerHTML = "";
  }
});
