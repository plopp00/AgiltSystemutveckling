const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");

// create the unit
const box = 32;

// load images
const ground = new Image();
ground.src = "img/sweden.png";
const foodImg = new Image();
foodImg.src = "img/food.png";
const powerImg = new Image();
powerImg.src = "img/power3.png";


// load audio files
const myMusic = new Audio();
const dead = new Audio();
const eat = new Audio();
const up = new Audio();
const left = new Audio();
const right = new Audio();
const down = new Audio();
dead.src = "audio/dead.mp3"
eat.src = "audio/eat.mp3"
up.src = "audio/up.mp3"
right.src = "audio/right.mp3"
left.src = "audio/left.mp3"
down.src = "audio/down.mp3"
myMusic.src = "audio/bakgrund.mp3";

// create the snake
let snake = [];

//position of the head and the two tales
snake[0] = {
  x : 11 * box,
  y : 10 * box
}
snake[1] = {
    x : 25 * box,
    y : 10 * box
}
snake[2] = {
    x : 25 * box,
    y : 10 * box
}

// create the food
let food = {
  x : Math.floor(Math.random()*21+1) * box,
  y : Math.floor(Math.random()*15+3) * box
}
// Create Powerup
let powerUp = {
    x : Math.floor(Math.random()*21+1) * box,
    y : Math.floor(Math.random()*15+3) * box
}


// create the score var
let score = 0;

var frameCount=0;
var pause = false;
var mute = false;

// control the snake var
let d;



// Score and HighScore
let highScore = localStorage.getItem("highScore");

document.addEventListener("keydown",direction);

function direction(event){
  let key = event.keyCode;
  if (key == 37 && d != "RIGHT") {
    right.play();
    d = "LEFT";
  }else if (key == 38 && d != "DOWN") {
    down.play();
    d = "UP";
  }else if (key == 39 && d != "LEFT") {
    left.play();
    d = "RIGHT";
  }else if (key == 40 && d != "UP") {
    down.play();
    d = "DOWN";
  }
  else if (key==80) {
      pause = !pause;
  } // p
  else if (key==77) {
      mute = !mute;
  } // m
}

// check collision function
function collision(head,array){
  for(let i = 2; i < array.length; i++){
    if(head.x == array[i].x && head.y == array[i].y){
      return true;
    }
  }
  return false;
}



// draw everything to the canvas
function draw(){
    myMusic.play();
  ctx.drawImage(ground,0,0);


  for(let i = 0; i < snake.length ; i++){
    ctx.fillStyle = (i == 0)? "red" : "#FF4D48"
    ctx.fillRect(snake[i].x,snake[i].y,box,box);

    ctx.strokeStyle = "black";
    ctx.strokeRect(snake[i].x,snake[i].y,box,box);
  }
    if(pause){
        ctx.fillStyle = "white";
        ctx.fillText('PAUSED',1*box,19*box);
        myMusic.pause();
        return;
    }
    if(mute){
        myMusic.pause();

        ctx.fillStyle = "white";
        ctx.fillText('MUTE',1*box,19*box);
    }
    ctx.drawImage(foodImg, food.x, food.y);
    ctx.drawImage(powerImg,powerUp.x,powerUp.y)


  // old head position
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  // which direction
  if(d == "LEFT") snakeX -= box;
  if(d == "UP") snakeY -= box;
  if(d == "RIGHT") snakeX += box;
  if(d == "DOWN") snakeY += box;

  // if the snake eats the food
  if (snakeX == food.x && snakeY == food.y){
    score++;
    if(highScore !== null){
      if (score > highScore){
        localStorage.setItem("highScore", score);
      }
    }
    else{
      localStorage.setItem("highScore", score);
    }
    eat.play();
    food = {
      x : Math.floor(Math.random()*17+1) * box,
      y : Math.floor(Math.random()*15+3) * box
    }
    // we don't remove the tail
  }
  else if (snakeX == powerUp.x && snakeY == powerUp.y){
      score +=3;
      eat.play();
      powerUp = {
          x : Math.floor(Math.random()*17+1) * box,
          y : Math.floor(Math.random()*15+3) * box
      }

  }
  else {
      // remove the tail
      snake.pop();
  }

     //  Changes the powerup place and takes it away
    frameCount++;
    if(frameCount % 15 === 0)    {
        powerUp = {
            x:20*box,
            y : 20 *box
        }
        if(frameCount % 25 === 0) {
            powerUp = {
                x: Math.floor(Math.random() * 17 + 1) * box,
                y: Math.floor(Math.random() * 15 + 3) * box
            }
        }
    }

    // add new Head
    let newHead = {
        x : snakeX,
        y : snakeY
    }




  // game over
  if(snakeX < box || snakeX > 21 * box || snakeY < 3*box || snakeY > 17*box || collision(newHead, snake)){

    clearInterval(game);
    dead.play();
      ctx.fillStyle = "white";
      ctx.fillText('Press R to Restart',1*box,19*box);
      ctx.font = "70px Changa one";
      ctx.fillStyle = "black";
      ctx.fillText('GAME OVER',5*box,11*box);
   // document.getElementById('restart').innerHTML = '<p>Press R to restart the game</p>';
      myMusic.pause();
    document.addEventListener('keyup', function(e){
      if(e.keyCode == 82)
        window.location.reload();
    })
  }

  snake.unshift(newHead);

  ctx.fillStyle = "white";
  ctx.font = "45px Changa one";
  ctx.fillText(score,2*box,1.6*box);
  ctx.fillText(highScore, 4*box, 1.6*box);
}

// call draw function every 100ms
let game = setInterval(draw,100);

