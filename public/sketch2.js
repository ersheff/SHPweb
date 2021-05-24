// const { clear } = require("node:console");

const synth = new Tone.Synth().toDestination();
let now;
let audioEnabled = false;

document.getElementById("play-button").addEventListener("click", function () {
  // console.log(Tone);
  if (Tone.Transport.state !== "started") {
    Tone.start();
    audioEnabled = true;
    document.getElementById("play-button").textContent = "Audio Enabled";
  }
});

var socket;
let buttonsArray = [];
let squareSize = 15;
let bufferSize = 4;
let margin = 20;
let gridSize;
var posX = 40;
var fillColor = 80;

function setup() {
  var socket = io("/hub");
  socket.on("connected", () => {
    socket.emit("addUsername", "p5jsClient");
    console.log("connected");

    socket.on("control", (data) => {
      //   if (data.control == null || data.control == undefined) return;

      console.log("received control");
      console.dir(data);
      switch (data.header) {
        case "value1":
          console.log("grid cell change: " + data.control.halues);
          posX = data.control.values;
          break;
        case "webSlider3":
          //   console.log("cell color change" + data.control.halues);
          changePos(data.values);
          console.log(data.values);
          // changeCellFill(data.control.Values[0], data.control.Values[1], data.control.Values[2], data.control.Values[3], data.control.Values[4]);
          break;
        case "webSlider1":
          //   console.log("cell color change" + data.control.halues);
          posX = data.control.Values;
          // changeCellFill(data.control.Values[0], data.control.Values[1], data.control.Values[2], data.control.Values[3], data.control.Values[4]);
          break;
        default:
          console.log("not gridcells header...");
          break;
      }
    });
    socket.on("event", (data) => {
      this.playSound(Math.floor(random(3)));
    });
    createCanvas(400, 200);
  });
}

function eventTriggered(){
    this.playSound(Math.floor(random(3)));
    fillColor = random(100);
}
function changePos(data) {
  posX = data;
}
function draw() {
  background(220);
  ellipseMode(CENTER);
  fill(fillColor);
  stroke(0);
  ellipse(posX + 50, 46, 55, 55);
}

function mousePressed() {
  for (let i = 0; i < buttonsArray.length; i++) {
    for (let j = 0; j < buttonsArray.length; j++) {
      buttonsArray[i][j].clicked(mouseX, mouseY);
    }
  }
}

function clicked(px, py) {
  let d = dist(px, py, this.x, this.y);
  if (d < this.radius) {
    //   this.brightness = 255;
    console.log(this.position + " clicked");
    if (audioEnabled == true) {
      this.playSound(Math.floor(random(3)));
    }
  }
}

function playSound(value) {
  console.log("value: " + value);
  switch (value) {
    case 0:
      now = Tone.now();
      synth.triggerAttackRelease("C4", "8n", now);
      synth.triggerAttackRelease("F4", "8n", now + 0.5);
      synth.triggerAttackRelease("G#4", "8n", now + 1);
      break;
    case 1:
      now = Tone.now();
      synth.triggerAttackRelease("C4", "8n", now);
      synth.triggerAttackRelease("E4", "8n", now + 0.5);
      synth.triggerAttackRelease("G4", "8n", now + 1);
      break;

    case 2:
      now = Tone.now();
      synth.triggerAttackRelease("D4", "8n", now);
      synth.triggerAttackRelease("F4", "8n", now + 0.5);
      synth.triggerAttackRelease("G#4", "8n", now + 1);
      break;
    case 3:
      now = Tone.now();
      synth.triggerAttackRelease("D4", "8n", now);
      synth.triggerAttackRelease("Eb4", "8n", now + 0.5);
      synth.triggerAttackRelease("Ab4", "8n", now + 1);
      break;
  }
}
