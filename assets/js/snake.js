const boardBorder = 'black';
const boardBackground = 'yellowgreen';
const snakeBorder = 'red';
const snakeBody = 'orangered';
const foodBorder = 'white';
const foodBody = 'red';

let snake = [
  { x: 50, y: 150 },
  { x: 40, y: 150 },
  { x: 30, y: 150 },
];

let horizontalMovement = 10;
let verticalMovement = 0;
let changingDirection = false;
let foodX;
let foodY;
let score = 0;

const gameboard = document.getElementById('board');
const gameboard_ctx = board.getContext('2d');

document.addEventListener('keydown', changeDirection);

function main() {
  if (hasGameEnded()) {
    if (confirm('Do you want to play again?')) {
      location.reload();
    } else return;
  }

  changingDirection = false;

  setTimeout(function onTick() {
    clearBoard();
    drawFood();
    moveSnake();
    drawSnake();
    main();
  }, 80);
}

function clearBoard() {
  gameboard_ctx.fillStyle = boardBackground;
  gameboard_ctx.strokestyle = boardBorder;
  gameboard_ctx.fillRect(0, 0, gameboard.width, gameboard.height);
  gameboard_ctx.strokeRect(0, 0, gameboard.width, gameboard.height);
}

function drawSnakeElement(snakeElement) {
  gameboard_ctx.fillStyle = snakeBody;
  gameboard_ctx.strokestyle = snakeBorder;
  gameboard_ctx.fillRect(snakeElement.x, snakeElement.y, 10, 10);
  gameboard_ctx.strokeRect(snakeElement.x, snakeElement.y, 10, 10);
}

function drawSnake() {
  snake.forEach(drawSnakeElement);
}

function drawFood() {
  gameboard_ctx.fillStyle = foodBody;
  gameboard_ctx.strokestyle = foodBorder;
  gameboard_ctx.fillRect(foodX, foodY, 10, 10);
  gameboard_ctx.strokeRect(foodX, foodY, 10, 10);
}

function moveSnake() {
  const snakeHead = {
    x: snake[0].x + horizontalMovement,
    y: snake[0].y + verticalMovement,
  };
  snake.unshift(snakeHead);
  const hasEatenFood = snake[0].x === foodX && snake[0].y === foodY;
  if (hasEatenFood) {
    score += 10;
    document.getElementById('score').innerHTML = score;
    generateFood();
  } else {
    snake.pop();
  }
}

function changeDirection(event) {
  const leftArrow = 37;
  const rightArrow = 39;
  const upArrow = 38;
  const downArrow = 40;

  if (changingDirection) return;
  changingDirection = true;

  const keyPressed = event.keyCode;
  const snakeGoingLeft = horizontalMovement === -10;
  const snakeGoingRight = horizontalMovement === 10;
  const snakeGoingUp = verticalMovement === -10;
  const snakeGoingDown = verticalMovement === 10;

  if (keyPressed === leftArrow && !snakeGoingRight) {
    horizontalMovement = -10;
    verticalMovement = 0;
  }

  if (keyPressed === rightArrow && !snakeGoingLeft) {
    horizontalMovement = 10;
    verticalMovement = 0;
  }

  if (keyPressed === upArrow && !snakeGoingDown) {
    horizontalMovement = 0;
    verticalMovement = -10;
  }

  if (keyPressed === downArrow && !snakeGoingUp) {
    horizontalMovement = 0;
    verticalMovement = 10;
  }
}

function hasGameEnded() {
  for (let i = 4; i < snake.length; i++) {
    const hasCollided = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
    if (hasCollided) return true;
  }
  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > gameboard.width - 10;
  const hitToptWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > gameboard.height - 10;

  return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
}

function randomFoodLocalization(min, max) {
  return Math.round((Math.random() * (max - min)) / 10) * 10;
}

function generateFood() {
  foodX = randomFoodLocalization(0, gameboard.width - 10);
  foodY = randomFoodLocalization(0, gameboard.height - 10);
  snake.forEach(function isSnakeElementCurrentlyHere(snakeElement) {
    const isHere = snakeElement.x == foodX && snakeElement.y == foodY;
    if (isHere) generateFood();
  });
}

main();
generateFood();
