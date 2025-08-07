/** @type {HTMLCanvasElement} */
import { config } from "./components/config.js";
import { Sprite } from "./components/Sprite.js";
import { Layer } from "./components/Layer.js";
import { isOverlapping } from "./components/utils.js";
import { createSwarm } from "./components/utils.js";
import { spawnButterflySwarmFromShell } from "./components/utils.js";
import { slowDownscrollSpeed } from "./components/utils.js";
import { speedUpscrollSpeed } from "./components/utils.js";
import { stopscrollSpeed } from "./components/utils.js";

// TO-DO: delete unnecessary comments
/* check for crashing due to canvas: 
if (isFinite(this.x) && isFinite(this.y)) {
    ctx.drawImage( ... );
} */

// TO DO

/* I got a white line over curled Animation after resizing
   now only left in firefox 
    Something's not right! */
/* 
    Flutter toward light
    Flee from thunder
    Fade after a while
    Change color near the moon...
    
    Optimize for mobile using @media and CSS?
    Fix swarm overlapping logic?
    Animate butterfly swarm reacting to tap / touch?
*/
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
canvas.style.imageRendering = "crisp-edges";
let canvasWidth;
let canvasHeight;

// detect colliding sprites

/* create some sprites */
const snail = new Sprite({
  src: "snail-sprite-002.svg",
  spriteWidth: 215,
  spriteHeight: 130,
  x: Math.floor(canvasWidth / 2 - 215 / 2),
  y: canvasHeight - 130,
  scale: 1,
  frameStaggerRate: 6,
  maxFrames: 8, //actually 0-8
  states: ["normal", "curled", "butterfly", "ghost"],
  startState: "normal",
});

const butterfly = new Sprite({
  src: "butterfly-sprite-01.svg",
  spriteWidth: 100,
  spriteHeight: 80,
  x: Math.floor(canvasWidth / 2 - 100 / 2),
  y: canvasHeight / 2,
  scale: 3,
  frameStaggerRate: 1,
  maxFrames: 6, //acutally 0-6
  states: ["white", "black", "color"],
  startState: "white",
  flutter: true,
  rising: true,
  riseSpeed: 0.3 + Math.random() * 0.3,
  maxRise: 1, //DEBUG MAXRISE
  riseDirection: (Math.random() - 0.5) * 1.2,
});

//const swarmCollide = createSwarm(10, "white", "black", "color");

const swarm = spawnButterflySwarmFromShell(
  snail.x,
  snail.y,
  20,
  0.6,
  "white",
  "black",
  "color"
);

//const snailButterfly = spawnButterflySwarmFromShell(snail.x, snail.y, 1, 1);

canvas.addEventListener("click", () => {
  const nextIndex =
    (snail.states.indexOf(snail.currentState) + 1) % snail.states.length;
  snail.setState(snail.states[nextIndex]);
  console.log("Changed state to:", snail.currentState);
});

// ** PARALLAX **
const parallaxLayer1 = new Image();
parallaxLayer1.src = "fibonacci-mountain-bg-01.svg";
const parallaxLayer2 = new Image();
parallaxLayer2.src = "fibonacci-mountain-bg-02.svg";
const parallaxLayer3 = new Image();
parallaxLayer3.src = "fibonacci-mountain-bg-03.svg";
const parallaxLayer4 = new Image();
parallaxLayer4.src = "fibonacci-mountain-bg-04.svg";
const nonParallaxLayer1 = new Image();
nonParallaxLayer1.src = "fibonacci-bg-non-parallax.svg";

// ** PARALLAX **
const pLayer1 = new Layer(parallaxLayer1, 0.25, canvasHeight);
const pLayer2 = new Layer(parallaxLayer2, 0.3, canvasHeight);
const pLayer3 = new Layer(parallaxLayer3, 0.35, canvasHeight);
const pLayer4 = new Layer(parallaxLayer4, 0.4, canvasHeight);
const npLayer1 = new Layer(nonParallaxLayer1, 0, canvasHeight);

const parallaxLayers = [pLayer1, pLayer2, pLayer3, pLayer4, npLayer1];

//slow down the parallax background
/* function slowDownscrollSpeed() {
  if (scrollSpeed > 0) scrollSpeed--;
}
function speedUpscrollSpeed(scrollSpeed) {
  if (scrollSpeed < 7) scrollSpeed++;
}
function stopscrollSpeed() {
  scrollSpeed = 0;
} */

// resize pixel and dimensions of the canvas
// call once at the beginning, too
// scale dynamically
function resizeCanvas() {
  const cssWidth = window.innerWidth;
  const cssHeight = window.innerHeight;

  const dpr = window.devicePixelRatio || 1;

  canvas.width = cssWidth * dpr;
  canvas.height = cssHeight * dpr;

  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);

  //helper vars for quick access
  canvasWidth = cssWidth;
  canvasHeight = cssHeight;

  if (typeof snail !== "undefined" && snail !== null) {
    snail.x = Math.floor(
      canvasWidth / 2 - (snail.spriteWidth * snail.scale) / 2
    );
    //console.log("canvasHeight =", canvasHeight);
    //console.log(`snail.y before: ${snail.y}`);
    snail.y = canvasHeight - snail.spriteHeight * snail.scale;
    /* 
    console.log(
      `resize y: canvasHeight: ${canvasHeight} + snail.spriteHeight: ${snail.spriteHeight} 
        + snail.scale: ${snail.scale} + snail.y : ${snail.y} `
    );
     */
    /* snail.y = canvasHeight - snail.spriteHeight * snail.scale; */
  }

  //check properties:
  /*  if (snail?.spriteWidth && snail?.scale) {
            snail.x = Math.floor((canvasWidth / 2) - (snail.spriteWidth * snail.scale) / 2);
        } */

  // I'd have to do it for the swarm, too, and maybe make some method
  //snail.x = Math.floor((canvasWidth / 2) - (snail.spriteWidth * snail.scale) / 2);
  //snail.y = canvasHeight - snail.spriteHeight * snail.scale;
  if (typeof butterfly !== "undefined" && butterfly !== null) {
    butterfly.x = snail.x + (snail.spriteWidth * snail.scale) / 2 - 130;
    butterfly.y = snail.y + (Math.random() - 0.5) * 20;

    //static butterfly in the middle:
    /*     butterfly.x = Math.floor(
      canvasWidth / 2 - (butterfly.spriteWidth * butterfly.scale) / 2
    );
    butterfly.y = canvasHeight / 2; */
  }

  // insert swarm class maybe tomorrow ...? Let the swarm manage itself
  //insert rise logic here, too
  // TO DO rise
  if (swarm && Array.isArray(swarm)) {
    swarm.forEach((b, i) => {
      //scatter butterflies randomly
      /* 
      b.x = Math.random() * canvasWidth;
      b.y = Math.random() * canvasHeight * 0.6;
       */

      b.x =
        snail.x +
        (snail.spriteWidth * snail.scale) / 2 +
        (Math.random() - 0.5) * 120 -
        30; // -30 to position it slightly towards the shell
      b.y = snail.y + (Math.random() - 0.5) * 20;
    });
  }
}

resizeCanvas();
console.log(`Snail at x=${snail.x}, canvasWidth=${canvasWidth}`);
// if user resizes window:
window.addEventListener("resize", resizeCanvas());

function animate() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // slow down or speed up in walking (creeping) mode
  // stop in curled mode
  if (snail.frameY === 0) {
    //moving state
    // adjust tempo
    if (snail.frameX >= 3 && snail.frameX <= 6) {
      speedUpscrollSpeed();
    } else {
      slowDownscrollSpeed();
    }
  }
  if (snail.frameY === 1) {
    stopscrollSpeed();
  }
  // slow down certain parts of the curl animation
  // play around a bit with timing the shell
  if (snail.currentState === "curled") {
    if (snail.frameX === 4) {
      snail.slowDown();
    }
    if (snail.frameX === 5) {
      //snail.slowDown();
      //snail.slowDown();
    }
    if (snail.frameX === 6) {
      snail.speedUp();
      //snail.speedUp();
      /* snail.speedUp();  */
    }
    if (snail.frameX === 7) {
      //snail.slowDown();
      snail.slowDown();
      snail.slowDown();
      snail.slowDown();
    }
    if (snail.frameX === 8) {
      //reset frameStaggerRate in the last frame to normal speed again
      snail.frameStaggerRate = 5;
    }
  }

  /*  
     stopscrollSpeed();
     */

  parallaxLayers.forEach((object) => {
    object.update();
    object.draw(canvasHeight, ctx);
  });

  snail.drawCrispImage(ctx);
  // snail only curles up once:
  // if not in the last frame of curl animation, it updates:
  //if (!(snail.frameY === 1 && snail.frameX === 8)) snail.update();
  if (!(snail.currentState === "curled" && snail.frameX === 8)) snail.update();

  if (snail.currentState === "butterfly") {
    butterfly.draw(ctx);
    butterfly.update();
  }

  if (snail.currentState == "curled") {
    //console.log("CURLED!");
    swarm.forEach((b) => {
      b.draw(ctx);
      b.update();
    });
  }

  // DEBUG
  /*   swarmCollide.draw(ctx);
  swarmCollide.update(); */

  /* debug */
  //ctx.fillStyle = "red";
  //ctx.fillRect(0, canvasHeight - 1, canvasWidth, 1); // bottom red line
  /* debug */
  requestAnimationFrame(animate);
}
animate();
