import { config } from "./config.js"; // background layer class for parallax effects:

/* this class creates layer files that can be used for parallax effects, 
   or as static layers (just set speedModifier to 0) */
export class Layer {
  constructor(image, speedModifier, canvasHeight) {
    this.x = 0;
    this.y = 0;
    //this.width = this.image.width;
    //this.width = 2400;
    //this.height = 700;
    this.image = image;
    this.speedModifier = speedModifier;
    this.speed = config.scrollSpeed * this.speedModifier;
    this.getTargetWidth = (currentCanvasHeight) => {
      const heightRatio = currentCanvasHeight / this.image.height;
      return this.image.width * heightRatio;
    };
  }
  update(currentCanvasHeight) {
    this.speed = config.scrollSpeed * this.speedModifier;
    this.x -= this.speed;
    const targetWidth = this.getTargetWidth(currentCanvasHeight);

    if (this.x <= -targetWidth) {
      this.x += targetWidth;
    }
    //this.x = this.x - this.speed;
    // instead ( w/ globalFrameCount):
    //this.x = globalFrameCount *this.speed % this.width;
  }
  draw(currentCanvasHeight, ctx) {
    const heightRatio = currentCanvasHeight / this.image.height;
    const targetHeight = currentCanvasHeight;
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
