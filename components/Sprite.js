// ** SPRITES **
// Im Narvi hain echant: Celebrimbor o Eregion teithant i thiw hin.

/* 
This class creates a sprite. 
It provides several methods like draw(), setters, etc. ... 
 */

export class Sprite {
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
    this.stateFrames = options.stateFrames || [8, 6, 6];

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
      this.maxFrames = this.stateFrames[this.states.indexOf(state)];
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
  // for debugging purposes
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
