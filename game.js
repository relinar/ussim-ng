var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");
var game, snake, food;

game = {
  score: 0,
  fps: 5,
  over: true,
  paused: false,
  message: 'Press Space to Start',

  start: function () {
    game.over = false;
    game.paused = false;
    game.message = null;
    game.score = 0;
    game.fps = 8;
    snake.init();
    food.set();
  },

  stop: function () {
    game.over = true;
    game.message = 'GAME OVER';
  },

  drawBox: function (x, y, size, color) {
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(x - (size / 2), y - (size / 2));
    context.lineTo(x + (size / 2), y - (size / 2));
    context.lineTo(x + (size / 2), y + (size / 2));
    context.lineTo(x - (size / 2), y + (size / 2));
    context.closePath();
    context.fill();
  },

  drawScore: function () {
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
      scoreElement.textContent = 'Errors: ' + game.score;
    } else {
      console.error('Score element not found in the HTML.');
    }
    context.fillStyle = '#999';
    context.font = (canvas.height) + 'px Impact, sans-serif';
    context.textAlign = 'center';
    context.strokeStyle = '#000';
  },

  drawMessage: function () {
    if (game.message !== null) {
      context.fillStyle = '#00F';
      context.strokeStyle = '#FFF';
      context.font = (canvas.height / 12) + 'px Impact';
      context.textAlign = 'center';
  
      // If paused, show two lines
      if (game.paused) {
        context.fillText('Paused', canvas.width / 2, canvas.height / 2 - 30);
        context.strokeText('Paused', canvas.width / 2, canvas.height / 2 - 30);
  
        context.font = (canvas.height / 20) + 'px Impact'; // smaller font
        context.fillText('Press Space to Continue', canvas.width / 2, canvas.height / 2 + 20);
        context.strokeText('Press Space to Continue', canvas.width / 2, canvas.height / 2 + 20);
      } else {
        // For start screen or game over
        context.fillText(game.message, canvas.width / 2, canvas.height / 2);
        context.strokeText(game.message, canvas.width / 2, canvas.height / 2);
      }
    }
  },
  

  resetCanvas: function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
};

snake = {
  size: canvas.width / 40,
  x: null,
  y: null,
  image: new Image(),
  direction: 'left',
  sections: [],

  init: function () {
    snake.sections = [];
    snake.direction = 'left';
    snake.x = canvas.width / 2 + snake.size / 2;
    snake.y = canvas.height / 2 + snake.size / 2;
    snake.image.src = 'hero.png';
    for (var i = snake.x + (0 * snake.size); i >= snake.x; i -= snake.size) {
      snake.sections.push(i + ',' + snake.y);
    }
  },

  move: function () {
    if (!game.over && !game.paused) {
      switch (snake.direction) {
        case 'up': snake.y -= snake.size; break;
        case 'down': snake.y += snake.size; break;
        case 'left': snake.x -= snake.size; break;
        case 'right': snake.x += snake.size; break;
      }
      snake.checkCollision();
      snake.checkGrowth();
      snake.sections.push(snake.x + ',' + snake.y);
    }
  },

  draw: function () {
    for (var i = 0; i < snake.sections.length; i++) {
      snake.drawSection(snake.sections[i].split(','));
    }
  },

  drawSection: function (section) {
    context.drawImage(snake.image, parseInt(section[0]) - snake.size / 2, parseInt(section[1]) - snake.size / 2, snake.size, snake.size);
  },

  checkCollision: function () {
    if (snake.isCollision(snake.x, snake.y)) {
      game.stop();
    }
  },

  isCollision: function (x, y) {
    return (
      x < snake.size / 2 || x >= canvas.width ||
      y < snake.size / 2 || y >= canvas.height ||
      snake.sections.indexOf(x + ',' + y) >= 0
    );
  },

  checkGrowth: function () {
    if (snake.x == food.x && snake.y == food.y) {
      game.score++;
      if (game.fps < 60) {
        game.fps += 0.5;
      }
      food.set();
    } else {
      snake.sections.shift();
    }
  }
};

food = {
  size: null,
  x: null,
  y: null,
  image: new Image(),

  set: function () {
    food.size = snake.size;
    food.x = (Math.ceil(Math.random() * 10) * snake.size * 4) - snake.size / 2;
    food.y = (Math.ceil(Math.random() * 10) * snake.size * 3) - snake.size / 2;
    food.image.src = 'error.png';
  },

  draw: function () {
    context.drawImage(food.image, food.x - food.size / 2, food.y - food.size / 2, food.size, food.size);
  }
};

var inverseDirection = {
  'up': 'down',
  'left': 'right',
  'right': 'left',
  'down': 'up'
};

var keys = {
  up: [38, 75, 87],
  down: [40, 74, 83],
  left: [37, 65, 72],
  right: [39, 68, 76],
  start_game: [13, 32] // Enter or Space
};

function getKey(value) { 
  for (var key in keys) { 
    if (keys[key] instanceof Array && keys[key].indexOf(value) >= 0) {
      return key;
    }
  }
  return null;
}

addEventListener("keydown", function (e) {
  var lastKey = getKey(e.keyCode);

  if (['up', 'down', 'left', 'right'].indexOf(lastKey) >= 0
    && lastKey != inverseDirection[snake.direction]) {
    snake.direction = lastKey;
  } else if (lastKey === 'start_game') {
    if (game.over) {
      game.start();
    } else {
      game.paused = !game.paused;
      game.message = game.paused ? 'Press space to continue' : null;
    }
  }
}, false);

// Game loop
var requestAnimationFrame = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame;

function loop() {
  game.resetCanvas();

  if (!game.over && !game.paused) {
    snake.move();
    food.draw();
    snake.draw();
  } else if (!game.over && game.paused) {
    food.draw();
    snake.draw();
  }

  game.drawScore();
  game.drawMessage();

  setTimeout(() => {
    requestAnimationFrame(loop);
  }, 1000 / game.fps);
}

requestAnimationFrame(loop);
