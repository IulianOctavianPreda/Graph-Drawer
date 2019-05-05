var size = 30;
var color = "#ff2626";
var nodeArray = [];
var lineArray = [];
var textArray = [];

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var selectedGraphOne = null;
var selectedGraphTwo = null;
var selectedGraphForMove = null;

window.addEventListener("resize", resizeCanvas, false);
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  redrawStuff();
}
resizeCanvas();

document.getElementById("canvas").addEventListener("click", (e) => {
  var rect = canvas.getBoundingClientRect();
  var x = event.clientX - rect.left;
  var y = event.clientY - rect.top;

  var ok = true;
  var selectedNode = null;
  for (var i = 0; i < lineArray.length; i++) {
    console.log(
      pointInRectangle(lineArray[i].x1, lineArray[i].y1, lineArray[i].x2, lineArray[i].y2, x, y, 50)
    );
  }
  for (var i = 0; i < nodeArray.length; i++) {
    if (pointInCircle(x, y, nodeArray[i].x, nodeArray[i].y, size)) {
      selectedNode = nodeArray[i];
      ok = false;
    }
  }
  if (ok) {
    createGraph(x, y);
    clearSelection();
  } else {
    connectGraphs(selectedNode);
  }
  console.log(document.getElementsByTagName("input").length);
  var inputArray = document.getElementsByTagName("input");
  var textArrayLen = textArray.length;
  for (var i = 0; i < inputArray.length; i++) {
    console.log(inputArray[i]);
    for (var j = 0; j < textArray.length; j++) {
      if (textArray[i].x != inputArray[i].style.left && textArray[i].y != inputArray[i].style.top) {
        textArray.push({
          x: inputArray[i].style.left,
          y: inputArray[i].style.top,
          text: inputArray[i].value
        });
      }
      inputArray[i].remove();
    }
  }
  if (textArrayLen != textArray.length) {
    redrawStuff();
  }
  // document.getElementsByTagName('input').forEach(element =>{
  //   console.log(element)
  // })
});

//document.getElementById("canvas").addEventListener("auxclick ", e => {

// var rect = canvas.getBoundingClientRect();
// var x = event.clientX - rect.left;
// var y = event.clientY - rect.top;
// var ok = false;
// var selectedNode = null;
// for (var i = 0; i < nodeArray.length; i++) {
//   if (pointInCircle(x, y, nodeArray[i].x, nodeArray[i].y, size)) {
//     selectedNode =  nodeArray[i];
//     ok = true;
//   }
// }
// if(ok){
// var input = document.createElement("INPUT");
// input.setAttribute("type", "text");
// input.style.position = 'absolute';
// input.style.top = y - size/2;
// input.style.left = x - size/2;
// input.style.width = size;
// document.body.appendChild(input);
// }
//});

document.getElementById("canvas").addEventListener("mousedown", (e) => {
  console.log(e);
  var rect = canvas.getBoundingClientRect();
  var x = event.clientX - rect.left;
  var y = event.clientY - rect.top;
  // if (e.button == 1) {
  //   var input = document.createElement("INPUT");
  //   input.setAttribute("type", "text");
  //   input.style.position = "absolute";
  //   input.style.top = y - size / 2;
  //   input.style.left = x - size / 2;
  //   input.style.width = size;
  //   document.body.appendChild(input);
  // } else {
  for (var i = 0; i < nodeArray.length; i++) {
    if (pointInCircle(x, y, nodeArray[i].x, nodeArray[i].y, size)) {
      selectedGraphForMove = i;
    }
  }
  // }
});
document.getElementById("canvas").addEventListener("mouseup", (e) => {
  selectedGraphForMove = null;
});

document.getElementById("canvas").addEventListener("mousemove", (e) => {
  var rect = canvas.getBoundingClientRect();
  var x = event.clientX - rect.left;
  var y = event.clientY - rect.top;
  if (selectedGraphForMove != null) {
    updateLines(nodeArray[selectedGraphForMove].x, nodeArray[selectedGraphForMove].y, x, y);
    nodeArray[selectedGraphForMove].x = x;
    nodeArray[selectedGraphForMove].y = y;
    clearCanvas();
    redrawStuff();
    selectedGraphOne = null;
    selectedGraphTwo = null;
  }
});

function updateLines(x, y, nx, ny) {
  for (var i = 0; i < lineArray.length; i++) {
    if (x == lineArray[i].x1 && y == lineArray[i].y1) {
      lineArray[i].x1 = nx;
      lineArray[i].y1 = ny;
    }
    if (x == lineArray[i].x2 && y == lineArray[i].y2) {
      lineArray[i].x2 = nx;
      lineArray[i].y2 = ny;
    }
  }
}

document.getElementById("canvas").addEventListener(
  "contextmenu",
  (e) => {
    e.preventDefault();

    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    var ok = false;
    var toRemove;
    for (var i = 0; i < nodeArray.length; i++) {
      if (pointInCircle(x, y, nodeArray[i].x, nodeArray[i].y, size)) {
        x = nodeArray[i].x;
        y = nodeArray[i].y;
        toRemove = nodeArray[i];
        ok = true;
      }
    }
    if (ok) {
      nodeArray = nodeArray.filter((item) => item != toRemove);
      lineArray = lineArray
        .filter((item) => item.x1 != x && item.y1 != y)
        .filter((item) => item.x2 != x && item.y2 != y);
      clearCanvas();
      redrawStuff();
    }
    return false;
  },
  false
);

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function redrawStuff() {
  nodeArray.forEach((element) => {
    drawCircle(element.x, element.y);
  });
  lineArray.forEach((element) => {
    drawLine(element.x1, element.y1, element.x2, element.y2);
  });
  textArray.forEach((element) => {
    ctx.font = "30px Arial";
    ctx.fillText(element.text, element.x, element.y);
  });
}

function createGraph(x, y) {
  var ok = true;
  for (var i = 0; i < nodeArray.length; i++) {
    if (Math.sqrt(Math.pow(nodeArray[i].x - x, 2) + Math.pow(nodeArray[i].y - y, 2)) < 2 * size) {
      ok = false;
    }
  }
  if (ok) {
    drawCircle(x, y);
    nodeArray.push({ x: x, y: y });
  }
}

function drawCircle(x, y) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2, true);
  ctx.fill();
}

function connectGraphs(graph) {
  if (
    selectedGraphOne != null &&
    (selectedGraphOne.x != graph.x && selectedGraphOne.y != graph.y)
  ) {
    selectedGraphTwo = graph;
  } else {
    selectedGraphOne = graph;
  }
  if (selectedGraphOne && selectedGraphTwo) {
    var ok = true;
    for (var i = 0; i < lineArray.length; i++) {
      if (
        (selectedGraphOne.x == lineArray[i].x1 &&
          selectedGraphOne.y == lineArray[i].y1 &&
          (selectedGraphTwo.x == lineArray[i].x2 && selectedGraphTwo.y == lineArray[i].y2)) ||
        (selectedGraphOne.x == lineArray[i].x2 &&
          selectedGraphOne.y == lineArray[i].y2 &&
          (selectedGraphTwo.x == lineArray[i].x1 && selectedGraphTwo.y == lineArray[i].y1))
      ) {
        ok = false;
      }
    }
    if (ok) {
      drawLine(selectedGraphOne.x, selectedGraphOne.y, selectedGraphTwo.x, selectedGraphTwo.y);
      lineArray.push({
        x1: selectedGraphOne.x,
        y1: selectedGraphOne.y,
        x2: selectedGraphTwo.x,
        y2: selectedGraphTwo.y
      });
    }
    clearSelection();
  }
}
function clearSelection() {
  selectedGraphOne = null;
  selectedGraphTwo = null;
}

function drawLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}