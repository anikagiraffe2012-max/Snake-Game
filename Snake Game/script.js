const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreSpan = document.getElementById('score');
const highScoreSpan = document.getElementById('highScore');
const newGameBtn = document.getElementById('newGameBtn');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
    { x: 10, y: 10 }
];
let direction = { x: 0, y: 0 };
let food = { x: 15, y: 15 };
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') ? parseInt(localStorage.getItem('snakeHighScore')) : 0;
let gameRunning = false;
let gameLoop = null;
let frameCount = 0;
const moveInterval = 8;

function updateHighScoreDisplay() {
    highScoreSpan.textContent = highScore;
}

function updateScoreDisplay() {
    scoreSpan.textContent = score;
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < tileCount; i++) {
        for (let j = 0; j < tileCount; j++) {
            ctx.fillStyle = (i + j) % 2 === 0 ? '#1a1a2e' : '#16213e';
            ctx.fillRect(i * gridSize, j * gridSize, gridSize, gridSize);
        }
    }

    ctx.fillStyle = '#e94560';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });

    ctx.fillStyle = '#f5c542';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function moveSnake() {
    if (direction.x === 0 && direction.y === 0) return;

    const head = { ...snake[0] };
    head.x += direction.x;
    head.y += direction.y;

    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }

    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        updateScoreDisplay();
        generateFood();

        if (score > highScore) {
            highScore = score;
            localStorage.setItem('snakeHighScore', highScore);
            updateHighScoreDisplay();
        }
    } else {
        snake.pop();
    }
}

function generateFood() {
    const freeCells = [];
    for (let i = 0; i < tileCount; i++) {
        for (let j = 0; j < tileCount; j++) {
            if (!snake.some(segment => segment.x === i && segment.y === j)) {
                freeCells.push({ x: i, y: j });
            }
        }
    }

    if (freeCells.length === 0) {
        gameOver(true);
        return;
    }

    const randomIndex = Math.floor(Math.random() * freeCells.length);
    food = freeCells[randomIndex];
}

function gameOver(win = false) {
    gameRunning = false;
    cancelAnimationFrame(gameLoop);
    if (win) {
        alert('You win! Perfect Score!');
    } else {
        alert('Game over! Your score: ' + score);
    }
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    score = 0;
    updateScoreDisplay();
    gameRunning = true;
    generateFood();
    drawGame();
    if (gameLoop) cancelAnimationFrame(gameLoop);
    gameLoop = requestAnimationFrame(gameTick);
}

function gameTick() {
    if (!gameRunning) return;
    frameCount++;
    if (frameCount >= moveInterval) {
        moveSnake();
        frameCount = 0;
    }
    drawGame();
    gameLoop = requestAnimationFrame(gameTick);
}

function changeDirection(newDirection) {
    if ((direction.x === 0 && direction.y === 0) ||
        (newDirection.x !== 0 && direction.x === 0) ||
        (newDirection.y !== 0 && direction.y === 0)) {
        if (!(direction.x === -newDirection.x && direction.y === -newDirection.y)) {
            direction = newDirection;
        }
    }
}

document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    const key = e.key;
    e.preventDefault();

    if (key === 'ArrowUp') changeDirection({ x: 0, y: -1 });
    else if (key === 'ArrowDown') changeDirection({ x: 0, y: 1 });
    else if (key === 'ArrowLeft') changeDirection({ x: -1, y: 0 });
    else if (key === 'ArrowRight') changeDirection({ x: 1, y: 0 });
});

newGameBtn.addEventListener('click', () => {
    resetGame();
});

function init() {
    updateHighScoreDisplay();
    resetGame();
}

init();