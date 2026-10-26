// Constants stored at the top
const MAX_LIVES = 3;
const MIN_VAL = 1;
const MAX_VAL = 100;

// Game state variables
let lives = MAX_LIVES;
let streak = 0;
let currentValue = getRandomNumber(MIN_VAL, MAX_VAL);
let nextValue = getRandomNumber(MIN_VAL, MAX_VAL);

// DOM Elements
const valueEl = document.getElementById("current-value");
const livesEl = document.getElementById("lives-display");
const streakEl = document.getElementById("streak-display");
const msgEl = document.getElementById("game-message");
const higherBtn = document.getElementById("higher-btn");
const lowerBtn = document.getElementById("lower-btn");

valueEl.textContent = currentValue;

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateUI() {
    livesEl.textContent = lives;
    streakEl.textContent = streak;
    valueEl.textContent = currentValue;
}

function handleGuess(userGuessedHigher) {
    // Condition using &&, ||, ! to ensure game is active and input is valid
    if (!(lives > 0) || (userGuessedHigher !== true && userGuessedHigher !== false)) {
        return;
    }

    const actualIsHigher = nextValue >= currentValue; // equal counts as right per rules

    if (userGuessedHigher === actualIsHigher) {
        streak++;
        msgEl.textContent = `Correct! The hidden number was ${nextValue}.`;
        msgEl.className = "alert alert-success mb-0";
    } else {
        lives--;
        streak = 0;
        msgEl.textContent = `Wrong! The hidden number was ${nextValue}.`;
        msgEl.className = "alert alert-danger mb-0";
    }

    updateUI();

    if (lives === 0) {
        msgEl.textContent = `Game Over! Final Streak: ${streak}. Restarting...`;
        higherBtn.disabled = true;
        lowerBtn.disabled = true;
        
        setTimeout(() => {
            lives = MAX_LIVES;
            streak = 0;
            higherBtn.disabled = false;
            currentValue = getRandomNumber(MIN_VAL, MAX_VAL);
            nextValue = getRandomNumber(MIN_VAL, MAX_VAL);
            msgEl.className = "alert d-none mb-0";
            updateUI();
        }, 2500);
        return;
    }

    // Shift values for next round
    currentValue = nextValue;
    nextValue = getRandomNumber(MIN_VAL, MAX_VAL);
}

higherBtn.addEventListener("click", () => handleGuess(true));
lowerBtn.addEventListener("click", () => handleGuess(false)); 