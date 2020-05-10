window.addEventListener("load", init);
function init() {
  registerEvent();
  document.getElementById("questionbox").style.display = "none";
  userName();
}
function registerEvent() {
  document.getElementById("signout").addEventListener("click", signOut);
  document.getElementById("startExam").addEventListener("click", startExam);
  document.getElementById("end").addEventListener("click", endFunction);
}
function userName() {
  document.getElementById("userId").innerText = localStorage.currentUser;
}
function startExam() {
  document.getElementById("rules").style.display = "none";
  document.getElementById("questionbox").style.display = "block";
  document.getElementById("end").style.display = "none";
  document.getElementById("questionButton").innerHTML = "";
  allQuestion.loadQuestion(buildQuiz);
  const quizContainer = document.getElementById("quiz");
  // const resultsContainer = document.getElementById("results");
  const submitButton = document.getElementById("submit");
  console.log(allQuestion.myQuestion);
  allQuestion.myQuestion = [];

  const previousButton = document.getElementById("previous");
  const nextButton = document.getElementById("next");
  console.log(document.querySelectorAll(".slide"));

  // showSlide(0);
  submitButton.addEventListener("click", showResults);
  previousButton.addEventListener("click", showPreviousSlide);
  nextButton.addEventListener("click", showNextSlide);
}
function showResults() {
  const answerContainers = document
    .getElementById("quiz")
    .querySelectorAll(".answers");

  let numCorrect = 0;
  let score = 0;
  allQuestion.myQuestion.forEach((currentQuestion, questionNumber) => {
    const answerContainer = answerContainers[questionNumber];
    const selector = `input[name=question${questionNumber}]:checked`;
    const userAnswer = (answerContainer.querySelector(selector) || {}).value;
    if (userAnswer === currentQuestion.rans) {
      numCorrect++;
      score += parseInt(currentQuestion.score);
      answerContainers[questionNumber].style.color = "lightgreen";
    } else {
      answerContainers[questionNumber].style.color = "red";
    }
  });
  changeAfterResult(numCorrect, score);
}
function changeAfterResult(numCorrect, score) {
  var elements = document.getElementsByClassName("fas fa-check-double tick");
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.display = "inline-block";
  }
  document.getElementById(
    "userResult"
  ).innerHTML = `${numCorrect} Questions Correct Out Of ${
    allQuestion.myQuestion.length
  } `;
  document.getElementById("end").style.display = "inline-block";
  document.getElementById("userScore").innerText = `Total Score : ${score}`;
  document.getElementById("submit").style.display = "none";
}
function showSlide(n) {
  document
    .querySelectorAll(".slide")
    [currentSlide].classList.remove("active-slide");
  document.querySelectorAll(".slide")[n].classList.add("active-slide");
  document.getElementById(n).classList = "w3-button w3-circle w3-teal mr-2";
  // document
  //   .getElementById(n)
  //   .classList.add("w3 - button w3 - circle w3 - green mr - 2");
  //
  console.log(document.getElementById(n).classList);
  currentSlide = n;
  if (currentSlide === 0) {
    document.getElementById("previous").style.display = "none";
  } else {
    document.getElementById("previous").style.display = "inline-block";
  }

  if (currentSlide === document.querySelectorAll(".slide").length - 1) {
    document.getElementById("next").style.display = "none";
    document.getElementById("submit").style.display = "inline-block";
  } else {
    document.getElementById("next").style.display = "inline-block";
    document.getElementById("submit").style.display = "none";
  }
}

var currentSlide = 0;
function showNextSlide() {
  showSlide(currentSlide + 1);
  console.log(currentSlide);
}

function showPreviousSlide() {
  showSlide(currentSlide - 1);
  console.log(currentSlide);
}
function showButton(val) {
  var btn = document.createElement("BUTTON");
  btn.setAttribute("id", val - 1);
  var t = document.createTextNode(val);
  btn.appendChild(t);
  btn.addEventListener("click", function() {
    showSlide(val - 1);
  });
  btn.classList = "w3-button  w3-circle w3-red w3-card-3 mr-2";
  document.getElementById("questionButton").appendChild(btn);
}
function buildQuiz() {
  const output = [];
  let ibutton = 1;
  allQuestion.myQuestion.forEach((currentQuestion, questionNumber) => {
    showButton(ibutton);

    const answers = [];

    const ansindex = ["A", "B", "C", "D"];
    for (let index = 0; index <= 3; index++) {
      if (currentQuestion.rans == ansindex[index]) {
        answers.push(
          `<label>
        <input type='radio' name="question${questionNumber}" value="${
            ansindex[index]
          }">${ansindex[index]}:
        ${
          currentQuestion.options[index]
        } <i  class='fas fa-check-double tick' style='display:none'></i>
        </label>`
        );
      } else {
        answers.push(
          `<label>
        <input type='radio' name="question${questionNumber}" value="${
            ansindex[index]
          }">${ansindex[index]}:
        ${currentQuestion.options[index]}
        </label>`
        );
      }
    }
    output.push(
      `<div class="slide">
        <div class="question">${ibutton}.${currentQuestion.name}</div>
        <div class="answers">${answers.join("")}</div>
      </div>`
    );
    ibutton++;
  });

  document.getElementById("quiz").innerHTML = output.join("");
  SetTimer();
}
function signOut() {
  var userId = firebase.auth().currentUser.uid;
  console.log(userId);
  firebase
    .auth()
    .signOut()
    .then(function() {
      window.location.href = "index.html";
    })
    .catch(function(error) {});
}
function SetTimer() {
  createTimer(timerval, 60);
  var timer, totalSecounds;
  function createTimer(timerId, time) {
    timer = document.getElementById(timerId);
    totalSecounds = time;
    updateTimer();
    window.setTimeout(function() {
      Tick();
    }, 1000);
  }
  function Tick() {
    totalSecounds -= 1;
    document.getElementById("submit").addEventListener("click", stopTimer);

    if (totalSecounds == -10) {
    } else {
      if (totalSecounds == -1) {
        alert("Time Up");

        end();
        userTime(totalSecounds);
      } else {
        updateTimer();
        window.setTimeout(function() {
          Tick();
        }, 1000);
      }
    }
  }
  function updateTimer() {
    document.getElementById(
      "timerval"
    ).innerHTML = `<i class="fas fa-stopwatch"></i>Timer : ${totalSecounds} `;
  }
  function stopTimer() {
    userTime(totalSecounds);
    totalSecounds = -9;
  }
}

function userTime(totalSecounds) {
  document.getElementById("userTime").innerText = `Time Of Completion :${60 -
    totalSecounds} Sec`;
}
function endFunction() {
  // end();
  document.getElementById("rules").style.display = "block";
  document.getElementById("questionbox").style.display = "none";
}
function end() {
  showResults();
  document.getElementById("next").style.display = "none";
  document.getElementById("end").style.display = "inline-block";
  document.getElementById("previous").style.display = "none";
  document.getElementById("submit").style.display = "none";
}
