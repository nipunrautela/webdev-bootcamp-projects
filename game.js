var gamePattern = []
var userClickedPattern = []

var buttonColors = [
  "red",
  "blue",
  "green",
  "yellow"
]

var level = 0;
var maxScore = 0;

function animatePress(currentColor) {
  $("#"+currentColor).addClass("pressed");
  setTimeout(function() {
      $("#"+currentColor).removeClass("pressed")
    }, 100
  );
}

function nextSequence() {
  var randomNumber = Math.round(Math.random()*3);
  // console.log(randomNumber);
  var randomChosenColor = buttonColors[randomNumber];

  gamePattern.push(randomChosenColor);
  // console.log(gamePattern);

  $("#"+randomChosenColor).fadeOut(100).fadeIn(100);

  playSound(randomChosenColor);

  $("#level-title").text("Level "+level);
  level++;

  userClickedPattern.length = 0;
}

function playSound(name) {
  var sound = new Audio("sounds/"+name+".mp3");
  sound.play();
}

function checkAnswer() {
  for(var i=0; i<userClickedPattern.length; i++) {
    if (userClickedPattern[i] != gamePattern[i]) {
      // console.log("wrong");
      return false;
    }
  }
  // console.log("success");
  return true;
}

function gameStart() {
  if (level == 0) {
    $("#level-title").text("Level "+level);
    nextSequence();
  }
}

function gameOver() {
  gamePattern.length = 0;
  $("body").addClass("game-over");
  setTimeout(function(){
    $("body").removeClass("game-over");
  }, 200);
  if (level > maxScore)
    maxScore = level;
  $("#level-title").html("Game Over, Press Any Key to Restart. <br>(Max Score = "+maxScore+")");
  level = 0;
}

$(document).keypress(function(event) {
  gameStart();
});

$("#level-title").click(function() {
  gameStart();
});

var debounce = false;
$(".btn").click(function() {
  if (level == 0 || debounce)
    return

  var userChosenColor = $(this).attr("id");
  userClickedPattern.push(userChosenColor);
  // console.log(userClickedPattern);

  animatePress(userChosenColor);

  var isCorrect = checkAnswer();

  if (isCorrect) {
    playSound(userChosenColor);
    if (userClickedPattern.length === gamePattern.length) {
      setTimeout(nextSequence, 1000);
      debounce = true;
      setTimeout(function() {debounce=false}, 1000);
    }
  }
  else {
    playSound("wrong");
    gameOver();
  }

});
