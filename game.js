// ==== SETUP AWAL ====
const gameArea = document.getElementById("gameArea");
const mangkuk = document.getElementById("mangkuk");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const highScoreDisplay = document.getElementById("highScore");
const startBtn = document.getElementById("startBtn");
const overlay = document.getElementById("gameOverOverlay");
const restartBtn = document.getElementById("restartBtn");
const pauseBtn = document.getElementById("pauseBtn");
const finalScoreText = document.getElementById("finalScore");

// === Sound effects ===
const soundStart = new Audio("assets/ayo-makan.mp3");
const soundCatch = new Audio("assets/sedapnyo.mp3");
const soundMiss = new Audio("assets/lapar.mp3");
const soundGameOver = new Audio("assets/tidak-bisa-hidup.mp3");

// === Backsound looping ===
const backsoundGame = new Audio("assets/backsoundgame.mp3");
backsoundGame.loop = true;

let score = 0;
let lives = 3;
let highScore = localStorage.getItem("highScore") || 0;
let gameInterval, spawnInterval;
let mangkukPos = 200;
let mieSpeed = 5; // kecepatan awal mie jatuh

highScoreDisplay.textContent = highScore;

// === Backsound Control ===
function playGameMusic() {
  backsoundGame.play();
}

function stopAllMusic() {
  backsoundGame.pause();
  backsoundGame.currentTime = 0;
}

// === Game Logic ===
function setMangkukPos(x) {
  mangkuk.style.left = `${x}px`;
}

function startGame() {
  score = 0;
  lives = 3;
  mieSpeed = 5;
  scoreDisplay.textContent = score;
  livesDisplay.textContent = lives;
  finalScoreText.textContent = 0;
  setMangkukPos(mangkukPos = 200);
  clearInterval(gameInterval);
  clearInterval(spawnInterval);
  overlay.style.display = "none";
  gameArea.querySelectorAll(".mie").forEach(m => m.remove());

  soundStart.play();
  playGameMusic();

  spawnInterval = setInterval(spawnMie, 1000);
  gameInterval = setInterval(updateMie, 30);
}

function spawnMie() {
  const mie = document.createElement("img");

  // === Tentukan apakah ini mie emas atau bukan ===
  const isGolden = Math.random() < 0.1; // 10% chance
  mie.src = isGolden ? "assets/mieemas.png" : "assets/mie.png";
  mie.dataset.type = isGolden ? "golden" : "normal";

  mie.className = "mie";
  mie.style.left = `${Math.random() * (gameArea.clientWidth - 50)}px`;
  mie.style.top = "0px";
  gameArea.appendChild(mie);
}

function updateMie() {
  const mieList = document.querySelectorAll(".mie");
  mieList.forEach((mie) => {
    let mieTop = parseInt(mie.style.top);
    mie.style.top = `${mieTop + mieSpeed}px`;

    const mieRect = mie.getBoundingClientRect();
    const mangkukRect = mangkuk.getBoundingClientRect();

    if (
      mieRect.bottom >= mangkukRect.top &&
      mieRect.left < mangkukRect.right &&
      mieRect.right > mangkukRect.left
    ) {
      soundCatch.currentTime = 0;
      soundCatch.play();

      // Tambah poin sesuai tipe mie
      if (mie.dataset.type === "golden") {
        score += 5;
      } else {
        score += 1;
      }

      // Update skor & kecepatan mie
      scoreDisplay.textContent = score;
      mieSpeed = 5 + Math.floor(score / 10); // tiap 10 poin, tambah kecepatan

      if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
        highScoreDisplay.textContent = highScore;
      }

      mie.remove();
    } else if (mieTop >= gameArea.clientHeight - 10) {
      mie.remove();
      soundMiss.currentTime = 0;
      soundMiss.play();
      lives--;
      livesDisplay.textContent = lives;
      if (lives <= 0) {
        gameOver();
      }
    }
  });
}

function gameOver() {
  clearInterval(gameInterval);
  clearInterval(spawnInterval);
  stopAllMusic();
  soundGameOver.play();

  setTimeout(() => {
    finalScoreText.textContent = score;
    overlay.style.display = "flex";
  }, 1000);
}

// === Controls ===
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    mangkukPos = Math.max(0, mangkukPos - 20);
    setMangkukPos(mangkukPos);
  } else if (e.key === "ArrowRight") {
    mangkukPos = Math.min(gameArea.clientWidth - mangkuk.clientWidth, mangkukPos + 20);
    setMangkukPos(mangkukPos);
  }
});

// === Button Events ===
startBtn.addEventListener("click", () => {
  startGame();
});

restartBtn.addEventListener("click", () => {
  overlay.style.display = "none";
  startGame();
});

pauseBtn.addEventListener("click", () => {
  overlay.style.display = "none";
  stopAllMusic();
});
