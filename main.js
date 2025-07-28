/** @type {HTMLCanvasElement} */ 
const canvas = document.getElementById('canvas1'); 
const ctx = canvas.getContext('2d'); 
const CANVAS_WIDTH = canvas.width = 800;
const CANVAS_HEIGHT = canvas.height = 700; 
let gameSpeed = 7; 
let gameFrame = 0; 

// ** PARALLAX **
const backgroundLayer1 = new Image(); 
backgroundLayer1.src = "fibonacci-mountain-bg-01.svg"; 
const backgroundLayer2 = new Image(); 
backgroundLayer2.src = "fibonacci-mountain-bg-02.svg"; 
const backgroundLayer3 = new Image(); 
backgroundLayer3.src = "fibonacci-mountain-bg-03.svg"; 
const backgroundLayer4 = new Image(); 
backgroundLayer4.src = "fibonacci-mountain-bg-04.svg"; 

// ** SPRITE **
const playerImage = new Image(); 
playerImage.src = 'Snail-Sprite-001-exp.svg'; 
const spriteWidth = 215; 
const spriteHeight = 120; 
let frameX = 0; 
//let frameY = 0; // for diffenent rows, currently only 1
//let gameFrame = 0; 
const staggerFrames = 5;


/* const slider = document.getElementById('slider'); 
slider.value = gameSpeed; 
const showGameSpeed = document.getElementById('showGameSpeed');
showGameSpeed.innerHTML = gameSpeed; 
slider.addEventListener('change', function(e){
    //console.log(e.target.value); 
    gameSpeed = e.target.value;
    showGameSpeed.innerHTML = gameSpeed; 
})  */ 

class Layer {
    constructor(image,speedModifier){
        this.x = 0; 
        this.y = 0; 
        this.width = 2400; 
        this.height = 700; 
        this.image = image; 
        this.speedModifier = speedModifier; 
        this.speed = gameSpeed * this.speedModifier;
    }
    update(){
         this.speed = gameSpeed * this.speedModifier; 
        if (this.x <= -this.width){
            this.x = 0;
        }
        this.x = Math.floor(this.x - this.speed);  
        // instead ( w/ gameFrame): 
        //this.x = gameFrame *this.speed % this.width;
    }
    draw(){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    }
}

const layer1 = new Layer(backgroundLayer1, 0.2);
const layer2 = new Layer(backgroundLayer2, 0.4);
const layer3 = new Layer(backgroundLayer3, 0.6);
const layer4 = new Layer(backgroundLayer4, 0.8); 

const gameObjects = [layer1, layer2, layer3, layer4];

function animate(){
    ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    gameObjects.forEach(object => {
        object.update();
        object.draw();
    }); 
    //gameFrame--;

    //ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    //ctx.fillRect(100,50,100,100);
    //ctx.drawImage(playerImage,0,0);
    //drawImage with 9 arguments:
    // sx = source x (on image)
    // dx = dimensions x (on canvas)
    //ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);

    // ** SNAIL ON FULL SCREEN (LARGE) ** 
    //ctx.drawImage(playerImage, frameX*spriteWidth, 0 , spriteWidth, spriteHeight, 20, 130, CANVAS_WIDTH, CANVAS_HEIGHT);

    // ** SMALL SCALE SNAIL ** 
    ctx.drawImage(playerImage, frameX*spriteWidth, 0, spriteWidth, spriteHeight, 220, 240, 400, CANVAS_HEIGHT);
    //this would be for spritesheet with columns and rows: 
    //ctx.drawImage(playerImage, frameX*spriteWidth, frameY*spriteHeight, spriteWidth, spriteHeight, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    if (gameFrame % staggerFrames === 0){
        if (frameX < 8) frameX++; 
        else frameX = 0; 
    }
    
    gameFrame++;

    requestAnimationFrame(animate);
}
animate();