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
var hit = new Audio();

fly.src = "sounds/fly.mp3";
scor.src = "sounds/score.mp3";
hit.src = "sounds/hit.mp3";

//constants
const gap = 85;
let pipeDistance;

const gravity = 1.5;

//bird dposition
var bX;
var bY;

var score;

//on kedown
document.addEventListener("keydown", moveUp);

function moveUp() {
  if (!end) {
    bY -= 25;
    fly.play();
  }
}

//pipe coordinates
let pipes;

function initialize() {
  bX = 10;
  bY = 150;
  score = 0;
  pipes = [];
  pipes[0] = {
    x: cvs.width,
    y: 0
  };
}

//game variables
let frameID;
let end;

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
      ctx.fillStyle = "red";
      ctx.font = "24px Verdana";
      ctx.fillText(`Game Over, Score: ${score}`, 10, 300);
      hit.play();
      stop();
      // location.reload();
    }

    //score
    if (pipe.x == 5) {
      score++;
      scor.play();
    }

    //remove pipes which have gone off screen
    pipes = pipes.filter(pipe => pipe.x != 0);
  });

  ctx.drawImage(fg, 0, cvs.height - fg.height);

  ctx.drawImage(bird, bX, bY);

  bY += gravity;

  ctx.fillStyle = "#000";
  ctx.font = "20px Verdana";
  ctx.fillText(`Score: ${score}`, 10, cvs.height - 20);
  console.log("still drawing");
}

function start() {
  end = false;
  draw();
  if (!end) frameID = requestAnimationFrame(start);
}

function stop() {
  if (frameID) {
    end = true;
    cancelAnimationFrame(frameID);
  }
}

cvs.addEventListener("click", () => {
  if (end) {
    console.log("restarting game");
    initialize();
    start();
  }
});
window.onload = () => {
  initialize();
  start();
};
