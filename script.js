const tg = window.Telegram.WebApp;
const userId = tg?.initDataUnsafe?.user?.id || "unknown";

const betInput = document.getElementById("bet-amount");
const decreaseBet = document.getElementById("decrease-bet");
const increaseBet = document.getElementById("increase-bet");
const placeBet = document.getElementById("place-bet");
const cashoutBtn = document.getElementById("cashout-btn");
const cashoutDisplay = document.getElementById("cashout-payout");
const multiplierEl = document.getElementById("multiplier");
const resultMsg = document.getElementById("result-msg");
const pointsValue = document.getElementById("points-value");
const chicken = document.getElementById("chicken");

let balance = 0.00;
let multiplier = 1.00;
let interval;
let isBetActive = false;
let currentBet = 0.50;
let flightDistance = 0;

const API_URL = "https://script.google.com/macros/s/AKfycbwy32NHFqLbChSanL_Vs53u_YUJPsezIQe6h1JKrTytsAQ5iNK1moP9Sp6iW-4VIZh8/exec";

// === API Helpers ===

async function apiRequest(action, extra = {}) {
  const response = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ action, user_id: userId, ...extra }),
    headers: { "Content-Type": "application/json" }
  });
  return response.text();
}

async function fetchBalance() {
  if (userId === "unknown") return;
  const res = await apiRequest("getBalance");
  balance = parseFloat(res) || 0;
  updateBalanceDisplay();
}

async function registerUser() {
  if (userId === "unknown") return;
  const email = prompt("Please enter your email:");
  if (email) {
    await apiRequest("register", { email });
    fetchBalance();
  }
}

async function updateBalance(amount) {
  await apiRequest("updateBalance", { amount });
  fetchBalance();
}

// === UI Logic ===

function updateBalanceDisplay() {
  pointsValue.textContent = balance.toFixed(2);
}

function updateMultiplierDisplay() {
  multiplierEl.textContent = multiplier.toFixed(2) + "x";
  if (multiplier < 10) {
    multiplierEl.style.color = "#00ffff";
    multiplierEl.style.textShadow = "0 0 10px #00ffff";
  } else {
    multiplierEl.style.color = "#ff69b4";
    multiplierEl.style.textShadow = "0 0 10px #ff69b4";
  }
}

function startGame() {
  if (isBetActive || parseFloat(betInput.value) > balance) return;

  currentBet = parseFloat(betInput.value);
  balance -= currentBet;
  updateBalanceDisplay();
  resultMsg.textContent = "";
  multiplier = 1.00;
  isBetActive = true;
  cashoutBtn.disabled = false;
  flightDistance = 0;

  interval = setInterval(() => {
    multiplier += 0.05;
    updateMultiplierDisplay();
    cashoutDisplay.textContent = (currentBet * multiplier).toFixed(2);

    flightDistance += 2;
    chicken.style.transform = `translate(${flightDistance}px, -${flightDistance / 1.5}px)`;

    if (multiplier >= Math.random() * 100 + 1) {
      crash();
    }
  }, 100);
}

function crash() {
  clearInterval(interval);
  resultMsg.textContent = `💥 Chicken crashed at ${multiplier.toFixed(2)}x!`;
  isBetActive = false;
  cashoutBtn.disabled = true;
  cashoutDisplay.textContent = "0.00";
  resetChicken();
}

function cashOut() {
  if (!isBetActive) return;
  clearInterval(interval);
  const winnings = currentBet * multiplier;
  balance += winnings;
  updateBalanceDisplay();
  updateBalance(winnings); // update Google Sheet
  resultMsg.textContent = `✅ Cashed out at ${multiplier.toFixed(2)}x! You won $${winnings.toFixed(2)}`;
  isBetActive = false;
  cashoutBtn.disabled = true;
  cashoutDisplay.textContent = "0.00";
  resetChicken();
}

function resetChicken() {
  chicken.style.transform = `translate(0, 0)`;
}

// === Button Events ===
decreaseBet.onclick = () => {
  let val = parseFloat(betInput.value);
  if (val > 0.5) betInput.value = (val - 0.5).toFixed(2);
};

increaseBet.onclick = () => {
  let val = parseFloat(betInput.value);
  betInput.value = (val + 0.5).toFixed(2);
};

placeBet.onclick = startGame;
cashoutBtn.onclick = cashOut;

// === Init ===
Telegram.WebApp.ready();
registerUser(); // Optional, or replace with `fetchBalance()` if you want silent mode8
