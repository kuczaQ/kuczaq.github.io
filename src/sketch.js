'use strict';

alert("Draw a triangle by selecting it's edge points on the screen.\nTo select click with your mouse. ");

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
// const EDGE_POINTS = [A, B, C];
let EDGE_POINTS = [];

const MOUSE_POINTER_SIZE = 25;

let firstClick = true;

// let firstPoint      = undefined;
// let firstPointValid = false;
// let lastPoint = undefined;

let firstPoint      = undefined;
let firstPointValid = true;
let lastPoint       = firstPoint


let adding = true;


let counter      = 0;
let colorCounter = 0;

let shapeCanvas = undefined;


const MAXIMAL_MAX_TO_ADD_LUL = 3000;
let maxToAdd                 = 400;
// let maxToAddStep             = 50;
// const MAXIMAL_MAX_TO_ADD_LUL = 50;
// let maxToAdd     = 1;
// let maxToAddStep = 0.01;

let hideContour = false;

let isShapeClosed = false;

let clickedPoint = undefined;



let F;
let dotFader;
let sizeFader;

//  ███████████
// ░░███░░░░░░█
//  ░███   █ ░  █████ ████ ████████    ██████   █████
//  ░███████   ░░███ ░███ ░░███░░███  ███░░███ ███░░
//  ░███░░░█    ░███ ░███  ░███ ░███ ░███ ░░░ ░░█████
//  ░███  ░     ░███ ░███  ░███ ░███ ░███  ███ ░░░░███
//  █████       ░░████████ ████ █████░░██████  ██████

function getTanFromDegrees(degrees) {
  return Math.tan(degrees * Math.PI / 180);
}

const TAN_60 = getTanFromDegrees(60);
const TAN_30 = getTanFromDegrees(30);

function isInTriangle(A, B, C, length, point) {
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

function iit(point) {
  return isInTriangle(A, B, C, LENGTH, point);
}

function Point(x, y) {
  return {x, y};
}

function middle(p1, p2) {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  };
}

function distance(p1, p2) {
  return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}

function isNearMouse(p) {
  return distance(p, getMousePoint()) < MOUSE_POINTER_SIZE;
}

function getMousePoint() {
  return Point(mouseX, mouseY);
}

function canBeClosed() {
  if (EDGE_POINTS.length < 3) return false;

  return isNearMouse(EDGE_POINTS[0]);
}

function isMouseOverEdgePoint() {
  for (const p of EDGE_POINTS) {
    if (isNearMouse(p)) {
      return p;
    }
  }

  return undefined;
}

const getRandomInt = (max, min = 0) => Math.floor(Math.random() * (max - min)) + min;

const getRandomEdgePoint = () => EDGE_POINTS[getRandomInt(EDGE_POINTS.length)];

const getRandomPoint = () => Point(getRandomInt(B.x, A.x), getRandomInt(B.y, C.y));


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

  // frameRate(60)

  F         = new Fader(0, 0, 200, 2, 1);
  dotFader  = new Fader(0, 0, 200, 2).fadeIn();
  sizeFader = new Fader(200, 5, 400, 4, 0).fadeOut();


  setTimeout(() => hideContour = true, 1000);
  F.fadeIn();
}


function draw() {
  background(32, 72, 133);

  if (isShapeClosed) {
    // fill(firstPointValid ? 0 : 255, firstPointValid ? 255 : 0, 0, dotFader.val());
    // fill(255, 0, 0, dotFader.val());
    // circle(firstPoint.x, firstPoint.y, firstPointValid ? sizeFader.val() : 30);

    if (adding) {
      console.log(maxToAdd)
      setTimeout(() => {
        addPoints(Math.floor(maxToAdd));

        if (maxToAdd < MAXIMAL_MAX_TO_ADD_LUL) {
          maxToAddStep += 0.001;
        maxToAdd += maxToAddStep;
        }
      }, 0);
    }
  }



  // background(0);
  // background(255);

  // noStroke();



  if (iit(Point(mouseX, mouseY))) {
    F.fadeIn();
  } else if (hideContour) {
    F.fadeOut();
  }

  // fill(20, F.val());
  //
  // beginShape();
  // EDGE_POINTS.forEach(p => {
  //   vertex(p.x, p.y);
  // });
  // endShape(CLOSE);

  fill(0, 0);

  beginShape();
  EDGE_POINTS.forEach(p => {
    vertex(p.x, p.y);
  });

  if (isShapeClosed)
    endShape(CLOSE);
  else
    endShape();

  // push();
  let pointLength = POINTS.length;

  image(shapeCanvas, 0, 0);


  if (!isShapeClosed) {
    push();

    if (canBeClosed())
      fill(255);
    else
      fill(0, 0);
    stroke(255);
    strokeWeight(3);
    circle(mouseX, mouseY, MOUSE_POINTER_SIZE);

    pop();
  } else {
    if (isMouseOverEdgePoint()) {
      cursor('grab');
    } else {
      cursor(ARROW);
    }
  }

  if (clickedPoint) {
    clickedPoint.x = mouseX;
    clickedPoint.y = mouseY;
  }
}

function mousePressed() {
  if (isShapeClosed) {
    clickedPoint = isMouseOverEdgePoint();
  }
}

function mouseReleased() {
  clickedPoint = undefined;
}

function mouseClicked() {
  // fullscreen(true)
  // alert(`${mouseX}, ${mouseY}`)

  if (canBeClosed()) {
    isShapeClosed = true;
    firstPoint    = middle(EDGE_POINTS[0], EDGE_POINTS[1]);
    lastPoint     = firstPoint;
  }

  if (!isShapeClosed) {
    EDGE_POINTS.push(Point(mouseX, mouseY));
  }

  // if (!firstPointValid) {
  //
  //   firstPoint = Point(mouseX, mouseY);
  //
  //   firstPointValid = iit(firstPoint);
  //   dotFader.resetVal().fadeIn();
  //
  //   if (firstPointValid) {
  //     lastPoint = firstPoint;
  //   }
  // }
  // else {
  //   adding = !adding;
  // }
}

function keyPressed() {
  switch (key) {
    case 'c':
      shapeCanvas.clear();
      break;
    case 'r':
      EDGE_POINTS = [];
      isShapeClosed = false;
      break;
  }
}






