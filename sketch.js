let backgroundImg;
let player1;
let player2;
let currentAnimation1 = 'idle';
let currentAnimation2 = 'idle';
let bullets = [];
let explosions = [];
let bulletImg;
let explosionImg;
let player1Health = 100;
let player2Health = 100;
const MAX_BULLETS = 20;

function preload() {
  backgroundImg = loadImage('media/background.png');
  bulletImg = loadImage('media/bullet.png');
  
  // 載入 player1 的動作
  player1 = {
    idle: {
      img: loadImage('media/player1_idle.png'),
      width: 649,
      height: 162,
      frames: 6,
      frameWidth: 649/6,
      frameIndex: 0,
      frameDelay: 8,
      frameCounter: 0
    },
    jump: {
      img: loadImage('media/player1_jump.png'),
      width: 996,
      height: 151,
      frames: 7,
      frameWidth: 996/7,
      frameIndex: 0,
      frameDelay: 4,
      frameCounter: 0
    },
    walk: {
      img: loadImage('media/player1_walk.png'),
      width: 819,
      height: 155,
      frames: 8,
      frameWidth: 819/8,
      frameIndex: 0,
      frameDelay: 11,
      frameCounter: 0
    }
  };
  
  // 載入 player2 的動作
  player2 = {
    idle: {
      img: loadImage('media/player2_idle.png'),
      width: 1485,
      height: 143,
      frames: 10,
      frameWidth: 1485/10,
      frameIndex: 0,
      frameDelay: 8,
      frameCounter: 0
    },
    jump: {
      img: loadImage('media/player2_jump.png'),
      width: 1066,
      height: 150,
      frames: 7,
      frameWidth: 1066/7,
      frameIndex: 0,
      frameDelay: 4,
      frameCounter: 0
    },
    walk: {
      img: loadImage('media/player2_walk.png'),
      width: 1219,
      height: 158,
      frames: 8,
      frameWidth: 1219/8,
      frameIndex: 0,
      frameDelay: 8,
      frameCounter: 0
    }
  };
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Bullet {
  constructor(x, y, direction) {
    this.x = x;
    this.y = y - 10;
    this.direction = direction;
    this.speed = 12;
    this.width = 685/6;
    this.height = 65;
    this.frameIndex = 0;
    this.frameDelay = 3;
    this.frameCounter = 0;
    this.damage = 20;

    if (direction > 0) {
      this.x += 30;
    } else {
      this.x += 30;
    }
  }

  update() {
    this.x += this.speed * this.direction;
    
    this.frameCounter++;
    if (this.frameCounter >= this.frameDelay) {
      this.frameCounter = 0;
      this.frameIndex = (this.frameIndex + 1) % 6;
    }
  }

  draw() {
    let sx = this.frameIndex * (685/6);
    image(bulletImg, 
          this.x, this.y,
          this.width, this.height,
          sx, 0,
          685/6, 65);
  }

  checkHit(playerX, playerY, playerWidth, playerHeight) {
    return this.x < playerX + playerWidth &&
           this.x + this.width > playerX &&
           this.y < playerY + playerHeight &&
           this.y + this.height > playerY;
  }
}

function draw() {
  // 繪製背景
  imageMode(CORNER);
  image(backgroundImg, 0, 0, windowWidth, windowHeight);
  
  // 更新並繪製子彈
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].update();
    bullets[i].draw();
    
    if (bullets[i].direction > 0) {
      if (bullets[i].checkHit(windowWidth*2/3, windowHeight/2, player2.idle.frameWidth, player2.idle.height)) {
        player2Health -= bullets[i].damage;
        bullets.splice(i, 1);
        continue;
      }
    } else {
      if (bullets[i].checkHit(windowWidth/3, windowHeight/2, player1.idle.frameWidth, player1.idle.height)) {
        player1Health -= bullets[i].damage;
        bullets.splice(i, 1);
        continue;
      }
    }
    
    if (bullets[i].x < -300 || bullets[i].x > windowWidth + 300) {
      bullets.splice(i, 1);
    }
  }
  
  // 繪製 Player1
  imageMode(CENTER);
  let currentState1 = player1[currentAnimation1];
  let sx1 = currentState1.frameIndex * currentState1.frameWidth;
  
  image(
    currentState1.img,
    windowWidth/3,
    windowHeight/2,
    currentState1.frameWidth,
    currentState1.height,
    sx1,
    0,
    currentState1.frameWidth,
    currentState1.height
  );
  
  // 更新 Player1 動畫
  currentState1.frameCounter++;
  if (currentState1.frameCounter >= currentState1.frameDelay) {
    currentState1.frameCounter = 0;
    currentState1.frameIndex = (currentState1.frameIndex + 1) % currentState1.frames;
  }
  
  // 繪製 Player2
  let currentState2 = player2[currentAnimation2];
  let sx2 = currentState2.frameIndex * currentState2.frameWidth;
  
  image(
    currentState2.img,
    windowWidth*2/3,
    windowHeight/2,
    currentState2.frameWidth,
    currentState2.height,
    sx2,
    0,
    currentState2.frameWidth,
    currentState2.height
  );
  
  // 更新 Player2 動畫
  currentState2.frameCounter++;
  if (currentState2.frameCounter >= currentState2.frameDelay) {
    currentState2.frameCounter = 0;
    currentState2.frameIndex = (currentState2.frameIndex + 1) % currentState2.frames;
  }
  
  // 文字樣式設定
  textAlign(LEFT);
  textSize(24);
  
  // Player1 資訊
  fill(255);
  text('Player 1', 30, 40);
  fill(0, 0, 139);  // 深藍色
  text('Bullets: ' + (MAX_BULLETS - bullets.length) + '/' + MAX_BULLETS, 30, 70);
  
  // Player1 生命值條
  fill(40);  // 深色背景
  rect(30, 90, 200, 20, 5);  // 加入圓角
  fill(220, 60, 60);  // 柔和的紅色
  rect(30, 90, player1Health * 2, 20, 5);
  fill(255);  // 白色
  text('HP: ' + player1Health, 30, 130);
  
  // Player2 資訊
  textAlign(RIGHT);
  fill(255);
  text('Player 2', windowWidth - 30, 40);
  fill(0, 0, 139);  // 深藍色
  text('Bullets: ' + (MAX_BULLETS - bullets.length) + '/' + MAX_BULLETS, windowWidth - 30, 70);
  
  // Player2 生命值條
  fill(40);  // 深色背景
  rect(windowWidth - 230, 90, 200, 20, 5);  // 加入圓角
  fill(220, 60, 60);  // 柔和的紅色
  rect(windowWidth - 230, 90, player2Health * 2, 20, 5);
  fill(255);  // 白色
  text('HP: ' + player2Health, windowWidth - 30, 130);
  
  // 遊戲結束顯示
  if (player1Health <= 0 || player2Health <= 0) {
    textAlign(CENTER);
    textSize(50);
    fill(220, 60, 60);  // 柔和的紅色
    text('Game Over!', windowWidth/2, 160);
    
    textSize(40);
    if (player1Health <= 0) {
      text('Player 2 Wins!', windowWidth/2, 220);
    } else {
      text('Player 1 Wins!', windowWidth/2, 220);
    }
  }
  
  // Player1 控制說明
  textAlign(LEFT);
  fill(69, 69, 69);  // 深灰色
  textSize(20);
  text('Controls:', 30, windowHeight - 140);
  text('1 - 招式A', 30, windowHeight - 110);
  text('2 - 招式B', 30, windowHeight - 80);
  text('3 - 招式C', 30, windowHeight - 50);
  text('F - 發射', 30, windowHeight - 20);

  // Player2 控制說明
  textAlign(RIGHT);
  fill(69, 69, 69);  // 深灰色
  text('Controls:', windowWidth - 30, windowHeight - 140);
  text('4 - 招式A', windowWidth - 30, windowHeight - 110);
  text('5 - 招式B', windowWidth - 30, windowHeight - 80);
  text('6 - 招式C', windowWidth - 30, windowHeight - 50);
  text('J - 發射', windowWidth - 30, windowHeight - 20);
}

function keyPressed() {
  switch(key) {
    case '1':
      currentAnimation1 = 'idle';
      break;
    case '2':
      currentAnimation1 = 'jump';
      break;
    case '3':
      currentAnimation1 = 'walk';
      break;
    case '4':
      currentAnimation2 = 'idle';
      break;
    case '5':
      currentAnimation2 = 'jump';
      break;
    case '6':
      currentAnimation2 = 'walk';
      break;
    case 'f':
    case 'F':
      if (bullets.length < MAX_BULLETS) {
        let p1CenterX = windowWidth/3 + (player1.idle.frameWidth / 2) + 120;
        let p1CenterY = windowHeight/2;
        bullets.push(new Bullet(p1CenterX, p1CenterY, 1));
      }
      break;
    case 'j':
    case 'J':
      if (bullets.length < MAX_BULLETS) {
        let p2CenterX = windowWidth*2/3 + (player2.idle.frameWidth / 2);
        let p2CenterY = windowHeight/2;
        bullets.push(new Bullet(p2CenterX, p2CenterY, -1));
      }
      break;
  }
}
