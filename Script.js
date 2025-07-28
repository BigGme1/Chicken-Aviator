let multiplier = 1.0;
let interval;
let flying = false;
let crashed = false;
let points = 0;

const multiplierDisplay = document.getElementById("multiplier");
const chicken = document.getElementById("chicken");
const resultMsg = document.getElementById("result-msg");
const startBtn = document.getElementById("start-btn");
const cashoutBtn = document.getElementById("cashout-btn");
const pointsDisplay = document.getElementById("points-value");

function startGame() {
  multiplier = 1.0;
  flying = true;
  crashed = false;
  chicken.style.bottom = "0px";
  resultMsg.textContent = "";
  chicken.src = "assets/chicken.png";

  startBtn.disabled = true;
  cashoutBtn.disabled = false;

  interval = setInterval(() => {
    multiplier += 0.05;
    multiplierDisplay.textContent = multiplier.toFixed(2) + "x";

    let newBottom = parseFloat(chicken.style.bottom) || 0;
    chicken.style.bottom = newBottom + 5 + "px";

    if (Math.random() < 0.01 + multiplier / 200) {
      crash();
    }
  }, 100);
}

function cashOut() {
  if (!flying || crashed) return;
  clearInterval(interval);
  const earned = Math.floor(multiplier * 10); // e.g. 2.5x = 25 points
  points += earned;
  pointsDisplay.textContent = points;
  resultMsg.textContent = `✅ Cashed out at ${multiplier.toFixed(2)}x! +${earned} points`;
  reset();
}

function crash() {
  flying = false;
  crashed = true;
  clearInterval(interval);
  chicken.src = "assets/explosion.gif";
  resultMsg.textContent = `💥 Crashed at ${multiplier.toFixed(2)}x!`;
  setTimeout(() => {
    chicken.src = "assets/chicken.png";
    reset();
  }, 1500);
}

function reset() {
  startBtn.disabled = false;
  cashoutBtn.disabled = true;
  chicken.style.bottom = "0px";
}
startBtn.addEventListener("click", startGame);
cashoutBtn.addEventListener("click", cashOut);