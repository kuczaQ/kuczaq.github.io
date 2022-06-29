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

class Fader {
  min;
  max;
  step;
  current;
  currentStep;

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

  val = (debug = false) => {
    let result = this.current;

    debug && console.log("if", this.currentStep)
    if (this.currentStep) {

      if (this.exponential)
        this.currentStep += this.currentStep

      debug && console.log(this.currentStep)
      this.current += this.currentStep;
      debug && console.log("current", this.current)
      debug && console.log("max", this.max)
      debug && console.log("min", this.min)

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

const Point = (x, y) => ({x, y});



const middleW = window.innerWidth / 2
const middleH = window.innerHeight / 2
console.log(innerWidth)
console.log(innerHeight)


// const LENGTH      = TAN_60 * innerHeight; // px
const LENGTH      = innerWidth; // px
const HALF_LENGTH = (LENGTH / 2); // px


const A = Point(middleW - HALF_LENGTH, window.innerHeight);
const B = Point(A.x + LENGTH, A.y);
const C = Point(middleW, 0);

const POINTS      = [];
const EDGE_POINTS = [A, B, C];


const getRandomInt       = (max, min = 0) => Math.floor(Math.random() * (max - min)) + min;
const getRandomEdgePoint = () => EDGE_POINTS[getRandomInt(3)];
const getRandomPoint     = () => Point(getRandomInt(B.x, A.x), getRandomInt(B.y, C.y));

const F         = new Fader(0, 0, 200, 2, true);
const dotFader  = new Fader(0, 0, 200, 2).fadeIn();
const sizeFader = new Fader(200, 5, 400, 4, 0).fadeOut();

let firstClick      = true;
let firstPoint      = undefined;
let firstPointValid = false;
let adding          = true;

let lastPoint = undefined;

const addNextPoint = () => {
  let next;

  // do {
  //   next = getRandomPoint();
  //   // break;
  // } while (!iit(next));
  // console.log(next);

  let rand = getRandomEdgePoint();

  next = {
    x: Math.abs(rand.x + lastPoint.x) / 2,
    y: Math.abs(rand.y + lastPoint.y) / 2,
  }

  if (lastPoint != firstPoint)
    POINTS.push(lastPoint);

  lastPoint = next;
}


function setup() {
  createCanvas(window.innerWidth, window.innerHeight);


}

const MAXIMAL_MAX_TO_ADD_LUL = 50;
let maxToAdd                 = 1;
let maxToAddStep             = 0.01;
console.log(A, B, C)

function draw() {
  // background(32, 72, 133);
  background(0);
  // background(255);

  noStroke();



  if (iit(Point(mouseX, mouseY))) {
    F.fadeIn();
  } else {
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
  // colorMode(HSB, pointLength);

  let pink = color(255);
  loadPixels();

  let d = pixelDensity();

  POINTS.forEach((p, i) => {
    // fill(i, pointLength, pointLength, pointLength * 0.4);
    // fill(i, 0, 0, pointLength);
    // circle(p.x, p.y, 2);
    let index;// = 4 * ((p.y * d + j) * width * d + (p.x * d + i));

    for (let i = 0; i < d; i++) {
      for (let j = 0; j < d; j++) {
        index = 4 * ((Math.round(p.y) * d + j) * width * d + (Math.round(p.x) * d + i));

        pixels[index]     = red(pink);
        pixels[index + 1] = green(pink);
        pixels[index + 2] = blue(pink);
        pixels[index + 3] = alpha(pink);
      }
    }
  });
  updatePixels();


  if (firstPoint) {
    // fill(firstPointValid ? 0 : 255, firstPointValid ? 255 : 0, 0, dotFader.val());
    // fill(255, 0, 0, dotFader.val());
    // circle(firstPoint.x, firstPoint.y, firstPointValid ? sizeFader.val() : 30);

    if (adding && firstPointValid) {
      for (let i = 0; i < Math.floor(maxToAdd); i++) {
        addNextPoint();
      }

      if (maxToAdd < MAXIMAL_MAX_TO_ADD_LUL)
        maxToAddStep += 0.001;
      maxToAdd += maxToAddStep;
    }
  }

}

function mouseClicked() {
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








