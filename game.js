var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");
var game, snake, food;

game = {
  score: 0,
  fps: 5,
  over: true, // Game starts as over
  message: 'Press Space to Start', // Initial message

  start: function() {
    game.over = false;
    game.message = null; // Remove the game over message
    game.score = 0;
    game.fps = 8;
    snake.init(); // Reinitialize the snake
    food.set(); // Reinitialize the food
  },

  stop: function() {
    game.over = true;
    game.message = 'GAME OVER'; // Show the game over message when the game ends
  },

  drawBox: function(x, y, size, color) {
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(x - (size / 2), y - (size / 2));
    context.lineTo(x + (size / 2), y - (size / 2));
    context.lineTo(x + (size / 2), y + (size / 2));
    context.lineTo(x - (size / 2), y + (size / 2));
    context.closePath();
    context.fill();
  },

  drawScore: function() {
    const scoreElement = document.getElementById('score'); // Select the score element
    if (scoreElement) {
        scoreElement.textContent = 'Errors: ' + game.score; // Update the score in the error box
    } else {
        console.error('Score element not found in the HTML.'); // Log an error if the element is missing
    }
    context.fillStyle = '#999';
    context.font = (canvas.height) + 'px Impact, sans-serif';
    context.textAlign = 'center';
    context.strokeStyle = '#000';
  },

  drawMessage: function() {
    if (game.message !== null) {
      context.fillStyle = '#00F';
      context.strokeStyle = '#FFF';
      context.font = (canvas.height / 12) + 'px Impact';
      context.textAlign = 'center';
      context.fillText(game.message, canvas.width / 2, canvas.height / 2);
      context.strokeText(game.message, canvas.width / 2, canvas.height / 2);
    }
  },

  resetCanvas: function() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
};

snake = {
  size: canvas.width / 40,
  x: null,
  y: null,
  image: new Image(), // Add an image for the snake
  direction: 'left',
  sections: [],

  init: function() {
    snake.sections = [];
    snake.direction = 'left';
    snake.x = canvas.width / 2 + snake.size / 2;
    snake.y = canvas.height / 2 + snake.size / 2;
    // Load the snake image
    snake.image.src = 'hero.png'; // Path to your hero.png image
    // Start with a small snake
    for (var i = snake.x + (0 * snake.size); i >= snake.x; i -= snake.size) {
      snake.sections.push(i + ',' + snake.y);
    }
  },

  move: function() {
    if (!game.over) {
      switch (snake.direction) {
        case 'up':
          snake.y -= snake.size;
          break;
        case 'down':
          snake.y += snake.size;
          break;
        case 'left':
          snake.x -= snake.size;
          break;
        case 'right':
          snake.x += snake.size;
          break;
      }
      snake.checkCollision(); // Check if snake collides with the canvas boundary
      snake.checkGrowth(); // Check if the snake eats food
      snake.sections.push(snake.x + ',' + snake.y);
    }
  },

  draw: function() {
    for (var i = 0; i < snake.sections.length; i++) {
      snake.drawSection(snake.sections[i].split(','));
    }
  },

  drawSection: function(section) {
    context.drawImage(snake.image, parseInt(section[0]) - snake.size / 2, parseInt(section[1]) - snake.size / 2, snake.size, snake.size);
  },

  checkCollision: function() {
    // Check if snake collides with canvas edges or itself
    if (snake.isCollision(snake.x, snake.y)) {
      game.stop(); // End the game if collision happens
    }
  },

  isCollision: function(x, y) {
    // Collision detection with canvas boundaries
    if (x < snake.size / 2 || x >= canvas.width || y < snake.size / 2 || y >= canvas.height || snake.sections.indexOf(x + ',' + y) >= 0) {
      return true;
    }
    return false;
  },

  checkGrowth: function() {
    if (snake.x == food.x && snake.y == food.y) {
      game.score++;
  
      if (game.score % 10 === 0) {
        spawnBalloons(25); // 🎈 Shower the screen!
      }
      
      if (game.score % 5 == 0 && game.fps < 60) {
        game.fps++;
      }      
  
      food.set(); // Generate new food after eating
    } else {
      snake.sections.shift(); // Remove tail if food not eaten
    }
  }
};
  

food = {
  size: null,
  x: null,
  y: null,
  image: new Image(), // Add an image for the food

  set: function() {
    food.size = snake.size;
    food.x = (Math.ceil(Math.random() * 10) * snake.size * 4) - snake.size / 2;
    food.y = (Math.ceil(Math.random() * 10) * snake.size * 3) - snake.size / 2;
    // Load the food image
    food.image.src = 'error.png'; // Path to your error.png image
    width: '30%'
  },

  draw: function() {
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
  start_game: [13, 32] // Enter and Space for start
};

function getKey(value) {
  for (var key in keys) {
    if (keys[key] instanceof Array && keys[key].indexOf(value) >= 0) {
      return key;
    }
  }
  return null;
}

function spawnBalloons(count = 100) {
  const container = document.getElementById('balloon-container');

  const colors = ['#ff4b5c', '#ffb400', '#3ae374', '#17c0eb', '#9b59b6'];

  for (let i = 0; i < count; i++) {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';

    // Random horizontal position across the screen
    balloon.style.left = Math.random() * 100 + 'vw';

    // Random size
    const size = 30 + Math.random() * 20;
    balloon.style.width = size + 'px';
    balloon.style.height = size * 1.5 + 'px';

    // Random background color
    const color = colors[Math.floor(Math.random() * colors.length)];
    balloon.style.background = `radial-gradient(circle at 30% 30%, #fff, ${color})`;

    // Slight animation delay for natural spread
    balloon.style.animationDelay = (Math.random() * 1.5) + 's';

    container.appendChild(balloon);

    // Remove after animation
    setTimeout(() => balloon.remove(), 6000);
  }
}



// Listen for key press events
addEventListener("keydown", function (e) {
  var lastKey = getKey(e.keyCode);

  if (['up', 'down', 'left', 'right'].indexOf(lastKey) >= 0
    && lastKey != inverseDirection[snake.direction]) {
    snake.direction = lastKey;
  } else if (['start_game'].indexOf(lastKey) >= 0 && game.over) {
    game.start(); // Start the game when Enter/Space is pressed after game over
  }
}, false);

// Game loop to update the canvas
var requestAnimationFrame = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame;

function loop() {
  game.resetCanvas();

  if (!game.over) {
    snake.move();
    food.draw();
    snake.draw();
  }
  game.drawScore();
  game.drawMessage();

  setTimeout(function () {
    requestAnimationFrame(loop);
  }, 1000 / game.fps);
}

requestAnimationFrame(loop);