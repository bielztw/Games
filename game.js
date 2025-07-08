const score = document.querySelector('.score');
const highScore = document.querySelector('.highScore');
const startScreen = document.querySelector('.startScreen');
const gameArea = document.querySelector('.gameArea');
const ClickToStart = document.querySelector('.ClickToStart');

ClickToStart.addEventListener('click', Start);
document.addEventListener('keydown', keydown);
document.addEventListener('keyup', keyup);

let keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false
};

let player = {
  speed: 5,
  score: 0,
  highScore: 0
};

function keydown(e) {
  keys[e.key] = true;
}

function keyup(e) {
  keys[e.key] = false;
}

// starting the game
function Start() {
  gameArea.innerHTML = "";
  startScreen.classList.add('hide');
  player.isStart = true;
  player.score = 0;
  window.requestAnimationFrame(Play);

  // creating the road lines
  for (let i = 0; i < 5; i++) {
    let roadLines = document.createElement('div');
    roadLines.setAttribute('class', 'roadLines');
    roadLines.y = i * 140;
    roadLines.style.top = roadLines.y + "px";
    gameArea.appendChild(roadLines);
  }

  // creating opponents
  for (let i = 0; i < 3; i++) {
    let Opponents = document.createElement('div');
    Opponents.setAttribute('class', 'Opponents');
    Opponents.y = (i + 1) * -300;
    Opponents.style.top = Opponents.y + "px";
    Opponents.style.left = Math.floor(Math.random() * 350) + "px";
    Opponents.style.backgroundColor = randomColor();
    gameArea.appendChild(Opponents);
  }

  // creating the car
  let car = document.createElement('div');
  car.setAttribute('class', 'car');
  gameArea.appendChild(car);
  player.x = car.offsetLeft;
  player.y = car.offsetTop;
}

function randomColor() {
  let hex = Math.floor(Math.random() * 256).toString(16);
  return `#${("0" + hex).substr(-2)}e4c0`;
}

// play the game
function Play() {
  let car = document.querySelector('.car');
  let road = gameArea.getBoundingClientRect();

  if (player.isStart) {
    moveLines();
    moveOpponents(car);

    if (keys.ArrowUp && player.y > (road.top + 70)) player.y -= player.speed;
    if (keys.ArrowDown && player.y < (road.height - 75)) player.y += player.speed;
    if (keys.ArrowRight && player.x < 350) player.x += player.speed;
    if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;

    car.style.top = player.y + "px";
    car.style.left = player.x + "px";

    score.innerHTML = "Score : " + (player.score++);
    player.speed += 0.01;

    if (player.highScore < player.score) {
      player.highScore = player.score;
      highScore.innerHTML = "HighScore : " + (player.highScore - 1);
      highScore.style.top = "80px";
    }

    window.requestAnimationFrame(Play);
  }
}

function moveLines() {
  let roadLines = document.querySelectorAll('.roadLines');
  roadLines.forEach(function(item) {
    if (item.y >= 700) {
      item.y -= 700;
    }
    item.y += player.speed;
    item.style.top = item.y + "px";
  });
}

function moveOpponents(car) {
  let Opponents = document.querySelectorAll('.Opponents');
  Opponents.forEach(function(item) {
    if (isCollide(car, item)) {
      endGame();
    }
    if (item.y >= 750) {
      item.y = -300;
      item.style.left = Math.floor(Math.random() * 350) + "px";
      item.style.backgroundColor = randomColor();
    }
    item.y += player.speed;
    item.style.top = item.y + "px";
  });
}

function isCollide(a, b) {
  let aRect = a.getBoundingClientRect();
  let bRect = b.getBoundingClientRect();

  return !(
    (aRect.top > bRect.bottom) ||
    (aRect.bottom < bRect.top) ||
    (aRect.right < bRect.left) ||
    (aRect.left > bRect.right)
  );
}

function endGame() {
  player.isStart = false;
  player.speed = 5;
  startScreen.classList.remove('hide');
}
