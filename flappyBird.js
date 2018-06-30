//@ts-check

class Game {
  constructor(cvs) {
    this.cvs = cvs;
    this.ctx = cvs.getContext("2d");
    this.pipeGap = 85;
    this.gravity = 1.5;
    this.loadResources();
    this.initialize();
  }

  loadResources() {
    //load images
    this.bird = new Image();
    this.fg = new Image();
    this.bg = new Image();
    this.pipeNorth = new Image();
    this.pipeSouth = new Image();

    this.bird.src = "images/bird.png";
    this.fg.src = "images/fg.png";
    this.bg.src = "images/bg.png";
    this.pipeNorth.src = "images/pipeNorth.png";
    this.pipeSouth.src = "images/pipeSouth.png";

    //audio files;
    this.flySound = new Audio();
    this.scoreSound = new Audio();
    this.hitSound = new Audio();

    this.flySound.src = "sounds/fly.mp3";
    this.scoreSound.src = "sounds/score.mp3";
    this.hitSound.src = "sounds/hit.mp3";
  }

  initialize() {
    // initilaize values
    this.bX = 10;
    this.bY = 150;
    this.score = 0;
    this.pipes = [];
    this.pipes[0] = {
      x: this.cvs.width,
      y: 0
    };
    this.end = false;
    // ewvent handler that moves the bird
    //on kedown
    document.addEventListener("keydown", () => {
      if (!this.end) {
        this.bY -= 25;
        this.flySound.play();
      }
    });

    // add event handler to canvas to restart the game
    this.cvs.addEventListener("click", () => {
      if (this.end) {
        this.initialize();
        this.start();
      }
    });
  }

  start() {
    this.draw();
    if (!this.end) this.frameID = requestAnimationFrame(this.start.bind(this));
  }

  draw() {
    this.ctx.drawImage(this.bg, 0, 0);

    this.pipes.forEach(pipe => {
      this.pipeDistance = this.pipeGap + this.pipeNorth.height;
      this.ctx.drawImage(this.pipeNorth, pipe.x, pipe.y);
      this.ctx.drawImage(this.pipeSouth, pipe.x, pipe.y + this.pipeDistance);
      pipe.x--;
      if (pipe.x == 125) {
        this.pipes.push({
          x: this.cvs.width,
          y:
            Math.floor(Math.random() * this.pipeNorth.height) -
            this.pipeNorth.height
        });
      }

      //detect collision, check this logic
      if (
        (this.bX + this.bird.width >= pipe.x &&
          this.bX <= pipe.x + this.pipeNorth.width &&
          (this.bY <= pipe.y + this.pipeNorth.height ||
            this.bY + this.bird.height >= pipe.y + this.pipeDistance)) ||
        this.bY + this.bird.height >= this.cvs.height - this.fg.height
      ) {
        this.ctx.fillStyle = "red";
        this.ctx.font = "24px Verdana";
        this.ctx.fillText(`Game Over, Score: ${this.score}`, 10, 300);
        this.hitSound.play();
        this.stop();
        // location.reload();
      }

      //score
      if (pipe.x == 5) {
        this.score++;
        this.scoreSound.play();
      }

      //remove pipes which have gone off screen
      this.pipes = this.pipes.filter(pipe => pipe.x != 0);
    });

    this.ctx.drawImage(this.fg, 0, this.cvs.height - this.fg.height);

    this.ctx.drawImage(this.bird, this.bX, this.bY);

    this.bY += this.gravity;

    this.ctx.fillStyle = "#000";
    this.ctx.font = "20px Verdana";
    this.ctx.fillText(`Score: ${this.score}`, 10, this.cvs.height - 20);
  }
  stop() {
    if (this.frameID) {
      this.end = true;
      cancelAnimationFrame(this.frameID);
    }
  }
}

window.onload = () => {
  var cvs = document.getElementById("canvas");
  let flapyBird = new Game(cvs);
  flapyBird.start();
};
