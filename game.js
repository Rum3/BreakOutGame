// План за ранота:

// 1.Дефинирайна на топката , дъската и тухлички

// 2.Функции за рисуване на обекти 

// 3.Функции за управление на дъската.

// 4.обновление на играта


const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const bricks = [];
var gameStarted = false;
var lives = 5;
var gameOver = false;
var rightPressed = false;
var leftPressed = false;

// 1.Дефинирайна на топката , дъската и тухлички
const ball = {
    x: canvas.width / 2, 
    y: canvas.height - 30,
    radius: 6,
    dx: 4, 
    dy: -4
};

const paddle = {
    width: 75, 
    height: 10,
    radius: 2,
    x: (canvas.width - 75) / 2, 
    speed: 4,
    dx: 0
};

function createBricks() {
    const brickRowCount = 4;
    const brickColumnCount = 20;
    const brickWidth = 20;
    const brickHeight = 20;
    const brickPadding = 1; 
    const brickOffsetTop = 30;
    const brickOffsetLeft = 30;
    const brickColor = "orange";

    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            bricks.push({
                x: c * (brickWidth + brickPadding) + brickOffsetLeft,
                y: r * (brickHeight + brickPadding) + brickOffsetTop,
                width: brickWidth,
                height: brickHeight,
                radius: 2,
                status: 1, // 1 означава, че квадратчето е видимо, 0 означава, че е изчезнало
                color: brickColor,
            });
        }
    }
}


// 2.Функции за рисуване на обекти 
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
    ctx.fillStyle = "#00FFF0"; 
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    let bricksRemaining = 0;
    bricks.forEach(function (brick) {
        if (brick.status === 1) {
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.width, brick.height);
            ctx.fillStyle = brick.color;
            ctx.fill();
            ctx.closePath();

            bricksRemaining++;
        }
    });
    if (bricksRemaining === 0) {
        console.log("WIN!");
        document.getElementById("winMessage").style.display = "block";

    }
}

// 3.Функции за управление на дъската.
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

function handleKeyDown(event) {
    if (event.key === "Right" || event.key === "ArrowRight") {
        rightPressed = true;
    } else if (event.key === "Left" || event.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function handleKeyUp(event) {
    if (event.key === "Right" || event.key === "ArrowRight") {
        rightPressed = false;
    } else if (event.key === "Left" || event.key === "ArrowLeft") {
        leftPressed = false;
    }
}

// 4.обновление на играта
function updateBallPosition() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
    }

    if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy; 
    }

    if (ball.y + ball.radius > canvas.height - paddle.height && ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
        ball.dy = -ball.dy; 
    }

    if (ball.y + ball.radius > canvas.height && lives > 0) {
        lives--; 
        

        if (lives === 0) {
            console.log("Game Over!");
        } else {
            ball.x = canvas.width / 2;
            ball.y = canvas.height - 30;
            paddle.x = (canvas.width - paddle.width) / 2;
        }
    }

    bricks.forEach(function (brick) {
        if (brick.status === 1) {
            if (
                ball.x > brick.x &&
                ball.x < brick.x + brick.width &&
                ball.y > brick.y &&
                ball.y < brick.y + brick.height
            ) {
                ball.dy = -ball.dy;
                brick.status = 0;
            }
        }
    });
    document.getElementById("livesCount").textContent = lives;
}

function updatePaddlePosition() {
    if (rightPressed && paddle.x + paddle.width < canvas.width) {
        paddle.dx = paddle.speed;
    } else if (leftPressed && paddle.x > 0) {
        paddle.dx = -paddle.speed;
    } else {
        paddle.dx = 0;
    }

    paddle.x += paddle.dx;

    if (paddle.x < 0) {
        paddle.x = 0;
    } else if (paddle.x + paddle.width > canvas.width) {
        paddle.x = canvas.width - paddle.width;
    }
}
  
function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBall();
    drawPaddle();
    drawBricks();
    
    if (!gameStarted) {
        if (rightPressed || leftPressed) {
            gameStarted = true;
        } else {
            requestAnimationFrame(updateGame);
            return;
        }
    }
    updateBallPosition();
    updatePaddlePosition();

    if (lives === 0) {
        document.getElementById("gameOverMessage").style.display = "block";
        document.addEventListener("keydown", handleRestart);
        return;
    }
    requestAnimationFrame(updateGame);

}
// Рестарт на играта
function handleRestart(event) {
    if (event.key === "r" || event.key === "R") {
        lives = 1; 
        gameOver = false; 
        document.getElementById("gameOverMessage").style.display = "none";
        createBricks();
        ball.x = canvas.width / 2;
        ball.y = canvas.height - 30;
        paddle.x = (canvas.width - paddle.width) / 2;
        updateGame(); 
    }
}

createBricks();
updateGame();




