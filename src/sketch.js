'use strict';

function getTanFromDegrees(degrees) {
  return Math.tan(degrees * Math.PI / 180);
}

const TAN_60 = getTanFromDegrees(60);
const TAN_30 = getTanFromDegrees(30);

const isInTriangle = (A, B, C, length, point) => {
  const halfLength = length >> 1;

  let pointX = point.x;

  if (
    pointX >= A.x && pointX <= B.x
    &&
    point.y <= A.y && point.y >= C.y
  ) {

    let h;

    let pointXNormal = B.x - pointX;

    if (pointXNormal < halfLength) {
      h = pointXNormal * TAN_60;
    } else {
      h = (-pointXNormal + length) * TAN_60;
    }

    if (point.y >= A.y - h)
      return true;
  }


  return false;
}

const iit = (point) => {
  return isInTriangle(A, B, C, LENGTH, point);
}

const Point = (x, y) => ({x, y});

const middle = (p1, p2) => ({
  x: (p1.x + p2.x) / 2,
  y: (p1.y + p2.y) / 2,
})

//    █████████  ████
//   ███░░░░░███░░███
//  ███     ░░░  ░███   ██████    █████   █████
// ░███          ░███  ░░░░░███  ███░░   ███░░
// ░███          ░███   ███████ ░░█████ ░░█████
// ░░███     ███ ░███  ███░░███  ░░░░███ ░░░░███
//  ░░█████████  █████░░████████ ██████  ██████


class Fader {
  min;
  max;
  step;
  current;
  currentStep;
  currentStepInc;

  exponential;

  constructor(start, min, max, step, exponential = false) {
    this.min     = min;
    this.max     = max;
    this.step    = step;
    this.current = start;

    this.exponential = exponential;

    this.resetVal = () => {
      this.current = start;
      return this;
    };
  }

  val = () => {
    let result = this.current;

    if (this.currentStep) {

      if (this.exponential)
        this.currentStep += this.currentStep

      this.current += this.currentStep;

      if (this.current > this.max) {
        this.current     = this.max;
        this.currentStep = undefined;
      } else if (this.current < this.min) {
        this.current     = this.min;
        this.currentStep = undefined;
      }

    }

    return result;
  }

  fadeIn = () => {
    this.currentStep = this.step;
    return this;
  };

  fadeOut = () => {
    this.currentStep = -this.step;
    return this;
  };
}

//  █████   █████
// ░░███   ░░███
//  ░███    ░███   ██████   ████████   █████
//  ░███    ░███  ░░░░░███ ░░███░░███ ███░░
//  ░░███   ███    ███████  ░███ ░░░ ░░█████
//   ░░░█████░    ███░░███  ░███      ░░░░███
//     ░░███     ░░████████ █████     ██████

const middleW = window.innerWidth / 2
const middleH = window.innerHeight / 2


// const LENGTH      = TAN_60 * innerHeight; // px
const LENGTH      = window.innerWidth; // px
const HALF_LENGTH = (LENGTH / 2); // px


const A = Point(middleW - HALF_LENGTH, window.innerHeight);
const B = Point(A.x + LENGTH, A.y);
const C = Point(middleW, 0);

const POINTS      = [];
const EDGE_POINTS = [A, B, C];


let firstClick      = true;

// let firstPoint      = undefined;
// let firstPointValid = false;
// let lastPoint = undefined;

let firstPoint      = middle(A, B);
let firstPointValid = true;
let lastPoint = firstPoint


let adding          = true;


let counter = 0;
let colorCounter = 0;

let shapeCanvas;


const MAXIMAL_MAX_TO_ADD_LUL = 150;
let maxToAdd                 = 1;
let maxToAddStep             = 0.01;

let hideContour = false;

//  ██████████              █████                              ██████
// ░░███░░░░░█             ░░███                              ███░░███
//  ░███  █ ░  █████ █████ ███████   ████████   ██████       ░███ ░░░  █████ ████ ████████    ██████   █████
//  ░██████   ░░███ ░░███ ░░░███░   ░░███░░███ ░░░░░███     ███████   ░░███ ░███ ░░███░░███  ███░░███ ███░░
//  ░███░░█    ░░░█████░    ░███     ░███ ░░░   ███████    ░░░███░     ░███ ░███  ░███ ░███ ░███ ░░░ ░░█████
//  ░███ ░   █  ███░░░███   ░███ ███ ░███      ███░░███      ░███      ░███ ░███  ░███ ░███ ░███  ███ ░░░░███
//  ██████████ █████ █████  ░░█████  █████    ░░████████     █████     ░░████████ ████ █████░░██████  ██████

const getRandomInt       = (max, min = 0) => Math.floor(Math.random() * (max - min)) + min;
const getRandomEdgePoint = () => EDGE_POINTS[getRandomInt(3)];
const getRandomPoint     = () => Point(getRandomInt(B.x, A.x), getRandomInt(B.y, C.y));

const F         = new Fader(0, 0, 200, 2, 1 );
const dotFader  = new Fader(0, 0, 200, 2).fadeIn();
const sizeFader = new Fader(200, 5, 400, 4, 0).fadeOut();



const PointMode = {
  PIXEL: "pixel",
  DOT  : "dot"
}


const setPointsOnCanvas = (points, mode = PointMode.DOT) => {

  push();
  colorMode(HSB, 360);

  let pink = color(colorCounter++ % 360, 360, 360, 180);

  pop();

  switch (mode) {
    case PointMode.PIXEL: {
      shapeCanvas.loadPixels();

      points.forEach((p) => {
        let index = 4 * (Math.round(p.y) * width + Math.round(p.x));

        shapeCanvas.pixels[index]     = red(pink);
        shapeCanvas.pixels[index + 1] = green(pink);
        shapeCanvas.pixels[index + 2] = blue(pink);
        shapeCanvas.pixels[index + 3] = alpha(pink);


        shapeCanvas.updatePixels();
      });
    }
      break;

    case PointMode.DOT: {
      const c = shapeCanvas;

      c.colorMode(HSB, 360);
      c.fill(pink);

      // c.fill(pink);
      c.noStroke();

      points.forEach((p) => {
        c.circle(p.x, p.y, 5)
      });
    }
      break;
  }
}

const addPoints = (n = 1) => {
  let newPoints = [];

  let next;

  // do {
  //   next = getRandomPoint();
  //   // break;
  // } while (!iit(next));
  // console.log(next);

  for (let i = 0; i < n; i++) {

    let rand = getRandomEdgePoint();

    next = {
      x: Math.abs(rand.x + lastPoint.x) / 2,
      y: Math.abs(rand.y + lastPoint.y) / 2,
    }

    // shapeCanvas.loadPixels();
    if (lastPoint !== firstPoint) {
      // shapeCanvas.set(next.x, next.y, color(255));
      newPoints.push(next);
      // POINTS.push(lastPoint);
    }
    // shapeCanvas.updatePixels();

    lastPoint = next;
  }

  setPointsOnCanvas(newPoints);
}
//  ██████   ██████            ███
// ░░██████ ██████            ░░░
//  ░███░█████░███   ██████   ████  ████████
//  ░███░░███ ░███  ░░░░░███ ░░███ ░░███░░███
//  ░███ ░░░  ░███   ███████  ░███  ░███ ░███
//  ░███      ░███  ███░░███  ░███  ░███ ░███
//  █████     █████░░████████ █████ ████ █████

function setup() {

  createCanvas(window.innerWidth, window.innerHeight);

  shapeCanvas = createGraphics(width, height);

  frameRate(60)


  setTimeout(() => hideContour = true, 1000);
  F.fadeIn();
}


function draw() {
  if (firstPoint) {
    // fill(firstPointValid ? 0 : 255, firstPointValid ? 255 : 0, 0, dotFader.val());
    // fill(255, 0, 0, dotFader.val());
    // circle(firstPoint.x, firstPoint.y, firstPointValid ? sizeFader.val() : 30);

    if (adding && firstPointValid) {
      setTimeout(() => {
        addPoints(Math.floor(maxToAdd));

        if (maxToAdd < MAXIMAL_MAX_TO_ADD_LUL)
          maxToAddStep += 0.001;
        maxToAdd += maxToAddStep;
      }, 0);
    }
  }


  background(32, 72, 133);
  // background(0);
  // background(255);

  noStroke();



  if (iit(Point(mouseX, mouseY))) {
    F.fadeIn();
  } else if (hideContour) {
    F.fadeOut();
  }

  fill(20, F.val());

  beginShape();
  vertex(A.x, A.y);
  vertex(B.x, B.y);
  vertex(C.x, C.y);
  endShape(CLOSE);

  // push();
  let pointLength = POINTS.length;

  image(shapeCanvas, 0, 0);



}

function mouseClicked() {
  // fullscreen(true)
  // alert(`${mouseX}, ${mouseY}`)

  if (!firstPointValid) {

    firstPoint = Point(mouseX, mouseY);

    firstPointValid = iit(firstPoint);
    dotFader.resetVal().fadeIn();

    if (firstPointValid) {
      lastPoint = firstPoint;
    }
  } else {
    adding = !adding;
  }
}







