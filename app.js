const p1 = {
  score: 0,
  button: document.querySelector("#p1Button"),
  display: document.querySelector("#p1Score")
}

const p2 = {
  score: 0,
  button: document.querySelector("#p2Button"),
  display: document.querySelector("#p2Score")
}

const winningScoreInput = document.querySelector("#playTo");
const resetButton = document.querySelector("#reset");
let winningScore = 5;

function updateScore(player, opponent) {
  if (!isGameOver) {
    player.score++;
    if (player.score === winningScore) {
      isGameOver = true;
      player.display.classList.add("has-text-success");
      opponent.display.classList.add("has-text-danger");
      player.button.disabled = true;
      opponent.button.disabled = true;
    }
    player.display.textContent = player.score;
  }
}

let isGameOver = false;

p1.button.addEventListener("click", function() {
  updateScore(p1, p2)
});

p2.button.addEventListener("click", function() {
  updateScore(p2, p1)
});

winningScoreInput.addEventListener("change", function() {
  winningScore = parseInt(this.value);
  if (!winningScore) {
    winningScoreInput.value = winningScoreInput.min;
    winningScore = parseInt(winningScoreInput.min);
  }
  else if(winningScore < winningScoreInput.min) {
    winningScoreInput.value = winningScoreInput.min;
    winningScore = parseInt(winningScoreInput.min);
  }
  reset();
});

resetButton.addEventListener("click", reset);

function reset() {
  isGameOver = false;
  p1.score = 0;
  p2.score = 0;
  p1.display.textContent = 0;
  p2.display.textContent = 0;
  p2.display.classList.remove("has-text-success", "has-text-danger");
  p1.display.classList.remove("has-text-success", "has-text-danger");
  p1.button.disabled = false;
  p2.button.disabled = false;
}
