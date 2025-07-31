/** @type {HTMLCanvasElement} */
// TO-DO: delete unnecessary comments
/* check for crashing due to canvas: 
if (isFinite(this.x) && isFinite(this.y)) {
    ctx.drawImage( ... );
} */

// TO DO

/* I got a white line over curled Animation after resizing
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
let scrollSpeed = 1;
//let globalFrameCount = 0;

// ** SPRITES **
class Sprite {
  constructor(options) {
    this.image = new Image();
    this.image.src = options.src;

    this.spriteWidth = options.spriteWidth;
    this.spriteHeight = options.spriteHeight;
    this.scale = options.scale || 1;
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.initialY = this.y;

    this.states = options.states || ["default"];
    this.currentState = options.startState || this.states[0];
    this.frameY = this.states.indexOf(this.currentState);
    this.maxFrames = options.maxFrames || 8;

    this.frameX = 0;
    this.frameStaggerRate = options.frameStaggerRate || 5;
    this.frameCounter = 0;

    /* for butterflies only */
    this.flutter = options.flutter || false;

    /* random movement speed: 0.5 base this.speed, 
    + variation between 0 - 0.5  */
    /*     this.speed = 0.5 + Math.random() * 0.5;
    this.angle = Math.random() * Math.PI * 2; // For sine movement
    this.angleSpeed = 0.02 + Math.random() * 0.02;
    this.offset = Math.random() * 100;  */

    // New movement = FLUTTER UP <3
    this.rising = options.rising || false;
    this.riseSpeed = options.riseSpeed || 0.2 + Math.random() * 0.3;
    this.riseDirection = options.riseDirection || (Math.random() - 0.5) * 2; // horizontal drift
    this.maxRise = options.maxRise || 500;
    this.angle = Math.random() * Math.PI * 2;
    this.angleSpeed = 0.02 + Math.random() * 0.02;
  }
  slowDown() {
    if (this.frameStaggerRate < 20) this.frameStaggerRate++;
  }
  speedUp() {
    if (this.frameStaggerRate > 0) this.frameStaggerRate--;
  }
  setState(state) {
    if (this.states.includes(state)) {
      this.currentState = state;
      this.frameY = this.states.indexOf(state);
      this.frameX = 0;
      this.frameCounter = 0;
    }
  }
  update(deltaTime) {
    this.frameCounter++;
    if (this.frameCounter % this.frameStaggerRate === 0) {
      this.frameX = (this.frameX + 1) % (this.maxFrames + 1);
    }
    /* if (this.flutter) {
      this.angle += this.angleSpeed;
      this.y += Math.sin(this.angle) * this.speed;
      this.x += Math.cos(this.angle + this.offset) * this.speed * 0.5;
    } */

    if (this.flutter) {
      this.angle += this.angleSpeed;
      this.y += Math.sin(this.angle) * 0.3;
      this.x += Math.cos(this.angle + this.angleSpeed) * 0.2;
    }

    if (this.rising) {
      this.y -= this.riseSpeed; // upward
      this.x += this.riseDirection * 0.3; // slight sideways drift
      //stop after maxRise
      if (this.initialY - this.y > this.maxRise) this.rising = false;
    }
  }
  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.spriteWidth * this.scale,
      this.spriteHeight * this.scale
    );
  }
  drawCrispImage(ctx) {
    ctx.drawImage(
      this.image,
      Math.floor(this.frameX * this.spriteWidth),
      Math.floor(this.frameY * this.spriteHeight),
      this.spriteWidth,
      this.spriteHeight,
      Math.floor(this.x),
      Math.floor(this.y),
      Math.floor(this.spriteWidth * this.scale),
      Math.floor(this.spriteHeight * this.scale)
    );
  }
}

// detect colliding sprites
function isOverlapping(x, y, width, height, others) {
  return others.some((other) => {
    const dx = others.x - x;
    const dy = others.y - y;
    return Math.abs(dx) < width && Math.abs(dy) < height;
  });
}
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
  scale: 0.7,
  frameStaggerRate: 1,
  maxFrames: 6, //acutally 0-6
  states: ["white", "black", "color"],
  startState: "white",
  flutter: true,
});

// BUTTERFLY SWARMS
function createSwarm(num, ...colors) {
  console.log(colors);
  const availableColors = colors.length > 0 ? colors : ["white"];
  const bswarm = [];
  for (let i = 0; i < num; i++) {
    let xb = Math.floor(Math.random() * (canvasWidth - canvasWidth / 10));
    let yb = Math.floor(Math.random() * (canvasHeight - canvasHeight / 10));

    //randomize color:
    const color =
      availableColors[Math.floor(Math.random() * availableColors.length)];

    bswarm.push(
      new Sprite({
        src: "butterfly-sprite-01.svg",
        spriteWidth: 100,
        spriteHeight: 80,
        x: xb,
        y: yb,
        scale: 0.7,
        frameStaggerRate: 11,
        maxFrames: 6, //acutally 0-6
        states: ["white", "black", "color"],
        startState: color,
        flutter: true,
      })
    );
  }
  return bswarm;
}
//const swarm = createSwarm(10, "white", "black", "color");

function spawnButterflySwarmFromShell(shellX, shellY, count = 10) {
  const bswarm = [];

  /*   b.x =
        snail.x +
        (snail.spriteWidth * snail.scale) / 2 +
        (Math.random() - 0.5) * 120 -
        30; // -30 to position it slightly towards the shell
      b.y = snail.y + (Math.random() - 0.5) * 20;
 */

  for (let i = 0; i < count; i++) {
    const offsetX = (Math.random() - 0.5) * 30;
    const offsetY = (Math.random() - 0.5) * 20;

    bswarm.push(
      new Sprite({
        src: "butterfly-sprite-01.svg",
        spriteWidth: 100,
        spriteHeight: 80,
        x: shellX / 2 + offsetX - 30,
        y: shellY + offsetY,
        scale: 0.6,
        frameStaggerRate: 15,
        maxFrames: 6,
        flutter: true,
        rising: true,
        riseSpeed: 0.3 + Math.random() * 0.3,
        maxRise: 150 + Math.random() * 50,
      })
    );
  }
  return bswarm;
}
const swarm = spawnButterflySwarmFromShell(snail.x, snail.y);
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

// background layer class for parallax effects:
class Layer {
  constructor(image, speedModifier) {
    this.x = 0;
    this.y = 0;
    //this.width = this.image.width;
    //this.width = 2400;
    //this.height = 700;
    this.image = image;
    this.speedModifier = speedModifier;
    this.speed = scrollSpeed * this.speedModifier;
    this.getTargetWidth = () => {
      const heightRatio = canvasHeight / this.image.height;
      return this.image.width * heightRatio;
    };
  }
  update() {
    this.speed = scrollSpeed * this.speedModifier;
    this.x -= this.speed;
    const targetWidth = this.getTargetWidth();

    if (this.x <= -targetWidth) {
      this.x += targetWidth;
    }
    //this.x = this.x - this.speed;
    // instead ( w/ globalFrameCount):
    //this.x = globalFrameCount *this.speed % this.width;
  }
  draw() {
    const heightRatio = canvasHeight / this.image.height;
    const targetHeight = canvasHeight;
    const targetWidth = this.image.width * heightRatio;

    for (let i = -1; i <= 1; i++) {
      ctx.drawImage(
        this.image,
        Math.floor(this.x + i * targetWidth),
        this.y,
        Math.floor(targetWidth),
        targetHeight
      );
    }
    /*   
  ctx.drawImage(
      this.image,
      Math.floor(this.x),
      this.y,
      Math.floor(targetWidth),
      targetHeight
    );
    ctx.drawImage(
      this.image,
      Math.floor(this.x + targetWidth),
      this.y,
      Math.floor(targetWidth),
      targetHeight
    );
     */
  }
}

// ** PARALLAX **
const pLayer1 = new Layer(parallaxLayer1, 0.25);
const pLayer2 = new Layer(parallaxLayer2, 0.3);
const pLayer3 = new Layer(parallaxLayer3, 0.35);
const pLayer4 = new Layer(parallaxLayer4, 0.4);
const npLayer1 = new Layer(nonParallaxLayer1, 0);

const parallaxLayers = [pLayer1, pLayer2, pLayer3, pLayer4, npLayer1];

//slow down the parallax background
function slowDownscrollSpeed() {
  if (scrollSpeed > 0) scrollSpeed--;
}
function speedUpscrollSpeed() {
  if (scrollSpeed < 7) scrollSpeed++;
}
function stopscrollSpeed() {
  scrollSpeed = 0;
}

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

  // HERE
  // resize snail (maybe make Sprite resize() method!)
  // TO DO!
  if (typeof snail !== "undefined" && snail !== null) {
    snail.x = Math.floor(
      canvasWidth / 2 - (snail.spriteWidth * snail.scale) / 2
    );
    console.log("canvasHeight =", canvasHeight);
    console.log(`snail.y before: ${snail.y}`);
    snail.y = canvasHeight - snail.spriteHeight * snail.scale;
    console.log(
      `resize y: canvasHeight: ${canvasHeight} + snail.spriteHeight: ${snail.spriteHeight} 
        + snail.scale: ${snail.scale} + snail.y : ${snail.y} `
    );
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
    butterfly.x = Math.floor(
      canvasWidth / 2 - (butterfly.spriteWidth * butterfly.scale) / 2
    );
    butterfly.y = canvasHeight / 2;
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
    object.draw();
  });

  snail.drawCrispImage(ctx);
  // snail only curles up once:
  // if not in the last frame of curl animation, it updates:
  //if (!(snail.frameY === 1 && snail.frameX === 8)) snail.update();
  if (!(snail.currentState === "curled" && snail.frameX === 8)) snail.update();

  butterfly.draw(ctx);
  butterfly.update();

  if (snail.currentState == "curled") {
    //console.log("CURLED!");
    swarm.forEach((b) => {
      b.draw(ctx);
      b.update();
    });
  }
  /* debug */
  //ctx.fillStyle = "red";
  //ctx.fillRect(0, canvasHeight - 1, canvasWidth, 1); // bottom red line
  /* debug */
  requestAnimationFrame(animate);
}
animate();
