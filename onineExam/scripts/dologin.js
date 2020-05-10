window.addEventListener("load", init);

function init() {
  clickLogin();
  document.getElementById("register").style = "display:none";
  document.getElementById("submit").addEventListener("click", doLogin);
  document.getElementById("reg").addEventListener("click", register);
  document.getElementById("clearall").addEventListener("click", clearall);
  document.getElementById("loginButton").addEventListener("click", clickLogin);
  document
    .getElementById("loginRegister")
    .addEventListener("click", clickRegister);
  document.getElementById("loginButton").addEventListener("click", clickLogin);
}

const clickLogin = () => {
  document.getElementById("register").style = "display:none";
  document.querySelector("#login").classList.toggle("clickLogin");
};

const clickRegister = () => {
  console.log(
    document.getElementById("login").className.includes("clickLogin")
  );
  if (!document.getElementById("login").className.includes("clickLogin"))
    clickLogin();
  document.querySelector("#register").style = "display:block";
};

function doLogin() {
  var userid = document.getElementById("userId").value;
  var pass = document.getElementById("password").value;
  firebase
    .auth()
    .signInWithEmailAndPassword(userid, pass)
    .then(data => {
      if (!userid.localeCompare("teacher@gmail.com")) {
        localStorage.currentUser = userid;
        window.location.href = "crud.html";
      } else {
        localStorage.currentUser = userid;
        window.location.href = "student.html";
      }
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
      alert("Invalid Email and Password");
    });
}

function clearall() {
  document.getElementById("userId").value = "";
  document.getElementById("password").value = "";
  document.getElementById("ruserId").value = "";
  document.getElementById("rpassword").value = "";
  document.getElementById("cPassword").value = "";
}
function register() {
  var user = document.querySelector("#ruserId").value;
  var cpass = document.querySelector("#cPassword").value;
  var pass = document.querySelector("#rpassword").value;
  if (pass == cpass && user) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(user, pass)
      .then(data => {
        alert("Successfully registerd Now login");
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        console.log(errorMessage);
      });
  }
}
