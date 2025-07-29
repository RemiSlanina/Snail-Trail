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
const canvas = document.getElementById('canvas1'); 
const ctx = canvas.getContext('2d'); 
let canvasWidth; 
let canvasHeight; 
let scrollSpeed = 7; 
//let globalFrameCount = 0; 


// ** PARALLAX **
const parallaxLayer1 = new Image(); 
parallaxLayer1.src = "fibonacci-mountain-bg-01.svg"; 
const parallaxLayer2 = new Image(); 
parallaxLayer2.src = "fibonacci-mountain-bg-02.svg"; 
const parallaxLayer3 = new Image(); 
parallaxLayer3.src = "fibonacci-mountain-bg-03.svg"; 
const parallaxLayer4 = new Image(); 
parallaxLayer4.src = "fibonacci-mountain-bg-04.svg"; 


class Sprite {
    constructor(options){
        this.image = new Image(); 
        this.image.src = options.src; 

        this.spriteWidth = options.spriteWidth;
        this.spriteHeight = options.spriteHeight; 
        this.scale = options.scale || 1; 
        this.x = options.x || 0; 
        this.y = options.y || 0; 

        this.states = options.states || ["default"]; 
        this.currentState = options.startState || this.states[0]; 
        this.frameY = this.states.indexOf(this.currentState); 
        this.maxFrames = options.maxFrames || 8; 

        this.frameX = 0; 
        this.frameStaggerRate = options.frameStaggerRate || 5; 
        this.frameCounter = 0; 
    }
    slowDown(){
        if (this.frameStaggerRate < 20) this.frameStaggerRate++; 
    }
    speedUp(){
        if (this.frameStaggerRate > 0) this.frameStaggerRate--; 
    }
    setState(state){
        if (this.states.includes(state)){
            this.currentState = state; 
            this.frameY = this.states.indexOf(state); 
            this.frameX = 0; 
            this.frameCounter = 0; 
        }
    }
    update(){
        this.frameCounter++; 
        if (this.frameCounter % this.frameStaggerRate === 0){
            this.frameX = (this.frameX + 1) % (this.maxFrames + 1); 
        }
    }
    draw(ctx){
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
}

// CREATE SPRITES 
const snail = new Sprite({
    src: 'snail-sprite-002.svg', 
    spriteWidth: 215,
    spriteHeight: 120, 
    x: Math.floor((canvasWidth/2) - 215/2), 
    y: canvasHeight-120, 
    scale: 1, 
    frameStaggerRate: 5, 
    maxFrames: 8, //actually 0-8
    states: ['normal', 'curled', 'butterfly', 'ghost'], 
    startState: 'normal'
});
const butterfly = new Sprite({
    src: 'butterfly-sprite-01.svg',
    spriteWidth: 100, 
    spriteHeight: 80,
    x: Math.floor((canvasWidth/2) - 100/2),
    y: canvasHeight/2,
    scale: 0.7, 
    frameStaggerRate: 5, 
    maxFrames: 6, //acutally 0-6 
    states: ['white', 'black', 'color'], 
    startState: 'white'
}); 

// BUTTERFLY SWARMS 
const swarm = [];
for (let i = 0; i < 20; i++) {

    let xb = Math.floor(Math.random()*(canvasWidth - (canvasWidth/10) ));
    let yb = Math.floor(Math.random()*(canvasHeight - (canvasHeight/10) ));

  swarm.push(new Sprite({
    src: 'butterfly-sprite-01.svg',
    spriteWidth: 100, 
    spriteHeight: 80,
    x: xb,
    y: yb,
    scale: 0.7, 
    frameStaggerRate: 5, 
    maxFrames: 6, //acutally 0-6 
    states: ['white', 'black', 'color'], 
    startState: 'white'
  })); 
}

// change snail state on click here
canvas.addEventListener('click', () => {
    const nextIndex = (snail.states.indexOf(snail.currentState) + 1) % snail.states.length; 
    snail.setState(snail.states[nextIndex]);
    console.log('Changed state to:', snail.currentState);
    
})
// background layer class for parallax effects: 
class Layer {
    constructor(image,speedModifier){
        this.x = 0; 
        this.y = 0; 
        //this.width = 2400; 
        //this.height = 700; 
        this.image = image; 
        this.speedModifier = speedModifier; 
        this.speed = scrollSpeed * this.speedModifier;
    }
    update(){
         this.speed = scrollSpeed * this.speedModifier; 
        if (this.x <= -this.width){
            this.x = 0;
        }
        this.x = Math.floor(this.x - this.speed);  
        // instead ( w/ globalFrameCount): 
        //this.x = globalFrameCount *this.speed % this.width;
    }
    draw(){
        const heightRatio = canvasHeight/this.image.height; 
        const targetHeight = canvasHeight; 
        const targetWidth = this.image.width * heightRatio; 

        ctx.drawImage(this.image, this.x, this.y, targetWidth, targetHeight);
        ctx.drawImage(this.image, this.x + targetWidth, this.y, targetWidth, targetHeight);
    }
}

// ** PARALLAX **
const layer1 = new Layer(parallaxLayer1, 0.2);
const layer2 = new Layer(parallaxLayer2, 0.4);
const layer3 = new Layer(parallaxLayer3, 0.6);
const layer4 = new Layer(parallaxLayer4, 0.8); 

const parallaxLayers = [layer1, layer2, layer3, layer4]; 

    //slow down the parallax background 
function slowDownscrollSpeed(){
    if (scrollSpeed > 0) scrollSpeed--; 
}
function speedUpscrollSpeed(){
    if (scrollSpeed < 7) scrollSpeed++;
}
function stopscrollSpeed(){
    scrollSpeed=0;
}

// resize pixel and dimensions of the canvas 
// call once at the beginning, too 
// scale dynamically 
function resizeCanvas(){
    const dpr = window.devicePixelRatio || 1; 

    canvas.width = window.innerWidth; 
    canvas.height = window.innerHeight; 

    canvas.style.width = window.innerWidth + 'px'; 
    canvas.style.height = window.innerHeight + 'px'; 

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    //helper vars for quick access 
    canvasWidth = canvas.width;
    canvasHeight = canvas.height; 


    // HERE
    // resize snail (maybe make Sprite resize() method!) 
    // TO DO!
    if (typeof snail !== 'undefined' && snail !== null) {
        snail.x = Math.floor((canvasWidth / 2) - (snail.spriteWidth * snail.scale) / 2);
        snail.y = canvasHeight - snail.spriteHeight * snail.scale;
    } 

    //check properties: 
   /*  if (snail?.spriteWidth && snail?.scale) {
         snail.x = Math.floor((canvasWidth / 2) - (snail.spriteWidth * snail.scale) / 2);
    } */

    // I'd have to do it for the swarm, too, and maybe make some method 
    //snail.x = Math.floor((canvasWidth / 2) - (snail.spriteWidth * snail.scale) / 2);
    //snail.y = canvasHeight - snail.spriteHeight * snail.scale;
    butterfly.x = Math.floor((canvasWidth / 2) - (butterfly.spriteWidth * butterfly.scale) / 2);
    butterfly.y = canvasHeight / 2;

    // insert swarm class maybe tomorrow ...? Let the swarm manage itself
    if (swarm && Array.isArray(swarm)){
        swarm.forEach((b,i) => {
            //scatter butterflies randomly 
            b.x = Math.random() * canvasWidth;
            b.y = Math.random() * canvasHeight * 0.6;
        });
    }


}
resizeCanvas();
// if user resizes window: 
window.addEventListener('resize', resizeCanvas());


function animate(){
    ctx.clearRect(0,0,canvasWidth,canvasHeight);

    // slow down or speed up in walking (creeping) mode 
    if (snail.frameY === 0){ //moving state 
        // adjust tempo 
        if (snail.frameX >= 3 && snail.frameX <= 6) { speedUpscrollSpeed(); }
        else { slowDownscrollSpeed(); }
    } 
    if (snail.frameY === 1) {
        stopscrollSpeed();
    }
    // slow down certain parts of the curl animation 
    // play around a bit with timing the shell 
    if (snail.currentState === 'curled'){
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
        if (snail.frameX === 8){
            //reset frameStaggerRate in the last frame to normal speed again
            snail.frameStaggerRate = 5;
        }
    }
    
    /*  
     stopscrollSpeed();
     */

    parallaxLayers.forEach(object => {
        object.update();
        object.draw();
    }); 
    
    snail.draw(ctx); 
    // snail only curles up once: 
    // if not in the last frame of curl animation, it updates: 
    //if (!(snail.frameY === 1 && snail.frameX === 8)) snail.update(); 
    if (!(snail.currentState === "curled" && snail.frameX === 8)) snail.update(); 

    butterfly.draw(ctx); 
    butterfly.update(); 

    swarm.forEach(b => {
        b.draw(ctx); 
        b.update(); 
    })
    
    requestAnimationFrame(animate);
}
animate();