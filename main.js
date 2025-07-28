/** @type {HTMLCanvasElement} */ 
// TO-DO: delete unnecessary comments 
const canvas = document.getElementById('canvas1'); 
const ctx = canvas.getContext('2d'); 
const CANVAS_WIDTH = canvas.width = 800;
const CANVAS_HEIGHT = canvas.height = 700; 
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
    setState(state){
        if (this.states.includes(state)){
            this.currentState = state; 
            this.frameY = this.state.indexOf(state); 
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

// CREATE SNAIL SPRITE 
const snail = new Sprite({
    src: 'Snail-Sprite-002.svg', 
    spriteWidth: 215,
    spriteHeight: 120, 
    x: 220, 
    y: 20, 
    scale: 1, 
    frameStaggerRate: 5, 
    maxFrames: 8, 
    states: ['normal', 'curled', 'butterfly', 'ghost'], 
    startState: 'normal'
});


/* old code:  */
/* 
// ** SPRITE **
const snailSprite = new Image(); 
snailSprite.src = 'Snail-Sprite-002.svg'; 
const spriteWidth = 215; 
const spriteHeight = 120; 
let snailFrameX = 0; 
let snailFrameY = 0; // for diffenent rows, currently only 1
//let globalFrameCount = 0; 
const frameStaggerRate = 5;
// ** CAN HAVE DIFFERENT STATES ** 
// corresponding to the array numbers of Snail-Sprite-002.svg
// normal state = snailFrameY == 0 
// curled state = snailFrameY == 1 
const snailStates = ['normal', 'curled', 'butterfly', 'ghost']; 
let currentSnailState = snailStates[0]; //starting off in normal mode 

// simplest animation, just one animation: 
// curl up when clicked: 
canvas.addEventListener('click', () => {
    snailFrameY = snailFrameY === 0 ? 1 : 0; 
    snailFrameX = 0; 
});  */

canvas.addEventListener('click', () => {
    const nextIndex = (snail.states.indexOf(snail.currentState) + 1) % snail.states.length; 
    snail.setState(snail.states[nextIndex]);
})

class Layer {
    constructor(image,speedModifier){
        this.x = 0; 
        this.y = 0; 
        this.width = 2400; 
        this.height = 700; 
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
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
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

function animate(){
    ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);

    // slow down or speed up in walking (creeping) mode 
    if (snail.frameY === 0){ //moving state 
        // adjust tempo 
        if (snail.frameX >= 3 && snail.frameX <= 6) { speedUpscrollSpeed(); }
        else { slowDownscrollSpeed(); }
    } 
    if (snail.frameY === 1) {
        stopscrollSpeed();
    }
    
    
    /*  
     stopscrollSpeed();
     */

    parallaxLayers.forEach(object => {
        object.update();
        object.draw();
    }); 

    //ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    //ctx.fillRect(100,50,100,100);
    //ctx.drawImage(snailSprite,0,0);
    //drawImage with 9 arguments:
    // sx = source x (on image)
    // dx = dimensions x (on canvas)
    //ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);

    // ** SNAIL ON FULL SCREEN (LARGE) ** 
    //ctx.drawImage(snailSprite, snailFrameX*spriteWidth, 0 , spriteWidth, spriteHeight, 20, 130, CANVAS_WIDTH, CANVAS_HEIGHT);

    // ** SMALL SCALE SNAIL ** 
    //ctx.drawImage(snailSprite, snailFrameX*spriteWidth, 0, spriteWidth, spriteHeight, 220, 240, 400, CANVAS_HEIGHT);
    //this would be for spritesheet with columns and rows: 
    //ctx.drawImage(snailSprite, snailFrameX*spriteWidth, snailFrameY*spriteHeight, spriteWidth, spriteHeight, 220, 20, 400, CANVAS_HEIGHT);
    
    
    snail.draw(ctx); 
    snail.update(); 

    //reset globalFrameCount (sprite) after one cycle
    /* if (globalFrameCount % snail.frameStaggerRate === 0){
        if (snail.frameX < 8) snail.frameX++; 
        else snail.frameX = 0; 
    } */
    
    //snail.frameCounter++;

    requestAnimationFrame(animate);
}
animate();