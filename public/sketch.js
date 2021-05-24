const synth = new Tone.Synth().toDestination();
let now;
let audioEnabled = false;

document.getElementById("play-button").addEventListener("click", function () {
    // console.log(Tone);
    if (Tone.Transport.state !== 'started') {
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

function setup() {
    var socket = io('/grid');
    socket.on('connected', () => {
        socket.emit('addUsername', 'GridUser1');
        socket.emit('joinRoom', 'GridUsers');
        console.log('connected');
    });
    socket.on('control', (data) => {
        if (data.control == null || data.control == undefined)
            return;

        switch (data.control.Header.toString()) {
            case "gridCells":
                console.log("grid cell change: " + data.control.Values);
                changeGrid(data.control.Values[0], data.control.Values[1])
                break;
            case "cellColor":
                console.log("cell color change" + data.control.Values);
                changeCellFill(data.control.Values[0], data.control.Values[1], data.control.Values[2], data.control.Values[3], data.control.Values[4]);
                break;
            case "cells":
                // console.log(data.control.Values[0]);
                changeAllCells(data.control.Values[0]);
                break;
            default:
                console.log("not gridcells header...");
                break;
        }
    });
    gridSize = createVector(10, 10);
    createCanvas(800, 800);
    setupGrid();
}

function changeAllCells(cellData){
    console.log(cellData[0].length)
    for(var i = 0; i < cellData[0].length; i++){
        var bRow = i % gridSize.x;
        var bCol = (int) (i / gridSize.y);
        console.log('br ' + bRow + 'bc ' + bCol);
        changeCellFill(bRow, bCol, cellData[1][i], cellData[2][i], cellData[3][i]);
        // changeCellFill(bRow, bCol, 255, 0, 0);
    }
}

function mousePressed() {
    // for (let i = 0; i < bubbles.length; i++) {
    //   bubbles[i].clicked(mouseX, mouseY);
    // }

    for (let i = 0; i < buttonsArray.length; i++) {
        for (let j = 0; j < buttonsArray.length; j++) {
            buttonsArray[i][j].clicked(mouseX, mouseY);
        }
    }
}

function setupGrid() {
    buttonsArray = [];
    for (var i = 0; i < gridSize.x; i++) {
        var columns = [];
        for (var j = 0; j < gridSize.y; j++) {
            columns[j] = new button(
                (i * (squareSize + bufferSize)) + margin,
                (j * (squareSize + bufferSize)) + margin,
                squareSize,
                i,
                j,
                0,
                ((i + 1) * (j + 1)) * 255 / 100,
                ((i + 1) * (j + 1)) * 255 / 100,
                ((i + 1) * (j + 1)) * 255 / 100
            );
        }
        buttonsArray[i] = columns;
    }
}

function changeCellFill(x, y, r, g, b) {
    if (buttonsArray.length < y || buttonsArray.length[0] < x) {
        console.log('out of bounds');
        return;
    }
    buttonsArray[x][y].changeFill(r, g, b);
}

function draw() {
    background(220);
    for (var i = 0; i < gridSize.x; i++) {
        for (var j = 0; j < gridSize.y; j++) {
            buttonsArray[i][j].display();
        }
    }

    // buttonsArray[1][2].changeFill(120);
}

function changeGrid(x, y) {
    gridSize = new createVector(x, y);
    // console.log(gridSize);
    setupGrid();
}

class button {
    constructor(x, y, rad, row, col, strokeColor, r, g, b) {
        rectMode(CENTER);
        this.x = x;
        this.y = y;
        this.radius = rad;
        this.strokeColor = strokeColor;
        this.fillColor = color(r, g, b);
        this.position = new createVector(row, col);
    }

    display() {
        // let col = (this.fillColor < 0) ? random(255) : this.fillColor;
        // console.log(this.fillColor);
        fill(this.fillColor);
        rect(this.x, this.y, this.radius, this.radius);

        // (this.color);
    }

    changeFill(r, g, b) {
        console.log('changing color!!');
        this.fillColor = color(r, g, b);
        this.display();
    }

    clicked(px, py) {
        let d = dist(px, py, this.x, this.y);
        if (d < this.radius) {
            //   this.brightness = 255;
            console.log(this.position + ' clicked');

            if (audioEnabled == true) {
                this.playSound(Math.floor(random(3)));
            }
        }
    }

    playSound(value) {
        console.log('value: ' + value);
        switch (value) {
            case 0:
                now = Tone.now()
                synth.triggerAttackRelease("C4", "8n", now)
                synth.triggerAttackRelease("F4", "8n", now + 0.5)
                synth.triggerAttackRelease("G#4", "8n", now + 1)
                break;
            case 1:
                now = Tone.now()
                synth.triggerAttackRelease("C4", "8n", now)
                synth.triggerAttackRelease("E4", "8n", now + 0.5)
                synth.triggerAttackRelease("G4", "8n", now + 1)
                break;

            case 2:
                now = Tone.now()
                synth.triggerAttackRelease("D4", "8n", now)
                synth.triggerAttackRelease("F4", "8n", now + 0.5)
                synth.triggerAttackRelease("G#4", "8n", now + 1)
                break;
            case 3:
                now = Tone.now()
                synth.triggerAttackRelease("D4", "8n", now)
                synth.triggerAttackRelease("Eb4", "8n", now + 0.5)
                synth.triggerAttackRelease("Ab4", "8n", now + 1)
                break;
        }

    }
}