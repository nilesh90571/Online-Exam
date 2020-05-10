window.addEventListener("load", init);
var countDown;
function printCounter() {
  document.getElementById("id").innerText = countDown.next().value;
}

function init() {
  registerEvent();
  countDown = autoGen();
  updateCount();
  printCounter();
  showHide();
}
function updateCount() {
  document.querySelector("#total").innerText =
    questionOperations.operations.length;
  document.querySelector("#mark").innerText = questionOperations.countMark();
  document.querySelector("#unmark").innerText =
    questionOperations.operations.length - questionOperations.countMark();
}
const showHide = () =>
  document.querySelector("#sbox").classList.toggle("searchbox");
function registerEvent() {
  document.getElementById("add").addEventListener("click", function() {
    addQuestion();
  });
  document
    .getElementById("fetchServer")
    .addEventListener("click", fetchFromServer);
  document
    .getElementById("loadServer")
    .addEventListener("click", loadIntoServer);
  document.getElementById("delete").addEventListener("click", deleteQuestion);
  document.getElementById("search").addEventListener("click", searchIt);
  document.getElementById("update").addEventListener("click", updateQuestion);
  document.getElementById("clearall").addEventListener("click", clearAll);
  document.getElementById("down").addEventListener("click", function() {
    sortbyname(1, "score");
  });
  document.getElementById("up").addEventListener("click", function() {
    sortbyname(2, "score");
  });
  document.getElementById("downname").addEventListener("click", function() {
    sortbyname(2, "name");
  });
  document.getElementById("upname").addEventListener("click", function() {
    sortbyname(1, "name");
  });
  document.getElementById("load").addEventListener("click", loadQuestion);
  document.getElementById("save").addEventListener("click", saveQuestion);
  document.getElementById("signout").addEventListener("click", signOut);

  document.getElementById("userId").innerText = localStorage.currentUser;
}
function signOut() {
  firebase
    .auth()
    .signOut()
    .then(function() {
      window.location.href = "index.html";
    })
    .catch(function(error) {
      // An error happened.
    });
}
function loadQuestion() {
  if (localStorage) {
    if (localStorage.questions) {
      questionOperations.operations = JSON.parse(localStorage.questions);
      printQuestions(questionOperations.operations);
      updateCount();
    } else {
      alert("No Date Exist to Load");
    }
  } else {
    alert("Your Brower is Outdated");
  }
}
function saveQuestion() {
  if (localStorage) {
    localStorage.questions = JSON.stringify(questionOperations.operations);
    alert("Record Saved");
  } else {
    alert("Your Brower is Outdated");
  }
}
function sortbyname(type, val) {
  var object = questionOperations.sort(type, val);
  printQuestions(object);
}
function clearAll() {
  var elements = document.getElementsByClassName("form-control one");
  for (var i = 0, len = elements.length; i < len; i++) {
    // elements[i].style ...
    elements[i].value = "";
  }
}
function updateQuestion() {
  var id = document.querySelector("#id").innerText;
  console.log(id);
  addQuestion(id);
}
function searchIt() {
  showHide();
  var val = document.querySelector("#searchValue").value;
  var key = document.querySelector("#searchby").value;
  if (key != "-1") {
    var subArr = questionOperations.search(key, val);
    printQuestions(subArr);
  }
}
function deleteQuestion() {
  questionOperations.remove();
  printQuestions(questionOperations.operations);
  updateCount();
}
function fetchFromServer() {
  // single record
  //firebase.database().ref('/questions/100')
  // all
  // var questions = firebase.database().ref("/questions");
  // questions.on("value", snapshot => {
  //   var allQuestionsObj = snapshot.val();
  //   for (let key in allQuestionsObj) {
  //     questionOperations.add(allQuestionsObj[key]);
  //   }
  //   printQuestion(allQuestionsObj);
  // });
  var questions = firebase.database().ref("/questions");
  questions.on("value", snapshot => {
    var allQuestionsObj = snapshot.val();
    for (let key in allQuestionsObj) {
      var questionObj = allQuestionsObj[key];
      questionOperations.add(questionObj);
      console.log(questionObj);
    }
    // console.log(allQuestionsObj);
    printQuestions(questionOperations.operations);
    // updateCount();
  });
}
function loadIntoServer() {
  questionOperations.operations.forEach(obj => {
    let id = obj.id;
    let promise = firebase
      .database()
      .ref("/questions/" + id)
      .set(obj);
    promise
      .then(data => {
        alert("Data loaded");
      })
      .catch(error => {
        alert("Error during the add database");
      });
  });
}
function edit() {
  var id = this.getAttribute("qid");
  var questionObject = questionOperations.find(id);
  for (let key in questionObject) {
    if (key == "id") {
      document.getElementById("id").innerText = questionObject[key];
      continue;
    }

    if (key == "markForDelete") {
      continue;
    }
    if (key == "options") {
      let i = 1;

      for (let val of questionObject[key]) {
        console.log(val);
        document.getElementById("option" + i).value = val;
        i++;
      }
      continue;
    }
    document.getElementById(key).value = questionObject[key];
  }
}

function toggleRed() {
  var id = this.getAttribute("qid");
  var tr = this.parentNode.parentNode;
  tr.classList.toggle("alert-danger");
  questionOperations.toggleMark(id);
  updateCount();
}
function createIcon(className, fn, id) {
  var icon = document.createElement("i");

  icon.classList = className;
  icon.setAttribute("qid", id);
  icon.addEventListener("click", fn);

  return icon;
}
function addQuestion(id) {
  console.log(id);
  var questionObject = new question();
  for (let key in questionObject) {
    if (key == "id") {
      questionObject[key] = document.getElementById("id").innerText;
      continue;
    }

    if (key == "markForDelete") {
      continue;
    }
    if (key == "options") {
      var option = [];
      for (let i = 1; i <= 4; i++) {
        option.push(document.getElementById("option" + i).value);
      }
      questionObject[key] = option;
      continue;
    }
    questionObject[key] = document.getElementById(key).value;
  }
  if (id) {
    console.log(id);
    questionOperations.update(id, questionObject);
    printQuestions(questionOperations.operations);
    document.querySelector("#id").innerText = questionOperations.idValue();
  } else {
    questionOperations.add(questionObject);
    printQuestion(questionObject);
    printCounter();
    updateCount();
  }
}
function printQuestions(questions) {
  document.querySelector("#question").innerHTML = " ";
  questions.forEach(printQuestion);
  updateCount();
}
// function printQuestion(questionObject) {
//   var tbody = document.querySelector("#question");
//   var tr = tbody.insertRow();
//   var index = 0;
//   for (let key in questionObject) {
//     if (key == "markForDelete") {
//       continue;
//     }
//     if (key == "options") {
//       for (let option of questionObject[key]) {
//         tr.insertCell(index).innerText = option;
//         index++;
//       }
//       continue;
//     }
//     tr.insertCell(index).innerText = questionObject[key];
//     index++;
//   }
//   //var td = tr.insertCell(index);

//   // td.appendChild(
//   //   createIcon("fas fa-trash mr-2 hand ", toggleRed, questionObject.id)
//   // );
//   // td.appendChild(createIcon("fas fa - edit hand ", edit, questionObject.id));
//   var td = tr.insertCell(index);
//   console.log(td, index);
//   console.log(
//     td.appendChild(
//       createIcon("fas fa-trash mr-2 hand", toggleRed, questionObject.id)
//     )
//   );

//   td.appendChild(createIcon("fas fa-edit hand", edit, questionObject.id));
// }
function printQuestion(questionObject) {
  var tbody = document.querySelector("#question");
  var tr = tbody.insertRow();
  var index = 0;
  for (let key in questionObject) {
    if (key == "markForDelete") {
      continue;
    }
    if (key == "options") {
      let options = questionObject[key];
      for (let option of options) {
        tr.insertCell(index).innerText = option;
        index++;
      }
      continue;
    }
    tr.insertCell(index).innerText = questionObject[key];
    index++;
  } // loop ends
  var td = tr.insertCell(index);
  td.appendChild(
    createIcon("fas fa-trash mr-2 hand", toggleRed, questionObject.id)
  );

  td.appendChild(createIcon("fas fa-edit hand", edit, questionObject.id));
}
