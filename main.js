/** @type {HTMLCanvasElement} */
import { Sprite } from "./components/sprite.js";
import { Layer } from "./components/layer.js";
import { isOverlapping } from "./components/utils.js";
import { createSwarm } from "./components/utils.js";
import { config } from "./components/config.js";
import { spawnButterflySwarmFromShell } from "./components/utils.js";
import { slowDownscrollSpeed } from "./components/utils.js";
import { speedUpscrollSpeed } from "./components/utils.js";
import { stopscrollSpeed } from "./components/utils.js";

// TO-DO: remove unnecessary comments
/* check for crashing due to canvas: 
if (isFinite(this.x) && isFinite(this.y)) {
    ctx.drawImage( ... );
} */

// TO DO
// detect colliding sprites
/*  I got a white line over curled Animation after resizing
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

// ********************** CREATE CONSTANTS **********************
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
canvas.style.imageRendering = "crisp-edges";
let canvasWidth;
let canvasHeight;

// ********************** CREATE SPRITES **********************
const snail = new Sprite({
  src: "./assets/sprites/Snail-Sprite-002.svg",
  spriteWidth: 215,
  spriteHeight: 130,
  x: Math.floor(canvasWidth / 2 - 215 / 2),
  y: canvasHeight - 130,
  scale: 1,
  frameStaggerRate: 6,
  maxFrames: 8, //actually 0-8
  stateFrames: [8, 8, 8, 0], // 0-8 or 0
  states: ["normal", "curled", "shaking", "standing"],
  startState: "normal",
});

const butterfly = new Sprite({
  src: "./assets/sprites/Butterfly-Sprite-01.svg",
  spriteWidth: 100,
  spriteHeight: 80,
  x: Math.floor(canvasWidth / 2 - 100 / 2),
  y: canvasHeight / 2,
  scale: 3,
  frameStaggerRate: 1,
  maxFrames: 6, //acutally 0-6
  stateFrames: [6, 6, 6], // 0-6
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

// ********************** ADD EVENT LISTENER **********************
canvas.addEventListener("click", () => {
  const nextIndex =
    (snail.states.indexOf(snail.currentState) + 1) % snail.states.length;
  snail.setState(snail.states[nextIndex]);
  console.log("Changed state to:", snail.currentState);
});

// ********************** CREATE PARALLAX **********************
const parallaxLayer1 = new Image();
parallaxLayer1.src = "./assets/layers/BG-Hills-Big.svg";
const parallaxLayer2 = new Image();
parallaxLayer2.src = "./assets/layers/BG-Clouds.svg";
const parallaxLayer3 = new Image();
parallaxLayer3.src = "./assets/layers/BG-Hills-Small.svg";
const parallaxLayer4 = new Image();
parallaxLayer4.src = "./assets/layers/BG-Trees.svg";
const ParallaxLayer5 = new Image();
ParallaxLayer5.src = "./assets/layers/BG-Path.svg";

// ** PARALLAX **
const pLayer1 = new Layer(parallaxLayer1, 0.25, canvasHeight);
const pLayer2 = new Layer(parallaxLayer2, 0.3, canvasHeight);
const pLayer3 = new Layer(parallaxLayer3, 0.35, canvasHeight);
const pLayer4 = new Layer(parallaxLayer4, 0.4, canvasHeight);
const pLayer5 = new Layer(ParallaxLayer5, 0.5, canvasHeight);

const parallaxLayers = [pLayer1, pLayer2, pLayer3, pLayer4, pLayer5];

// ********************** RESIZE CANVAS **********************
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

    snail.y = canvasHeight - snail.spriteHeight * snail.scale;
  }

  if (typeof butterfly !== "undefined" && butterfly !== null) {
    butterfly.x = snail.x + (snail.spriteWidth * snail.scale) / 2 - 130;
    butterfly.y = snail.y + (Math.random() - 0.5) * 20;
  }

  // insert swarm class maybe tomorrow ...? Let the swarm manage itself
  //insert rise logic here, too
  // TO DO rise
  if (swarm && Array.isArray(swarm)) {
    swarm.forEach((b, i) => {
      //scatter butterflies randomly

      b.x =
        snail.x +
        (snail.spriteWidth * snail.scale) / 2 +
        (Math.random() - 0.5) * 120 -
        30; // -30 to position it slightly towards the shell
      b.y = snail.y + (Math.random() - 0.5) * 20;
    });
  }
}

// ********************** ANIMATE **********************

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
    object.update(canvasHeight);
    object.draw(canvasHeight, ctx);
  });

  snail.drawCrispImage(ctx);
  // snail only curles up once:
  // if not in the last frame of curl animation, it updates:
  //if (!(snail.frameY === 1 && snail.frameX === 8)) snail.update();
  if (!(snail.currentState === "curled" && snail.frameX === 8)) snail.update();

  /* 
  if (snail.currentState === "shaking") {
    butterfly.draw(ctx);
    butterfly.update();
  } */

  // ** SPAWN BUTTERFLIES AFTER 2 SECONDS **
  if (snail.currentState == "shaking") {
    if (!config.shakingTimeStart) {
      config.shakingTimeStart = Date.now();
    }

    const elapsed = Date.now() - config.shakingTimeStart;

    if (elapsed > 2000 && !config.butterfliesSpawned) {
      //draw swarm
      //console.log("swarm");
      swarm.forEach((b) => {
        b.draw(ctx);
        b.update();
      });
      config.butterfliesSpawned = true;
      snail.setState("standing");
    }
  } else {
    // Reset if snail enters another state
    config.shakingTimeStart = null;
    config.butterfliesSpawned = false;
  }

  if (snail.currentState == "standing") {
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

// ********************** EXECUTE **********************
// ** INITIAL RESIZE **
resizeCanvas();
console.log(`Snail at x=${snail.x}, canvasWidth=${canvasWidth}`);
// ** LATER RESIZES OF WINDOW **
window.addEventListener("resize", resizeCanvas);
animate();
