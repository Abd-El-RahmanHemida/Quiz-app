let numQuestion = document.querySelector(".count span");
let bulletsContainer = document.querySelector(".bullets .spans");
let headQuestion = document.querySelector(".quiz-area h2");
let quizArea = document.querySelector(".quiz-area");
let bullets = document.querySelector(".bullets");
let answerArea = document.querySelector(".answer-area");
let submitButton = document.querySelector(".submit");
let answers = document.getElementsByName("questions");
let resultContainer = document.querySelector(".result");
let counterDown = document.querySelector(".countdown");
let counter = 0;
let rightAnswerCounter = 0;
let countDownInterval;

function getDate() {
  let request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionObj = JSON.parse(this.responseText);
      let qNum = questionObj.length;
      creatBulletsAndSpans(qNum);
      addDate(questionObj[counter], qNum);
      countDown(qNum, 5);
      submitButton.onclick = () => {
        let rightAnswer = questionObj[counter].answer_right;
        let theChosenAnswer;
        answers.forEach(function (e) {
          if (e.checked) {
            theChosenAnswer = e.dataset.answer;
          }
        });
        ++counter;
        if (rightAnswer === theChosenAnswer) {
          ++rightAnswerCounter;
        }
        //Remove Old Date
        headQuestion.innerHTML = "";
        answerArea.innerHTML = "";
        //Add New Date
        addDate(questionObj[counter], qNum);
        // handle bullets
        handleBullets();
        clearInterval(countDownInterval);
        countDown(qNum, 5);

        // Show Result
        showResult(qNum);
      };
    }
  };

  request.open("GET", "questions.json", true);
  request.send();
}

getDate();

function creatBulletsAndSpans(num) {
  numQuestion.innerHTML = num;

  for (let i = 0; i < num; i++) {
    let bullet = document.createElement("span");
    if (i === 0) {
      bullet.className = "on";
    }
    bulletsContainer.appendChild(bullet);
  }
}

function addDate(obj, num) {
  if (num > counter) {
    // create Head

    let headText = document.createTextNode(obj.title);
    headQuestion.appendChild(headText);

    for (let i = 1; i <= 4; i++) {
      // main div

      let mainDiv = document.createElement("div");

      mainDiv.className = "answer";

      // Create Radio

      let radioInput = document.createElement("input");

      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.name = "questions";
      radioInput.dataset.answer = obj[`answer_${i}`];

      // Create Label

      let labelAnswer = document.createElement("label");
      let labelText = document.createTextNode(obj[`answer_${i}`]);

      labelAnswer.htmlFor = `answer_${i}`;
      labelAnswer.appendChild(labelText);

      // append to main div

      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(labelAnswer);

      // Append To Answer Area

      answerArea.appendChild(mainDiv);
      if (i === 1) {
        radioInput.checked = true;
      }
    }
  }
}
function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayFromSpans = Array.from(bulletsSpans);
  arrayFromSpans.forEach((span, index) => {
    span.classList.remove("on");
    if (index == counter) {
      span.className = "on";
    }
  });
}
function showResult(num) {
  if (counter === num) {
    quizArea.remove();
    answerArea.remove();
    submitButton.remove();
    bullets.remove();
    let result;
    if (rightAnswerCounter > num / 2 && rightAnswerCounter < num) {
      result = `<span class="good">Good</span> You answered ${rightAnswerCounter} from ${num}`;
    } else if (rightAnswerCounter === num) {
      result = `<span class="perfect">Perfect</span> You answered ${rightAnswerCounter} from ${num}`;
    } else {
      result = `<span class="bad">Bad</span> You answered ${rightAnswerCounter} from ${num}`;
    }
    resultContainer.innerHTML = result;
  }
}
function countDown(count, duration) {
  if (counter < count) {
    let minutes, seconds;
    countDownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      counterDown.innerHTML = `${minutes}:${seconds}`;
      if (--duration < 0) {
        clearInterval(countDownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
