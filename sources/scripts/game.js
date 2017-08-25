var gameCanvas = document.getElementById('canvas');
gameCanvas.width = window.innerWidth / 2;
gameCanvas.height = window.innerHeight / 2;
var gameContext = gameCanvas.getContext('2d');
var background = document.createElement('canvas');
var backgroundCopy = document.createElement('canvas');
var middleground = document.createElement('canvas');
var middlegroundCopy = document.createElement('canvas');
var bg1Copy = document.createElement('canvas');
var timer = 0;

function init() {

    // Global background
    gameContext.fillStyle = '#356a9e';
    gameContext.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    
    // Generates background 1
    generateBackground(background);
    generateBackground(backgroundCopy);
    generateMiddleground(middleground);
    generateMiddleground(middlegroundCopy);
    
    generatePlatform(30, 30, 100, 30);
    generatePlatform(200, 45, 400, 30);
    generatePlatform(100, 200, 800, 50);
    generatePlatform(10, 300, 50, 30);
    generatePlatform(100, 300, 200, 50);
    generatePlatform(500, 300, 400, 120);
    generatePlatform(150, 400, 300, 50);

    setInterval(moveBackground, 10);
}

function moveBackground() {
    gameContext.fillStyle = '#356a9e';
    gameContext.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    console.log(Math.floor(timer / background.width));
    var backgroundSpeed = timer / 1.3;
    var middlegroundSpeed = timer;
    gameContext.drawImage(background, Math.floor(- backgroundSpeed) + background.width * Math.floor(backgroundSpeed / background.width), 0);
    gameContext.drawImage(backgroundCopy, Math.floor(- backgroundSpeed) + backgroundCopy.width * Math.floor(backgroundSpeed / backgroundCopy.width + 1), 0);
   // gameContext.drawImage(middleground, - timer, 0);
   // gameContext.drawImage(middlegroundCopy, - timer + middleground.width, 0);
    ++timer;
}

function generateBackground(canvas) {
    var width = 300;
    var offset = 20;
    var loop = 4;
    
    canvas.width = (width + offset * 2) * loop;
    canvas.height = gameCanvas.height;
    var context = canvas.getContext('2d');
    context.fillStyle = '#1e3d5a';
context.fillStyle = '#' + Math.floor(Math.random()*16777215).toString(16);
console.log('generateBackground', context.fillStyle);
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    for(var index = 0; index < loop; ++index) {
        drawBackground(context, offset + index * (width + offset * 2), canvas.height / 2, width, canvas.height / 5);
    }
}

function generateMiddleground(canvas) {
    var width = 400;
    var offset = 50;
    var loop = 3;

    canvas.width = (width + offset * 2) * loop;
    canvas.height = gameCanvas.height;
    var context = canvas.getContext('2d');
    context.fillStyle = '#101f32';
context.fillStyle = '#' + Math.floor(Math.random()*16777215).toString(16);
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    for(var index = 0; index < loop; ++index) {
        drawBackground(context, offset + index * (width + offset * 2), canvas.height / 2, width, canvas.height / 3);
    }
}

function drawBackground(ctx, x, y, width, height) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    var currentX = x;
    var currentY = y;
    var splitNumber = width / 20;

    var currentX = x;
    var currentY = y;
    var centerOffset = (gaussianRandom() + 1) * 0.2 * height - 0.1 * height;
    ctx.moveTo(x, y + centerOffset);
    var step = 1;
    while(currentX < x + width - splitNumber) {
        currentX = currentX + (gaussianRandom() + 1) * splitNumber;
        if(currentX >= x + width) {
            break;
        }
        if(step === 1 && currentY < y + height) {
            currentY += height / (0.5 + (gaussianRandom() + 1) * 1.5);
            if(currentY >= y + height) {
                currentY = y + height;
                step = 2;
            }
        } else {
            currentY = y + (gaussianRandom() + 1) * height * 0.25 + 0.75 * height;
        }
        ctx.lineTo(currentX, currentY);
    }
    ctx.lineTo(x + width, y + centerOffset);
    ctx.lineTo(x, y + centerOffset);
    ctx.fillStyle = 'white';
    ctx.fill();

    // Draws top part of background
    var currentX = x;
    var currentY = y;
    var step = 1;
    ctx.moveTo(x, y + centerOffset);
    while(currentX < x + width - splitNumber) {
        currentX = currentX + (gaussianRandom() + 1) * splitNumber;
        if(currentX >= x + width) {
            break;
        }
        if(step === 1 && currentY > y - height) {
            currentY -= height / (0.5 + (gaussianRandom() + 1) * 2);
            if(currentY <= y - height) {
                currentY = y - height;
                step = 2;
            }
        } else {
            currentY = y - (gaussianRandom() + 1) * height * 0.25 - 0.75 * height;
        }
        ctx.lineTo(currentX, currentY);
    }
    
    ctx.lineTo(x + width, y + centerOffset);
    ctx.lineTo(x, y + centerOffset);
    ctx.fillStyle = 'white';
    ctx.fill();
}

function generatePlatform(x, y, width, height) {
    // Number of spikes on platform
    var splitNumber = Math.min(width / 10, 25 + 5 * gaussianRandom());
    
    // Sets the dot list under the platform
    var dotList = [];
    var i = x;
    while(i < x + width - splitNumber) {
        i = i + (gaussianRandom() + 1) * splitNumber;
        if(i >= x + width) {
            break;
        }
        dotList.push([i, y + height / 3 + (gaussianRandom() + 1) * height * 2 / 3]);
    }
    
    // Draws platform line 2px under under (decoration)
    gameContext.beginPath();
    gameContext.moveTo(x, y + 2);
    for(var dot in dotList) {
        gameContext.lineTo(dotList[dot][0], dotList[dot][1] + 2);
    }
    gameContext.lineTo(x + width, y + 2);
    gameContext.fillStyle = '#bfa16d';
    gameContext.fill();
 
    //Draws platform
    gameContext.beginPath();
    gameContext.moveTo(x, y);
    for(var dot in dotList) {
        gameContext.lineTo(dotList[dot][0], dotList[dot][1]);
    }
    gameContext.lineTo(x + width, y);
    gameContext.fillStyle = '#122937';
    gameContext.fill();

    // Draws grass on platform
    gameContext.beginPath();
    gameContext.moveTo(x, y);
    splitNumber = Math.min(width / 50, 5 + 5 * gaussianRandom());
    i = x;
    while(i < x + width - splitNumber) {
        i = i + (gaussianRandom() + 1) * splitNumber;
        if(i >= x + width) {
            break;
        }
        gameContext.lineTo(i, y + 2 + (gaussianRandom() + 1) * 3);
    }
    gameContext.lineTo(x + width, y);
    gameContext.fillStyle = '#376d91';
    gameContext.fill();
}

function gaussianRandom() {
    return ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3;
}


init();