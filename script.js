
const blueBall = $("#blue-ball");
const redBall = $("#red-ball");
const coins = $(".coin");
const gameWidth = $("#game-container").width();
const gameHeight = $("#game-container").height();
const blueBallSpeed = 5;
const redBallSpeed = blueBallSpeed * 0.5;
const coinCount = 25;

let score = 0;
let gameOver = false;
let timeLeft = 24;
let timerInterval;

function getRandomPosition() {
    const x = Math.floor(Math.random() * (gameWidth - 30));
    const y = Math.floor(Math.random() * (gameHeight - 30));
    return { x, y };
}

function checkCollision(ball1, ball2) {
    const x1 = ball1.offset().left;
    const y1 = ball1.offset().top;
    const x2 = ball2.offset().left;
    const y2 = ball2.offset().top;
    const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    return distance < 30;
}

function checkCollisions() {
    if (checkCollision(blueBall, redBall)) {
        gameOver = true;
        alert("Game Over! You were caught by the red ball.");
        resetGame();
    }

    coins.each(function () {
        if (!$(this).hasClass("collected") && checkCollision(blueBall, $(this))) {
            $(this).addClass("collected").hide();
            score++;
            if (score === coinCount) {
                gameOver = true;
                alert("Congratulations! You collected all the coins and won!");
                resetGame();
            }
        }
    });
}

function moveRedBall() {
    if (!gameOver) {
        const blueX = blueBall.offset().left;
        const blueY = blueBall.offset().top;

        const redX = redBall.offset().left;
        const redY = redBall.offset().top;

        const dx = blueX - redX;
        const dy = blueY - redY;

        const distance = Math.sqrt(dx ** 2 + dy ** 2);

        const velocityX = (dx / distance) * redBallSpeed;
        const velocityY = (dy / distance) * redBallSpeed;

        redBall.css({
            left: redX + velocityX + "px",
            top: redY + velocityY + "px",
        });

        checkCollisions();
    }

    requestAnimationFrame(moveRedBall);
}

function startTimer() {
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    timeLeft--;
    $("#timer").text("Time Left: " + timeLeft);
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        gameOver = true;
        alert("Time's up! You ran out of time.");
        resetGame();
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    timeLeft = 24;
    $("#timer").text("Time Left: " + timeLeft);
    startTimer();
}

function resetGame() {
    score = 0;
    coins.removeClass("collected").show();
    blueBall.css(getRandomPosition());
    redBall.css({ top: gameHeight / 2 - 15, left: gameWidth / 2 - 15 });
    gameOver = false;
    resetTimer();
}

$(document).on("mousemove", function (event) {
    if (!gameOver) {
        const mouseX = event.pageX;
        const mouseY = event.pageY;

        const blueX = blueBall.offset().left;
        const blueY = blueBall.offset().top;

        const dx = mouseX - blueX;
        const dy = mouseY - blueY;

        const angle = Math.atan2(dy, dx);
        const velocityX = Math.cos(angle) * blueBallSpeed;
        const velocityY = Math.sin(angle) * blueBallSpeed;

        blueBall.css({
            left: blueX + velocityX + "px",
            top: blueY + velocityY + "px",
        });
    }
});
resetGame();
moveRedBall();
startTimer();
