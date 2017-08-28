var gameCanvas = document.getElementById('canvas');
gameCanvas.width = window.innerWidth / 2;
gameCanvas.height = window.innerHeight / 2;
var gameContext = gameCanvas.getContext('2d');
var background =  document.getElementById('bg1');
var middleground =  document.getElementById('bg2');

var backgroundSpeed = 20;
var middlegroundSpeed = 15;


function init() {
    // Generates background 1
    generateBackground(background, 300, 0.2, 20, 4, '#1e3d5a');
    generateBackground(middleground, 400, 0.3, 50, 3, '#101f32');
    
    generatePlatform(30, 30, 100, 30);
    generatePlatform(200, 45, 400, 30);
    generatePlatform(100, 200, 800, 50);
    generatePlatform(10, 300, 50, 30);
    generatePlatform(100, 300, 200, 50);
    generatePlatform(500, 300, 400, 120);
    generatePlatform(150, 400, 300, 50);

    initPlayer();
    initReaper();
}

function loop() {
    
}

function initPlayer() {
    var playerImage = new Image();
    playerImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAkAgMAAACCp0C4AAAADFBMVEUAAAD///////8AAAA4fh26AAAAAnRSTlMA32D/An0AAACCSURBVBjTndCxDYMwEIXhk0smidjHKVKljDKFl4iEUrkJCo+CEdiHEagwfujOCCr+6pN915ysAQjCXPJrc5X83oxUF82gXfY/u85ugxkHg0Wu9jOGqblkph7PzL7BjOfelflWGHVhLap/QdStnLspHGm9oXvoOD/shGb38d7fhdbnBddVtJA2inbyAAAAAElFTkSuQmCC';
    playerImage.addEventListener('load', function() {
        gameContext.drawImage(playerImage, 400, (gameCanvas.height - playerImage.height) / 2);
    });
}

function initReaper() {
    var reaperImage = new Image();
    reaperImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAACrAQMAAAAKIQHdAAAABlBMVEUAAAAAAAClZ7nPAAAAAXRSTlMAQObYZgAAAStJREFUWMPN1VFqxDAMRVHBW4j2vyvBbEPw2pGTCKbQOJIovR9j8PmwJ3aIrGDyURnoDwHkFChhXcgl/BHoN+gcwEaAdBHGvn0LQFqcLkh6C3QdkwvfNcFjwDZwATgBluBWhry4ymgLPEZGrw7oAnDVA1vDSu6BCzgCMgTI/1cD70A+qi5oASSBtH8FPPJ7yLtub9ARiHVgVgc7wIXrZxvWzkT74IJ4UmjA6QVQknEBmxBTsTX3KuSgjEwfA2wMxOdAfwf7BBFYDeQniM4B7BYiXiA+AjGnPQATYLvwOkC8BUrST9AW8N31Bv4tIOA1ARrglE3Ig+0DuBoAHtku4ATvAjgGzPYAzKwHOgIEXcjM70Bp1xRisCrkx9Gv+1uHLBfZBaGBlB5kkCJ8AVSVaGnTcqoDAAAAAElFTkSuQmCC';
    reaperImage.addEventListener('load', function() {
        gameContext.drawImage(reaperImage, 50, (gameCanvas.height - reaperImage.height) / 2);
    });
}

function generateBackground(background, width, heightPercent, offset, loop, color) {
    background.width = (width + offset * 2) * loop;
    var canvas = document.createElement('canvas');
    canvas.width = background.width;
    canvas.height = gameCanvas.height;

    var context = canvas.getContext('2d');
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);

    for(var index = 0; index < loop; ++index) {
        drawBackground(context, offset + index * (width + offset * 2), canvas.height / 2, width, canvas.height * heightPercent);
    }
    background.style.backgroundImage = 'url(' + canvas.toDataURL() + ')';
}

function drawBackground(ctx, x, y, width, height) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    var currentX = x;
    var currentY = y;
    var splitNumber = width / 20;
    var centerOffset = (gaussianRandom() + 1) * 0.2 * height - 0.1 * height;

    var currentX = x;
    var currentY = y;
    var step = 1;
    ctx.moveTo(x, y + centerOffset);
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