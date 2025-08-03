// script.js
let points = 0;

function updateWalletDisplay() {
  document.getElementById('points').innerText = points.toFixed(2);
  document.getElementById('usd').innerText = (points / 1.3).toFixed(2);
}

document.getElementById('deposit-btn').addEventListener('click', () => {
  const amount = prompt("Enter USD amount to deposit:");
  if (amount && !isNaN(amount) && Number(amount) >= 10) {
    points += Number(amount) * 1.3;
    updateWalletDisplay();
    logTransaction(`Deposited $${amount}`);
  } else {
    alert("Minimum deposit is $10");
  }
});

document.getElementById('withdraw-btn').addEventListener('click', () => {
  if (points < 1.3) {
    alert("You need at least 1.3 points to withdraw ($1)");
    return;
  }
  const usd = (points / 1.3).toFixed(2);
  logTransaction(`Withdrew $${usd}`);
  points = 0;
  updateWalletDisplay();
});

function logTransaction(message) {
  const item = document.createElement('li');
  item.innerText = `${new Date().toLocaleTimeString()}: ${message}`;
  document.getElementById('transactions').prepend(item);
  document.getElementById('status-msg').innerText = message;
}

updateWalletDisplay();