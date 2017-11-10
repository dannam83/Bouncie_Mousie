const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const beginningBoards = [
  [2120, Math.random()],
  [2000, Math.random()],
  [1880, Math.random()],
  [1750, Math.random()],
  [1630, Math.random()],
  [1540, Math.random()],
  [1440, Math.random()],
  [1320, Math.random()],
  [1200, Math.random()],
  [1150, Math.random()],
  [1080, Math.random()],
  [1000, Math.random()],
  [920, Math.random()],
  [880, Math.random()],
  [850, Math.random()],
  [800, Math.random()],
  [720, Math.random()],
  [650, Math.random()],
  [600, Math.random()],
  [580, Math.random()],
  [550, Math.random()],
  [500, Math.random()],
  [415, Math.random()],
  [370, Math.random()],
  [300, Math.random()],
  [250, Math.random()],
  [150, Math.random()],
  [80, 0.5],
];

const cloudsArray = [];
for (let i = 0; i < 20; i++) {
  cloudsArray.push([Math.random(), Math.random()]);
}

// *** TO ALSO RANDOMIZE Y COORD OF BOARD
// const defaultBoard = [
//   [80, 0.5],
//   [500, Math.random()],
//   [580, Math.random()],
// ];
// const beginningBoards = [];
// for (let i = 0; i < 7; i++) {
//   boardCoord = [Math.random() * 420 + 80, Math.random()];
//   beginningBoards.push(boardCoord);
// }

// THE INVOKED FUNCTION ***
drawAll();
// ************************

function drawAll() {
  draw(beginningBoards);
}

function draw(beginningBoards) {
  let raf;
  const walleFloat = new Image();
    walleFloat.src = './images/walle_float.png';
  const eves = new Image();
    eves.src = './images/eves.png';
  const board = new Image();
    board.src = './images/board.png';
  const bounceBall = new Image();
    bounceBall.src = './images/ball.png';
  const cloud = new Image();
    cloud.src = './images/cloud1.png';
  const gravity = 0.14;
  const ball = {
    x: 200,
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
      if (ball.y + ball.vy > canvas.height) {
        ball.vy = -ball.vy;
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


    const boardHeight = 1;
    const boardWidth = 50;
    const ystart = canvas.height - boardHeight;
    // const xstart = 0;

    // function drawBoard(y, x) {
    //   this.ypos = ystart - y;
    //   this.xpos = xstart + x;
    //   ctx.beginPath();
    //   ctx.rect(this.xpos, this.ypos, boardWidth, boardHeight);
    //   ctx.fillStyle = "#0095DD";
    //   ctx.fill();
    //   ctx.closePath();
    //   if (ball.y > this.ypos - 15 && (ball.vy > 0)) {
    //     if(ball.x > this.xpos - 4 && ball.x < this.xpos +
    //       boardWidth + 4) {
    //         if (ball.y < this.ypos) {
    //           ball.vy = -12;
    //       }
    //     }
    //   }
    // }

    const xposMax = canvas.width - boardWidth;

    function Cloud(y, x) {
      this.ypos = ystart - y;
      this.xpos = x;
      ctx.drawImage(cloud, this.xpos, this.ypos);
    }


    cloudsArray.map(cloudCoord => {
      return new Cloud(2000 * cloudCoord[0] + 200, xposMax * cloudCoord[1]);
    });

    function Board(y, x) {
      this.ypos = ystart - y;
      this.xpos = x;
      // ctx.beginPath();
      // ctx.rect(this.xpos, this.ypos, boardWidth, boardHeight);
      // ctx.fillStyle = "#0095DD";
      // ctx.fill();
      // ctx.closePath();
      ctx.drawImage(board, this.xpos, this.ypos);
      ctx.drawImage(eves, this.xpos + 0.5, this.ypos + 6);
      if (ball.y > this.ypos - 15 && (ball.vy > 0)) {
        if(ball.x > this.xpos - 4 && ball.x < this.xpos +
          boardWidth + 4) {
            if (ball.y < this.ypos) {
              ball.vy = -12;
              ball.gameOff = false;
          }
        }
      }
    }


    beginningBoards.map(coord => {
      return new Board(coord[0], xposMax * coord[1]);
    });

    ctx.drawImage(bounceBall, ball.x - 18, ball.y - 15);
    ctx.drawImage(walleFloat, ball.x - 25, ball.y - 54);


    if (ball.y < 200) {
      beginningBoards.forEach(board => {
        board[0] += ball.vy;
        if (board[0] < -20) {
          beginningBoards.pop();
        }
      });
      ball.y -= ball.vy;
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

  window.addEventListener("keydown", moveBall);

  function moveBall(e) {
    switch (e.keyCode) {
      case (37):
        ball.vx -= 4;
        break;
      case (39):
        ball.vx += 4;
        break;
      case (32):
        if (ball.move) {
          ball.move = false;
          window.cancelAnimationFrame(raf);
        } else if (ball.move === false) {
          ball.move = true;
          window.requestAnimationFrame(redraw);
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

  //  canvas.addEventListener('mouseover', function(e) {
  //  }); 'mouseout' also a listener
