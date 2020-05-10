window.addEventListener("load", init);
function init() {
  registerEvents();
}
// var scriptArr = [
//   "scripts/utils/util.js",
//   "scripts/crud/model/question.js",
//   "scripts / crud / model / questionoperations.js",
//   "scripts/crud/controller/questioncontroller.js"
// ];
function registerEvents() {
  var p1 = document.getElementById("crudme");
  if (p1.addEventListener) {
    p1.addEventListener("click", change);
  }
}
function change() {
  var pr = fetch("http://127.0.0.1:5500/crud1.html");
  pr.then(response => {
    response
      .text()
      .then(data => {
        console.log(data);
        document.getElementById("main").innerHTML = data;
        scriptFetch();
      })
      .catch(er => console.log(er));
  }).catch(er => console.log(er));
}
