document.addEventListener("DOMContentLoaded", function () {
    const spaceship = document.getElementById("spaceship");
    const aliensContainer = document.getElementById("aliens-container");
    const pointsDisplay = document.getElementById("points");
    const countdownDisplay = document.getElementById("countdown");

    let points = 0;
    let timeRemaining = 180;
    let isGameRunning = true;

    function createAliens() {
        for (let i = 0; i < 10; i++) {
            const alien = document.createElement("div");
            alien.className = "alien";
            alien.setAttribute("data-shots", 5);
            alien.style.left = `${i % 5 * 50}px`;
            alien.style.top = `${Math.floor(i / 5) * 50}px`;
            aliensContainer.appendChild(alien);
        }
    }

    function updatePoints() {
        pointsDisplay.textContent = `Points: ${points}`;
    }

    function updateCountdown() {
        countdownDisplay.textContent = `Time: ${timeRemaining}`;
    }

    function moveAliens() {
        const aliens = document.querySelectorAll(".alien");
        aliens.forEach((alien) => {
            const currentLeft = parseInt(alien.style.left);
            const direction = currentLeft === 0 ? 1 : -1;
            alien.style.left = `${currentLeft + direction * 5}px`;

            if (currentLeft <= 0 || currentLeft >= 200) {
                const shots = parseInt(alien.getAttribute("data-shots"));
                if (shots <= 0) {
                    points += 10;
                    updatePoints();
                    aliensContainer.removeChild(alien);
                } else {
                    alien.setAttribute("data-shots", shots - 1);
                    alien.textContent = shots - 1;
                }
            }
        });
    }

    function checkCollision() {
        const aliens = document.querySelectorAll(".alien");
        const spaceshipRect = spaceship.getBoundingClientRect();

        aliens.forEach((alien) => {
            const alienRect = alien.getBoundingClientRect();
            if (
                spaceshipRect.left < alienRect.right &&
                spaceshipRect.right > alienRect.left &&
                spaceshipRect.top < alienRect.bottom &&
                spaceshipRect.bottom > alienRect.top
            ) {
                points -= 20;
                updatePoints();
            }
        });
    }

    function gameLoop() {
        if (isGameRunning) {
            moveAliens();
            checkCollision();
            timeRemaining--;

            if (timeRemaining <= 0) {
                isGameRunning = false;
                alert(`Game Over! Your score: ${points}`);
            } else {
                updateCountdown();
                requestAnimationFrame(gameLoop);
            }
        }
    }

    function startGame() {
        createAliens();
        updatePoints();
        updateCountdown();
        gameLoop();
    }

    startGame();

    document.addEventListener("mousemove", function (event) {
        spaceship.style.left = `${event.clientX}px`;
        spaceship.style.top = `${event.clientY}px`;
    });

    document.addEventListener("click", function () {
        const bullets = document.createElement("div");
        bullets.className = "bullets";
        bullets.style.left = `${parseInt(spaceship.style.left) + 20}px`;
        bullets.style.top = `${parseInt(spaceship.style.top) - 10}px`;
        aliensContainer.appendChild(bullets);
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === " ") {
            setInterval(function () {
                document.dispatchEvent(new Event("click"));
            }, 500);
        }
    });

    document.addEventListener("keyup", function (event) {
        if (event.key === " ") {
            clearInterval();
        }
    });
});
