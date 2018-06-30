//@ts-check
var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

//load images
var bird = new Image();
var fg = new Image();
var bg = new Image();
var pipeNorth = new Image();
var pipeSouth = new Image();

bird.src = "images/bird.png";
fg.src = "images/fg.png";
bg.src = "images/bg.png";
pipeNorth.src = "images/pipeNorth.png";
pipeSouth.src = "images/pipeSouth.png";

//audio files;
var fly = new Audio();
var scor = new Audio();

fly.src = "sounds/fly.mp3";
scor.src = "sounds/score.mp3";

//constants
const gap = 85;
let pipeDistance;
console.log(pipeDistance);

const gravity = 1.5;

//bir dposition
var bX = 10;
var bY = 150;

var score = 0;

//on kedowm
document.addEventListener("keydown", moveUp);

function moveUp() {
  bY -= 25;
  fly.play();
}

//pipe coordinates
let pipes = [];
pipes[0] = {
  x: cvs.width,
  y: 0
};

//draw
function draw() {
  ctx.drawImage(bg, 0, 0);

  pipes.forEach(pipe => {
    pipeDistance = gap + pipeNorth.height;
    ctx.drawImage(pipeNorth, pipe.x, pipe.y);
    ctx.drawImage(pipeSouth, pipe.x, pipe.y + pipeDistance);
    pipe.x--;
    if (pipe.x == 125) {
      pipes.push({
        x: cvs.width,
        y: Math.floor(Math.random() * pipeNorth.height) - pipeNorth.height
      });
    }

    //detect collision, check this logic
    if (
      (bX + bird.width >= pipe.x &&
        bX <= pipe.x + pipeNorth.width &&
        (bY <= pipe.y + pipeNorth.height ||
          bY + bird.height >= pipe.y + pipeDistance)) ||
      bY + bird.height >= cvs.height - fg.height
    ) {
      location.reload();
    }

    //score
    if (pipe.x == 5) {
      score++;
      scor.play();
    }
  });

  ctx.drawImage(fg, 0, cvs.height - fg.height);

  ctx.drawImage(bird, bX, bY);

  bY += gravity;

  ctx.fillStyle = "#000";
  ctx.font = "20px Verdana";
  ctx.fillText(`Score: ${score}`, 10, cvs.height - 20);
  requestAnimationFrame(draw);
}

window.onload = draw;
