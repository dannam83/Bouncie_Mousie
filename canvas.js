let score = 0;
let gameStart = false;
let musicOn = true;
let soundfxOn = true;
let pauseOff = true;
let boards = [];
let cloudsArray = [];

const walleFloat = new Image();
  walleFloat.src = './images/walle_float.png';
const eves = new Image();
  eves.src = './images/eves.png';
const board = new Image();
  board.src = './images/board.png';
const bounceBall = new Image();
  bounceBall.src = './images/ball.png';
const junkyard = new Image();
  junkyard.src = './images/junkyard.png';
const cloud1 = new Image();
  cloud1.src = './images/cloud1.png';
const cloud2 = new Image();
  cloud2.src = './images/cloud2.png';
const cloud3 = new Image();
  cloud3.src = './images/cloud3.png';
const cloud4 = new Image();
  cloud4.src = './images/cloud4.png';
const cloud5 = new Image();
  cloud5.src = './images/cloud5.png';
const cloudImages = [cloud1, cloud2, cloud3, cloud4];

function coverOff() {
  document.getElementById("cover").style.visibility="hidden";
}

function coverOn() {
  document.getElementById("cover").style.visibility="visible";
}

const introAudio = document.createElement("audio");
introAudio.src = "./sounds/define_dancing.mp4";
introAudio.loop = true;
introAudio.play();

const gameAudio = document.createElement("audio");
gameAudio.src = "./sounds/wall_e.mp3";
gameAudio.loop = true;

const bounceAudio = document.createElement("audio");
bounceAudio.src = "./sounds/bounce2.mp3";

function musicPlay() {
  if (gameStart === false  && musicOn) {
    introAudio.play();
  } else if (musicOn) {
    gameAudio.play();
  }
}

function musicPause() {
  introAudio.pause();
  gameAudio.pause();
}

function playBounce() {
  if (soundfxOn) {
    bounceAudio.play();
  }
}

function soundControl(e) {
  switch (e.keyCode) {
    case (77):
      e.preventDefault();
      if (musicOn) {
        musicOn = false;
        musicPause();
      } else {
        musicOn = true;
        musicPlay();
      } break;
    case (70):
      e.preventDefault();
      if (soundfxOn) {
        soundfxOn = false;
      } else {
        soundfxOn = true;
      } break;
    default:
      return null;
  }
}

function start() {
  coverOff();
  gameStart = true;
  introAudio.pause();
  musicPlay();
}

window.addEventListener("keydown", soundControl);
document.addEventListener('DOMContentLoaded', go);

function go() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const boardHeight = 1;
  const boardWidth = 50;
  const xposMax = canvas.width - boardWidth;

  let groundCoord = [canvas.height - 135, 0];

  function fillBoards() {
    let gap = 0;
    let ypos = 6000;
    let xpos;
    while (ypos > 230) {
      xpos = Math.random() * xposMax;
      boards.push([ypos, xpos]);
      if (ypos > 4000) {
        gap = Math.random() * 250;
        ypos -= gap;
      } else if (ypos > 2000) {
        gap = Math.random() * 175;
        ypos -= gap;
      } else if (ypos > 230) {
        gap = Math.random() * 100;
        ypos -= gap;
      }
    }
    boards.push([230, 0.5 * xposMax]);
  }

  function fillClouds() {
    for (let i = 0; i < 50; i++) {
      let ypos = Math.random() * 6000 + 200;
      let xpos = Math.random() * xposMax;
      let cloudType = cloudImages[Math.floor(Math.random() * 4)];
      cloudsArray.push([ypos, xpos, cloudType]);
    }
  }

  fillBoards();
  fillClouds();
  draw();

  function draw() {
    let raf;
    const gravity = 0.14;
    let ball = {
      x: 300,
      y: 460,
      vx: 0,
      vy: 12,
      radius: 15,
      gameOff: true,
      color: 'red',
      draw: function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    };
    function redraw() {
      ctx.clearRect(0,0, canvas.width, canvas.height);
      ball.vy += gravity;
      ball.x += ball.vx;
      ball.y += ball.vy;
      ball.draw();
      ball.vy += 0.14;
      ball.move = true;
     // ball bounces off bottom of canvas
      if (ball.gameOff) {
        if (ball.y + ball.vy > canvas.height - 35) {
          ball.vy = -ball.vy;
          if (gameStart) {
            playBounce();
          }
        }
      }

      // ball wraps around to other side
      if (ball.x + ball.vx > canvas.width + 17) {
        ball.x = -17;
      } else if (ball.x + ball.vx < -17) {
        ball.x = canvas.width + 17;
      }

      // ball slows down itself from horizontal movement
      if (ball.vx < -0.2) {
        ball.vx += 0.2;
      } else if (ball.vx > 0.2) {
        ball.vx -= 0.2;
      } else {
        ball.vx = 0;
      }

      raf = window.requestAnimationFrame(redraw);

      const ystart = canvas.height - boardHeight;

      function Cloud(y, x, cloudType) {
        this.ypos = ystart - y;
        this.xpos = x;
        let cloud = cloudType;
        ctx.drawImage(cloudType, this.xpos, this.ypos);
      }

      function Board(y, x) {
        this.ypos = ystart - y;
        this.xpos = x;
        ctx.drawImage(board, this.xpos, this.ypos);
        ctx.drawImage(eves, this.xpos + 0.5, this.ypos + 6);
        // collision for ball bounce on boards
        if (gameStart) {
          if (ball.y > this.ypos - 23 && (ball.vy > 0)) {
            if(ball.x > this.xpos - 4 && ball.x < this.xpos +
              boardWidth + 4) {
              if (ball.y < this.ypos - 10) {
                ball.vy = -12;
                ball.gameOff = false;
                playBounce();
              }
            }
          }
        }
      }

      function drawScore() {
        ctx.font = "16px Verdana";
        ctx.fillStyle = "#000000";
        ctx.fillText("Score: "+ score, 8, 20);
      }

      cloudsArray.map(cloud => {
        return new Cloud(cloud[0], cloud[1], cloud[2]);
      });

      boards.map(coord => {
        return new Board(coord[0], coord[1]);
      });

      drawScore();
      ctx.drawImage(junkyard, groundCoord[1], groundCoord[0]);
      ctx.drawImage(bounceBall, ball.x - 18, ball.y - 15);
      ctx.drawImage(walleFloat, ball.x - 25, ball.y - 54);

      if (ball.y < 200) {
        boards.forEach(board => {
          board[0] += ball.vy;
          if (board[0] < -50) {
            boards.pop();
          }
        });
        cloudsArray.forEach(cloud => {
          cloud[0] += ball.vy;
        });
        ball.y -= ball.vy;
        groundCoord[0] -= ball.vy;
        score += 1;
      }

      if (ball.y > canvas.height + 80) {
        endGame();
      }

      function endGame() {
        window.cancelAnimationFrame(raf);
        alert("GAME OVER");
      }
    }
    // REDRAW ENDS HERE

    raf = window.requestAnimationFrame(redraw);
    window.addEventListener("keydown", pauseControl);
    window.addEventListener("keydown", moveBall);
    window.addEventListener("keydown", gameControl);

    function moveBall(e) {
      switch (e.keyCode) {
        case (37):
          e.preventDefault();
          ball.vx -= 4;
          break;
        case (39):
          e.preventDefault();
          ball.vx += 4;
          break;
        default:
          return null;
        }
      }

    function pauseControl(e) {
      switch (e.keyCode) {
        case (32):
          e.preventDefault();
          if (pauseOff) {
            window.cancelAnimationFrame(raf);
            coverOn();
            musicPause();
            pauseOff = false;
          } else {
            window.requestAnimationFrame(redraw);
            coverOff();
            pauseOff = true;
            if (musicOn) {
              musicPlay();
            }
          } break;
        default:
          return null;
      }
    }

    function gameControl(e) {
      switch (e.keyCode) {
        case (13):
          e.preventDefault();
          if (gameStart === false) {
            start();
          } else if (ball.y > canvas.height + 80) {
            window.cancelAnimationFrame(raf);
            score = 0;
            groundCoord = [canvas.height - 135, 0];
            boards = [];
            fillBoards();
            cloudsArray = [];
            fillClouds();
            ball.x = 300;
            ball.y = 460;
            ball.vx = 0;
            ball.vy = 12;
            ball.gameOff = true;
            raf = window.requestAnimationFrame(redraw);
          } break;
        default:
          return null;
      }
    }

    canvas.addEventListener('click', function(e) {
      if (ball.move) {
        ball.move = false;
        window.cancelAnimationFrame(raf);
      } else if (ball.move === false) {
        ball.move = true;
        raf = window.requestAnimationFrame(redraw);
      }
    });
  }
}
