import { Sprite } from "./Sprite.js";
import { config } from "./config.js";

export function isOverlapping(x, y, width, height, others) {
  return others.some((other) => {
    const dx = others.x - x;
    const dy = others.y - y;
    return Math.abs(dx) < width && Math.abs(dy) < height;
  });
}
// BUTTERFLY SWARMS
export function createSwarm(num, ...colors) {
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
export function spawnButterflySwarmFromShell(
  shellX,
  shellY,
  count = 10,
  size = 0.6,
  ...colors
) {
  const bswarm = [];
  const availableColors = colors.length > 0 ? colors : ["white"];

  for (let i = 0; i < count; i++) {
    const offsetX = (Math.random() - 0.5) * 30;
    const offsetY = (Math.random() - 0.5) * 20;

    const color =
      availableColors[Math.floor(Math.random() * availableColors.length)];

    bswarm.push(
      new Sprite({
        src: "butterfly-sprite-01.svg",
        spriteWidth: 100,
        spriteHeight: 80,
        x: shellX / 2 + offsetX - 30,
        y: shellY + offsetY,
        scale: size,
        frameStaggerRate: 15,
        maxFrames: 6,
        states: ["white", "black", "color"],
        startState: color,
        flutter: true,
        rising: true,
        riseSpeed: 0.3 + Math.random() * 0.3,
        maxRise: 150 + Math.random() * 50,
      })
    );
  }
  return bswarm;
}
//slow down the parallax background
export function slowDownscrollSpeed() {
  if (config.scrollSpeed > 0) config.scrollSpeed--;
}
export function speedUpscrollSpeed() {
  if (config.scrollSpeed < 7) config.scrollSpeed++;
}
export function stopscrollSpeed() {
  config.scrollSpeed = 0;
}
